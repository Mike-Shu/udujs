# UduJS

[![Build Status](https://travis-ci.org/Heliax44/udujs.svg?branch=master)](https://travis-ci.org/Heliax44/udujs)
[![Coverage Status](https://coveralls.io/repos/github/Heliax44/udujs/badge.svg?branch=master)](https://coveralls.io/github/Heliax44/udujs?branch=master)
[![dependencies Status](https://david-dm.org/Heliax44/udujs/status.svg)](https://david-dm.org/Heliax44/udujs)
[![devDependencies Status](https://david-dm.org/Heliax44/udujs/dev-status.svg)](https://david-dm.org/Heliax44/udujs?type=dev)

**[The English version is here.]**

Простая универсальная отладочная утилита для JavaScript-кода. Предназначена для Node.js и браузеров.

**Сделайте отладку более понятной и простой.**

<img src="../resources/intro.png" width="820" height="457"/>

## Поддержка

Потестировано в:
* Node.js 6-8.
* Google Chrome 62-63.
* Firefox Developer Edition 57-58.

У вас есть предложения, пожелания или замечания? Добро пожаловать в [issue tracker]!

## Установка

```bash
$ npm i udujs
```

или

```bash
$ yarn add udujs
```

## Применение

* [Включение в проект](#Inclusion)
* [Пользовательская настройка](#Customizing)
* [Основные методы](#GeneralMethods)
* [Клиентские методы](#ClientMethods)

<a name="Inclusion"></a>
### Включение в проект

#### Код на сервере:

* стандартный метод (_автоматическое определение рабочего окружения_);
```js
const UduJS = require('udujs');
const Debug = new UduJS();
```
* прямое подключение серверных методов (_рекомендуется_).
```js
const UduJS = require('udujs/Server');
const Debug = new UduJS();
```
**Примечание**: оба этих способа включения практически идентичны. Вы можете применить любой из них.

#### Код на клиенте:

* стандартный способ (_не рекомендуется_);
```js
const UduJS = require('udujs');
const Debug = new UduJS();
```
* прямое подключение клиентских методов;
```js
const UduJS = require('udujs/Client');
const Debug = new UduJS();
```
* подключение скомпилированной библиотеки непосредственно к файлу HTML (_папка <code>[compiled]</code>_).
```html
<script src="js/mod/udujs-1.0.0.min.js"></script> <!-- Для примера -->
<script>
  var Debug = new UduJS();
</script>
```
**Примечание**: стандартный способ включения может привести к распуханию файлов при компиляции бандла.

<a name="Customizing"></a>
### Пользовательская настройка

При создании экземпляра утилиты вы можете указать объект с [пользовательскими настройками]. Это поможет вам немного отрегулировать процесс отладки. Например:
```javascript
const UduJS = require('udujs/Client');
const Debug = new UduJS({
  maxWidth: 'auto',
  fontSize: '1.2em',
  decimalPlaces: 4,
  popupColorScheme: 'dark',
});
```

<a name="GeneralMethods"></a>
### Основные методы

* [.log()](#log)
* [.rttPoint()](#rttPoint)
* [.rttStart()](#rttStart)
* [.rttFinish()](#rttFinish)
* [.rttAverage()](#rttAverage)
* [.stopExec()](#stopExec)
* [.resumeExec()](#resumeExec)

<a name="log"></a>
#### .log(value, [comment]) [API](./general-api.md#log)

Выводит отладочную информацию в консоль.
Этот метод ничего не возвращает.
```javascript
const someVariable = +100500;
Debug.log(someVariable);
```

Результат ([пример кода с основными методами]):

<img src="../resources/sample1.png" width="526" height="73"/>

<a name="rttPoint"></a>
#### .rttPoint([name]) ⇒ <code>число</code> [API](./general-api.md#rttPoint)

Проверка времени выполнения (RTT).
Устанавливает контрольную точку в коде. 
Вычисляет время выполнения кода между двумя контрольными точками (_в миллисекундах_).
* Отображает вычисленное значение в консоли.
* Возвращает вычисленное значение.
```javascript
Debug.rttPoint();
someCode();
Debug.rttPoint('Some code was executed.');
someCode();
// Или, результат работы метода можно присвоить переменной.
let lastPointResult = Debug.rttPoint('More code.');
```

Результат ([пример кода с основными методами]):

<img src="../resources/sample2.png" width="526" height="91"/>

<a name="rttStart"></a>
#### .rttStart([name], [levelIndex]) [API](./general-api.md#rttStart)

Проверка времени выполнения (RTT).
Начальная точка для вычисления времени выполнения некоторого кода.
Этот метод ничего не возвращает.

<a name="rttFinish"></a>
#### .rttFinish([levelIndex]) ⇒ <code>число</code> [API](./general-api.md#rttFinish)

Проверка времени выполнения (RTT).
Конечная точка для метода <code>rttStart()</code>.
Вычисляет время выполнения кода между начальной и текущей точками (_в миллисекундах_).
* Отображает вычисленное значение в консоли.
* Возвращает вычисленное значение.
```javascript
Debug.rttStart('Single testing of some code.');
someCode();
Debug.rttFinish();
// Или, результат работы метода можно присвоить переменной.
let rttResult = Debug.rttFinish();
```

Результат ([пример кода с основными методами]):

<img src="../resources/sample3.png" width="526" height="53"/>

<a name="rttAverage"></a>
#### .rttAverage(codeContainer, cycles, [name], [timeEachIteration]) ⇒ <code>число</code> [API](./general-api.md#rttAverage)

Проверка времени выполнения (RTT).
Вычисляет среднее время выполнения некоторого кода (_в миллисекундах_).
* Отображает вычисленное значение в консоли.
* Возвращает вычисленное значение.
```javascript
Debug.rttAverage(someCode, 3, 'The average execution time of some code.', true);
// Или, результат работы метода можно присвоить переменной.
let averageResult = Debug.rttAverage(someCode, 3, 'The average execution time of some code.', true);
```

Результат ([пример кода с основными методами]):

<img src="../resources/sample4.png" width="526" height="107"/>

<a name="stopExec"></a>
#### .stopExec() [API](./general-api.md#stopExec)

Приостановка выполнения утилиты.
Этот метод ничего не возвращает.

<a name="resumeExec"></a>
#### .resumeExec() [API](./general-api.md#resumeExec)

Возобновление выполнения утилиты.
Этот метод ничего не возвращает.
```javascript
Debug.stopExec();
// Код приложения между этими методами будет выполнен.
someCode(); // Этот код будет выполнен.
// Утилитные методы, напротив, будут проигнорированы.
Debug.log('This method will be ignored.');
Debug.resumeExec();
```

<a name="ClientMethods"></a>
### Клиентские методы

* [.popup()](#popup)
* [.popupReset()](#popupReset)
* [.show()](#show)
* [.observer()](#observer)

<a name="popup"></a>
#### .popup() [API](./client-api.md#popup)

Отображает отладочную информацию в списке во всплывающем сообщении в окне браузера.
Этот метод ничего не возвращает.
```javascript
const someVariable = +100500;
Debug.popup(someVariable);
```

Результат ([пример кода с клиентскими методами]):

<img src="../resources/sample5.png" width="526" height="108"/>

<a name="popupReset"></a>
#### .popupReset() [API](./client-api.md#popupReset)

Очищает список во всплывающем сообщении.
Этот метод ничего не возвращает.
```javascript
Debug.popupReset();
```

Результат ([пример кода с клиентскими методами]):

<img src="../resources/sample6.png" width="526" height="108"/>

<a name="show"></a>
#### .show() [API](./client-api.md#show)

Универсальный метод для отображения отладочной информации.
Выводит либо в консоль, либо во всплывающее сообщение.
Направление вывода управляется через конфигурацию (_параметр <code>[showOutputDirection]</code>_).
По умолчанию информация отображается во всплывающем сообщении.
Этот метод ничего не возвращает.
```javascript
const someVariable = +100500;
Debug.show(`Using the "show()" method: ${someVariable}`);
```

Результат ([пример кода с клиентскими методами]):

<img src="../resources/sample7.png" width="526" height="108"/>

<a name="observer"></a>
#### .observer() [API](./client-api.md#observer)

Отображает отладочную информацию в фиксированном поле во всплывающем сообщении.
Этот метод ничего не возвращает.

```javascript
const someStatus = true;
Debug.observer(`Some status: ${someStatus}`);
```

Результат ([пример кода с клиентскими методами]):

<img src="../resources/sample8.png" width="526" height="139"/>

[The English version is here.]:../../README.md "Documentation in English"
[compiled]:/compiled
[пользовательскими настройками]:./custom-settings.md
[пример кода с основными методами]:../../app/server-app.js
[пример кода с клиентскими методами]:../../app/client-app.js
[showOutputDirection]:./custom-settings.md#showOutputDirection
[issue tracker]:https://github.com/Heliax44/udujs/issues
