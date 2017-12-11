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
}

module.exports = new ClientLib();
