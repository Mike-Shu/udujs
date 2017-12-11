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

  //--------------------------------------------------
  /**
   * A universal method for displaying debugging information.
   * Outputs either to the console or to a pop-up message.
   * The output direction is controlled through the configuration.
   * By default, the information is displayed in a pop-up message.
   * This method returns nothing.
   * @param {*} value - A value of any type.
   * @param {string} [comment] - Additional explanatory comment to the displayed value.
   */
  show(value, comment = '') {
    if (this.executionAllowed) {
      switch (Common.config.serviceApp.showOutputDefault) {
        case 'console':
          this.log(value, comment);
          break;

        case 'window':
          this.popup(value, comment);
          break;

        case 'file': // TODO: The feature can be implemented in future versions.
          break;

        default:
          Common.console.warn(Common.getErrorMessage('show1'));
      }
    }
  }

  //--------------------------------------------------
  /**
   * Displays debug information in a fixed field in a pop-up message.
   * This method returns nothing.
   * @param {string|number|boolean} value - Any value of a valid type: string, number or boolean.
   */
  observer(value) {
    if (this.executionAllowed) {
      const valueType = Common.getValueType(value);
      const allowedTypes = [
        'String',
        'Number',
        'Boolean',
      ];

      if (allowedTypes.join(',').indexOf(valueType) !== -1) {
        ClientLib.createMsgBox();
        ClientLib.getObserver().innerText = value.toString();
      }
    }
  }

  //--------------------------------------------------
  /**
   * Run-time testing (RTT).
   * Sets the control point in the code.
   * Calculates the code execution time between two control points (in milliseconds).
   * Displays the calculated value in the console.
   * @param {string} [name] - An optional explanatory name for the control point.
   * @returns {number} - Returns the computed value.
   */
  rttPoint(name = '') {
    let performanceResult = 0;

    if (this.executionAllowed && this.performanceAllowed) {
      const performance = ClientLib.performanceNow;

      try {
        Common.checkValueType(name, 'String', 'rttPoint1');
        const pointTime = ClientLib.testPointTime;
        Common.checkValueType(pointTime, 'Number', 'rttPoint3');
        ClientLib.testPointTime = performance;
        const result = [];

        if (pointTime === 0) {
          result.push(...['Point RTT | 0 ms | ', 'slave']);
          if (name) {
            result.push(...[name, 'master']);
          } else {
            result.push(...['Starting point.', 'master']);
          }
        } else {
          performanceResult = performance - pointTime;
          result.push(...[`Point RTT | +${Common.correctDecimals(performanceResult)} ms`, 'slave']);
          if (name) {
            result.push(...[
              ' | ', 'slave',
              name, 'master',
            ]);
          }
        }
        Common.console.info(...ClientLib.prepareColoring([
          ...ClientLib.appName,
          ...result,
        ]));
      } catch (e) {
        Common.errorHandler(e);
      }
    }

    return performanceResult;
  }

  //--------------------------------------------------
  /**
   * Run-time testing (RTT).
   * The starting point for computing the execution time of some code.
   * This method returns nothing.
   * @param {string} [name] - An optional explanatory name for Runtime testing.
   * @param {int} [levelIndex] - An optional index for the level of nesting (for nested tests).
   */
  rttStart(name = '', levelIndex = 0) {
    if (this.executionAllowed && this.performanceAllowed) {
      try {
        Common.checkValueType(name, 'String', 'rttStart1');
        Common.checkValueType(levelIndex, 'Number', 'rttStart2');
        const level = Common.setRTTLevel(levelIndex);
        Common.checkValueType(level, 'Object', 'rttStart3');

        level.name = name;
        level.time = ClientLib.performanceNow;
      } catch (e) {
        Common.errorHandler(e);
      }
    }
  }

  //--------------------------------------------------
  /**
   * Run-time testing (RTT).
   * The end point for the "rttStart()" method.
   * Calculates the code execution time between the start and current points (in milliseconds).
   * Displays the calculated value in the console.
   * @param {int} [levelIndex] - An optional index for the level of nesting (for nested tests).
   * @returns {number} - Returns the computed value.
   */
  rttFinish(levelIndex = 0) {
    let performanceResult = 0;

    if (this.executionAllowed && this.performanceAllowed) {
      const performance = ClientLib.performanceNow;

      try {
        Common.checkValueType(levelIndex, 'Number', 'rttFinish1');
        const level = Common.getRTTLevel(levelIndex);
        Common.checkValueType(level, 'Object', 'rttFinish2');

        performanceResult = performance - level.time;
        if (level.name) {
          Common.console.info(...ClientLib.prepareColoring([
            ...ClientLib.appName,
            ...[
              `Single RTT | ${Common.correctDecimals(performanceResult)} ms | `, 'slave',
              level.name, 'master',
            ],
          ]));
        }
      } catch (e) {
        Common.errorHandler(e);
      }
    }

    return performanceResult;
  }
}

module.exports = UduJS;
