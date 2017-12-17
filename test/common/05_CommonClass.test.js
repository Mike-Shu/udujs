// Dependencies.
const mocha = require('mocha');
const should = require('chai').should();

// Class for testing and helper set.
const Common = require('../../src/lib/Common');
const config = require('../../src/config');
const errors = require('../../src/lib/errors');
const Utility = require('../misc/utility');


// Tools.
const Describe = mocha.describe;
const It = mocha.it;
const After = mocha.after;
const Before = mocha.before;
const BeforeEach = mocha.beforeEach;
const AfterEach = mocha.afterEach;
const sampleCode = Utility.showSampleCode;
const EOL = config.serviceApp.consoleEOL;

// Test management: useful for debugging to enable or disable test sets.
Utility.managementFor('server');
const testManagement = Utility.testManagement([
  'Constructor',
  'getValueType',
  'validatingBoolean',
  'validatingInteger',
  'validatingString',
  'lowerCaseFirst',
  'setCustomSettings',
  'loadColorScheme',
  'getErrorMessage',
  'errorHandler',
  'singleLine',
  'checkValueType',
  'setLeftIndent',
  'checkIndentSize',
  'showArray',
  'showObject',
  'getResult',
  'correctDecimals',
  'RTTLevel',
]);

// Preparatory activities:
const stubs = Utility.stubsPack();
let consoleStub;

Utility.run('Common', () => {
  Describe(Utility.name('Class "Common":'), () => {
    //--------------------------------------------------
    testManagement.run('Constructor', () => {
      Describe(Utility.method('Constructor:'), () => {
        It('The "config" property must contain an object with a App configuration.', () => {
          Common.config.should.an('object').equal(config);
        });
        It('The "errors" property must contain an object with a list of errors.', () => {
          Common.errors.should.an('object').equal(errors);
        });
        It('The "testLevelsPack" property must be an empty array.', () => {
          Common.testLevelsPack.should.an('array').with.lengthOf(0);
        });
        It('The "console" property must contain the "console" object.', () => {
          Common.console.should.equal(console);
        });
        It('The "consoleEOL" property must contain the EOL value from the App configuration.', () => {
          Common.consoleEOL.should.a('string').equal(EOL);
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('getValueType', () => {
      Describe(Utility.method('method "getValueType()":'), () => {
        It('Input: string value, returns: "String".', () => {
          Common.getValueType('foo').should.equal('String');
        });
        It('Input: numerical value, returns: "Number".', () => {
          Common.getValueType(123).should.equal('Number');
        });
        It('Input: non-numeric value, returns: "NaN".', () => {
          Common.getValueType(0 / 0).should.equal('NaN');
        });
        It('Input: infinite value, returns: "Infinity".', () => {
          Common.getValueType(1 / +0).should.equal('Infinity');
        });
        It('Input: negative infinite value, returns: "-Infinity".', () => {
          Common.getValueType(1 / -0).should.equal('-Infinity');
        });
        It('Input: boolean value, returns: "Boolean".', () => {
          Common.getValueType(true).should.equal('Boolean');
        });
        It('Input: object value, returns: "Object".', () => {
          Common.getValueType({ foo: 'bar' }).should.equal('Object');
        });
        It('Input: array value, returns: "Array".', () => {
          Common.getValueType(['foo']).should.equal('Array');
        });
        It('Input: function value, returns: "Function".', () => {
          Common.getValueType(Utility.testFunction).should.equal('Function');
        });
        It('Input: null value, returns: "Null".', () => {
          Common.getValueType(null).should.equal('Null');
        });
        It('Input: undefined value, returns: "Undefined".', () => {
          Common.getValueType().should.equal('Undefined');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('validatingBoolean', () => {
      Describe(Utility.method('method "validatingBoolean()":'), () => {
        It('Input: true, returns: true.', () => {
          Common.validatingBoolean(true).should.equal(true);
        });
        It('Input: false, returns: false.', () => {
          Common.validatingBoolean(false).should.equal(false);
        });
        It('Input: any other value, returns: false.', () => {
          Common.validatingBoolean('foo').should.equal(false);
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('validatingInteger', () => {
      Describe(Utility.method('method "validatingInteger()":'), () => {
        It('Input: 1, returns: 1.', () => {
          Common.validatingInteger(1).should.equal(1);
        });
        It('Input: 0, returns: 0.', () => {
          Common.validatingInteger(0).should.equal(0);
        });
        It('Input: -1, returns: -1.', () => {
          Common.validatingInteger(-1).should.equal(-1);
        });
        It('Input: 1.4, returns: 1.', () => {
          Common.validatingInteger(1.4).should.equal(1);
        });
        It('Input: 1.6, returns: 1.', () => {
          Common.validatingInteger(1.6).should.equal(1);
        });
        It('Input: non-numeric value, returns: 0.', () => {
          Common.validatingInteger('foo').should.equal(0);
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('validatingString', () => {
      Describe(Utility.method('method "validatingString()":'), () => {
        It('Input: "foo", returns: "foo".', () => {
          Common.validatingString('foo').should.equal('foo');
        });
        It('Input: non-string value, returns: empty string value.', () => {
          Common.validatingString(true).should.equal('');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('lowerCaseFirst', () => {
      Describe(Utility.method('method "lowerCaseFirst()":'), () => {
        It('Input: "Foo", returns: "foo".', () => {
          Common.lowerCaseFirst('Foo').should.equal('foo');
        });
        It('Input: non-string value, returns: empty string value.', () => {
          Common.lowerCaseFirst(true).should.equal('');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('setCustomSettings', () => {
      Describe(Utility.method('method "setCustomSettings()":'), () => {
        Before(() => {
          Utility.storage = config.popupMsg.maxWidth;
          stubs.reset();
        });
        After(() => {
          config.popupMsg.maxWidth = Utility.storage;
        });
        BeforeEach(() => {
          Common.console = Utility.consoleStub;
          consoleStub = stubs.warn;
        });
        AfterEach(() => {
          consoleStub.reset();
        });
        It(`Input: object with allowed property, result: equal value in the App configuration should change. ${sampleCode('setCustomSettings({ maxWidth: "300" });')}`, () => {
          const currentConfigurationValue = config.popupMsg.maxWidth;
          const newConfigurationValue = (currentConfigurationValue * 2);
          Common.setCustomSettings({ maxWidth: newConfigurationValue }); // To make sure.
          config.popupMsg.maxWidth.should.a('Number').equal(newConfigurationValue);
        });
        It(`Input: empty object, result: the App configuration unchanged. ${sampleCode('setCustomSettings({});')}`, () => {
          const currentConfig = JSON.parse(JSON.stringify(config));
          Common.setCustomSettings({});
          config.should.eql(currentConfig);
        });
        It('Input: not an object, result: the App configuration unchanged.', () => {
          const currentConfig = JSON.parse(JSON.stringify(config));
          Common.setCustomSettings(['foo']);
          config.should.eql(currentConfig);
        });
        It(`Input: object with unknown property, displays: an error message to the console. ${sampleCode('setCustomSettings({ unknownProperty: 123 });')}`, () => {
          Common.setCustomSettings({ unknownProperty: 123 });
          consoleStub.calledOnce.should.equal(true);
          const consoleArgs = consoleStub.args[0][0];
          consoleArgs.should.include('Custom configuration: the "unknownProperty" property is not allowed to modify, or it does not exist.');
        });
        It(`Input: object with not allowed property, displays: an error message to the console. ${sampleCode('setCustomSettings({ globalIndentSize: 123 });')}`, () => {
          Common.setCustomSettings({ globalIndentSize: 123 });
          consoleStub.calledOnce.should.equal(true);
          const consoleArgs = consoleStub.args[0][0];
          consoleArgs.should.include('Custom configuration: the "globalIndentSize" property is not allowed to modify, or it does not exist.');
        });
        It(`Input: object with a wrong property value, displays: an error message to the console. ${sampleCode('setCustomSettings({ maxWidth: true });')}`, () => {
          Common.setCustomSettings({ maxWidth: true });
          consoleStub.calledOnce.should.equal(true);
          const consoleArgs = consoleStub.args[0][0];
          consoleArgs.should.include('Custom configuration: the value of the "maxWidth" property must be a Number|String. The custom value is ignored.');
        });
        It('Input: wrong section name in the "publicSettings" object, displays: an error message to the console.', () => {
          Utility.storage = config.popupMsg;
          delete config.popupMsg;
          Common.setCustomSettings({ maxHeight: 100 });
          config.popupMsg = Utility.storage;
          consoleStub.calledOnce.should.equal(true);
          const consoleArgs = consoleStub.args[0][0];
          consoleArgs.should.include('Custom configuration: the "popupMsg" section does not exist.');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('loadColorScheme', () => {
      Describe(Utility.method('method "loadColorScheme()":'), () => {
        const sections = {
          console: [
            'heading',
            'master',
            'slave',
            'attention',
          ],
          popup: [
            'background',
            'border',
            'appendBG',
            'hoverBG',
            'master',
            'slave',
            'attention',
          ],
          server: [
            'heading',
            'master',
            'slave',
            'attention',
          ],
        };
        Common.loadColorScheme();
        const scheme = config.runtime.colorScheme;
        It('The color scheme must be an object.', () => {
          scheme.should.an('Object');
        });
        Describe('In the color scheme:', () => {
          Object.keys(sections).forEach((section) => {
            It(`there should be a "${section}" section.`, () => {
              scheme.should.have.property(section).which.be.an('Object');
            });
            Describe(`In the "${section}" section:`, () => {
              sections[section].forEach((item) => {
                It(`there should be a "${item}" property of a string type.`, () => {
                  scheme[section].should.have.property(item).which.be.a('String');
                });
              });
            });
          });
        });
        Describe('App configuration errors:', () => {
          Before(() => {
            Common.console = Utility.consoleStub;
            stubs.reset();
          });
          BeforeEach(() => {
            consoleStub = stubs.warn;
          });
          AfterEach(() => {
            consoleStub.reset();
          });
          It('Input: object with an incorrect color scheme name, displays: an an error message to the console.', () => {
            Utility.storage = config.serviceApp.consoleColorScheme;
            Common.setCustomSettings({ consoleColorScheme: 'wrong-scheme-name' });
            Common.loadColorScheme();
            config.serviceApp.consoleColorScheme = Utility.storage;
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include('Error: unknown name for the color scheme "wrong-scheme-name". Check the App configuration.');
          });
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('getErrorMessage', () => {
      Describe(Utility.method('method "getErrorMessage()":'), () => {
        It(`Input: existing error name, returns: error text. ${sampleCode('getErrorMessage("errorNameForTesting");')}`, () => {
          Common.getErrorMessage('errorNameForTesting').should.equal('result for testing.');
        });
        It(`Input: non-existent error name, returns: error name. ${sampleCode('getErrorMessage("nonexistentName");')}`, () => {
          Common.getErrorMessage('nonexistentName').should.equal('nonexistentName.');
        });
        It('Input: empty string value, returns: message "unknown error name".', () => {
          Common.getErrorMessage('').should.equal('unknown error name.');
        });
        It('Input: any non-string value, returns: message "unknown error name".', () => {
          Common.getErrorMessage(123).should.equal('unknown error name.');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('errorHandler', () => {
      Describe(Utility.method('method "errorHandler()":'), () => {
        Before(() => {
          stubs.reset();
        });
        BeforeEach(() => {
          Common.console = Utility.consoleStub;
          consoleStub = stubs.error;
        });
        AfterEach(() => {
          consoleStub.reset();
        });
        It(`Input: real object with error information, displays: an error text to the console. ${sampleCode('errorHandler(e);')}`, () => {
          try {
            throw new Error('errorNameForTesting');
          } catch (e) {
            Common.errorHandler(e);
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include('Error: result for testing.');
          }
        });
        It(`Input: fake object with error information, displays: an error text to the console. ${sampleCode('errorHandler({ name: "FakeError", message: "errorNameForTesting" });')}`, () => {
          Common.errorHandler({ // TODO: Maybe it's deprecated?
            name: 'FakeError',
            message: 'errorNameForTesting',
          });
          consoleStub.calledOnce.should.equal(true);
          const consoleArgs = consoleStub.args[0][0];
          consoleArgs.should.include('FakeError: result for testing.');
        });
        It(`Input: fake object without "name" property, displays: an error text to the console. ${sampleCode('errorHandler({ message: "errorNameForTesting" });')}`, () => {
          Common.errorHandler({ // TODO: Maybe it's deprecated?
            message: 'errorNameForTesting',
          });
          consoleStub.calledOnce.should.equal(true);
          const consoleArgs = consoleStub.args[0][0];
          consoleArgs.should.include('Error: result for testing.');
        });
        It('Input: not an object, displays: an error message to the console.', () => {
          Common.errorHandler(123);
          consoleStub.calledOnce.should.equal(true);
          const consoleArgs = consoleStub.args[0][0];
          consoleArgs.should.include('TypeError');
          consoleArgs.should.include(errors.errorHandler1);
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('singleLine', () => {
      Describe(Utility.method('method "singleLine()":'), () => {
        It('Input: string value, returns: string ending with a newline character.', () => {
          Common.singleLine('foo').should.equal(`foo${EOL}`);
        });
        It('Input: empty string value, returns: empty string value.', () => {
          Common.singleLine('').should.equal('');
        });
        It('Input: any non-string value, returns: empty string value.', () => {
          Common.singleLine(true).should.equal('');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('checkValueType', () => {
      Describe(Utility.method('method "checkValueType()":'), () => {
        Before(() => {
          stubs.reset();
        });
        BeforeEach(() => {
          Common.console = Utility.consoleStub;
          consoleStub = stubs.error;
        });
        AfterEach(() => {
          consoleStub.reset();
        });
        It(`Input: string value and string type, result: nothing. ${sampleCode('checkValueType("foo", "String", "errorNameForTesting");')}`, () => {
          try {
            Common.checkValueType('foo', 'String', 'errorNameForTesting');
          } catch (e) {
            Common.errorHandler(e);
          }
          consoleStub.called.should.equal(false);
        });
        It(`Input: numeric value and string type, result: an exception will be thrown. ${sampleCode('checkValueType(123, "String", "errorNameForTesting");')}`, () => {
          try {
            Common.checkValueType(123, 'String', 'errorNameForTesting');
          } catch (e) {
            Common.errorHandler(e);
          }
          consoleStub.calledOnce.should.equal(true);
          const consoleArgs = consoleStub.args[0][0];
          consoleArgs.should.include('TypeError');
          consoleArgs.should.include(errors.errorNameForTesting);
        });
        It(`Input: non-string value for the "requiredType" argument, result: an exception will be thrown. ${sampleCode('checkValueType("foo", 123, "errorNameForTesting");')}`, () => {
          try {
            Common.checkValueType('foo', 123, 'errorNameForTesting');
          } catch (e) {
            Common.errorHandler(e);
          }
          consoleStub.calledOnce.should.equal(true);
          const consoleArgs = consoleStub.args[0][0];
          consoleArgs.should.include('TypeError');
          consoleArgs.should.include(errors.checkType1);
        });
        It(`Input: non-string value for the "errorName" argument, result: type error in the console. ${sampleCode('checkValueType("foo", "String", 123);')}`, () => {
          try {
            Common.checkValueType('foo', 'String', 123);
          } catch (e) {
            Common.errorHandler(e);
          }
          consoleStub.calledOnce.should.equal(true);
          const consoleArgs = consoleStub.args[0][0];
          consoleArgs.should.include('TypeError');
          consoleArgs.should.include(errors.checkType2);
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('setLeftIndent', () => {
      Describe(Utility.method('method "setLeftIndent()":'), () => {
        It('Input: 3 (set threefold indent), returns: string consisting of three indents.', () => {
          Common.setLeftIndent(3).should.equal(config.serviceApp.tabChar.repeat(3));
        });
        It('Input: -3, returns: empty string value.', () => {
          Common.setLeftIndent(-3).should.equal('');
        });
        It('Input: 0, returns: empty string value.', () => {
          Common.setLeftIndent(-3).should.equal('');
        });
        It('Input: non-numeric value, returns: empty string value.', () => {
          Common.setLeftIndent(true).should.equal('');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('checkIndentSize', () => {
      Describe(Utility.method('method "checkIndentSize()":'), () => {
        It('Input: 0, returns: 0.', () => {
          Common.checkIndentSize(0).should.equal(0);
        });
        It('Input: 1, returns: 1.', () => {
          Common.checkIndentSize(1).should.equal(1);
        });
        It('Input: -1, returns: 0.', () => {
          Common.checkIndentSize(-1).should.equal(0);
        });
        It('Input: 1.4, returns: 1.', () => {
          Common.checkIndentSize(1.4).should.equal(1);
        });
        It('Input: 1.6, returns: 1.', () => {
          Common.checkIndentSize(1.6).should.equal(1);
        });
        It('Input: non-numeric value, returns: 0.', () => {
          Common.checkIndentSize(true).should.equal(0);
        });
        Describe('The parameter "globalIndentSize" is not equal to zero:', () => {
          After('', () => {
            config.runtime.globalIndentSize = 0;
          });
          It('Input: 0 and "globalIndentSize" = 3, returns: 4.', () => {
            config.runtime.globalIndentSize = 3;
            Common.checkIndentSize(0).should.equal(4);
          });
          It('Input: 1 and "globalIndentSize" = 3, returns: 4.', () => {
            config.runtime.globalIndentSize = 3;
            Common.checkIndentSize(1).should.equal(4);
          });
          It('Input: 1 and "globalIndentSize" = -3, returns: 1.', () => {
            config.runtime.globalIndentSize = -3;
            Common.checkIndentSize(1).should.equal(1);
          });
          It('Input: 1 and "globalIndentSize" = non-numeric value, returns: 1.', () => {
            config.runtime.globalIndentSize = 'foo';
            Common.checkIndentSize(1).should.equal(1);
          });
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('showArray', () => {
      Describe(Utility.method('method "showArray()":'), () => {
        It(`Input: an empty array, returns: formatted string value. ${sampleCode('showArray([]);')}`, () => {
          const resultPattern = [
            Common.singleLine('['),
            ']',
          ];
          Common.showArray([]).should.equal(resultPattern.join(''));
        });
        It('Input: compaund array value, returns: formatted string value.', () => {
          const resultPattern = [
            Common.singleLine('['),
            Common.singleLine(`${Common.setLeftIndent(1)}[0] = {`),
            Common.singleLine(`${Common.setLeftIndent(2)}bar: "baz"`),
            Common.singleLine(`${Common.setLeftIndent(1)}},`),
            Common.singleLine(`${Common.setLeftIndent(1)}[1] = [`),
            Common.singleLine(`${Common.setLeftIndent(2)}[0] = "baz"`),
            Common.singleLine(`${Common.setLeftIndent(1)}]`),
            ']',
          ];
          Common.showArray(Utility.compoundArray).should.equal(resultPattern.join(''));
        });
        It(`Input: array value only, returns: formatted string value without indent. ${sampleCode('showArray(["foo"]);')}`, () => {
          const resultPattern = [
            Common.singleLine('['),
            Common.singleLine(`${Common.setLeftIndent(1)}[0] = "foo"`),
            ']',
          ];
          Common.showArray(['foo']).should.equal(resultPattern.join(''));
        });
        It(`Input: not an array, returns: error message. ${sampleCode('showArray(true);')}`, () => {
          Common.showArray(true).should.equal(Common.singleLine(errors.showArray1));
        });
        It(`Input: array value + indent size, returns: formatted string value with indent. ${sampleCode('showArray(["foo"], 2);')}`, () => {
          const resultPattern = [
            Common.singleLine('['),
            Common.singleLine(`${Common.setLeftIndent(3)}[0] = "foo"`),
            `${Common.setLeftIndent(2)}]`,
          ];
          Common.showArray(['foo'], 2).should.equal(resultPattern.join(''));
        });
        It(`Input: array value + non-numeric value, returns: formatted string value without indent. ${sampleCode('showArray(["foo"], "bar");')}`, () => {
          const resultPattern = [
            Common.singleLine('['),
            Common.singleLine(`${Common.setLeftIndent(1)}[0] = "foo"`),
            ']',
          ];
          Common.showArray(['foo'], 'bar').should.equal(resultPattern.join(''));
        });
        It(`Input: array value + indent size + show start indent, returns: formatted string value with indent, including the first line. ${sampleCode('showArray(["foo"], 2, true);')}`, () => {
          const resultPattern = [
            Common.singleLine(`${Common.setLeftIndent(2)}[`),
            Common.singleLine(`${Common.setLeftIndent(3)}[0] = "foo"`),
            `${Common.setLeftIndent(2)}]`,
          ];
          Common.showArray(['foo'], 2, true).should.equal(resultPattern.join(''));
        });
        It(`Input: array value + indent size + non-boolean value, returns: formatted string value with indent. ${sampleCode('showArray(["foo"], 2, 1);')}`, () => {
          const resultPattern = [
            Common.singleLine('['),
            Common.singleLine(`${Common.setLeftIndent(3)}[0] = "foo"`),
            `${Common.setLeftIndent(2)}]`,
          ];
          Common.showArray(['foo'], 2, 1).should.equal(resultPattern.join(''));
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('showObject', () => {
      Describe(Utility.method('method "showObject()":'), () => {
        It(`Input: an empty object, returns: formatted string value. ${sampleCode('showObject({});')}`, () => {
          const resultPattern = [
            Common.singleLine('{'),
            '}',
          ];
          Common.showObject({}).should.equal(resultPattern.join(''));
        });
        It('Input: compaund object value, returns: formatted string value.', () => {
          const resultPattern = [
            Common.singleLine('{'),
            Common.singleLine(`${Common.setLeftIndent(1)}foo: {`),
            Common.singleLine(`${Common.setLeftIndent(2)}bar: "baz"`),
            Common.singleLine(`${Common.setLeftIndent(1)}},`),
            Common.singleLine(`${Common.setLeftIndent(1)}bar: [`),
            Common.singleLine(`${Common.setLeftIndent(2)}[0] = "baz"`),
            Common.singleLine(`${Common.setLeftIndent(1)}]`),
            '}',
          ];
          Common.showObject(Utility.compoundObject).should.equal(resultPattern.join(''));
        });
        It(`Input: object value only, returns: formatted string value without indent. ${sampleCode('showObject({ foo: "bar" });')}`, () => {
          const resultPattern = [
            Common.singleLine('{'),
            Common.singleLine(`${Common.setLeftIndent(1)}foo: "bar"`),
            '}',
          ];
          Common.showObject({ foo: 'bar' }).should.equal(resultPattern.join(''));
        });
        It(`Input: not an object, returns: error message. ${sampleCode('showObject(true);')}`, () => {
          Common.showObject(true).should.equal(Common.singleLine(errors.showObject1));
        });
        It(`Input: object value + indent size, returns: formatted string value with indent. ${sampleCode('showObject({ foo: "bar" }, 2);')}`, () => {
          const resultPattern = [
            Common.singleLine('{'),
            Common.singleLine(`${Common.setLeftIndent(3)}foo: "bar"`),
            `${Common.setLeftIndent(2)}}`,
          ];
          Common.showObject({ foo: 'bar' }, 2).should.equal(resultPattern.join(''));
        });
        It(`Input: object value + non-numeric value, returns: formatted string value without indent. ${sampleCode('showObject({ foo: "bar" }, "bar");')}`, () => {
          const resultPattern = [
            Common.singleLine('{'),
            Common.singleLine(`${Common.setLeftIndent(1)}foo: "bar"`),
            '}',
          ];
          Common.showObject({ foo: 'bar' }, 'bar').should.equal(resultPattern.join(''));
        });
        It(`Input: object value + indent size + show start indent, returns: formatted string value with indent, including the first line. ${sampleCode('showObject({ foo: "bar" }, 2, true);')}`, () => {
          const resultPattern = [
            Common.singleLine(`${Common.setLeftIndent(2)}{`),
            Common.singleLine(`${Common.setLeftIndent(3)}foo: "bar"`),
            `${Common.setLeftIndent(2)}}`,
          ];
          Common.showObject({ foo: 'bar' }, 2, true).should.equal(resultPattern.join(''));
        });
        It(`Input: object value + indent size + non-boolean value, returns: formatted string value with indent. ${sampleCode('showObject({ foo: "bar" }, 2, 1);')}`, () => {
          const resultPattern = [
            Common.singleLine('{'),
            Common.singleLine(`${Common.setLeftIndent(3)}foo: "bar"`),
            `${Common.setLeftIndent(2)}}`,
          ];
          Common.showObject({ foo: 'bar' }, 2, 1).should.equal(resultPattern.join(''));
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('getResult', () => {
      Describe(Utility.method('method "getResult()":'), () => {
        It('Input: string value, returns: string value in quotation marks.', () => {
          Common.getResult('foo').should.equal('"foo"');
        });
        It('Input: numerical value, returns: number represented as a string.', () => {
          Common.getResult(1).should.equal('1');
        });
        It('Input: boolean value, returns: boolean value represented as a string.', () => {
          Common.getResult(true).should.equal('true');
        });
        It('Input: array value, returns: array value represented as a string.', () => {
          const resultPattern = [
            Common.singleLine('['),
            Common.singleLine(`${Common.setLeftIndent(1)}[0] = "foo"`),
            ']',
          ];
          Common.getResult(['foo']).should.equal(resultPattern.join(''));
        });
        It('Input: object value, returns: object value represented as a string.', () => {
          const resultPattern = [
            Common.singleLine('{'),
            Common.singleLine(`${Common.setLeftIndent(1)}foo: "bar"`),
            '}',
          ];
          Common.getResult({ foo: 'bar' }).should.equal(resultPattern.join(''));
        });
        It('Input: function value, returns: function value represented as a string.', () => {
          Common.getResult(Utility.testFunction).should.equal(Utility.testFunction.toString());
        });
        It('Input: undefined value, returns: string value "Undefined".', () => {
          Common.getResult(undefined).should.equal('Undefined');
        });
        It('Input: null value, returns: string value "Null".', () => {
          Common.getResult(null).should.equal('Null');
        });
        It(`Input: NaN value, returns: string value "NaN". ${sampleCode('getResult(0 / 0);')}`, () => {
          Common.getResult(0 / 0).should.equal('NaN');
        });
        It(`Input: infinity value, returns: string value "Infinity". ${sampleCode('getResult(1 / +0);')}`, () => {
          Common.getResult(1 / +0).should.equal('Infinity');
        });
        It(`Input: negative infinity value, returns: string value "-Infinity". ${sampleCode('getResult(1 / -0);')}`, () => {
          Common.getResult(1 / -0).should.equal('-Infinity');
        });
        It(`Input: unsupported value type, returns: error message. ${sampleCode('getResult((() => arguments)());')}`, () => {
          Common.getResult((() => arguments)()).should.equal(errors.getResult1);
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('correctDecimals', () => {
      Describe(Utility.method('method "correctDecimals()", parameter "decimalPlaces" = 4:'), () => {
        Before(() => {
          Utility.storage = config.performance.decimalPlaces;
          config.performance.decimalPlaces = 4;
        });
        After(() => {
          config.performance.decimalPlaces = Utility.storage;
        });
        It('Input: 1.1234567, returns: "1.1235".', () => {
          Common.correctDecimals(1.1234567).should.equal('1.1235');
        });
        It('Input: -1.1234567, returns: "-1.1235".', () => {
          Common.correctDecimals(-1.1234567).should.equal('-1.1235');
        });
        It('Input: 1, returns: "1.0000".', () => {
          Common.correctDecimals(1).should.equal('1.0000');
        });
        It('Input: non-numeric value, returns: error message.', () => {
          Common.correctDecimals(true).should.equal(errors.correctDecimalPlaces1);
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('RTTLevel', () => {
      Describe(Utility.method('method "setRTTLevel()":'), () => {
        const testLevelPack = {
          time: 0,
          name: '',
        };
        It('The "testLevelsPack" parameter is an empty array.', () => {
          Common.testLevelsPack.should.an('array').with.lengthOf(0);
        });
        It(`Input: index 0, returns: object with a level package. ${sampleCode('setRTTLevel(0);')}`, () => {
          Common.setRTTLevel(0).should.deep.equal(testLevelPack);
        });
        It('The "testLevelsPack" parameter now contains an array of one element.', () => {
          Common.testLevelsPack.should.deep.include(testLevelPack);
        });
        It(`Input: index 1, returns: object with a level package. ${sampleCode('setRTTLevel(1);')}`, () => {
          Common.setRTTLevel(1).should.deep.equal(testLevelPack);
        });
        It('The "testLevelsPack" parameter now contains an array of two element.', () => {
          Common.testLevelsPack.should.lengthOf(2);
          Common.testLevelsPack[0].should.deep.equal(testLevelPack);
          Common.testLevelsPack[1].should.deep.equal(testLevelPack);
        });
        It(`Input: index 5, returns: null value. ${sampleCode('setRTTLevel(5);')}`, () => {
          should.equal(Common.setRTTLevel(5), null);
        });
        It('The parameter "testLevelsPack" has not changed.', () => {
          Common.testLevelsPack.should.lengthOf(2);
          Common.testLevelsPack[0].should.deep.equal(testLevelPack);
          Common.testLevelsPack[1].should.deep.equal(testLevelPack);
        });
        It('If the "testLevelsPack" parameter is not an array, returns: null value.', () => {
          Utility.storage = Common.testLevelsPack;
          Common.testLevelsPack = {};
          should.equal(Common.setRTTLevel(0), null);
          Common.testLevelsPack = Utility.storage;
        });
        It(`Input: non-numeric value, returns: object with a level package with index 0. ${sampleCode('setRTTLevel(true);')}`, () => {
          const changedLevelPack = {
            time: 123,
            name: 'foo',
          };
          Common.testLevelsPack[0] = changedLevelPack;
          Common.setRTTLevel(true).should.deep.equal(changedLevelPack);
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('RTTLevel', () => {
      Describe(Utility.method('method "getRTTLevel()":'), () => {
        It(`Input: index 1, returns: object with a level package. ${sampleCode('getRTTLevel(1);')}`, () => {
          const testLevelPack = {
            time: 0,
            name: '',
          };
          Common.getRTTLevel(1).should.deep.equal(testLevelPack);
        });
        It(`Input: index 5, returns: null value. ${sampleCode('getRTTLevel(5);')}`, () => {
          should.equal(Common.getRTTLevel(5), null);
        });
        It(`Input: non-numeric value, returns: object with a level package with index 0. ${sampleCode('getRTTLevel(true);')}`, () => {
          const changedLevelPack = {
            time: 123,
            name: 'foo',
          };
          Common.getRTTLevel(true).should.deep.equal(changedLevelPack);
        });
        It('If the "testLevelsPack" parameter is not an array, returns: null value.', () => {
          Common.testLevelsPack = {};
          should.equal(Common.getRTTLevel(0), null);
        });
        It('Restore the "testLevelsPack" parameter to the default value.', () => {
          Common.testLevelsPack = [];
          Common.testLevelsPack.should.an('array').with.lengthOf(0);
        });
      });
    });
  });
});
