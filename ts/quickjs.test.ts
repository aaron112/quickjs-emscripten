/**
 * These tests demonstate some common patterns for using quickjs-emscripten.
 */

import { getQuickJS, QuickJSVm, QuickJSHandle } from './quickjs'
import { it, describe } from 'mocha'
import assert from 'assert'
import { VmCallResult } from './vm-interface'

describe('QuickJSVm', async () => {
  let vm: QuickJSVm = undefined as any

  beforeEach(async () => {
    const quickjs = await getQuickJS()
    vm = quickjs.createVm()
  })

  afterEach(async () => {
    vm.dispose()
    vm = undefined as any
  })

  describe('primitives', () => {
    it('can round-trip a number', () => {
      const jsNumber = 42
      const numHandle = vm.newNumber(jsNumber)
      assert.equal(vm.getNumber(numHandle), jsNumber)
    })

    it('can round-trip a string', () => {
      const jsString = 'an example 🤔 string with unicode 🎉'
      const stringHandle = vm.newString(jsString)
      assert.equal(vm.getString(stringHandle), jsString)
    })

    it('can round-trip undefined', () => {
      assert.strictEqual(vm.dump(vm.undefined), undefined)
    })
  })

  describe('functions', () => {
    it('can wrap a Javascript function and call it', () => {
      const some = 9
      const fnHandle = vm.newFunction('addSome', num => {
        return vm.newNumber(some + vm.getNumber(num))
      })
      const result = vm.callFunction(fnHandle, vm.undefined, vm.newNumber(1))
      if (result.error) {
        assert.fail('calling fnHandle must succeed')
      }
      assert.equal(vm.getNumber(result.value), 10)
      fnHandle.dispose()
    })

    it('passes through native exceptions', () => {
      const fnHandle = vm.newFunction('jsOops', () => {
        throw new Error('oops')
      })

      const result = vm.callFunction(fnHandle, vm.undefined)
      if (!result.error) {
        assert.fail('function call must return error')
      }
      assert.deepEqual(vm.dump(result.error), {
        name: 'Error',
        message: 'oops',
      })
      result.error.dispose()
      fnHandle.dispose()
    })

    it('can return undefined twice', () => {
      const fnHandle = vm.newFunction('returnUndef', () => {
        return vm.undefined
      })

      vm.unwrapResult(vm.callFunction(fnHandle, vm.undefined)).dispose()
      const result = vm.unwrapResult(vm.callFunction(fnHandle, vm.undefined))

      assert.equal(vm.typeof(result), 'undefined')
      result.dispose()
      fnHandle.dispose()
    })
  })

  describe('objects', () => {
    it('can set and get properties by native string', () => {
      const object = vm.newObject()
      const value = vm.newNumber(42)
      vm.setProp(object, 'propName', value)

      const value2 = vm.getProp(object, 'propName')
      assert.equal(vm.getNumber(value2), 42)

      object.dispose()
      value.dispose()
      value2.dispose()
    })

    it('can set and get properties by handle string', () => {
      const object = vm.newObject()
      const key = vm.newString('prop as a QuickJS string')
      const value = vm.newNumber(42)
      vm.setProp(object, key, value)

      const value2 = vm.getProp(object, key)
      assert.equal(vm.getNumber(value2), 42)

      object.dispose()
      key.dispose()
      value.dispose()
      value2.dispose()
    })

    it('can create objects with a prototype', () => {
      const defaultGreeting = vm.newString('SUP DAWG')
      const greeterPrototype = vm.newObject()
      vm.setProp(greeterPrototype, 'greeting', defaultGreeting)
      defaultGreeting.dispose()
      const greeter = vm.newObject(greeterPrototype)

      // Gets something from the prototype
      const getGreeting = vm.getProp(greeter, 'greeting')
      assert.equal(vm.getString(getGreeting), 'SUP DAWG')
      getGreeting.dispose()

      // But setting a property from the prototype does not modify the prototype
      const newGreeting = vm.newString('How do you do?')
      vm.setProp(greeter, 'greeting', newGreeting)
      newGreeting.dispose()

      const originalGreeting = vm.getProp(greeterPrototype, 'greeting')
      assert.equal(vm.getString(originalGreeting), 'SUP DAWG')
      originalGreeting.dispose()

      greeterPrototype.dispose()
      greeter.dispose()
    })
  })

  describe('.unwrapResult', () => {
    it('successful result: returns the value', () => {
      const handle = vm.newString('OK!')
      const result: VmCallResult<QuickJSHandle> = {
        value: handle,
      }

      assert.strictEqual(vm.unwrapResult(result), handle)
    })

    it('error result: throws the error as a Javascript value', () => {
      const handle = vm.newString('ERROR!')
      const result: VmCallResult<QuickJSHandle> = {
        error: handle,
      }

      try {
        vm.unwrapResult(result)
        assert.fail('vm.unwrapResult(error) must throw')
      } catch (error) {
        assert.strictEqual(error, 'ERROR!')
      }
    })
  })

  describe('.evalCode', () => {
    it('on success: returns { value: success }', () => {
      const value = vm.unwrapResult(vm.evalCode(`["this", "should", "work"].join(' ')`))
      assert.equal(vm.getString(value), 'this should work')
      value.dispose()
    })

    it('on failure: returns { error: exception }', () => {
      const result = vm.evalCode(`["this", "should", "fail].join(' ')`)
      if (!result.error) {
        assert.fail('result should be an error')
      }
      assert.deepEqual(vm.dump(result.error), {
        name: 'SyntaxError',
        message: 'unexpected end of string',
        stack: '    at eval.js:1\n',
      })
      result.error.dispose()
    })

    it('runs in the global context', () => {
      vm.unwrapResult(vm.evalCode(`var declaredWithEval = 'Nice!'`)).dispose()
      const declaredWithEval = vm.getProp(vm.global, 'declaredWithEval')
      assert.equal(vm.getString(declaredWithEval), 'Nice!')
      declaredWithEval.dispose()
    })

    it('can access assigned globals', () => {
      let i = 0
      const fnHandle = vm.newFunction('nextId', () => {
        return vm.newNumber(++i)
      })
      vm.setProp(vm.global, 'nextId', fnHandle)
      fnHandle.dispose()

      const nextId = vm.unwrapResult(vm.evalCode(`nextId(); nextId(); nextId()`))
      assert.equal(i, 3)
      assert.equal(vm.getNumber(nextId), 3)
    })
  })

  describe('.dump', () => {
    function dumpTestExample(val: unknown) {
      const json = JSON.stringify(val)
      const nativeType = typeof val
      it(`supports ${nativeType} (${json})`, () => {
        const handle = vm.unwrapResult(vm.evalCode(`(${json})`))
        assert.deepEqual(vm.dump(handle), val)
        handle.dispose()
      })
    }
    dumpTestExample(1)
    dumpTestExample('hi')
    dumpTestExample(true)
    dumpTestExample(false)
    dumpTestExample(undefined)
    dumpTestExample(null)
    dumpTestExample({ cow: true })
    dumpTestExample([1, 2, 3])
  })

  describe('.typeof', () => {
    function typeofTestExample(val: unknown, toCode = JSON.stringify) {
      const json = toCode(val)
      const nativeType = typeof val
      it(`supports ${nativeType} (${json})`, () => {
        const handle = vm.unwrapResult(vm.evalCode(`(${json})`))
        assert.equal(vm.typeof(handle), nativeType)
        handle.dispose()
      })
    }

    typeofTestExample(1)
    typeofTestExample('hi')
    typeofTestExample(true)
    typeofTestExample(false)
    typeofTestExample(undefined)
    typeofTestExample(null)
    typeofTestExample({ cow: true })
    typeofTestExample([1, 2, 3])
    typeofTestExample(
      function() {},
      (val: any) => val.toString()
    )
  })
})
