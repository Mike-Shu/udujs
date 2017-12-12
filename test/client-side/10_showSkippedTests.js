// Dependencies.
const mocha = require('mocha');

// Helper set.
const Utility = require('.././misc/utility');

Utility.managementFor('client');

mocha.after(() => {
  Utility.showSkippedTests();
});
