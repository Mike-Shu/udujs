// Dependencies.
const sinon = require('sinon');
const serverStatusList = require('./serverSideManagement.json');
const clientStatusList = require('./clientSideManagement.json');

// Preparatory activities:
const statusListPack = {
  server: serverStatusList,
  client: clientStatusList,
};
const skippedTestUnits = [];
const tempValue = null;
let managementFor = null;
let globalTestList = [];
let consoleStub = null;

/**
 * Checks whether the specified set of tests should be performed.
 * Managing the sets is described in the "serverSideManagement.json" file in the "misc" directory.
 * @param {string} value - Conditional name of the test set.
 * @param {function} callback - Wrapper function for the test code.
 * @returns {boolean}
 */
exports.run = (value, callback) => {
  if (globalTestList.length) {
    if (managementFor) {
      const statusList = statusListPack[managementFor];
      const listKeys = Object.keys(statusList);
      if (listKeys.length) {
        if (listKeys[0] === 'useManagement' && statusList.useManagement === true) {
          if (listKeys.join(',').indexOf(value) !== -1 && statusList[value] === 1) {
            callback();
          }
        }
      }
    } else {
      console.error(`RuntimeError: for the "${value}" test set, the method "Utility.managementFor()" is not specified, or it has an invalid value.`);
    }
  }
};

//--------------------------------------------------
/**
 * Displays a list of test sets that were skipped.
 * This method returns nothing.
 */
exports.showSkippedTests = () => {
  const skippedTestsArr = [];

  if (managementFor) {
    const statusList = statusListPack[managementFor];
    const listKeys = Object.keys(statusList);
    if (listKeys.length) {
      if (listKeys[0] === 'useManagement' && statusList.useManagement === true) {
        listKeys.forEach((property) => {
          if (statusList[property] === 0) {
            skippedTestsArr.push(property);
          }
        });
      }
    }
  }

  if (managementFor === 'server') {
    if (skippedTestUnits.length) {
      console.log(`  %sSkipped test units: ${skippedTestUnits.length}%s`, '\x1b[91m', '\x1b[0m');
    }
    if (skippedTestsArr.length) {
      console.log(`  %sSkipped test sets: ${skippedTestsArr.length}%s`, '\x1b[91m', '\x1b[0m');
    }
  } else if (managementFor === 'client') {
    if (skippedTestUnits.length) {
      console.log(`\x1b[91mSkipped test units: ${skippedTestUnits.length}\x1b[0m`);
    }
    if (skippedTestsArr.length) {
      console.log(`\x1b[91mSkipped test sets: ${skippedTestsArr.length}\x1b[0m`);
    }
  }
};

//--------------------------------------------------
/**
 * A tool for managing separate parts of a test set.
 * On the input accepts an array with conditional test names.
 * Returns a method that checks whether the specified test should be executed.
 * @param {Array} value - An array with conditional test names that must be executed.
 * @returns {Object}
 */
exports.testManagement = (value) => {
  const management = {
    testList: [],
    run: (testName, callback) => {
      if (management.testList.join(',').indexOf(testName) === -1) {
        skippedTestUnits.push(testName);
      } else {
        callback();
      }
    },
  };

  if (typeof value.length !== 'undefined' && value.length > 0) {
    management.testList.push(...value);
  }
  globalTestList = management.testList;

  return management;
};

//--------------------------------------------------
/**
 *
 * @param value
 */
exports.managementFor = (value) => {
  const allowValues = [
    'server',
    'client',
  ];

  if (allowValues.join(',').indexOf(value) !== -1) {
    managementFor = value;
  }
};

//--------------------------------------------------
/**
 * Returns the colored class name.
 * @param {string} value
 */
exports.name = value => `\x1b[35m${value}\x1b[0m`;

/**
 * Returns the colored method name.
 * @param value
 */
exports.method = value => `\x1b[33m${value}\x1b[0m`;

//--------------------------------------------------
/**
 * Returns a stub object. Used to override the "Console" object for test purposes.
 */
const consoleStubsPack = {
  log: value => value,
  info: value => value,
  warn: value => value,
  error: value => value,
};
module.exports.consoleStub = consoleStubsPack;

module.exports.stubsPack = () => {
  if (!consoleStub) {
    consoleStub = {
      log: sinon.stub(consoleStubsPack, 'log'),
      info: sinon.stub(consoleStubsPack, 'info'),
      warn: sinon.stub(consoleStubsPack, 'warn'),
      error: sinon.stub(consoleStubsPack, 'error'),
      reset: () => {
        consoleStub.log.reset();
        consoleStub.info.reset();
        consoleStub.warn.reset();
        consoleStub.error.reset();
      },
    };
  }

  return consoleStub;
};

//--------------------------------------------------
/**
 * Returns a primitive objects for testing purposes.
 */
module.exports.testFunction = function func() {
  const a = 1;
  const b = 2;
  return (a * b) + (a / b);
};

module.exports.compoundObject = {
  foo: { bar: 'baz' },
  bar: ['baz'],
};

module.exports.compoundArray = [
  { bar: 'baz' },
  ['baz'],
];

//--------------------------------------------------
/**
 * Returns the colored code sample.
 * @param value
 */
module.exports.showSampleCode = value => `\x1b[94m${value}\x1b[0m`;

//--------------------------------------------------
/**
 * The property for temporary storage of values, for later recovery.
 */
module.exports.storage = tempValue;
