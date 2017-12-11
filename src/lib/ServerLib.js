// Dependencies.
const Common = require('./Common');

/**
 * This module implements helper methods for the server.
 */
class ServerLib {
  constructor() {
    this.color = {
      consoleScheme(value) {
        const colorName = Common.validatingString(value);
        let result = 0;

        if (colorName) {
          const color = Common.config.runtime.colorScheme.server[colorName];

          if (typeof color === 'undefined') {
            Common.console.warn(`${Common.config.serviceApp.consoleEOL}Warning: unknown color name "${colorName}" in the color scheme "server".`);
          } else {
            result = color;
          }
        }

        return result;
      },
      getColor: value => `\x1b[${value}m`,
      get reset() {
        return this.getColor(0);
      },
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
    this.testPointTime = [];
    this.hrtimeFunc = process.hrtime;
    /**
     * Convert "hrtime" value to milliseconds.
     * @param {Array} hrTimeValue - "hrtime" value.
     */
    this.getMilliseconds = hrTimeValue => ((hrTimeValue[0] * 1e9) + hrTimeValue[1]) / 1e6;
  }

  //--------------------------------------------------
  /**
   * Get high-resolution real time value.
   * @returns {*}
   */
  get hrtime() {
    let result = null;

    if (typeof this.hrtimeFunc === 'function') {
      result = this.hrtimeFunc;
    }

    return result;
  }

  //--------------------------------------------------
  /**
   * Returns a string wrapped in the specified color.
   * @param {string} value - The string to be wrapped.
   * @param {string} color - One of the colors defined in the class constructor.
   * @returns {string}
   */
  wrapString(value, color) {
    const stringForWrapping = Common.validatingString(value);
    const wrapColor = Common.validatingString(color);
    let result = '';

    if (stringForWrapping) {
      const resultColor = this.color[wrapColor];
      if (typeof resultColor === 'undefined') {
        result = stringForWrapping;
      } else {
        result = resultColor + stringForWrapping + this.color.reset;
      }
    }

    return result;
  }

  //--------------------------------------------------
  /**
   * This method is required in order to perform coloring only after loading the color scheme.
   * This method returns nothing.
   */
  executeColoring() {
    this.appName = this.wrapString(`[${this.wrapString(Common.config.serviceApp.appName, 'heading')}] `, 'slave');
    this.appDescription = this.wrapString(Common.config.serviceApp.appDescription, 'heading');
    this.appVersion = this.wrapString(`Version: ${Common.config.serviceApp.appVersion}`, 'slave');
    this.appStopped = this.wrapString(Common.getErrorMessage('runningStopped'), 'master');
  }
}

module.exports = new ServerLib();
