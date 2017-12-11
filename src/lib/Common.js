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
}

module.exports = new Common();
