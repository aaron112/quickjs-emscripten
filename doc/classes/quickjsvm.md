[quickjs-emscripten](../README.md) › [Globals](../globals.md) › [QuickJSVm](quickjsvm.md)

# Class: QuickJSVm

QuickJSVm wraps a QuickJS Javascript runtime (JSRuntime*) and context (JSContext*).
This class's methods return [QuickJSHandle](../globals.md#quickjshandle), which wrap C pointers (JSValue*).
It's the caller's responsibility to call `.dispose()` on any
handles you create to free memory once you're done with the handle.

Each QuickJSVm instance is isolated. You cannot share handles between different
QuickJSVm instances. You should create separate QuickJSVm instances for
untrusted code from different souces for isolation.

Use [QuickJS.createVm](quickjs.md#createvm) to create a new QuickJSVm.

Create QuickJS values with methods like [newNumber](quickjsvm.md#newnumber), [newString](quickjsvm.md#newstring), [newObject](quickjsvm.md#newobject), and [newFunction](quickjsvm.md#newfunction).

Call [setProp](quickjsvm.md#setprop) or [defineProp](quickjsvm.md#defineprop) to customize objects. Use those methods with [global](quickjsvm.md#global) to expose the
values you create to the interior of the interpreter, so they can be used in [evalCode](quickjsvm.md#evalcode).

## Hierarchy

* **QuickJSVm**

## Implements

* [LowLevelJavascriptVm](../interfaces/lowleveljavascriptvm.md)‹[QuickJSHandle](../globals.md#quickjshandle)›

## Index

### Constructors

* [constructor](quickjsvm.md#constructor)

### Accessors

* [global](quickjsvm.md#global)
* [undefined](quickjsvm.md#undefined)

### Methods

* [callFunction](quickjsvm.md#callfunction)
* [defineProp](quickjsvm.md#defineprop)
* [dispose](quickjsvm.md#dispose)
* [dump](quickjsvm.md#dump)
* [evalCode](quickjsvm.md#evalcode)
* [getNumber](quickjsvm.md#getnumber)
* [getProp](quickjsvm.md#getprop)
* [getString](quickjsvm.md#getstring)
* [newFunction](quickjsvm.md#newfunction)
* [newNumber](quickjsvm.md#newnumber)
* [newObject](quickjsvm.md#newobject)
* [newString](quickjsvm.md#newstring)
* [setProp](quickjsvm.md#setprop)
* [typeof](quickjsvm.md#typeof)
* [unwrapResult](quickjsvm.md#unwrapresult)

## Constructors

###  constructor

\+ **new QuickJSVm**(`args`: object): *[QuickJSVm](quickjsvm.md)*

*Defined in [quickjs.ts:133](https://github.com/justjake/quickjs-emscripten/blob/master/ts/quickjs.ts#L133)*

Use [QuickJS.createVm](quickjs.md#createvm) to create a QuickJSVm instance.

**Parameters:**

Name | Type |
------ | ------ |
`args` | object |

**Returns:** *[QuickJSVm](quickjsvm.md)*

## Accessors

###  global

• **get global**(): *[QuickJSHandle](../globals.md#quickjshandle)*

*Defined in [quickjs.ts:168](https://github.com/justjake/quickjs-emscripten/blob/master/ts/quickjs.ts#L168)*

[`global`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects).
A handle to the global object inside the interpreter.
You can set properties to create global variables.

**Returns:** *[QuickJSHandle](../globals.md#quickjshandle)*

___

###  undefined

• **get undefined**(): *[QuickJSHandle](../globals.md#quickjshandle)*

*Defined in [quickjs.ts:153](https://github.com/justjake/quickjs-emscripten/blob/master/ts/quickjs.ts#L153)*

[`undefined`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined).

**Returns:** *[QuickJSHandle](../globals.md#quickjshandle)*

## Methods

###  callFunction

▸ **callFunction**(`func`: [QuickJSHandle](../globals.md#quickjshandle), `thisVal`: [QuickJSHandle](../globals.md#quickjshandle), ...`args`: [QuickJSHandle](../globals.md#quickjshandle)[]): *[VmCallResult](../globals.md#vmcallresult)‹[QuickJSHandle](../globals.md#quickjshandle)›*

*Defined in [quickjs.ts:364](https://github.com/justjake/quickjs-emscripten/blob/master/ts/quickjs.ts#L364)*

[`func.call(thisVal, ...args)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call).
Call a JSValue as a function.

See [unwrapResult](quickjsvm.md#unwrapresult), which will throw if the function returned an error, or
return the result handle directly.

**Parameters:**

Name | Type |
------ | ------ |
`func` | [QuickJSHandle](../globals.md#quickjshandle) |
`thisVal` | [QuickJSHandle](../globals.md#quickjshandle) |
`...args` | [QuickJSHandle](../globals.md#quickjshandle)[] |

**Returns:** *[VmCallResult](../globals.md#vmcallresult)‹[QuickJSHandle](../globals.md#quickjshandle)›*

A result. If the function threw, result `error` be a handle to the exception.

___

###  defineProp

▸ **defineProp**(`handle`: [QuickJSHandle](../globals.md#quickjshandle), `key`: string | [QuickJSHandle](../globals.md#quickjshandle), `descriptor`: [VmPropertyDescriptor](../interfaces/vmpropertydescriptor.md)‹[QuickJSHandle](../globals.md#quickjshandle)›): *void*

*Defined in [quickjs.ts:318](https://github.com/justjake/quickjs-emscripten/blob/master/ts/quickjs.ts#L318)*

[`Object.defineProperty(handle, key, descriptor)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`handle` | [QuickJSHandle](../globals.md#quickjshandle) | - |
`key` | string &#124; [QuickJSHandle](../globals.md#quickjshandle) | The property may be specified as a JSValue handle, or as a Javascript string (which will be converted automatically).  |
`descriptor` | [VmPropertyDescriptor](../interfaces/vmpropertydescriptor.md)‹[QuickJSHandle](../globals.md#quickjshandle)› | - |

**Returns:** *void*

___

###  dispose

▸ **dispose**(): *void*

*Defined in [quickjs.ts:464](https://github.com/justjake/quickjs-emscripten/blob/master/ts/quickjs.ts#L464)*

Dispose of this VM's underlying resources.

**`throws`** If Calling this method without disposing of all created handles
will result in an error.

**Returns:** *void*

___

###  dump

▸ **dump**(`handle`: [QuickJSHandle](../globals.md#quickjshandle)): *any*

*Defined in [quickjs.ts:417](https://github.com/justjake/quickjs-emscripten/blob/master/ts/quickjs.ts#L417)*

Dump a JSValue to Javascript in a best-effort fashion.
Returns `handle.toString()` if it cannot be serialized to JSON.

**Parameters:**

Name | Type |
------ | ------ |
`handle` | [QuickJSHandle](../globals.md#quickjshandle) |

**Returns:** *any*

___

###  evalCode

▸ **evalCode**(`code`: string): *[VmCallResult](../globals.md#vmcallresult)‹[QuickJSHandle](../globals.md#quickjshandle)›*

*Implementation of [LowLevelJavascriptVm](../interfaces/lowleveljavascriptvm.md)*

*Defined in [quickjs.ts:401](https://github.com/justjake/quickjs-emscripten/blob/master/ts/quickjs.ts#L401)*

Like [`eval(code)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Description).
Evauatetes the Javascript source `code` in the global scope of this VM.

See [unwrapResult](quickjsvm.md#unwrapresult), which will throw if the function returned an error, or
return the result handle directly.

*Note: this does not protect against infinite loops*.

**Parameters:**

Name | Type |
------ | ------ |
`code` | string |

**Returns:** *[VmCallResult](../globals.md#vmcallresult)‹[QuickJSHandle](../globals.md#quickjshandle)›*

The last statement's value. If the code threw, result `error` be
a handle to the exception.

___

###  getNumber

▸ **getNumber**(`handle`: [QuickJSHandle](../globals.md#quickjshandle)): *number*

*Defined in [quickjs.ts:209](https://github.com/justjake/quickjs-emscripten/blob/master/ts/quickjs.ts#L209)*

Converts `handle` into a Javascript number.

**Parameters:**

Name | Type |
------ | ------ |
`handle` | [QuickJSHandle](../globals.md#quickjshandle) |

**Returns:** *number*

`NaN` on error, othewise a `number`.

___

###  getProp

▸ **getProp**(`handle`: [QuickJSHandle](../globals.md#quickjshandle), `key`: string | [QuickJSHandle](../globals.md#quickjshandle)): *[QuickJSHandle](../globals.md#quickjshandle)*

*Defined in [quickjs.ts:276](https://github.com/justjake/quickjs-emscripten/blob/master/ts/quickjs.ts#L276)*

`handle[key]`.
Get a property from a JSValue.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`handle` | [QuickJSHandle](../globals.md#quickjshandle) | - |
`key` | string &#124; [QuickJSHandle](../globals.md#quickjshandle) | The property may be specified as a JSValue handle, or as a Javascript string (which will be converted automatically).  |

**Returns:** *[QuickJSHandle](../globals.md#quickjshandle)*

___

###  getString

▸ **getString**(`handle`: [QuickJSHandle](../globals.md#quickjshandle)): *string*

*Defined in [quickjs.ts:224](https://github.com/justjake/quickjs-emscripten/blob/master/ts/quickjs.ts#L224)*

Converts `handle` to a Javascript string.

**Parameters:**

Name | Type |
------ | ------ |
`handle` | [QuickJSHandle](../globals.md#quickjshandle) |

**Returns:** *string*

___

###  newFunction

▸ **newFunction**(`name`: string, `fn`: [VmFunctionImplementation](../globals.md#vmfunctionimplementation)‹[QuickJSHandle](../globals.md#quickjshandle)›): *[QuickJSHandle](../globals.md#quickjshandle)*

*Implementation of [LowLevelJavascriptVm](../interfaces/lowleveljavascriptvm.md)*

*Defined in [quickjs.ts:253](https://github.com/justjake/quickjs-emscripten/blob/master/ts/quickjs.ts#L253)*

Convert a Javascript function into a QuickJS function value.
See [VmFunctionImplementation](../globals.md#vmfunctionimplementation) for more details.

A [VmFunctionImplementation](../globals.md#vmfunctionimplementation) should not free its arguments or its retun
value. A VmFunctionImplementation should also not retain any references to
its veturn value.

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`fn` | [VmFunctionImplementation](../globals.md#vmfunctionimplementation)‹[QuickJSHandle](../globals.md#quickjshandle)› |

**Returns:** *[QuickJSHandle](../globals.md#quickjshandle)*

___

###  newNumber

▸ **newNumber**(`num`: number): *[QuickJSHandle](../globals.md#quickjshandle)*

*Implementation of [LowLevelJavascriptVm](../interfaces/lowleveljavascriptvm.md)*

*Defined in [quickjs.ts:201](https://github.com/justjake/quickjs-emscripten/blob/master/ts/quickjs.ts#L201)*

Converts a Javascript number into a QuckJS value.

**Parameters:**

Name | Type |
------ | ------ |
`num` | number |

**Returns:** *[QuickJSHandle](../globals.md#quickjshandle)*

___

###  newObject

▸ **newObject**(`prototype?`: [QuickJSHandle](../globals.md#quickjshandle)): *[QuickJSHandle](../globals.md#quickjshandle)*

*Implementation of [LowLevelJavascriptVm](../interfaces/lowleveljavascriptvm.md)*

*Defined in [quickjs.ts:235](https://github.com/justjake/quickjs-emscripten/blob/master/ts/quickjs.ts#L235)*

`{}`.
Create a new QuickJS [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`prototype?` | [QuickJSHandle](../globals.md#quickjshandle) | Like [`Object.create`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create).  |

**Returns:** *[QuickJSHandle](../globals.md#quickjshandle)*

___

###  newString

▸ **newString**(`str`: string): *[QuickJSHandle](../globals.md#quickjshandle)*

*Implementation of [LowLevelJavascriptVm](../interfaces/lowleveljavascriptvm.md)*

*Defined in [quickjs.ts:217](https://github.com/justjake/quickjs-emscripten/blob/master/ts/quickjs.ts#L217)*

Create a QuickJS [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) value.

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

**Returns:** *[QuickJSHandle](../globals.md#quickjshandle)*

___

###  setProp

▸ **setProp**(`handle`: [QuickJSHandle](../globals.md#quickjshandle), `key`: string | [QuickJSHandle](../globals.md#quickjshandle), `value`: [QuickJSHandle](../globals.md#quickjshandle)): *void*

*Defined in [quickjs.ts:300](https://github.com/justjake/quickjs-emscripten/blob/master/ts/quickjs.ts#L300)*

`handle[key] = value`.
Set a property on a JSValue.

**`remarks`** 
Note that the QuickJS authors recommend using [defineProp](quickjsvm.md#defineprop) to define new
properties.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`handle` | [QuickJSHandle](../globals.md#quickjshandle) | - |
`key` | string &#124; [QuickJSHandle](../globals.md#quickjshandle) | The property may be specified as a JSValue handle, or as a Javascript string (which will be converted automatically).  |
`value` | [QuickJSHandle](../globals.md#quickjshandle) | - |

**Returns:** *void*

___

###  typeof

▸ **typeof**(`handle`: [QuickJSHandle](../globals.md#quickjshandle)): *string*

*Defined in [quickjs.ts:193](https://github.com/justjake/quickjs-emscripten/blob/master/ts/quickjs.ts#L193)*

`typeof` operator. **Not** [standards compliant](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof).

**`remarks`** 
Does not support BigInt values correctly.

**Parameters:**

Name | Type |
------ | ------ |
`handle` | [QuickJSHandle](../globals.md#quickjshandle) |

**Returns:** *string*

___

###  unwrapResult

▸ **unwrapResult**(`result`: [VmCallResult](../globals.md#vmcallresult)‹[QuickJSHandle](../globals.md#quickjshandle)›): *[QuickJSHandle](../globals.md#quickjshandle)*

*Defined in [quickjs.ts:440](https://github.com/justjake/quickjs-emscripten/blob/master/ts/quickjs.ts#L440)*

Unwrap a VmCallResult, returning it's value on success, and throwing the dumped
error on failure.

**Parameters:**

Name | Type |
------ | ------ |
`result` | [VmCallResult](../globals.md#vmcallresult)‹[QuickJSHandle](../globals.md#quickjshandle)› |

**Returns:** *[QuickJSHandle](../globals.md#quickjshandle)*
