# Color scheme

**[Русская версия здесь.]**

The color scheme is a set of color profiles for three streams:
* console in the browser (<code>console</code>);
* pop-up message in the browser (<code>popup</code>);
* console on the server (<code>server</code>).

Each such stream has three profiles:
* standard dark (<code>dark</code>);
* standard bright (<code>bright</code>);
* custom version (<code>custom</code>).

Profiles for the console contain four colors:
* header color (<code>heading</code>);
* color of the useful information (<code>master</code>);
* color of service words and symbols (<code>slave</code>);
* color for data types that require special attention (<code>attention</code>).

Profiles for a pop-up message contain seven colors:
* background color of the pop-up message (<code>background</code>);
* border color of the pop-up message (<code>border</code>);
* background color for the newly added message (<code>appendBG</code>);
* background color for the message in focus (<code>hoverBG</code>);
* color of the useful information (<code>master</code>);
* color of service words and symbols (<code>slave</code>);
* color for data types that require special attention (<code>attention</code>).

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

Path to the color scheme file: [node_modules/udujs/lib/colorScheme.js](../../lib/colorScheme.js)

## Custom profile

If standard profiles do not suit you ((<code>dark</code> & <code>bright</code>)), you can customize your version.
To do this, you need to make changes to the profile <code>custom</code> (file <code>colorScheme.js</code>).
For example:
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

Then, specify this profile when creating the utility instance.
For example, like this:
```javascript
const UduJS = require('udujs/Client');
const Debug = new UduJS({
  consoleColorScheme: 'custom',
});
```

## Color selection

The colors for the browser were chosen here: [click](https://www.materialui.co/colors).

About how to use colors for the console on the server: [click](https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color).

[Русская версия здесь.]:../ru/color-scheme.md "Цветовая схема"
