// Dependencies.
const Common = require('./lib/Common');
const ServerLib = require('./lib/ServerLib');

let uduInstance = null; // Singleton.

/**
 * This module implements public methods for debugging code only on the server side.
 */
class UduJS {
  constructor(customSettingsObj) {
    if (ServerLib.hrtime) { // Does the server support the "Process.hrtime" object?
      if (!uduInstance) {
        uduInstance = this;
        this.instanceReset = () => {
          uduInstance = null;
        };
        Common.setCustomSettings(customSettingsObj);
        Common.loadColorScheme();
        ServerLib.executeColoring();
        this.appConfig = Common.config.serviceApp;
        this.executionAllowed = Common.config.runtime.run;
        Common.console.info(ServerLib.appDescription +
          this.appConfig.consoleEOL +
          ServerLib.appVersion);
        if (!this.executionAllowed) {
          Common.console.info(ServerLib.appStopped);
        }
      }
    } else {
      this.executionAllowed = false;
      Common.console.warn(`${Common.config.serviceApp.appName}: "${Common.getErrorMessage('constructorServer')}"`);
    }

    return uduInstance;
  }

  //--------------------------------------------------
  /**
   * The method stops execution of the utility.
   * This method returns nothing.
   */
  stopExec() {
    this.executionAllowed = false;
    ServerLib.testPointTime = [];
    Common.testLevelsPack = [];
  }

  /**
   * The method resumes execution of the utility.
   * This method returns nothing.
   */
  resumeExec() {
    if (Common.config.runtime.run) {
      this.executionAllowed = true;
    }
  }

  //--------------------------------------------------
  /**
   * Outputs debugging information in the console.
   * This method returns nothing.
   * @param {*} value - A value of any type.
   * @param {string} [comment] - Additional explanatory comment to the displayed value.
   */
  log(value, comment = '') {
    if (this.executionAllowed) {
      Common.console.log(this.appConfig.consoleEOL +
        ServerLib.appName +
        ServerLib.getDebugMessage(value, comment));
    }
  }
}

module.exports = UduJS;
