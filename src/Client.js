// Dependencies.
const Common = require('./lib/Common');
const ClientLib = require('./lib/ClientLib');

let uduInstance = null; // Singleton.

/**
 * This module implements public methods for debugging code only on the client side.
 */
class UduJS {
  constructor(customSettingsObj) {
    if (Common.getValueType(ClientLib.windowObj) === 'Window') { // Is the code running in the browser?
      if (!uduInstance) {
        uduInstance = this;
        this.instanceReset = () => {
          uduInstance = null;
        };
        Common.setCustomSettings(customSettingsObj);
        Common.loadColorScheme();
        this.appConfig = Common.config.serviceApp;
        this.executionAllowed = Common.config.runtime.run;
        Common.console.info(...ClientLib.prepareColoring([
          this.appConfig.appDescription, 'heading',
          `${this.appConfig.consoleEOL}Version: ${this.appConfig.appVersion}`, 'slave',
        ]));
        if (!this.executionAllowed) {
          Common.console.info(...ClientLib.prepareColoring([
            Common.getErrorMessage('runningStopped'), 'master',
          ]));
        }

        if (Common.getValueType(ClientLib.performanceNow) === 'Number') { // Does the browser support the "Window.performance" object?
          this.performanceAllowed = true;
        } else {
          this.performanceAllowed = false;
          Common.console.error(`${Common.config.serviceApp.appName}: ${Common.getErrorMessage('constructorClient2')}`);
        }
      }
    } else {
      this.executionAllowed = false;
      this.performanceAllowed = false;
      Common.console.error(`${Common.config.serviceApp.appName}: ${Common.getErrorMessage('constructorClient1')}`);
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
    ClientLib.testPointTime = 0;
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
   * Outputs debugging information in the browser console.
   * This method returns nothing.
   * @param {*} value - A value of any type.
   * @param {string} [comment] - Additional explanatory comment to the displayed value.
   */
  log(value, comment = '') {
    if (this.executionAllowed) {
      Common.console.info(...ClientLib.prepareColoring([
        ...ClientLib.appName,
        ...ClientLib.getDebugMessage(value, comment),
      ]));
    }
  }

  //--------------------------------------------------
  /**
   * Displays debugging information in the list in a pop-up message in the browser window.
   * This method returns nothing.
   * @param {*} value - A value of any type.
   * @param {string} [comment] - Additional explanatory comment to the displayed value.
   */
  popup(value, comment = '') {
    if (this.executionAllowed) {
      ClientLib.createMsgBox();
      ClientLib.addMessage(ClientLib.getDebugMessage(value, comment));
    }
  }

  //--------------------------------------------------
  /**
   * Removes debugging information from a pop-up message.
   * This method returns nothing.
   */
  popupReset() {
    if (this.executionAllowed) {
      ClientLib.popupContainerClear();
    }
  }
}

module.exports = UduJS;
