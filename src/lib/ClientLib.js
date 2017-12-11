// Dependencies.
const Common = require('./Common');

/**
 * This module implements helper methods for the client-side.
 */
class ClientLib {
  constructor() {
    this.color = {
      consoleScheme(value) {
        const colorName = Common.validatingString(value);
        let result = 0;

        if (colorName) {
          const color = Common.config.runtime.colorScheme.console[colorName];

          if (typeof color === 'undefined') {
            Common.console.warn(`${Common.config.serviceApp.consoleEOL}Warning: unknown color name "${colorName}" in the color scheme "console".`);
          } else {
            result = color;
          }
        }

        return result;
      },
      get popupScheme() {
        return Common.config.runtime.colorScheme.popup;
      },
      getColor: value => `color: ${value}`,
      get heading() {
        return this.getColor(this.consoleScheme('heading'));
      },
      get master() {
        return this.getColor(this.consoleScheme('master'));
      },
      get slave() {
        return this.getColor(this.consoleScheme('slave'));
      },
      get attention() {
        return this.getColor(this.consoleScheme('attention'));
      },
    };
    this.appName = [
      '[', 'slave',
      Common.config.serviceApp.appName, 'heading',
      '] ', 'slave',
    ];
    this.serviceApp = Common.config.serviceApp;
    this.runtime = Common.config.runtime;
    this.testPointTime = 0;
    this.windowObj = window;
    this.userAgent = window.navigator.userAgent;
    this.performanceObj = window.performance;
  }

  //--------------------------------------------------
  /**
   * Returns the timestamp (DOMHighResTimeStamp).
   * @returns {*}
   */
  get performanceNow() {
    let result = null;

    if (typeof this.performanceObj === 'object' && typeof this.performanceObj.now === 'function') {
      result = this.performanceObj.now();
    }

    return result;
  }

  //--------------------------------------------------
  /**
   * Which browser?
   * @returns {string}
   */
  get getBrowserSignature() {
    let result = ''; // By default.

    if (typeof this.runtime.cache.browserSignature === 'string') {
      result = this.runtime.cache.browserSignature;
    } else {
      if (typeof this.userAgent !== 'undefined') {
        if (this.userAgent.toLowerCase().match(/applewebkit\//)) {
          result = 'Webkit';
        }
        if (this.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) {
          result = 'Firefox';
        }
      }
      this.runtime.cache.browserSignature = result;
    }

    return result;
  }

  //--------------------------------------------------
  /**
   * Returns a Boolean value: whether the browser console supports coloring.
   * @returns {boolean}
   */
  isColoringAvailable() { // TODO: refactoring.
    let result = false; // By default.

    if (this.serviceApp.allowColorization === true) {
      if (typeof this.runtime.cache.colorizationStatus === 'boolean') {
        result = this.runtime.cache.colorizationStatus;
      } else {
        switch (this.getBrowserSignature) {
          case 'Webkit':
            result = true;
            break;
          case 'Firefox':
            result = true;
            break;
          default:
        }
        this.runtime.cache.colorizationStatus = result;
      }
    }

    return result;
  }

  //--------------------------------------------------
  /**
   * Returns the correct array for outputting colored data to the console.
   * @param {Array} value - An array with data pairs in the format: string, color.
   * @returns {Array}
   */
  prepareColoring(value) { // TODO: refactoring.
    const result = [];

    if (Common.getValueType(value) === 'Array' && (value.length / 2) === Math.round(value.length / 2)) {
      if (this.isColoringAvailable()) {
        const textsArr = [];
        const colorsArr = [];
        value.forEach((v, i) => {
          if ((i / 2) === Math.round(i / 2)) {
            textsArr.push(`%c${v}`);
          } else {
            const colorStyle = this.color[v];
            colorsArr.push((colorStyle === undefined) ? 'color: none' : colorStyle);
          }
        });
        if (textsArr.length) {
          result.push(textsArr.join(''));
          result.push(...colorsArr);
        }
      } else {
        const textsArr = [];
        value.forEach((v, i) => {
          if ((i / 2) === Math.round(i / 2)) {
            textsArr.push(v);
          }
        });
        result.push(textsArr.join(''));
      }
    }

    return result;
  }
}

module.exports = new ClientLib();
