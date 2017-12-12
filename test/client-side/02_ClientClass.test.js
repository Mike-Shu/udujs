// Dependencies.
const mocha = require('mocha');
require('chai').should();

// Module for testing and helper set.
const UduJS = require('../../src/Client');
const ClientLib = require('../../src/lib/ClientLib');
const Common = require('../../src/lib/Common');
const config = require('../../src/config');
const errors = require('../../src/lib/errors');
const Utility = require('../misc/utility');

// Tools.
const Describe = mocha.describe;
const It = mocha.it;
const Before = mocha.before;
const After = mocha.after;
const BeforeEach = mocha.beforeEach;
const AfterEach = mocha.afterEach;
const sampleCode = Utility.showSampleCode;
const EOL = config.serviceApp.consoleEOL;

// Test management: useful for debugging to enable or disable test sets.
Utility.managementFor('client');
const testManagement = Utility.testManagement([
  'Constructor',
  'stopExec',
  'resumeExec',
  'log',
  'popup',
  'popupReset',
  'show',
  'observer',
  'rttPoint',
  'rttStart',
  'rttFinish',
  'rttAverage',
]);

// Preparatory activities:
Common.loadColorScheme();
const stubs = Utility.stubsPack();
let consoleStub;
let Debug;

Utility.run('Client', () => {
  Describe(Utility.name('Class "Client":'), () => {
    //--------------------------------------------------
    testManagement.run('Constructor', () => {
      Describe(Utility.method('Constructor:'), () => {
        Before(() => {
          Common.console = Utility.consoleStub;
          Utility.storage = {
            run: config.runtime.run,
            window: ClientLib.windowObj,
            performance: ClientLib.performanceObj,
            showOutput: config.serviceApp.showOutputDefault,
          };
          stubs.reset();
        });
        After(() => {
          config.runtime.run = Utility.storage.run;
          ClientLib.windowObj = Utility.storage.window;
          ClientLib.performanceObj = Utility.storage.performance;
          config.serviceApp.showOutputDefault = Utility.storage.showOutput;
        });
        BeforeEach(() => {
          consoleStub = stubs.info;
        });
        AfterEach(() => {
          consoleStub.reset();
        });
        Describe('non-standard situation', () => {
          It('running stopped by the user', () => {
            config.runtime.run = false;
            Debug = new UduJS();
            Debug.instanceReset();
            config.runtime.run = Utility.storage.run;
            consoleStub.calledTwice.should.equal(true, 'called twice');
            consoleStub.secondCall.args.join('').should.include(Common.getErrorMessage('runningStopped'));
          });
          It('the "Window" object does not exist', () => {
            ClientLib.windowObj = undefined;
            Debug = new UduJS();
            Debug.executionAllowed.should.is.a('Boolean').equal(false, '"executionAllowed" must be false');
            Debug.performanceAllowed.should.is.a('Boolean').equal(false, '"performanceAllowed" must be false');
            consoleStub = stubs.error;
            consoleStub.calledOnce.should.equal(true, 'called once');
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include(config.serviceApp.appName);
            consoleArgs.should.include(Common.getErrorMessage('constructorClient1'));
            ClientLib.windowObj = Utility.storage.window;
          });
          It('the "Performance" object does not exist', () => {
            ClientLib.performanceObj = undefined;
            Debug = new UduJS();
            Debug.executionAllowed.should.equal(true, '"executionAllowed" must be true');
            Debug.performanceAllowed.should.equal(false, '"performanceAllowed" must be false');
            consoleStub = stubs.error;
            consoleStub.calledOnce.should.equal(true, 'called once');
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include(config.serviceApp.appName);
            consoleArgs.should.include(Common.getErrorMessage('constructorClient2'));
            ClientLib.performanceObj = Utility.storage.performance;
            Debug.instanceReset();
            stubs.reset();
          });
        });
        Describe('normal functionality', () => {
          It('description and version in the console & single-initialization + custom config check (singleton)', () => {
            config.serviceApp.showOutputDefault = 'foo';
            Debug = new UduJS({
              showOutputDefault: 'bar',
            });
            Debug.should.equal(new UduJS(), 'must be a singleton');
            config.serviceApp.showOutputDefault.should.equal('bar');
            consoleStub.calledOnce.should.equal(true, 'called once');
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include(config.serviceApp.appDescription);
            consoleArgs.should.include(`${EOL}Version: ${config.serviceApp.appVersion}`);
          });
          It('there should be 4 properties', () => {
            Object.keys(Debug).length.should.equal(4);
          });
          It('the "instanceReset" property has a Function type and performs a class instance reset', () => {
            Debug.instanceReset.should.is.a('Function');
            Debug.instanceReset.toString().should.include('uduInstance = null;');
          });
          It('the "executeAllowed" property is set to "true"', () => {
            Debug.executionAllowed.should.equal(true);
          });
          It('the "performanceAllowed" property is set to "true"', () => {
            Debug.performanceAllowed.should.equal(true);
          });
          It('the "appConfig" property is an object and contains the "serviceApp" part of the configuration', () => {
            Debug.appConfig.should.is.an('Object').equal(config.serviceApp);
          });
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('stopExec', () => {
      Describe(Utility.method('Method "stopExec()":'), () => {
        Before(() => {
          if (typeof Debug === 'undefined') {
            Debug = new UduJS();
          }
          Utility.storage = {
            run: Common.config.runtime.run,
            allowed: Debug.executionAllowed,
            pointTime: ClientLib.testPointTime,
            levelPack: Common.testLevelsPack,
          };
          ClientLib.testPointTime = 123;
          Common.testLevelsPack = [123];
          Debug.stopExec();
        });
        It('the "executionAllowed" parameter is set to false', () => {
          Debug.executionAllowed.should.equal(false);
        });
        It('the "testPointTime" parameter is equal to 0', () => {
          ClientLib.testPointTime.should.is.a('Number');
          ClientLib.testPointTime.should.equal(0);
        });
        It('the "testLevelsPack" parameter is equal to the empty array', () => {
          Common.testLevelsPack.should.is.an('Array');
          Common.testLevelsPack.length.should.equal(0, 'array length');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('resumeExec', () => {
      Describe(Utility.method('Method "resumeExec()":'), () => {
        Before(() => {
          if (typeof Debug === 'undefined') {
            Debug = new UduJS();
          }
        });
        After(() => {
          Common.config.runtime.run = Utility.storage.run;
          Debug.executionAllowed = Utility.storage.allowed;
          ClientLib.testPointTime = Utility.storage.pointTime;
          Common.testLevelsPack = Utility.storage.levelPack;
        });
        It('the "executionAllowed" parameter is set to true', () => {
          Debug.resumeExec();
          Debug.executionAllowed.should.equal(true);
        });
        It('if the "run" parameter is set to false, the "executeAllowed" parameter should not be set to true', () => {
          Common.config.runtime.run = false;
          Debug.executionAllowed = false;
          Debug.resumeExec();
          Debug.executionAllowed.should.equal(false);
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('log', () => {
      Describe(Utility.method('Method "log()":'), () => {
        Before(() => {
          Common.console = Utility.consoleStub;
          if (typeof Debug === 'undefined') {
            Debug = new UduJS();
          }
          Utility.storage = Debug.executionAllowed;
          stubs.reset();
        });
        After(() => {
          Debug.executionAllowed = Utility.storage;
        });
        BeforeEach(() => {
          consoleStub = stubs.info;
        });
        AfterEach(() => {
          consoleStub.reset();
        });
        It(`Input: "foo", displays: message in the console. ${sampleCode('console("foo");')}`, () => {
          Debug.log('foo');
          consoleStub.calledOnce.should.equal(true, 'called once');
          const consoleArgs = consoleStub.args[0][0];
          consoleArgs.should.include(config.serviceApp.appName);
          consoleArgs.should.include('Type: String');
          consoleArgs.should.include(`${EOL}Value: `);
          consoleArgs.should.include('"foo"');
        });
        It(`Input: "foo" & "bar", displays: message with comment in the console. ${sampleCode('console("foo", "bar");')}`, () => {
          Debug.log('foo', 'bar');
          consoleStub.calledOnce.should.equal(true);
          const consoleArgs = consoleStub.args[0][0];
          consoleArgs.should.include(config.serviceApp.appName);
          consoleArgs.should.include('Type: String');
          consoleArgs.should.include(' | ');
          consoleArgs.should.include('bar');
          consoleArgs.should.include(`${EOL}Value: `);
          consoleArgs.should.include('"foo"');
        });
        It('Execution is not allowed, displays: nothing.', () => {
          Debug.executionAllowed = false;
          Debug.log('foo');
          consoleStub.called.should.equal(false, 'console called');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('popup', () => {
      Describe(Utility.method('Method "popup()":'), () => {
        Before(() => {
          Common.console = Utility.consoleStub;
          if (typeof Debug === 'undefined') {
            Debug = new UduJS();
          }
          Utility.storage = {
            allowed: Debug.executionAllowed,
            container: config.runtime.msgContainer,
          };
        });
        After(() => {
          Debug.executionAllowed = Utility.storage.allowed;
          config.runtime.msgContainer = Utility.storage.container;
        });
        BeforeEach(() => {
          config.runtime.msgContainer = null;
          document.body.innerHTML = '';
        });
        It(`Input: "foo", displays: message in pop-up window. ${sampleCode('popup("foo");')}`, () => {
          document.getElementsByTagName('DIV').length.should.equal(0, 'DIV count before');
          Debug.popup('foo');
          const result = document.getElementsByTagName('DIV');
          result.length.should.equal(4, 'DIV count after');
          result[1].innerText.should.include('foo');
        });
        It(`Input: "foo" & "bar", displays: message with comment in pop-up window. ${sampleCode('popup("foo", "bar");')}`, () => {
          document.getElementsByTagName('DIV').length.should.equal(0, 'DIV count before');
          Debug.popup('foo', 'bar');
          const result = document.getElementsByTagName('DIV');
          result.length.should.equal(4, 'DIV count after');
          result[2].innerText.should.include('foo');
          result[2].innerText.should.include('bar');
        });
        It('Execution is not allowed, displays: nothing.', () => {
          Debug.executionAllowed = false;
          document.getElementsByTagName('DIV').length.should.equal(0, 'DIV count before');
          Debug.popup('foo');
          document.getElementsByTagName('DIV').length.should.equal(0, 'DIV count after');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('popupReset', () => {
      Describe(Utility.method('Method "popupReset()":'), () => {
        Before(() => {
          Common.console = Utility.consoleStub;
          if (typeof Debug === 'undefined') {
            Debug = new UduJS();
          }
          Utility.storage = {
            allowed: Debug.executionAllowed,
            container: config.runtime.msgContainer,
          };
          config.runtime.msgContainer = null;
          document.body.innerHTML = '';
        });
        After(() => {
          Debug.executionAllowed = Utility.storage.allowed;
          config.runtime.msgContainer = Utility.storage.container;
        });
        It('Removes debugging information from a pop-up message.', () => {
          Debug.popup('foo');
          document.getElementsByTagName('DIV').length.should.equal(4, 'DIV count before');
          document.getElementsByTagName('DIV')[2].innerText.should.include('foo');
          Debug.popupReset();
          document.getElementsByTagName('DIV').length.should.equal(3, 'DIV count after');
          document.getElementsByTagName('DIV')[2].innerText.should.not.include('foo');
        });
        It('Execution is not allowed, result: nothing.', () => {
          Debug.popup('foo');
          document.getElementsByTagName('DIV').length.should.equal(4, 'DIV count before');
          document.getElementsByTagName('DIV')[2].innerText.should.include('foo');
          Debug.executionAllowed = false;
          Debug.popupReset();
          document.getElementsByTagName('DIV').length.should.equal(4, 'DIV count after');
          document.getElementsByTagName('DIV')[2].innerText.should.include('foo');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('show', () => {
      Describe(Utility.method('Method "show()":'), () => {
        Before(() => {
          Common.console = Utility.consoleStub;
          if (typeof Debug === 'undefined') {
            Debug = new UduJS();
          }
          Utility.storage = {
            allowed: Debug.executionAllowed,
            container: config.runtime.msgContainer,
            output: config.serviceApp.showOutputDefault,
          };
          stubs.reset();
        });
        After(() => {
          Debug.executionAllowed = Utility.storage.allowed;
          config.runtime.msgContainer = Utility.storage.container;
          config.runtime.showOutputDefault = Utility.storage.output;
        });
        Describe('Default output is "window":', () => {
          BeforeEach(() => {
            config.runtime.msgContainer = null;
            document.body.innerHTML = '';
          });
          It(`Input: "foo", displays: message in pop-up window. ${sampleCode('show("foo");')}`, () => {
            config.serviceApp.showOutputDefault = 'window';
            document.getElementsByTagName('DIV').length.should.equal(0, 'DIV count before');
            Debug.show('foo');
            const result = document.getElementsByTagName('DIV');
            result.length.should.equal(4, 'DIV count after');
            result[1].innerText.should.include('foo');
          });
          It('Execution is not allowed, displays: nothing.', () => {
            Debug.executionAllowed = false;
            document.getElementsByTagName('DIV').length.should.equal(0, 'DIV count before');
            Debug.show('foo');
            document.getElementsByTagName('DIV').length.should.equal(0, 'DIV count after');
          });
        });
        Describe('Default output is "console":', () => {
          BeforeEach(() => {
            consoleStub = stubs.info;
          });
          AfterEach(() => {
            consoleStub.reset();
          });
          It(`Input: "foo", displays: message in the console. ${sampleCode('show("foo");')}`, () => {
            config.serviceApp.showOutputDefault = 'console';
            Debug.executionAllowed = true;
            Debug.show('foo');
            consoleStub.calledOnce.should.equal(true, 'called once');
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include(config.serviceApp.appName);
            consoleArgs.should.include('Type: String');
            consoleArgs.should.include(`${EOL}Value: `);
            consoleArgs.should.include('"foo"');
          });
          It('Execution is not allowed, displays: nothing.', () => {
            Debug.executionAllowed = false;
            Debug.show('foo');
            consoleStub.called.should.equal(false, 'console called');
          });
        });
        Describe('Other variants:', () => {
          It('Default output is "file", input: "foo", displays: nothing.', () => {
            config.serviceApp.showOutputDefault = 'file';
            Debug.executionAllowed = true;
            Debug.show('foo');
          });
          It('Default output is "undefined", input: "foo", displays: error message in the console.', () => {
            config.serviceApp.showOutputDefault = 'undefined';
            Debug.executionAllowed = true;
            Debug.show('foo');
            consoleStub = stubs.warn;
            consoleStub.calledOnce.should.equal(true, 'called once');
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include(Common.getErrorMessage('show1'));
          });
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('observer', () => {
      Describe(Utility.method('Method "observer()":'), () => {
        Before(() => {
          Common.console = Utility.consoleStub;
          if (typeof Debug === 'undefined') {
            Debug = new UduJS();
          }
          Utility.storage = {
            allowed: Debug.executionAllowed,
            container: config.runtime.msgContainer,
          };
        });
        After(() => {
          Debug.executionAllowed = Utility.storage.allowed;
          config.runtime.msgContainer = Utility.storage.container;
        });
        BeforeEach(() => {
          config.runtime.msgContainer = null;
          document.body.innerHTML = '';
        });
        It(`Input: "foo" (String), displays: message in pop-up window. ${sampleCode('observer("foo");')}`, () => {
          document.getElementsByTagName('DIV').length.should.equal(0, 'DIV count before');
          Debug.observer('baz');
          const result = document.getElementsByTagName('DIV');
          result.length.should.equal(4, 'DIV count after');
          result[3].innerText.should.include('baz');
        });
        It(`Input: 123 (Number), displays: message in pop-up window. ${sampleCode('observer(123);')}`, () => {
          document.getElementsByTagName('DIV').length.should.equal(0, 'DIV count before');
          Debug.observer(123);
          const result = document.getElementsByTagName('DIV');
          result.length.should.equal(4, 'DIV count after');
          result[3].innerText.should.include('123');
        });
        It(`Input: true (Boolean), displays: message in pop-up window. ${sampleCode('observer(true);')}`, () => {
          document.getElementsByTagName('DIV').length.should.equal(0, 'DIV count before');
          Debug.observer(true);
          const result = document.getElementsByTagName('DIV');
          result.length.should.equal(4, 'DIV count after');
          result[3].innerText.should.include('true');
        });
        It(`Input: value of any other type, displays: nothing. ${sampleCode('observer(["foo"]);')}`, () => {
          document.getElementsByTagName('DIV').length.should.equal(0, 'DIV count before');
          Debug.observer(['foo']);
          document.getElementsByTagName('DIV').length.should.equal(0, 'DIV count after');
        });
        It('Execution is not allowed, displays: nothing.', () => {
          Debug.executionAllowed = false;
          document.getElementsByTagName('DIV').length.should.equal(0, 'DIV count before');
          Debug.observer('foo');
          document.getElementsByTagName('DIV').length.should.equal(0, 'DIV count after');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('rttPoint', () => {
      Describe(Utility.method('Method "rttPoint()":'), () => {
        Before(() => {
          Common.console = Utility.consoleStub;
          if (typeof Debug === 'undefined') {
            Debug = new UduJS();
          }
          Utility.storage = {
            allowed: Debug.executionAllowed,
            pointTime: ClientLib.testPointTime,
          };
          stubs.reset();
        });
        After(() => {
          Debug.executionAllowed = Utility.storage.allowed;
          ClientLib.testPointTime = Utility.storage.pointTime;
        });
        BeforeEach(() => {
          consoleStub = stubs.info;
        });
        AfterEach(() => {
          consoleStub.reset();
        });
        Describe('First call:', () => {
          It(`Input: nothing, displays: a message to the console with the default comment. ${sampleCode('rttPoint();')}`, () => {
            ClientLib.testPointTime = 0;
            Debug.rttPoint();
            consoleStub.calledOnce.should.equal(true, 'called once');
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include(config.serviceApp.appName);
            consoleArgs.should.include('Point RTT | 0 ms | ');
            consoleArgs.should.include('Starting point.');
          });
          It(`Input: "Comment", displays: a message to the console with a custom comment. ${sampleCode('rttPoint("Comment");')}`, () => {
            ClientLib.testPointTime = 0;
            Debug.rttPoint('Comment');
            consoleStub.calledOnce.should.equal(true, 'called once');
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include(config.serviceApp.appName);
            consoleArgs.should.include('Point RTT | 0 ms | ');
            consoleArgs.should.include('Comment');
          });
          It('Returns a numeric zero value.', () => {
            ClientLib.testPointTime = 0;
            const result = Debug.rttPoint();
            result.should.is.a('Number');
            result.should.equal(0, 'RTT result');
          });
        });
        Describe('Subsequent call:', () => {
          It(`Input: nothing, displays: a message to the console without comment. ${sampleCode('rttPoint();')}`, () => {
            Debug.rttPoint();
            consoleStub.calledOnce.should.equal(true, 'called once');
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include(config.serviceApp.appName);
            consoleArgs.should.include('Point RTT | ');
            consoleArgs.should.include('+');
            consoleArgs.should.include(' ms');
          });
          It(`Input: "Comment", displays: a message to the console with a custom comment. ${sampleCode('rttPoint("Comment");')}`, () => {
            Debug.rttPoint('Comment');
            consoleStub.calledOnce.should.equal(true, 'called once');
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include(config.serviceApp.appName);
            consoleArgs.should.include('Point RTT | ');
            consoleArgs.should.include('+');
            consoleArgs.should.include(' ms');
            consoleArgs.should.include(' | ');
            consoleArgs.should.include('Comment');
          });
          It('Returns a numeric non-zero value.', () => {
            const result = Debug.rttPoint();
            result.should.is.a('Number');
            result.should.not.equal(0, 'RTT result');
          });
        });
        Describe('Errors:', () => {
          It(`Input: non-string value, displays: an error message to the console. ${sampleCode('rttPoint(true);')}`, () => {
            consoleStub = stubs.error;
            Debug.rttPoint(true);
            consoleStub.calledOnce.should.equal(true, 'called once');
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include('TypeError');
            consoleArgs.should.include(errors.rttPoint1);
          });
          It('Execution is not allowed, displays: nothing.', () => {
            Debug.executionAllowed = false;
            Debug.rttPoint();
            consoleStub.called.should.equal(false, 'console called');
          });
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('rttStart', () => {
      Describe(Utility.method('Method "rttStart()":'), () => {
        Before(() => {
          Common.console = Utility.consoleStub;
          if (typeof Debug === 'undefined') {
            Debug = new UduJS();
          }
          Utility.storage = {
            allowed: Debug.executionAllowed,
            levelsPack: Common.testLevelsPack,
          };
          stubs.reset();
        });
        After(() => {
          Debug.executionAllowed = Utility.storage.allowed;
          Common.testLevelsPack = Utility.storage.levelsPack;
        });
        BeforeEach(() => {
          consoleStub = stubs.error;
        });
        AfterEach(() => {
          consoleStub.reset();
        });
        Describe('Default level:', () => {
          It(`Input: comment string value, result: a new level has been created. ${sampleCode('rttStart("Comment");')}`, () => {
            Common.testLevelsPack = [];
            Debug.rttStart('Comment');
            Common.testLevelsPack.should.is.an('Array').with.lengthOf(1, 'testLevelsPack');
            const result = Common.testLevelsPack[0];
            result.should.is.an('Object');
            result.should.have.property('name', 'Comment').that.is.a('String');
            result.should.have.property('time').that.is.a('Number');
          });
          It(`Input: nothing, result: a new level has been created. ${sampleCode('rttStart();')}`, () => {
            Common.testLevelsPack = [];
            Debug.rttStart();
            Common.testLevelsPack.should.is.an('Array').with.lengthOf(1, 'testLevelsPack');
            const result = Common.testLevelsPack[0];
            result.should.is.an('Object');
            result.should.have.property('name', '').that.is.a('String');
            result.should.have.property('time').that.is.a('Number');
          });
        });
        Describe('Additional level:', () => {
          It(`Input: comment string value & numeric value of the level index, result: a new level has been created. ${sampleCode('rttStart("Comment", 1);')}`, () => {
            Debug.rttStart('Comment', 1);
            Common.testLevelsPack.should.lengthOf(2, 'testLevelsPack');
            const result = Common.testLevelsPack[1];
            result.should.is.an('Object');
            result.should.have.property('name', 'Comment').that.is.a('String');
            result.should.have.property('time').that.is.a('Number');
          });
          It(`Input: comment string value & incorrect level index -1, displays: an error message to the console. ${sampleCode('rttStart("Comment", -1);')}`, () => {
            Debug.rttStart('Comment', -1);
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include('TypeError');
            consoleArgs.should.include(errors.rttStart3);
          });
          It(`Input: comment string value & incorrect level index 5, displays: an error message to the console. ${sampleCode('rttStart("Comment", 5);')}`, () => {
            Debug.rttStart('Comment', 5);
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include('TypeError');
            consoleArgs.should.include(errors.rttStart3);
          });
        });
        Describe('Errors:', () => {
          It(`Input: non-string value, displays: an error message to the console. ${sampleCode('rttStart(true);')}`, () => {
            Debug.rttStart(true);
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include('TypeError');
            consoleArgs.should.include(errors.rttStart1);
          });
          It(`Input: non-string value & numeric value, displays: an error message to the console. ${sampleCode('rttStart(true, 1);')}`, () => {
            Debug.rttStart(true, 1);
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include('TypeError');
            consoleArgs.should.include(errors.rttStart1);
          });
          It(`Input: non-string value & non-numeric value, displays: an error message to the console. ${sampleCode('rttStart(true, true);')}`, () => {
            Debug.rttStart(true, true);
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include('TypeError');
            consoleArgs.should.include(errors.rttStart1);
          });
          It(`Input: comment string value & non-numeric value, displays: an error message to the console. ${sampleCode('rttStart("Comment", true);')}`, () => {
            Debug.rttStart('Comment', true);
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include('TypeError');
            consoleArgs.should.include(errors.rttStart2);
          });
          It('Execution is not allowed, displays: nothing.', () => {
            Debug.executionAllowed = false;
            Common.testLevelsPack = [];
            Debug.rttStart();
            Common.testLevelsPack.should.is.an('Array').with.lengthOf(0, 'testLevelsPack');
          });
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('rttFinish', () => {
      Describe(Utility.method('Method "rttFinish()":'), () => {
        Before(() => {
          Common.console = Utility.consoleStub;
          if (typeof Debug === 'undefined') {
            Debug = new UduJS();
          }
          Utility.storage = {
            allowed: Debug.executionAllowed,
            levelsPack: Common.testLevelsPack,
          };
          stubs.reset();
        });
        After(() => {
          Debug.executionAllowed = Utility.storage.allowed;
          Common.testLevelsPack = Utility.storage.levelsPack;
        });
        Describe(`Default level: ${sampleCode('rttFinish();')}`, () => {
          BeforeEach(() => {
            consoleStub = stubs.info;
          });
          AfterEach(() => {
            consoleStub.reset();
          });
          It('Level name is empty, displays: nothing to the console.', () => {
            Common.testLevelsPack = [{
              name: '',
              time: 0,
            }];
            Debug.rttFinish();
            consoleStub.called.should.equal(false, 'console called');
          });
          It('Level name is not empty, displays: an info message to the console.', () => {
            Common.testLevelsPack = [{
              name: 'Comment',
              time: 0,
            }];
            Debug.rttFinish();
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include(config.serviceApp.appName);
            consoleArgs.should.include('Single RTT | ');
            consoleArgs.should.include(' ms | ');
            consoleArgs.should.include('Comment');
          });
          It('Returns a numeric non-zero value.', () => {
            Debug.rttFinish().should.is.a('Number').not.equal(0);
          });
        });
        Describe(`Additional level: ${sampleCode('rttFinish(1);')}`, () => {
          BeforeEach(() => {
            consoleStub = stubs.info;
          });
          AfterEach(() => {
            consoleStub.reset();
          });
          It('Level name is empty, displays: nothing to the console.', () => {
            Common.testLevelsPack = [{}, {
              name: '',
              time: 0,
            }];
            Debug.rttFinish(1);
            consoleStub.called.should.equal(false, 'console called');
          });
          It('Level name is not empty, displays: an info message to the console.', () => {
            Common.testLevelsPack = [{}, {
              name: 'Comment',
              time: 0,
            }];
            Debug.rttFinish(1);
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include(config.serviceApp.appName);
            consoleArgs.should.include('Single RTT | ');
            consoleArgs.should.include(' ms | ');
            consoleArgs.should.include('Comment');
          });
          It('Returns a numeric non-zero value.', () => {
            Debug.rttFinish(1).should.is.a('Number').not.equal(0);
          });
        });
        Describe('Errors:', () => {
          BeforeEach(() => {
            consoleStub = stubs.error;
          });
          AfterEach(() => {
            consoleStub.reset();
          });
          It(`Input: non-numeric value, displays: an error message to the console. ${sampleCode('rttFinish(true);')}`, () => {
            Debug.rttFinish(true);
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include('TypeError');
            consoleArgs.should.include(errors.rttFinish1);
          });
          It(`Input: incorrect level index -1, displays: an error message to the console. ${sampleCode('rttFinish(-1);')}`, () => {
            Debug.rttFinish(-1);
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include('TypeError');
            consoleArgs.should.include(errors.rttFinish2);
          });
          It(`Input: incorrect level index 5, displays: an error message to the console. ${sampleCode('rttFinish(5);')}`, () => {
            Debug.rttFinish(5);
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include('TypeError');
            consoleArgs.should.include(errors.rttFinish2);
          });
          It('Layer pack is empty, displays: an error message to the console.', () => {
            Common.testLevelsPack = [];
            Debug.rttFinish();
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include('TypeError');
            consoleArgs.should.include(errors.rttFinish2);
          });
          It('Execution is not allowed, displays: nothing.', () => {
            Debug.executionAllowed = false;
            Common.testLevelsPack = [];
            Debug.rttFinish();
            consoleStub.called.should.equal(false, 'console called');
          });
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('rttAverage', () => {
      Describe(Utility.method('Method "rttAverage()":'), () => {
        Before(() => {
          Common.console = Utility.consoleStub;
          if (typeof Debug === 'undefined') {
            Debug = new UduJS();
          }
          Utility.storage = {
            allowed: Debug.executionAllowed,
            levelsPack: Common.testLevelsPack,
          };
          stubs.reset();
        });
        After(() => {
          Debug.executionAllowed = Utility.storage.allowed;
          Common.testLevelsPack = Utility.storage.levelsPack;
        });
        BeforeEach(() => {
          consoleStub = stubs.info;
        });
        AfterEach(() => {
          consoleStub.reset();
        });
        It(`Input: test code (function) & cycles count (number), displays: an info message to the console. ${sampleCode('rttAverage(() => {}, 3);')}`, () => {
          Debug.rttAverage(() => {
          }, 3);
          consoleStub.calledOnce.should.equal(true);
          const consoleArgs = consoleStub.args[0][0];
          consoleArgs.should.include(config.serviceApp.appName);
          consoleArgs.should.include('Average RTT | ');
          consoleArgs.should.include(' ms');
        });
        It(`Input: test code & cycles count & comment (string), displays: an info message to the console. ${sampleCode('rttAverage(() => {}, 3, "Comment");')}`, () => {
          Debug.rttAverage(() => {
          }, 3, 'Comment');
          consoleStub.calledOnce.should.equal(true);
          const consoleArgs = consoleStub.args[0][0];
          consoleArgs.should.include(config.serviceApp.appName);
          consoleArgs.should.include('Average RTT | ');
          consoleArgs.should.include(' ms');
          consoleArgs.should.include('%c | ');
          consoleArgs.should.include('Comment');
        });
        It(`Input: test code & cycles count & comment & flag for each iteration (boolean), displays: an info message to the console. ${sampleCode('rttAverage(() => {}, 3, "Comment", true);')}`, () => {
          Debug.rttAverage(() => {
          }, 3, 'Comment', true);
          consoleStub.calledOnce.should.equal(true);
          const consoleArgs = consoleStub.args[0][0];
          consoleArgs.should.include(config.serviceApp.appName);
          consoleArgs.should.include('Average RTT | ');
          consoleArgs.should.include(' ms');
          consoleArgs.should.include('%c | ');
          consoleArgs.should.include('Comment');
          consoleArgs.should.include('  iteration 1: ');
          consoleArgs.should.include('  iteration 3: ');
        });
        It(`Input: test code & cycles count with exceeded value (> 1000) & each iteration, displays: an info message to the console. ${sampleCode('rttAverage(() => {}, 100500);')}`, () => {
          Debug.rttAverage(() => {
          }, 100500, '', true);
          consoleStub.calledOnce.should.equal(true);
          const consoleArgs = consoleStub.args[0][0];
          consoleArgs.should.include(config.serviceApp.appName);
          consoleArgs.should.include('Average RTT | ');
          consoleArgs.should.include(' ms');
          consoleArgs.should.include('  iteration 1: ');
          consoleArgs.should.include('  iteration 1000: ');
        });
        Describe('Errors:', () => {
          BeforeEach(() => {
            consoleStub = stubs.error;
          });
          AfterEach(() => {
            consoleStub.reset();
          });
          It(`Input: only test code, displays: an error message to the console. ${sampleCode('rttAverage(() => {});')}`, () => {
            Debug.rttAverage(() => {
            });
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include('TypeError');
            consoleArgs.should.include(errors.rttAverage2);
          });
          It(`Input: nothing, displays: an error message to the console. ${sampleCode('rttAverage();')}`, () => {
            Debug.rttAverage();
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include('TypeError');
            consoleArgs.should.include(errors.rttAverage1);
          });
          It(`Input: non-function value & cycles count, displays: an error message to the console. ${sampleCode('rttAverage(true, 3);')}`, () => {
            Debug.rttAverage(true, 3);
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include('TypeError');
            consoleArgs.should.include(errors.rttAverage1);
          });
          It(`Input: test code & non-numeric value, displays: an error message to the console. ${sampleCode('rttAverage(() => {}, true);')}`, () => {
            Debug.rttAverage(() => {
            }, true);
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include('TypeError');
            consoleArgs.should.include(errors.rttAverage2);
          });
          It(`Input: test code & cycles count & non-string value, displays: an error message to the console. ${sampleCode('rttAverage(() => {}, 3, true);')}`, () => {
            Debug.rttAverage(() => {
            }, 3, true);
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include('TypeError');
            consoleArgs.should.include(errors.rttAverage3);
          });
          It(`Input: test code & cycles count & comment & non-boolean value, displays: an error message to the console. ${sampleCode('rttAverage(() => {}, 3, "Comment", 1);')}`, () => {
            Debug.rttAverage(() => {
            }, 3, 'Comment', 1);
            consoleStub.calledOnce.should.equal(true);
            const consoleArgs = consoleStub.args[0][0];
            consoleArgs.should.include('TypeError');
            consoleArgs.should.include(errors.rttAverage4);
          });
          It('Execution is not allowed, displays: nothing.', () => {
            Debug.executionAllowed = false;
            Debug.rttAverage();
            consoleStub.called.should.equal(false, 'console called');
          });
        });
      });
    });
  });
});

