# Цветовая схема

**[The English version is here.]**

Цветовая схема - это набор цветовых профилей для трёх потоков:
* консоль в браузере (<code>console</code>);
* всплывающее сообщение в браузере (<code>popup</code>);
* консоль на сервере (<code>server</code>).

Каждый такой поток имеет по три профиля:
* стандартный темный (<code>dark</code>);
* стандартный яркий (<code>bright</code>);
* пользовательский вариант (<code>custom</code>).

Профили для консоли содержат по четыре цвета:
* цвет заголовков (<code>heading</code>);
* цвет полезной информации (<code>master</code>);
* цвет служебных слов и символов (<code>slave</code>);
* цвет для типов данных, требующих особого внимания (<code>attention</code>).

Профили для всплывающего сообщения содержат по семь цветов:
* цвет фона всплывающего сообщения (<code>background</code>);
* цвет границы всплывающего сообщения (<code>border</code>);
* цвет фона для вновь добавленного сообщения (<code>appendBG</code>);
* цвет фона для сообщения в фокусе (<code>hoverBG</code>);
* цвет полезной информации (<code>master</code>);
* цвет служебных слов и символов (<code>slave</code>);
* цвет для типов данных, требующих особого внимания (<code>attention</code>).

```javascript
module.exports = {
  console: {
    dark: {
      heading: '#CDDC39',
      master: '#E0E0E0',
      slave: '#9E9E9E',
      attention: '#5394EC',
    },
    bright: {
      // ...
    },
    custom: {
      // ...
    },
  },
  popup: {
    dark: {
      background: '#37474F',
      border: '#78909C',
      appendBG: '#4DD0E1',
      hoverBG: '#455A64',
      master: '#ECEFF1',
      slave: '#9E9E9E',
      attention: '#40C4FF',
    },
    // ...
  },
  server: {
    // ...
  },
};
```

Путь к файлу цветовой схемы: [node_modules/udujs/lib/colorScheme.js](../../src/lib/colorScheme.js)

## Пользовательский профиль

Если стандартные профили вас не устраивают (<code>dark</code> & <code>bright</code>), вы можете настроить свою версию.
Для этого вам необходимо внести изменения в профиль <code>custom</code> (файл <code>colorScheme.js</code>).
Например:
```javascript
module.exports = {
  console: {
    dark: {
      // ...
    },
    bright: {
      // ...
    },
    custom: {
      heading: '#ff0000',
      master: '#00ff00',
      slave: '#0000ff',
      attention: '#ff00ff',
    },
  },
  popup: {
    // ...
  },
  server: {
    // ...
  },
};
```

Затем указать этот профиль при создании экземпляра утилиты.
Например, вот так:
```javascript
const UduJS = require('udujs/Client');
const Debug = new UduJS({
  consoleColorScheme: 'custom',
});
```

## Выбор цвета

Цвета для браузера были выбраны здесь: [click](https://www.materialui.co/colors).

О том, как использовать цвета для консоли на сервере: [click](https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color).

[The English version is here.]:../en/color-scheme.md "Color scheme"
