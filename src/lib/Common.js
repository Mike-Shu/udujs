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
}

module.exports = new Common();
