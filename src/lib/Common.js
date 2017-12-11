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
}

module.exports = new Common();
