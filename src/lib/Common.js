// Dependencies.
const config = require('../config');
const colorSchemes = require('./colorSchemes');
const errors = require('./errors');

/**
 * This module implements common helper methods: for both the server and the client-side.
 */
class Common {
  constructor() {
    this.config = config;
    this.errors = errors;
    this.testLevelsPack = [];
    this.consoleEOL = this.config.serviceApp.consoleEOL;
    /**
     * Encapsulation of the "console" object.
     */
    this.console = console;
  }

  //--------------------------------------------------
  /**
   * Returns the more accurate type of value.
   * @param {*} value - A value of any type.
   * @returns {string}
   */
  getValueType(value) {
    const valueTypePattern = Object.prototype.toString.call(value);
    const valueType = valueTypePattern.substring(8, valueTypePattern.length - 1);
    let result = valueType;

    if (valueType === 'Number') {
      if (Number.isNaN(value)) {
        result = 'NaN';
      }
      if (value === Infinity || value === +Infinity) {
        result = 'Infinity';
      }
      if (value === -Infinity) {
        result = '-Infinity';
      }
    }

    return result;
  }

  //--------------------------------------------------
  /**
   * A method for setting custom values in the application configuration.
   * This method returns nothing.
   * @param {object} customSettingsObj - An object with custom settings.
   */
  setCustomSettings(customSettingsObj) {
    if (this.getValueType(customSettingsObj) === 'Object') {
      const publicSettings = { // Format: setting name: section in default config.
        fontSize: ['popupMsg', 'String'],
        showClearTitle: ['popupMsg', 'Boolean'],
        horizontalPosition: ['popupMsg', 'String'],
        verticalPosition: ['popupMsg', 'String'],
        maxWidth: ['popupMsg', 'Number|String'],
        maxHeight: ['popupMsg', 'Number'],
        showOutputDefault: ['serviceApp', 'String'],
        consoleEOL: ['serviceApp', 'String'],
        consoleColorScheme: ['serviceApp', 'String'],
        popupColorScheme: ['serviceApp', 'String'],
        serverColorScheme: ['serviceApp', 'String'],
        allowColorization: ['serviceApp', 'Boolean'],
        decimalPlaces: ['performance', 'Number'],
        run: ['runtime', 'Boolean'],
      };
      const warnMessageArr = [];

      Object.keys(customSettingsObj).forEach((property) => {
        if (Object.prototype.hasOwnProperty.call(publicSettings, property)) {
          const configSectionName = publicSettings[property][0];
          const configPropertyType = publicSettings[property][1];
          const configSection = this.config[configSectionName];

          if (configSection === Object(configSection)) {
            const propertyType = this.getValueType(customSettingsObj[property]);
            if (configPropertyType.indexOf(propertyType) === -1) {
              warnMessageArr.push(`Custom configuration: the value of the "${property}" property must be a ${configPropertyType}. The custom value is ignored.`);
            } else {
              configSection[property] = customSettingsObj[property];
            }
          } else {
            warnMessageArr.push(`Custom configuration: the "${configSectionName}" section does not exist.`);
          }
        } else {
          warnMessageArr.push(`Custom configuration: the "${property}" property is not allowed to modify, or it does not exist.`);
        }
      });

      if (warnMessageArr.length) {
        this.console.warn(warnMessageArr.join(this.config.serviceApp.consoleEOL));
      }
    }
  }

  //--------------------------------------------------
  /**
   * Loads a color scheme based on preferences.
   * This method returns nothing.
   */
  loadColorScheme() {
    const appConfig = this.config.serviceApp;
    const schemeSections = [
      'console',
      'popup',
      'server',
    ];
    let result = true;

    try {
      schemeSections.forEach((section) => {
        const selectedSchemeName = appConfig[`${section}ColorScheme`];
        const colorScheme = colorSchemes[section][selectedSchemeName];
        if (this.getValueType(colorScheme) === 'Object') {
          this.config.runtime.colorScheme[section] = colorScheme;
        } else {
          throw new Error(`unknown name for the color scheme "${selectedSchemeName}". Check the App configuration.`);
        }
      });
    } catch (e) {
      this.console.warn(`${e.name}: ${e.message}`);
      result = false;
    }

    return result;
  }

  //--------------------------------------------------
  /**
   * Returns the error text in accordance with the specified code.
   * @param {string} value - Error code.
   * @returns {string}
   */
  getErrorMessage(value) {
    const errorName = this.validatingString(value);
    let result;

    if (errorName === '' || Object.keys(this.errors).join(',').indexOf(errorName) === -1) {
      result = errorName.length ? `${errorName}.` : 'unknown error name.';
    } else {
      result = this.errors[errorName];
    }

    return result;
  }

  //--------------------------------------------------
  /**
   * The error handler for the "catch" block.
   * Displays the type and description of the error in the console.
   * This method returns nothing.
   * @param {Error|Object} value - An object with error information.
   */
  errorHandler(value) {
    let result;
    const valueType = this.getValueType(value);

    if (valueType === 'Error' || valueType === 'Object') {
      let errorName = this.validatingString(value.name);
      if (!errorName) {
        errorName = 'Error';
      }
      result = `${errorName}: ${this.lowerCaseFirst(this.getErrorMessage(value.message))}`;
    } else {
      result = `TypeError: ${this.getErrorMessage('errorHandler1')}`;
    }
    this.console.error(result);
  }

  //--------------------------------------------------
  /**
   * Returns a string value with a newline character at the end of the result.
   * @param {*} value - String for processing.
   * @returns {string}
   */
  singleLine(value) {
    const lineValue = this.validatingString(value);
    let result = ''; // By default.

    if (lineValue) {
      result = lineValue + this.consoleEOL;
    }

    return result;
  }

  //--------------------------------------------------
  /**
   * Drops a type error if the type of the value to be checked does not match the required type.
   * This method returns nothing.
   * @param {*} value - The value to check.
   * @param {string} requiredType - Required type for verification.
   * @param {string} errorName - The special name of the error specified in the "errors" object.
   */
  checkValueType(value, requiredType, errorName) {
    if (this.getValueType(requiredType) !== 'String') {
      throw new TypeError('checkType1');
    }
    if (this.getValueType(errorName) !== 'String') {
      throw new TypeError('checkType2');
    }
    if (this.getValueType(value) !== requiredType) {
      throw new TypeError(errorName);
    }
  }

  //--------------------------------------------------
  /**
   * Returns a valid Boolean value.
   * @param {*} value - A value of any type.
   * @returns {boolean}
   */
  validatingBoolean(value) {
    return this.getValueType(value) === 'Boolean' ? value : false;
  }

  //--------------------------------------------------
  /**
   * Returns a valid integer value.
   * @param {*} value - A value of any type.
   * @returns {int}
   */
  validatingInteger(value) {
    return this.getValueType(value) === 'Number' ? parseInt(value, 10) : 0;
  }

  //--------------------------------------------------
  /**
   * Returns a valid string value.
   * @param {*} value - A value of any type.
   * @returns {string}
   */
  validatingString(value) {
    return this.getValueType(value) === 'String' ? value : '';
  }

  //--------------------------------------------------
  /**
   * Returns the indent of the specified length.
   * Required to visualize the nesting hierarchy of objects.
   * @param {int} value - block of spaces count.
   * @returns {string}
   */
  setLeftIndent(value) {
    const indentSize = this.validatingInteger(value);
    return indentSize > 0 ? this.config.serviceApp.consoleSpace.repeat(indentSize) : '';
  }
}

module.exports = new Common();
