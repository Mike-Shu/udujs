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

    if (this.executionAllowed) {
      const processTimeNow = ServerLib.getProcessTime();

      try {
        Common.checkValueType(name, 'String', 'rttPoint1');
        const pointTime = ServerLib.testPointTime;
        Common.checkValueType(pointTime, 'Array', 'rttPoint2');
        ServerLib.testPointTime = processTimeNow;
        let result;

        if (pointTime.length === 0) {
          result = this.appConfig.consoleEOL +
            ServerLib.appName +
            ServerLib.wrapString('Point RTT | 0 ms | ', 'slave');
          if (name) {
            result += ServerLib.wrapString(name, 'master');
          } else {
            result += ServerLib.wrapString('Starting point.', 'master');
          }
        } else {
          performanceResult = ServerLib.getMilliseconds(ServerLib.getProcessTime(pointTime));
          result = ServerLib.appName +
            ServerLib.wrapString('Point RTT | ', 'slave') +
            ServerLib.wrapString(`+${Common.correctDecimals(performanceResult)} ms`, 'master');
          if (name) {
            result += ServerLib.wrapString(' | ', 'slave') +
              ServerLib.wrapString(name, 'master');
          }
        }
        Common.console.info(result);
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
   * @param {string} [name] - An optional explanatory name for Run-time testing.
   * @param {int} [levelIndex] - An optional index for the level of nesting (for nested tests).
   */
  rttStart(name = '', levelIndex = 0) {
    if (this.executionAllowed) {
      try {
        Common.checkValueType(name, 'String', 'rttStart1');
        Common.checkValueType(levelIndex, 'Number', 'rttStart2');
        const level = Common.setRTTLevel(levelIndex);
        Common.checkValueType(level, 'Object', 'rttStart3');

        level.name = name;
        level.time = ServerLib.getMilliseconds(process.hrtime());
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

    if (this.executionAllowed) {
      const processTimeNow = process.hrtime();

      try {
        Common.checkValueType(levelIndex, 'Number', 'rttFinish1');
        const level = Common.getRTTLevel(levelIndex);
        Common.checkValueType(level, 'Object', 'rttFinish2');

        performanceResult = ServerLib.getMilliseconds(processTimeNow) - level.time;
        if (level.name) {
          Common.console.info(this.appConfig.consoleEOL +
            ServerLib.appName +
            ServerLib.wrapString('Single RTT | ', 'slave') +
            ServerLib.wrapString(`${Common.correctDecimals(performanceResult)} ms`, 'master') +
            ServerLib.wrapString(' | ', 'slave') +
            ServerLib.wrapString(level.name, 'master'));
        }
      } catch (e) {
        Common.errorHandler(e);
      }
    }

    return performanceResult;
  }

  //--------------------------------------------------
  /**
   * Run-time testing (RTT).
   * Calculates the average execution time of some code (in milliseconds).
   * Displays the calculated value in the console.
   * @param {function} codeContainer - Container for the code under test.
   * @param {int} cycles - Number of cycles to repeat the test (maximum 1000 cycles).
   * @param {string} [name] - An optional explanatory name for Run-time testing.
   * @param {boolean} [timeEachIteration] - Display the execution time of each iteration?
   * Optional argument, disabled by default.
   * @returns {number} - Returns the computed value.
   */
  rttAverage(codeContainer, cycles, name = '', timeEachIteration = false) {
    let performanceResult = 0;

    if (this.executionAllowed) {
      try {
        Common.checkValueType(codeContainer, 'Function', 'rttAverage1');
        Common.checkValueType(cycles, 'Number', 'rttAverage2');
        Common.checkValueType(name, 'String', 'rttAverage3');
        Common.checkValueType(timeEachIteration, 'Boolean', 'rttAverage4');

        let countCycles = (cycles > 1000) ? 1000 : cycles; // Max 1000 cycles.
        const cycleSkipped = Math.round(countCycles * 0.1); // 10%.
        let cyclePosition = 0;
        let oneIterationTime;
        let totalTestTime = 0;
        const timeEachIterationArr = [];

        countCycles += cycleSkipped;

        while (cyclePosition < countCycles) {
          cyclePosition += 1;
          this.rttStart();
          codeContainer();
          oneIterationTime = this.rttFinish();
          if (cyclePosition > cycleSkipped) {
            totalTestTime += oneIterationTime;
            timeEachIterationArr.push(oneIterationTime);
          }
        }

        performanceResult = totalTestTime / (countCycles - cycleSkipped); // Average time.
        let result = this.appConfig.consoleEOL;
        result += ServerLib.appName +
          ServerLib.wrapString('Average RTT | ', 'slave') +
          ServerLib.wrapString(`${Common.correctDecimals(performanceResult)} ms`, 'master');
        if (name) {
          result += ServerLib.wrapString(' | ', 'slave') + ServerLib.wrapString(name, 'master');
        }

        if (timeEachIteration === true) {
          timeEachIterationArr.forEach((item, index) => {
            result += this.appConfig.consoleEOL +
              ServerLib.wrapString(`  iteration ${index + 1}: ${Common.correctDecimals(item)} ms`, 'slave');
          });
        }

        Common.console.info(result);
      } catch (e) {
        Common.errorHandler(e);
      }
    }

    return performanceResult;
  }
}

module.exports = UduJS;
