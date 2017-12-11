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

  //--------------------------------------------------
  /**
   * Returns a string where data types that require special attention are highlighted.
   * @param {string} value - The source string.
   * @returns {string}
   */
  highlightAttentions(value) {
    let result = Common.validatingString(value);
    const attentionsArr = [
      'Undefined',
      'Null',
      'NaN',
      'Infinity',
      '-Infinity',
    ];

    attentionsArr.forEach((item) => {
      if (result.indexOf(`: ${item}`) !== -1) {
        result = result.split(`: ${item}`).join(`: ${this.color.reset + this.wrapString(item, 'attention') + this.color.master}`);
      }
    });

    return result;
  }

  //--------------------------------------------------
  /**
   * Returns a string where commas are highlighted.
   * @param {string} value - The source string.
   * @returns {string}
   */
  highlightCommas(value) {
    let result = Common.validatingString(value);
    const commaSymbol = `,${Common.config.serviceApp.consoleEOL}`;

    if (result.indexOf(commaSymbol) !== -1) {
      result = result.split(commaSymbol).join(this.color.reset + this.wrapString(commaSymbol, 'slave') + this.color.master);
    }

    return result;
  }

  //--------------------------------------------------
  /**
   * Returns the final version of the debug message.
   * @param {*} value - A value of any type.
   * @param {string} comment - Explanatory comment to the displayed value.
   * @returns {string}
   */
  getDebugMessage(value, comment) {
    let infoString;
    const typeString = `Type: ${Common.getValueType(value)}`;
    const msgComment = Common.validatingString(comment);

    Common.config.runtime.globalIndentSize = 0;

    if (msgComment) {
      infoString = this.wrapString(`${typeString} | `, 'slave') +
        this.wrapString(msgComment, 'master');
    } else {
      infoString = this.wrapString(typeString, 'slave');
    }

    let resultValue = this.wrapString(Common.getResult(value), 'master');
    resultValue = this.highlightAttentions(resultValue);
    resultValue = this.highlightCommas(resultValue);

    return Common.singleLine(infoString) +
      this.wrapString('Value: ', 'slave') +
      resultValue;
  }
}

module.exports = new ServerLib();
