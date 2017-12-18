module.exports = {
  popupMsg: {
    fontSize: '1em', // The font size in the pop-up message.
    showClearTitle: true, // The "Click to clear" tooltip on the pop-up message.
    horizontalPosition: 'left', // Horizontal position of pop-up message: "left" or "right".
    verticalPosition: 'bottom', // Vertical position of pop-up message: "top" or "bottom".
    maxWidth: 500, // Maximum width of pop-up message.
    maxHeight: 600, // Maximum height of pop-up message.
    // TODO: Implement customizing the direction of adding new messages: from above or below.
    messageDirection: 'above', // "above" or "below".
    bottomIndent: 22, // An indent at the bottom of the browser for the status line to be visible.
  },
  serviceApp: {
    showOutputDirection: 'window', // Output direction for the "show()" method: "window" or "console".
    consoleEOL: '\n', // A newline character for messages in the console. Recommended values: "\r\n" - Windows-style, "\n" - Linux-style.
    tabChar: '  ', // The size of one tab character for formatting messages.
    appName: 'UduJS',
    appDescription: 'A simple universal debugging utility for JavaScript code.',
    appVersion: '1.0.4',
    consoleColorScheme: 'dark', // The default color scheme for the console in the browser. "dark", "bright" or "custom".
    popupColorScheme: 'bright', // The default color scheme for a pop-up message in the browser. "dark", "bright" or "custom".
    serverColorScheme: 'dark', // The default color scheme for the console on the server. "dark", "bright" or "custom".
    allowColorization: true, // Allow coloring of the displayed information.
  },
  performance: {
    decimalPlaces: 2, // The number of decimal places to display the execution time in RTT-methods.
  },
  runtime: {
    run: true, // Allow the utility to run, or not.
    globalIndentSize: 0, // The current value of the indent in the output stream.
    msgContainer: null, // Container for pop-up message: does not exist by default.
    observer: null, // Container for pop-up observer: does not exist by default.
    colorScheme: {}, // A color scheme that will be loaded based on preferences.
    cache: {},
  },
};
