# API: general methods

**[Русская версия здесь.]**

These methods are common and are available both on the server (<code>Node.js</code>) and on the client (<code>in browsers</code>).

* [.log()](#log)
* [.rttPoint()](#rttPoint)
* [.rttStart()](#rttStart)
* [.rttFinish()](#rttFinish)
* [.rttAverage()](#rttAverage)
* [.stopExec()](#stopExec)
* [.resumeExec()](#resumeExec)

<a name="log"></a>
## .log(value, [comment])

Outputs debugging information to the console.
This method returns nothing.

| Parameter | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | A value of any type. |
| [comment] | <code>string</code> | Additional explanatory comment to the displayed value. |

<a name="rttPoint"></a>
## .rttPoint([name]) ⇒ <code>number</code>

Run-time testing (RTT).
Sets the control point in the code.
Calculates the code execution time between two control points (_in milliseconds_).
Displays the calculated value in the console.

**Returns**: <code>number</code> - the calculated value.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| [name] | <code>string</code> | <code>Starting point.</code> | An optional explanatory name for the control point. The default value is displayed only if the method is called the first time. |

<a name="rttStart"></a>
## .rttStart([name], [levelIndex])

Run-time testing (RTT).
The starting point for computing the execution time of some code.
This method returns nothing.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| [name] | <code>string</code> |  | An optional explanatory name for this test. |
| [levelIndex] | <code>int</code> | <code>0</code> | An optional index for the level of nesting (for nested tests). |

<a name="rttFinish"></a>
## .rttFinish([levelIndex]) ⇒ <code>number</code>

Run-time testing (RTT).
The end point for the <code>[rttStart()](#rttStart)</code> method.
Calculates the code execution time between the start and current points (_in milliseconds_).
Displays the calculated value in the console.

**Returns**: <code>number</code> - the calculated value.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| [levelIndex] | <code>int</code> | <code>0</code> | An optional index for the level of nesting (for nested tests). |

Example of nested tests:
```javascript
Debug.rttStart('The main level.', 0);
Debug.rttStart('The nested level.', 1);
// Some code.
Debug.rttFinish(1);
Debug.rttStart('The nested level.', 1);
// Some code.
Debug.rttFinish(1);
Debug.rttFinish(0);
```

<a name="rttAverage"></a>
## .rttAverage(codeContainer, cycles, [name], [timeEachIteration]) ⇒ <code>number</code>

Run-time testing (RTT).
Calculates the average execution time of some code (_in milliseconds_).
Displays the calculated value in the console.

**Returns**: <code>number</code> - the calculated value.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| codeContainer | <code>function</code> |  | Container for the code under test. |
| cycles | <code>int</code> |  | Number of cycles to repeat the test (maximum 1000 cycles). |
| [name] | <code>string</code> |  | An optional explanatory name for this test. |
| [timeEachIteration] | <code>boolean</code> | <code>false</code> | Display the execution time of each iteration? |

<a name="stopExec"></a>
## .stopExec()

The method stops execution of the utility.
This method returns nothing.

<a name="resumeExec"></a>
## .resumeExec()

The method resumes execution of the utility.
This method returns nothing.

[Русская версия здесь.]:../ru/general-api.md "API: основные методы"
