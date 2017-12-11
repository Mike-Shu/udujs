// Dependencies.
const mocha = require('mocha');
const should = require('chai').should();

// Module for testing and helper set.
const config = require('../../src/config');
const Utility = require('../misc/utility');

// Tools.
const Describe = mocha.describe;
const It = mocha.it;

// Test management: useful for debugging to enable or disable test sets.
Utility.managementFor('server');
const testManagement = Utility.testManagement([
  'fileExists',
  'sections',
]);

Utility.run('config', () => {
  Describe(Utility.name('Config file'), () => {
    const configurationTemplate = {
      popupMsg: [
        'fontSize',
        'showClearTitle',
        'horizontalPosition',
        'verticalPosition',
        'maxWidth',
        'maxHeight',
        'messageDirection',
        'bottomIndent',
      ],
      serviceApp: [
        'showOutputDefault',
        'consoleEOL',
        'consoleSpace',
        'appName',
        'appDescription',
        'appVersion',
        'consoleColorScheme',
        'popupColorScheme',
        'serverColorScheme',
        'allowColorization',
      ],
      performance: [
        'decimalPlaces',
      ],
      runtime: [
        'run',
        'globalIndentSize',
        'msgContainer',
        'observer',
        'colorScheme',
        'cache',
      ],
    };

    testManagement.run('fileExists', () => {
      It('The file exists and contains the object.', () => {
        config.should.is.an('Object');
      });
    });
    testManagement.run('sections', () => {
      Describe(Utility.method('Checking sections:'), () => {
        Object.keys(configurationTemplate).forEach((section) => {
          It(`section "${section}"`, () => {
            should.not.equal(config[section], undefined, 'Section does not exist');
            config[section].should.is.an('Object');
            Object.keys(config[section]).length.should.equal(configurationTemplate[section].length, 'Number of properties in the section');
          });
          Describe(`Properties in "${section}":`, () => {
            configurationTemplate[section].forEach((property) => {
              It(property, () => {
                config[section].should.property(property);
              });
            });
          });
        });
      });
    });
  });
});
