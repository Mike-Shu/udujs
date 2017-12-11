module.exports = {
  popupMsg: {
    fontSize: '1em', // Font size of pop-up message.
    showClearTitle: true, // Pop-up message "Click to clear".
    horizontalPosition: 'left', // Horizontal position of pop-up message: "left" or "right".
    verticalPosition: 'bottom', // Vertical position of pop-up message: "top" or "bottom".
    maxWidth: 500, // Maximum width of pop-up message.
    maxHeight: 600, // Maximum height of pop-up message.
    // TODO: Implement customizing the direction of adding new messages: from above or below.
    messageDirection: 'above', // "above" or "below".
    bottomIndent: 22, // An indent at the bottom of the browser for the status line to be visible.
  },
  serviceApp: {
    showOutputDefault: 'window', // Default output for "Show" method: "window" or "console".
    consoleEOL: '\n', // Newline character for console message. "\r\n" - Windows-style, "\n" - Linux-style.
    consoleSpace: '  ', // One block of spaces: for console messages.
    appName: 'UduJS',
    appDescription: 'A simple universal debugging utility for JavaScript code.',
    appVersion: '1.0.0',
    consoleColorScheme: 'dark', // The default color scheme for the console in the browser. "dark", "bright" or "custom".
    popupColorScheme: 'bright', // The default color scheme for a pop-up message in the browser. "dark", "bright" or "custom".
    serverColorScheme: 'dark', // The default color scheme for the console on the server. "dark", "bright" or "custom".
    allowColorization: true, // Allow coloring of the displayed information.
  },
  performance: {
    decimalPlaces: 2, // Decimal places in the output of the performance methods. Type zero to hide.
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
