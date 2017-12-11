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

  //--------------------------------------------------
  /**
   * Returns the current indent value in the output stream.
   * Required to visualize the nesting hierarchy of objects.
   * @param {int} value - Required indent value.
   * @returns {int}
   */
  checkIndentSize(value) {
    const globalValue = this.validatingInteger(this.config.runtime.globalIndentSize);
    let indentSize = this.validatingInteger(value);

    if (globalValue > 0) {
      indentSize = globalValue + 1;
    } else {
      indentSize = indentSize > 0 ? indentSize : 0;
    }

    return indentSize;
  }

  //--------------------------------------------------
  /**
   * Returns the adapted value for output to the console or to a pop-up message.
   * @param {*} value - A value of any type.
   * @returns {*}
   */
  getResult(value) {
    const valueType = this.getValueType(value);
    let result;

    switch (valueType) {
      case 'String':
        result = `"${value}"`;
        break;
      case 'Number':
        result = value.toString();
        break;
      case 'Boolean':
        result = value.toString();
        break;
      case 'Array':
        result = this.showArray(value);
        break;
      case 'Object':
        result = this.showObject(value);
        break;
      case 'Function': // TODO: Fix the indention for the function body.
        result = value.toString();
        break;
      case 'Undefined':
        result = valueType;
        break;
      case 'Null':
        result = valueType;
        break;
      case 'NaN':
        result = valueType;
        break;
      case 'Infinity':
        result = valueType;
        break;
      case '-Infinity':
        result = valueType;
        break;
      default:
        result = this.getErrorMessage('getResult1');
    }

    return result;
  }

  //--------------------------------------------------
  /**
   * Returns the string representation of the array.
   * Required to visualize the nesting hierarchy of objects.
   * @param {Array} value - Array for processing.
   * @param {int} [indent] - The current value of indentation in the output stream. Zero by default.
   * @param {boolean} [initialIndentation] - Make the initial indentation? Disabled by default.
   * @returns {string}
   */
  showArray(value, indent = 0, initialIndentation = false) {
    let result;

    if (this.getValueType(value) === 'Array') {
      const indentSize = this.checkIndentSize(indent);
      const nextIteration = indentSize + 1;
      const resultItemsArr = [];

      if (this.validatingBoolean(initialIndentation)) {
        result = this.singleLine(`${this.setLeftIndent(indentSize)}[`);
      } else {
        result = this.singleLine('[');
      }

      value.forEach((item, index) => {
        const itemType = this.getValueType(item);
        let itemValue;

        if (itemType === 'Array') {
          itemValue = this.showArray(item, nextIteration);
        } else if (itemType === 'Object') {
          itemValue = this.showObject(item, nextIteration);
        } else {
          itemValue = this.getResult(item);
        }

        resultItemsArr.push(`${this.setLeftIndent(nextIteration)}[${index}] = ${itemValue}`);
      });

      if (resultItemsArr.length) {
        result += this.singleLine(resultItemsArr.join(`,${this.consoleEOL}`));
      }

      result += `${this.setLeftIndent(indentSize)}]`;
    } else {
      result = this.singleLine(this.getErrorMessage('showArray1'));
    }

    return result;
  }

  //--------------------------------------------------
  /**
   * Returns the string representation of the object.
   * Required to visualize the nesting hierarchy of objects.
   * @param {object} value - Object for processing.
   * @param {int} [indent] - The current value of indentation in the output stream. Zero by default.
   * @param {boolean} [initialIndentation] - Make the initial indentation? Disabled by default.
   * @returns {string}
   */
  showObject(value, indent = 0, initialIndentation = false) {
    let result;

    if (this.getValueType(value) === 'Object') {
      const object = Object.assign({}, value); // Get an object with all enumerable properties.
      const indentSize = this.checkIndentSize(indent);
      const nextIteration = indentSize + 1;
      const resultItemsArr = [];

      if (this.validatingBoolean(initialIndentation)) {
        result = this.singleLine(`${this.setLeftIndent(indentSize)}{`);
      } else {
        result = this.singleLine('{');
      }

      Object.keys(object).forEach((property) => {
        const item = object[property];
        const itemType = this.getValueType(item);
        let itemValue;

        if (itemType === 'Array') {
          itemValue = this.showArray(item, nextIteration, false);
        } else if (itemType === 'Object') {
          itemValue = this.showObject(item, nextIteration, false);
        } else {
          itemValue = this.getResult(item);
        }

        resultItemsArr.push(`${this.setLeftIndent(nextIteration) + property}: ${itemValue}`);
      });

      if (resultItemsArr.length) {
        result += this.singleLine(resultItemsArr.join(`,${this.consoleEOL}`));
      }

      result += `${this.setLeftIndent(indentSize)}}`;
    } else {
      result = this.singleLine(this.getErrorMessage('showObject1'));
    }

    return result;
  }
}

module.exports = new Common();
