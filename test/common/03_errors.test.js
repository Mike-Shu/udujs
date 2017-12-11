// Dependencies.
const mocha = require('mocha');

// Module for testing and helper set.
const errors = require('../../src/lib/errors');
const Utility = require('../misc/utility');

// Tools.
const Describe = mocha.describe;
const It = mocha.it;

// Test management: useful for debugging to enable or disable test sets.
Utility.managementFor('server');
const testManagement = Utility.testManagement([
  'fileExists',
  'objectContains',
]);

Utility.run('errors', () => {
  Describe(Utility.name('Set of error messages'), () => {
    testManagement.run('fileExists', () => {
      It('The file exists and contains the object.', () => {
        errors.should.is.an('Object');
      });
    });
    testManagement.run('objectContains', () => {
      It('The object contains 27 properties.', () => {
        Object.keys(errors).should.lengthOf(27);
      });
    });
  });
});
