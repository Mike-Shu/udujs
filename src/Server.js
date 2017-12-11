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
}

module.exports = UduJS;
