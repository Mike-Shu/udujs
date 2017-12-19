# Пользовательские настройки

**[The English version is here.]**

Список всех параметров, которые могут быть указаны при создании экземпляра утилиты.

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

Параметры должны передаваться через объект, например:
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
## horizontalPosition <code>строка | только клиент</code>

Горизонтальное положение всплывающего сообщения в окне браузера.
Допустимые значения: <code>left</code> или <code>right</code>.
По умолчанию установлено значение <code>left</code>.
```javascript
const Debug = new UduJS({
  horizontalPosition: 'right',
});
```

<a name="verticalPosition"></a>
## verticalPosition <code>строка | только клиент</code>

Вертикальное положение всплывающего сообщения в окне браузера.
Допустимые значения: <code>top</code> или <code>bottom</code>.
По умолчанию установлено значение <code>bottom</code>.
```javascript
const Debug = new UduJS({
  verticalPosition: 'top',
});
```

<a name="maxWidth"></a>
## maxWidth <code>число, строка | только клиент</code>

Максимальная ширина всплывающего сообщения.
Допустимые значения: <code>number</code> или <code>auto</code>.
По умолчанию установлено значение <code>500</code>.
```javascript
const Debug = new UduJS({
  maxWidth: 'auto',
});
```

<a name="maxHeight"></a>
## maxHeight <code>число | только клиент</code>

Максимальная высота всплывающего сообщения.
Допустимое значение: <code>number</code>.
По умолчанию установлено значение <code>600</code>.
```javascript
const Debug = new UduJS({
  maxHeight: 400,
});
```

<a name="fontSize"></a>
## fontSize <code>строка | только клиент</code>

Размер шрифта во всплывающем сообщении.
Допустимое значение: <code>string</code>.
По умолчанию установлено значение <code>1em</code>.
```javascript
const Debug = new UduJS({
  fontSize: '2em',
});
```

<a name="showClearTitle"></a>
## showClearTitle <code>логический | только клиент</code>

Всплывающая подсказка "Нажмите, чтобы очистить". Если она раздражает, то вы можете отключить её.
Допустимые значения: <code>true</code> или <code>false</code>.
По умолчанию установлено значение <code>true</code>.
```javascript
const Debug = new UduJS({
  showClearTitle: false,
});
```

<a name="showOutputDirection"></a>
## showOutputDirection <code>строка | только клиент</code>

Направление вывода для метода <code>[show()](./client-api.md#show)</code>.
Допустимые значения: <code>window</code> или <code>console</code>.
По умолчанию установлено значение <code>window</code>.
```javascript
const Debug = new UduJS({
  showOutputDirection: 'console',
});
```

<a name="allowColorization"></a>
## allowColorization <code>логический | только клиент</code>

Разрешить окраску отображаемой информации.
Этот параметр применим **только к консоли в браузере**.
Выключите его, если браузер неправильно окрашивает текст в консоли.
Допустимые значения: <code>true</code> или <code>false</code>.
По умолчанию установлено значение <code>true</code>.
```javascript
const Debug = new UduJS({
  allowColorization: false,
});
```

<a name="consoleColorScheme"></a>
## consoleColorScheme <code>строка | только клиент</code>

[Цветовая схема] для консоли в браузере.
Допустимые значения: <code>dark</code>, <code>bright</code> или <code>custom</code>.
По умолчанию установлено значение <code>dark</code>.
```javascript
const Debug = new UduJS({
  consoleColorScheme: 'bright',
});
```

<a name="popupColorScheme"></a>
## popupColorScheme <code>строка | только клиент</code>

[Цветовая схема] для всплывающего сообщения в браузере.
Допустимые значения: <code>dark</code>, <code>bright</code> или <code>custom</code>.
По умолчанию установлено значение <code>bright</code>.
```javascript
const Debug = new UduJS({
  popupColorScheme: 'dark',
});
```

<a name="serverColorScheme"></a>
## serverColorScheme <code>строка | только сервер</code>

[Цветовая схема] для консоли на сервере.
Допустимые значения: <code>dark</code>, <code>bright</code> или <code>custom</code>.
По умолчанию установлено значение <code>dark</code>.
```javascript
const Debug = new UduJS({
  serverColorScheme: 'custom',
});
```

<a name="consoleEOL"></a>
## consoleEOL <code>строка</code>

Символ новой строки для сообщений в консоли.
Рекомендуемые значения: <code>\r\n</code> - Windows-стиль, <code>\n</code> - Linux-стиль.
Допустимое значение: <code>string</code>.
По умолчанию установлено значение <code>\n</code>.
```javascript
const Debug = new UduJS({
  consoleEOL: '\r\n',
});
```

<a name="tabChar"></a>
## tabChar <code>строка</code>

Размер одного символа табуляции для форматирования сообщений.
Шаг отступа для вложенных структур данных.
Допустимое значение: <code>string</code>.
По умолчанию указано два символа пробела.
```javascript
const Debug = new UduJS({
  tabChar: '..',
});
```

<a name="decimalPlaces"></a>
## decimalPlaces <code>число</code>

Число десятичных знаков для отображения времени выполнения в RTT-методах (точность измерения).
Укажите 0, чтобы отключить десятичную часть.
Допустимое значение: <code>number</code>.
По умолчанию установлено значение <code>2</code>.
```javascript
const Debug = new UduJS({
  decimalPlaces: 4,
});
```

<a name="run"></a>
## run <code>логический</code>

Этот параметр позволяет быстро отключить все компоненты утилиты.
Допустимые значения: <code>true</code> или <code>false</code>.
По умолчанию установлено значение <code>true</code>.
```javascript
const Debug = new UduJS({
  run: false,
});
```

[The English version is here.]:../en/custom-settings.md "Custom settings"
[Цветовая схема]:./color-scheme.md