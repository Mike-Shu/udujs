// Dependencies.
const mocha = require('mocha');
const should = require('chai').should();

// Module for testing and helper set.
const ServerLib = require('../../lib/ServerLib');
const Common = require('../../lib/Common');
const config = require('../../lib/config');
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
Utility.managementFor('server');
const testManagement = Utility.testManagement([
  'Constructor',
  'wrapString',
  'executeColoring',
  'highlightAttentions',
  'highlightCommas',
  'getDebugMessage',
  'getProcessTime',
]);

// Preparatory activities:
Common.loadColorScheme();
const stubs = Utility.stubsPack();
let consoleStub;
const headingColor = config.runtime.colorScheme.server.heading;
const masterColor = config.runtime.colorScheme.server.master;
const slaveColor = config.runtime.colorScheme.server.slave;
const attentionColor = config.runtime.colorScheme.server.attention;

Utility.run('ServerLib', () => {
  Describe(Utility.name('Class "ServerLib":'), () => {
    //--------------------------------------------------
    testManagement.run('Constructor', () => {
      Describe(Utility.method('Constructor:'), () => {
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
        It('The "color" property.', () => {
          ServerLib.should.property('color').that.is.an('Object');
        });
        It('The "testPointTime" property.', () => {
          ServerLib.should.property('testPointTime');
        });
        It('The "hrtime" property.', () => {
          ServerLib.should.property('hrtime');
        });
        It('The "getMilliseconds" property.', () => {
          ServerLib.should.property('getMilliseconds');
        });
        Describe('The "color" property must contain:', () => {
          const Color = ServerLib.color;
          It('the "consoleScheme" method;', () => {
            Color.consoleScheme.should.be.a('Function');
          });
          It('the "getColor" method;', () => {
            Color.getColor.should.be.a('Function');
          });
          It('the "reset" property;', () => {
            Color.reset.should.be.a('String');
          });
          It('the "heading" property;', () => {
            Color.heading.should.be.a('String');
          });
          It('the "master" property;', () => {
            Color.master.should.be.a('String');
          });
          It('the "slave" property;', () => {
            Color.slave.should.be.a('String');
          });
          It('the "attention" property.', () => {
            Color.attention.should.be.a('String');
          });
          Describe('The "consoleScheme" method should return:', () => {
            It(`Input: conditional color name (string value), returns: color coding (string value). ${sampleCode('consoleScheme("heading");')}`, () => {
              Color.consoleScheme('heading').should.is.a('String').equal(headingColor);
            });
            It(`Input: unknown color name, returns: error message to the console. ${sampleCode('consoleScheme("unknown");')}`, () => {
              Color.consoleScheme('unknown');
              consoleStub.calledOnce.should.equal(true);
              const consoleArgs = consoleStub.args[0][0];
              consoleArgs.should.include(`${EOL}Warning: unknown color name "unknown" in the color scheme "server".`);
            });
            It(`Input: non-string value, returns: color code 0 (numeric value). ${sampleCode('consoleScheme(true);')}`, () => {
              Color.consoleScheme(true).should.is.a('Number').equal(0);
            });
            It(`Input: nothing, returns: color code 0 (numeric value). ${sampleCode('consoleScheme();')}`, () => {
              Color.consoleScheme().should.is.a('Number').equal(0);
            });
          });
          Describe('The "getColor" method should return:', () => {
            It(`Input: color code (numeric value), returns: the ANSI escape sequence (string value). ${sampleCode('getColor(34);')}`, () => {
              Color.getColor(34).should.is.a('String').equal('\x1b[34m');
            });
          });
          Describe('The "reset" property should return:', () => {
            It(`the ANSI escape sequence (string value). ${sampleCode('\\x1b[0m')}`, () => {
              Color.reset.should.is.a('String').equal('\x1b[0m');
            });
          });
          Describe('The "heading" property should return:', () => {
            It('the ANSI escape sequence (string value).', () => {
              Color.heading.should.is.a('String').equal(`\x1b[${headingColor}m`);
            });
          });
          Describe('The "master" property should return:', () => {
            It('the ANSI escape sequence (string value).', () => {
              Color.master.should.is.a('String').equal(`\x1b[${masterColor}m`);
            });
          });
          Describe('The "slave" property should return:', () => {
            It('the ANSI escape sequence (string value).', () => {
              Color.slave.should.is.a('String').equal(`\x1b[${slaveColor}m`);
            });
          });
          Describe('The "attention" property should return:', () => {
            It('the ANSI escape sequence (string value).', () => {
              Color.attention.should.is.a('String').equal(`\x1b[${attentionColor}m`);
            });
          });
        });
        Describe('The "testPointTime" property must contain:', () => {
          It('an empty array.', () => {
            ServerLib.testPointTime.should.is.an('Array').with.lengthOf(0);
          });
        });
        Describe('The "hrtime" property must:', () => {
          It('be a function', () => {
            Utility.storage = ServerLib.hrtimeFunc;
            ServerLib.hrtimeFunc = undefined;
            should.equal(ServerLib.hrtime, null);
            ServerLib.hrtimeFunc = Utility.storage;
            ServerLib.hrtime.should.is.a('Function', 'should is');
          });
          It('returns an array of two numeric values', () => {
            const hrtime = ServerLib.hrtime();
            hrtime.should.is.an('Array').with.lengthOf(2);
            hrtime[0].should.is.a('Number');
            hrtime[1].should.is.a('Number');
          });
        });
        Describe('The "getMilliseconds" property must be:', () => {
          It(`a function, that returns a numeric value. ${sampleCode('getMilliseconds(ServerLib.hrtime());')}`, () => {
            ServerLib.getMilliseconds.should.is.a('Function');
            ServerLib.getMilliseconds(ServerLib.hrtime()).should.is.a('Number');
          });
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('wrapString', () => {
      Describe(Utility.method('method "wrapString()":'), () => {
        It(`Input: "foo" & "master", returns: string wrapped in the specified color. ${sampleCode('wrapString("foo", "master");')}`, () => {
          ServerLib.wrapString('foo', 'master').should.is.a('String').equal(`\x1b[${masterColor}mfoo\x1b[0m`);
        });
        It(`Input: "foo" & "", returns: string without colorizing. ${sampleCode('wrapString("foo", "");')}`, () => {
          ServerLib.wrapString('foo', '').should.is.a('String').equal('foo');
        });
        It(`Input: "" & "master", returns: empty string value. ${sampleCode('wrapString("", "master");')}`, () => {
          ServerLib.wrapString('', 'master').should.is.a('String').equal('');
        });
        It(`Input: "" & "", returns: empty string value. ${sampleCode('wrapString("", "");')}`, () => {
          ServerLib.wrapString('', '').should.is.a('String').equal('');
        });
        It(`Input: non-string value & non-string value, returns: empty string value. ${sampleCode('wrapString(123, true);')}`, () => {
          ServerLib.wrapString(123, true).should.is.a('String').equal('');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('executeColoring', () => {
      Describe(Utility.method('method "executeColoring()":'), () => {
        ServerLib.executeColoring();
        It('A "appName" property with a string value containing the name of the App was created.', () => {
          ServerLib.should.property('appName').that.is.a('String');
          ServerLib.appName.should.equal(`\x1b[${slaveColor}m[\x1b[${headingColor}m${config.serviceApp.appName}\x1b[0m] \x1b[0m`);
        });
        It('An "appVersion" property was created with a string value containing the version of the App.', () => {
          ServerLib.should.property('appVersion').that.is.a('String');
          ServerLib.appVersion.should.equal(`\x1b[${slaveColor}mVersion: ${config.serviceApp.appVersion}\x1b[0m`);
        });
        It('An "appDescription" property was created with a string value containing the App description.', () => {
          ServerLib.should.property('appDescription').that.is.a('String');
          ServerLib.appDescription.should.equal(`\x1b[${headingColor}m${config.serviceApp.appDescription}\x1b[0m`);
        });
        It('An "appStopped" property was created with a string value.', () => {
          ServerLib.should.property('appStopped').that.is.a('String');
          ServerLib.appStopped.should.equal(`\x1b[${masterColor}m${Common.getErrorMessage('runningStopped')}\x1b[0m`);
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('highlightAttentions', () => {
      Describe(Utility.method('method "highlightAttentions()":'), () => {
        It(`Input: string without data for highlighting, returns: string without highlights. ${sampleCode('highlightAttentions("Value: String.");')}`, () => {
          ServerLib.highlightAttentions('Value: String.').should.is.a('String').equal('Value: String.');
        });
        It(`Input: string with data for highlighting, returns: string with highlights. ${sampleCode('highlightAttentions("Value: Null.");')}`, () => {
          ServerLib.highlightAttentions('Value: Null.').should.is.a('String').equal(`Value: \x1b[0m\x1b[${attentionColor}mNull\x1b[0m\x1b[${masterColor}m.`);
        });
        It(`Input: non-string value, returns: empty string value. ${sampleCode('highlightAttentions(true);')}`, () => {
          ServerLib.highlightAttentions(true).should.is.a('String').equal('');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('highlightCommas', () => {
      Describe(Utility.method('method "highlightCommas()":'), () => {
        It(`Input: string without data for highlighting, returns: string without highlights. ${sampleCode('highlightCommas("foo bar");')}`, () => {
          ServerLib.highlightCommas('foo bar').should.is.a('String').equal('foo bar');
        });
        It(`Input: string with data for highlighting, returns: string with highlights. ${sampleCode('highlightCommas("foo, bar");')}`, () => {
          ServerLib.highlightCommas(`foo,${EOL} bar`).should.is.a('String').equal(`foo\x1b[0m\x1b[${slaveColor}m,${EOL}\x1b[0m\x1b[${masterColor}m bar`);
        });
        It(`Input: non-string value, returns: empty string value. ${sampleCode('highlightCommas(true);')}`, () => {
          ServerLib.highlightCommas(true).should.is.a('String').equal('');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('getDebugMessage', () => {
      Describe(Utility.method('method "getDebugMessage()":'), () => {
        Before(() => {
          Utility.storage = config.serviceApp.allowColorization;
        });
        After(() => {
          config.serviceApp.allowColorization = Utility.storage;
        });
        const typeString = `\x1b[${slaveColor}mType: String\x1b[0m`;
        const typeStringC = `\x1b[${slaveColor}mType: String | \x1b[0m`;
        const commentString = `\x1b[${masterColor}mbar\x1b[0m`;
        const valueString = value => `\x1b[${slaveColor}mValue: \x1b[0m\x1b[${masterColor}m"${value}"\x1b[0m`;
        Describe('parameter "allowColorization" = yes:', () => {
          config.serviceApp.allowColorization = true;
          It(`Input: "foo" & "", returns: colored string without comment. ${sampleCode('getDebugMessage("foo", "");')}`, () => {
            ServerLib.getDebugMessage('foo', '').should.is.a('String').equal(typeString + EOL + valueString('foo'));
          });
          It(`Input: "foo" & "bar", returns: colored string with comment. ${sampleCode('getDebugMessage("foo", "bar");')}`, () => {
            ServerLib.getDebugMessage('foo', 'bar').should.is.a('String').equal(typeStringC + commentString + EOL + valueString('foo'));
          });
          It(`Input: "" & "", returns: colored string without comment. ${sampleCode('getDebugMessage("", "");')}`, () => {
            ServerLib.getDebugMessage('', '').should.is.a('String').equal(typeString + EOL + valueString(''));
          });
          It(`Input: "foo" & non-string value, returns: colored string without comment. ${sampleCode('getDebugMessage("foo", true);')}`, () => {
            ServerLib.getDebugMessage('foo', true).should.is.a('String').equal(typeString + EOL + valueString('foo'));
          });
        });
        Describe('parameter "allowColorization" = no:', () => {
          config.serviceApp.allowColorization = false;
          It('Input: "foo" & "bar", returns: colored string with comment. For the server, the coloring does not turn off.', () => {
            ServerLib.getDebugMessage('foo', 'bar').should.is.a('String').equal(typeStringC + commentString + EOL + valueString('foo'));
          });
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('getProcessTime', () => {
      Describe(Utility.method('method "getProcessTime()":'), () => {
        It(`Input: nothing, returns: an array with two numeric values. ${sampleCode('getProcessTime()')}`, () => {
          const result = ServerLib.getProcessTime();
          result.should.is.an('Array').with.lengthOf(2);
          result[0].should.is.a('Number');
          result[1].should.is.a('Number');
        });
        It(`Input: an array with two numeric values, returns: an array with two numeric values. ${sampleCode('getProcessTime(getProcessTime());')}`, () => {
          const result = ServerLib.getProcessTime(ServerLib.getProcessTime());
          result.should.is.an('Array').with.lengthOf(2);
          result[0].should.is.a('Number');
          result[1].should.is.a('Number');
        });
        It(`Input: not an array value, returns: an array with two numeric values. ${sampleCode('getProcessTime(true);')}`, () => {
          const result = ServerLib.getProcessTime(true);
          result.should.is.an('Array').with.lengthOf(2);
          result[0].should.is.a('Number');
          result[1].should.is.a('Number');
        });
        It('If an exception is thrown, then it is caught.', () => {

        });
      });
    });
  });
});
