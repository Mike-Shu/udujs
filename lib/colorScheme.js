/**
 * A color scheme is a set of color profiles for three streams: for the browser console,
 * for the pop-up message in the browser, and for the console on the server.
 * The colors for the browser were chosen here: https://www.materialui.co/colors
 * About how to use colors for the console on the server:
 * https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
 *
 * Please do not rename sections "dark" and "bright".
 * For custom settings, there is a corresponding section.
 */
module.exports = {
  console: { // Console in the browser.
    dark: {
      heading: '#CDDC39', // The color of the headers.
      master: '#E0E0E0', // Color of the useful information.
      slave: '#9E9E9E', // Color of service words and symbols.
      attention: '#5394EC', // Color for data types that require special attention.
    },
    bright: {
      heading: '#8BC34A',
      master: '#546E7A',
      slave: '#BCAAA4',
      attention: '#0288D1',
    },
    custom: {
      heading: '#fff',
      master: '#fff',
      slave: '#fff',
      attention: '#fff',
    },
  },
  popup: { // Pop-up message in the browser.
    dark: {
      background: '#37474F', // Background color of the pop-up message.
      border: '#78909C', // Border color of the pop-up message.
      appendBG: '#4DD0E1', // Background color for the newly added message.
      hoverBG: '#455A64', // Background color for the message in focus.
      master: '#ECEFF1',
      slave: '#9E9E9E',
      attention: '#40C4FF',
    },
    bright: {
      background: '#FFFDE7',
      border: '#EFEBE9',
      appendBG: '#AED581',
      hoverBG: '#FFECB3',
      master: '#263238',
      slave: '#9E9E9E',
      attention: '#2196F3',
    },
    custom: {
      background: '#fff',
      border: '#fff',
      font: '#fff',
      appendBG: '#fff',
      hoverBG: '#fff',
      master: '#fff',
      slave: '#fff',
      attention: '#fff',
    },
  },
  server: { // Console on the server.
    dark: {
      heading: '33',
      master: '97',
      slave: '37',
      attention: '94',
    },
    bright: {
      heading: '33',
      master: '90',
      slave: '37',
      attention: '34',
    },
    custom: {
      heading: '7',
      master: '7',
      slave: '7',
      attention: '7',
    },
  },
};
