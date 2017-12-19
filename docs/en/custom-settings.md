# Custom settings

**[Русская версия здесь.]**

A list of all the parameters that can be specified when creating a utility instance.

* [horizontalPosition](#horizontalPosition)
* [verticalPosition](#verticalPosition)
* [maxWidth](#maxWidth)
* [maxHeight](#maxHeight)
* [fontSize](#fontSize)
* [showClearTitle](#showClearTitle)
* [showOutputDirection](#showOutputDirection)
* [allowColorization](#allowColorization)
* [consoleColorScheme](#consoleColorScheme)
* [popupColorScheme](#popupColorScheme)
* [serverColorScheme](#serverColorScheme)
* [consoleEOL](#consoleEOL)
* [tabChar](#tabChar)
* [decimalPlaces](#decimalPlaces)
* [run](#run)

Parameters must be passed through the object, for example:
```javascript
const UduJS = require('udujs/Client');
const Debug = new UduJS({
  maxWidth: 'auto',
  fontSize: '1.2em',
  decimalPlaces: 4,
  popupColorScheme: 'dark',
});
```

<a name="horizontalPosition"></a>
## horizontalPosition <code>string | client only</code>

Horizontal position of pop-up message on the browser window.
Valid values are <code>left</code> or <code>right</code>.
The default value is <code>left</code>.
```javascript
const Debug = new UduJS({
  horizontalPosition: 'right',
});
```

<a name="verticalPosition"></a>
## verticalPosition <code>string | client only</code>

Vertical position of pop-up message on the browser window.
Valid values are <code>top</code> or <code>bottom</code>.
The default value is <code>bottom</code>.
```javascript
const Debug = new UduJS({
  verticalPosition: 'top',
});
```

<a name="maxWidth"></a>
## maxWidth <code>number, string | client only</code>

The maximum width of the pop-up message.
Valid values are <code>number</code> or <code>auto</code>.
The default value is <code>500</code>.
```javascript
const Debug = new UduJS({
  maxWidth: 'auto',
});
```

<a name="maxHeight"></a>
## maxHeight <code>number | client only</code>

The maximum height of the pop-up message.
Valid value are <code>number</code>.
The default value is <code>600</code>.
```javascript
const Debug = new UduJS({
  maxHeight: 400,
});
```

<a name="fontSize"></a>
## fontSize <code>string | client only</code>

The font size in the pop-up message.
Valid value are <code>string</code>.
The default value is <code>1em</code>.
```javascript
const Debug = new UduJS({
  fontSize: '2em',
});
```

<a name="showClearTitle"></a>
## showClearTitle <code>boolean | client only</code>

The "Click to clear" tooltip on the pop-up message. If annoying, then you can turn it off.
Valid values are <code>true</code> or <code>false</code>.
The default value is <code>true</code>.
```javascript
const Debug = new UduJS({
  showClearTitle: false,
});
```

<a name="showOutputDirection"></a>
## showOutputDirection <code>string | client only</code>

Output direction for the <code>[show()](./client-api.md#show)</code> method.
Valid values are <code>window</code> or <code>console</code>.
The default value is <code>window</code>.
```javascript
const Debug = new UduJS({
  showOutputDirection: 'console',
});
```

<a name="allowColorization"></a>
## allowColorization <code>boolean | client only</code>

Allow coloring of the displayed information.
This parameter is applicable **only to the console on the browser**.
Turn it off if the browser does not correctly color the text in the console.
Valid values are <code>true</code> or <code>false</code>.
The default value is <code>true</code>.
```javascript
const Debug = new UduJS({
  allowColorization: false,
});
```

<a name="consoleColorScheme"></a>
## consoleColorScheme <code>string | client only</code>

The [color scheme] for the console in the browser.
Valid values are <code>dark</code>, <code>bright</code> or <code>custom</code>.
The default value is <code>dark</code>.
```javascript
const Debug = new UduJS({
  consoleColorScheme: 'bright',
});
```

<a name="popupColorScheme"></a>
## popupColorScheme <code>string | client only</code>

The [color scheme] for a pop-up message in the browser.
Valid values are <code>dark</code>, <code>bright</code> or <code>custom</code>.
The default value is <code>bright</code>.
```javascript
const Debug = new UduJS({
  popupColorScheme: 'dark',
});
```

<a name="serverColorScheme"></a>
## serverColorScheme <code>string | server only</code>

The [color scheme] for the console on the server.
Valid values are <code>dark</code>, <code>bright</code> or <code>custom</code>.
The default value is <code>dark</code>.
```javascript
const Debug = new UduJS({
  serverColorScheme: 'custom',
});
```

<a name="consoleEOL"></a>
## consoleEOL <code>string</code>

A newline character for messages in the console.
Recommended values: <code>\r\n</code> - Windows-style, <code>\n</code> - Linux-style.
Valid value are <code>string</code>.
The default value is <code>\n</code>.
```javascript
const Debug = new UduJS({
  consoleEOL: '\r\n',
});
```

<a name="tabChar"></a>
## tabChar <code>string</code>

The size of one tab character for formatting messages.
Step of indent for nested data structures.
Valid value are <code>string</code>.
The default is two space characters.
```javascript
const Debug = new UduJS({
  tabChar: '..',
});
```

<a name="decimalPlaces"></a>
## decimalPlaces <code>number</code>

The number of decimal places for displaying the execution time in RTT-methods (accuracy of measurement).
Specify 0 to disable the decimal part.
Valid value are <code>number</code>.
The default value is <code>2</code>.
```javascript
const Debug = new UduJS({
  decimalPlaces: 4,
});
```

<a name="run"></a>
## run <code>boolean</code>

This parameter allows you to quickly disable all components of the utility.
Valid values are <code>true</code> or <code>false</code>.
The default value is <code>true</code>.
```javascript
const Debug = new UduJS({
  run: false,
});
```

[Русская версия здесь.]:../ru/custom-settings.md "Пользовательские настройки"
[color scheme]:./color-scheme.md