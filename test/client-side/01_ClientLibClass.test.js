// Dependencies.
const mocha = require('mocha');
const should = require('chai').should();

// Module for testing and helper set.
const ClientLib = require('../../src/lib/ClientLib');
const Common = require('../../src/lib/Common');
const config = require('../../src/config');
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
  'getBrowserSignature',
  'isColoringAvailable',
  'prepareColoring',
  'getDebugMessage',
  'createMsgBox',
  'wrapString',
  'highlightAttentions',
  'highlightCommas',
  'addMessage',
  'popupContainerClear',
  'getObserver',
]);

// Preparatory activities:
Common.loadColorScheme();
const stubs = Utility.stubsPack();
let consoleStub;
const consoleHeadingColor = config.runtime.colorScheme.console.heading;
const consoleMasterColor = config.runtime.colorScheme.console.master;
const consoleSlaveColor = config.runtime.colorScheme.console.slave;
const consoleAttentionColor = config.runtime.colorScheme.console.attention;
const popupSlaveColor = config.runtime.colorScheme.popup.slave;
const popupAttentionColor = config.runtime.colorScheme.popup.attention;

Utility.run('ClientLib', () => {
  Describe(Utility.name('Class "ClientLib":'), () => {
    //--------------------------------------------------
    testManagement.run('Constructor', () => {
      Describe(Utility.method('Constructor:'), () => { // TODO: refactoring.
        Before(() => {
          stubs.reset();
        });
        BeforeEach(() => {
          Common.console = Utility.consoleStub;
          consoleStub = stubs.warn;
        });
        AfterEach(() => {
          consoleStub.reset();
        });
        It('There should be 8 properties.', () => {
          Object.keys(ClientLib).length.should.equal(8);
        });
        It('The "color" property.', () => {
          ClientLib.should.property('color');
          ClientLib.color.should.is.an('Object');
        });
        It('The "appName" property.', () => {
          ClientLib.should.property('appName');
        });
        It('The "testPointTime" property.', () => {
          ClientLib.should.property('testPointTime');
        });
        It('The "serviceApp" property.', () => {
          ClientLib.should.property('serviceApp');
        });
        It('The "runtime" property.', () => {
          ClientLib.should.property('runtime');
        });
        Describe('The "color" property must contain:', () => {
          const Color = ClientLib.color;
          It('the "consoleScheme" method;', () => {
            Color.consoleScheme.should.is.a('Function');
          });
          It('the "popupScheme" method;', () => {
            Color.popupScheme.should.is.an('Object');
          });
          It('the "getColor" method;', () => {
            Color.getColor.should.is.a('Function');
          });
          It('the "heading" property;', () => {
            Color.heading.should.is.a('String');
          });
          It('the "master" property;', () => {
            Color.master.should.is.a('String');
          });
          It('the "slave" property;', () => {
            Color.slave.should.is.a('String');
          });
          It('the "attention" property.', () => {
            Color.attention.should.is.a('String');
          });
          Describe('The "consoleScheme" method should return:', () => {
            It(`Input: conditional color name (string value), returns: color coding (string value). ${sampleCode('consoleScheme("heading");')}`, () => {
              Color.consoleScheme('heading').should.is.a('String').equal(consoleHeadingColor, 'color');
            });
            It(`Input: unknown color name, displays: an error message to the console. ${sampleCode('consoleScheme("unknown");')}`, () => {
              Color.consoleScheme('unknown');
              consoleStub.calledOnce.should.equal(true, 'calledOnce');
              const consoleArgs = consoleStub.args[0][0];
              consoleArgs.should.include(`${EOL}Warning: unknown color name "unknown" in the color scheme "console".`);
            });
            It(`Input: non-string value, returns: color code 0 (numeric value). ${sampleCode('consoleScheme(true);')}`, () => {
              Color.consoleScheme(true).should.is.a('Number').equal(0);
            });
            It(`Input: nothing, returns: color code 0 (numeric value). ${sampleCode('consoleScheme();')}`, () => {
              Color.consoleScheme().should.is.a('Number').equal(0);
            });
          });
          Describe('The "getColor" method should return:', () => {
            It(`Input: color code (string value), returns: the ANSI escape sequence (string value). ${sampleCode('getColor(34);')}`, () => {
              Color.getColor('#CDDC39').should.is.a('String').equal('color: #CDDC39');
            });
          });
          Describe('The "heading" property should return:', () => {
            It(`CSS parameter "color" with HEX color code (string value). ${sampleCode('color: #FFF')}`, () => {
              Color.heading.should.is.a('String').equal(`color: ${consoleHeadingColor}`);
            });
          });
          Describe('The "master" property should return:', () => {
            It('CSS parameter "color" with HEX color code (string value).', () => {
              Color.master.should.is.a('String').equal(`color: ${consoleMasterColor}`);
            });
          });
          Describe('The "slave" property should return:', () => {
            It('CSS parameter "color" with HEX color code (string value).', () => {
              Color.slave.should.is.a('String').equal(`color: ${consoleSlaveColor}`);
            });
          });
          Describe('The "attention" property should return:', () => {
            It('CSS parameter "color" with HEX color code (string value).', () => {
              Color.attention.should.is.a('String').equal(`color: ${consoleAttentionColor}`);
            });
          });
        });
        Describe('The "appName" property must contain:', () => {
          It('The "appName" property must contain an array with 6 elements.', () => {
            ClientLib.appName.should.is.an('Array');
            ClientLib.appName.length.should.equal(6, 'length');
          });
        });
        Describe('The "testPointTime" property must contain:', () => {
          It('a numeric value 0.', () => {
            ClientLib.testPointTime.should.is.a('Number').equal(0);
          });
        });
        Describe('The "serviceApp" property must contain:', () => {
          It('a reference to a similar part of the configuration.', () => {
            ClientLib.serviceApp.should.equal(config.serviceApp);
          });
        });
        Describe('The "runtime" property must contain:', () => {
          It('a reference to a similar part of the configuration.', () => {
            ClientLib.runtime.should.equal(config.runtime);
          });
        });
        It('The "windowObj" property refers to the "Window" object.', () => {
          ClientLib.should.property('windowObj');
          ClientLib.windowObj.should.equal(window);
        });
        It('The "userAgent" property refers to the "Navigator" object.', () => {
          ClientLib.should.property('userAgent');
          ClientLib.userAgent.should.equal(window.navigator.userAgent);
        });
        It('The "performanceObj" property refers to the "Performance" object.', () => {
          ClientLib.should.property('performanceObj');
          ClientLib.performanceObj.should.equal(window.performance);
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('getBrowserSignature', () => {
      Describe(Utility.method('method "getBrowserSignature()":'), () => {
        Before(() => {
          Utility.storage = {
            userAgent: ClientLib.userAgent,
            browserSignature: config.runtime.cache.browserSignature,
          };
        });
        After(() => {
          ClientLib.userAgent = Utility.storage.userAgent;
          config.runtime.cache.browserSignature = Utility.storage.browserSignature;
        });
        const userAgentSamples = [
          ['Webkit', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'],
          ['Webkit', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/601.7.7 (KHTML, like Gecko) Version/9.1.2 Safari/601.7.7'],
          ['Firefox', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0'],
          ['', 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko'],
          ['', undefined],
        ];
        userAgentSamples.forEach((item) => {
          It(`Synthetic check: the method should returns a "${item[0]}" value.`, () => {
            config.runtime.cache.browserSignature = null;
            ClientLib.userAgent = item[1];
            ClientLib.getBrowserSignature.should.equal(item[0]);
          });
        });
      });
    });
    //--------------------------------------------------
    testManagement.run('isColoringAvailable', () => {
      Describe(Utility.method('method "isColoringAvailable()":'), () => {
        Before(() => {
          Utility.storage = {
            colorization: config.serviceApp.allowColorization,
            cache: config.runtime.cache,
          };
        });
        After(() => {
          config.serviceApp.allowColorization = Utility.storage.colorization;
          config.runtime.cache = Utility.storage.cache;
        });
        BeforeEach(() => {
          config.runtime.cache = {};
        });
        It('Real check: the method returns a true value.', () => {
          ClientLib.isColoringAvailable().should.equal(true, 'method returns');
        });
        const browserSignatureArr = [
          'Webkit',
          'Firefox',
        ];
        browserSignatureArr.forEach((item) => {
          It(`Synthetic check: "${item}" signature.`, () => {
            config.runtime.cache.browserSignature = item;
            ClientLib.isColoringAvailable().should.equal(true, 'method returns');
          });
        });
        It('Synthetic check: "Wrong" signature.', () => {
          config.runtime.cache.browserSignature = 'Wrong';
          ClientLib.isColoringAvailable().should.equal(false, 'method returns');
        });
        It('Real check with off coloring: the method returns a false value.', () => {
          config.serviceApp.allowColorization = false;
          ClientLib.isColoringAvailable().should.equal(false, 'method returns');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('prepareColoring', () => {
      Describe(Utility.method('method "prepareColoring()":'), () => {
        Before(() => {
          Utility.storage = {
            colorization: config.serviceApp.allowColorization,
          };
        });
        After(() => {
          config.serviceApp.allowColorization = Utility.storage.colorization;
        });
        It(`Input: an array with an even number of elements, returns: the correct array for the console. ${sampleCode('prepareColoring(["foo", "master", "bar", "slave"]);')}`, () => {
          const sampleData = {
            input: [
              'foo', 'master',
              'bar', 'slave',
            ],
            returns: [
              '%cfoo%cbar',
              ClientLib.color.master,
              ClientLib.color.slave,
            ],
          };
          const result = ClientLib.prepareColoring(sampleData.input);
          result.should.is.an('Array');
          result.should.eql(sampleData.returns);
        });
        It(`Input: an array with a wrong color code, returns: the correct array for the console. ${sampleCode('prepareColoring(["foo", "wrong"]);')}`, () => {
          const sampleData = {
            input: [
              'foo', 'wrong',
            ],
            returns: [
              '%cfoo', 'color: none',
            ],
          };
          const result = ClientLib.prepareColoring(sampleData.input);
          result.should.is.an('Array');
          result.should.eql(sampleData.returns);
        });
        It(`Input: an array with an odd number of elements, returns: an empty array. ${sampleCode('prepareColoring(["foo", "master", "bar"]);')}`, () => {
          const sampleData = {
            input: [
              'foo', 'master', 'bar',
            ],
            returns: [],
          };
          const result = ClientLib.prepareColoring(sampleData.input);
          result.should.is.an('Array');
          result.should.eql(sampleData.returns);
        });
        It(`Input: an empty array, returns: an empty array. ${sampleCode('prepareColoring([]);')}`, () => {
          const result = ClientLib.prepareColoring([]);
          result.should.is.an('Array');
          result.length.should.equal(0, 'length');
        });
        It(`Input: not an array value, returns: an empty array. ${sampleCode('prepareColoring(true);')}`, () => {
          const result = ClientLib.prepareColoring(true);
          result.should.is.an('Array');
          result.length.should.equal(0, 'length');
        });
        It(`Input: nothing, returns: an empty array. ${sampleCode('prepareColoring();')}`, () => {
          const result = ClientLib.prepareColoring();
          result.should.is.an('Array');
          result.length.should.equal(0, 'length');
        });
        It('Coloring is disabled.', () => {
          const sampleData = [
            'foo', 'master',
            'bar', 'slave',
          ];
          config.serviceApp.allowColorization = false;
          const result = ClientLib.prepareColoring(sampleData);
          result.should.is.a('Array');
          result.length.should.equal(1, 'length');
          result[0].should.equal('foobar');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('getDebugMessage', () => {
      Describe(Utility.method('method "getDebugMessage()":'), () => {
        It(`Input: 123 (Number), returns: an array with debugging information. ${sampleCode('getDebugMessage(123);')}`, () => {
          const result = ClientLib.getDebugMessage(123);
          result.should.is.an('Array');
          result.length.should.equal(6, 'length');
          result.should.include('Type: Number');
          result.should.include(`${EOL}Value: `);
          result.should.include('123');
        });
        It(`Input: "foo" (String) & "Comment" (String), returns: an array with debugging information. ${sampleCode('getDebugMessage("foo", "Comment");')}`, () => {
          const result = ClientLib.getDebugMessage('foo', 'Comment');
          result.should.is.an('Array');
          result.length.should.equal(10, 'length');
          result.should.include('Type: String');
          result.should.include(' | ');
          result.should.include('Comment');
          result.should.include(`${EOL}Value: `);
          result.should.include('"foo"');
        });
        It(`Input: nothing, returns: an array with debugging information. ${sampleCode('getDebugMessage();')}`, () => {
          const result = ClientLib.getDebugMessage();
          result.should.is.an('Array');
          result.length.should.equal(6, 'length');
          result.should.include('Type: Undefined');
          result.should.include(`${EOL}Value: `);
          result.should.include('Undefined');
        });
        It(`Input: true (Boolean) & non-string value, returns: an array with debugging information. ${sampleCode('getDebugMessage(true, true);')}`, () => {
          const result = ClientLib.getDebugMessage(true, true);
          result.should.is.an('Array');
          result.length.should.equal(6, 'length');
          result.should.include('Type: Boolean');
          result.should.include(`${EOL}Value: `);
          result.should.include('true');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('createMsgBox', () => {
      Describe(Utility.method('method "createMsgBox()":'), () => {
        Before(() => {
          Utility.storage = {
            container: config.runtime.msgContainer,
            observer: config.runtime.observer,
          };
        });
        After(() => {
          config.runtime.msgContainer = Utility.storage.container;
          config.runtime.observer = Utility.storage.observer;
        });
        Describe('Before calling the method:', () => {
          It('The document does not contain "STYLE" elements.', () => {
            document.getElementsByTagName('STYLE').length.should.equal(0, 'length');
          });
          It('The document does not contain "DIV" elements.', () => {
            document.getElementsByTagName('DIV').length.should.equal(0, 'length');
          });
          It('The configuration parameter "msgContainer" is NULL.', () => {
            should.equal(config.runtime.msgContainer, null);
          });
          It('The configuration parameter "observer" is NULL.', () => {
            should.equal(config.runtime.observer, null);
          });
        });
        Describe('After calling the method:', () => {
          It('The "STYLE" element was added to the document.', () => {
            ClientLib.createMsgBox();
            document.getElementsByTagName('STYLE').length.should.equal(1, 'length');
          });
          It('Three "DIV" elements were added to the document.', () => {
            document.getElementsByTagName('DIV').length.should.equal(3, 'length');
          });
          It('One of the "DIV" elements has the "popupMsgBox" class.', () => {
            document.getElementsByClassName('popupMsgBox').length.should.equal(1, 'length');
          });
          It('One of the "DIV" elements has the "popupMsgContainer" class.', () => {
            document.getElementsByClassName('popupMsgContainer').length.should.equal(1, 'length');
          });
          It('The configuration parameter "msgContainer" contains the HTMLDivElement.', () => {
            config.runtime.msgContainer.should.is.a('HTMLDivElement');
            config.runtime.msgContainer.className.should.equal('popupMsgContainer');
          });
          It('The configuration parameter "observer" contains the HTMLDivElement.', () => {
            config.runtime.observer.should.is.an('HTMLDivElement');
          });
        });
        Describe('Other logic.', () => {
          BeforeEach(() => {
            document.body.innerHTML = '';
            config.runtime.msgContainer = null;
          });
          It('The configuration parameter "verticalPosition" set to "top".', () => {
            config.popupMsg.verticalPosition = 'top';
            ClientLib.createMsgBox();
            const result = document.getElementsByTagName('STYLE');
            result[0].innerHTML.should.include('top:0px;');
          });
          It('The configuration parameter "showClearTitle" set to "no".', () => {
            config.popupMsg.showClearTitle = false;
            ClientLib.createMsgBox();
            const result = document.getElementsByClassName('popupMsgContainer');
            result[0].hasAttribute('title').should.equal(false, 'has title attribute');
          });
          It('Click on the message list to clear it.', () => {
            ClientLib.createMsgBox();
            const result = document.getElementsByClassName('popupMsgContainer')[0];
            result.innerHTML.should.equal('', 'before message');
            ClientLib.addMessage(['foo', 'master']);
            result.innerHTML.should.include('foo', 'after message');
            result.click();
            result.innerHTML.should.equal('', 'after click');
          });
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('wrapString', () => {
      Describe(Utility.method('method "wrapString()":'), () => {
        It(`Input: "foo" & "#F080BF", returns: string wrapped in the specified color. ${sampleCode('wrapString("foo", "#F080BF");')}`, () => {
          const result = ClientLib.wrapString('foo', '#F080BF');
          result.should.is.a('String');
          result.should.equal('<span style="color: #F080BF">foo</span>');
        });
        It(`Input: "foo" & "", returns: string without colorizing. ${sampleCode('wrapString("foo", "");')}`, () => {
          const result = ClientLib.wrapString('foo', '');
          result.should.is.a('String');
          result.should.equal('foo');
        });
        It(`Input: "" & "#F080BF", returns: empty string value. ${sampleCode('wrapString("", "#F080BF");')}`, () => {
          const result = ClientLib.wrapString('', '#F080BF');
          result.should.is.a('String');
          result.should.equal('');
        });
        It(`Input: "" & "", returns: empty string value. ${sampleCode('wrapString("", "");')}`, () => {
          const result = ClientLib.wrapString('', '');
          result.should.is.a('String');
          result.should.equal('');
        });
        It(`Input: non-string value & non-string value, returns: empty string value. ${sampleCode('wrapString(123, true);')}`, () => {
          const result = ClientLib.wrapString(123, true);
          result.should.is.a('String');
          result.should.equal('');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('highlightAttentions', () => {
      Describe(Utility.method('method "highlightAttentions()":'), () => {
        It(`Input: string without data for highlighting, returns: string without highlights. ${sampleCode('highlightAttentions("Value: String.");')}`, () => {
          const result = ClientLib.highlightAttentions('Value: String.');
          result.should.is.a('String');
          result.should.equal('Value: String.');
        });
        It(`Input: string with data for highlighting, returns: string with highlights. ${sampleCode('highlightAttentions("Value: Null.");')}`, () => {
          const result = ClientLib.highlightAttentions('Value: Null.');
          result.should.is.a('String');
          result.should.equal(`Value: ${ClientLib.wrapString('Null', popupAttentionColor)}.`);
        });
        It(`Input: non-string value, returns: empty string value. ${sampleCode('highlightAttentions(true);')}`, () => {
          const result = ClientLib.highlightAttentions(true);
          result.should.is.a('String');
          result.should.equal('');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('highlightCommas', () => {
      Describe(Utility.method('method "highlightCommas()":'), () => {
        It(`Input: string without data for highlighting, returns: string without highlights. ${sampleCode('highlightCommas("foo bar");')}`, () => {
          const result = ClientLib.highlightCommas('foo bar');
          result.should.is.a('String');
          result.should.equal('foo bar');
        });
        It(`Input: string with data for highlighting, returns: string with highlights. ${sampleCode('highlightCommas("foo, bar");')}`, () => {
          const result = ClientLib.highlightCommas(`foo,${EOL} bar`);
          result.should.is.a('String');
          result.should.equal(`foo${ClientLib.wrapString(`,${EOL}`, popupSlaveColor)} bar`);
        });
        It(`Input: non-string value, returns: empty string value. ${sampleCode('highlightCommas(true);')}`, () => {
          const result = ClientLib.highlightCommas(true);
          result.should.is.a('String');
          result.should.equal('');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('addMessage', () => {
      Describe(Utility.method('method "addMessage()":'), () => {
        Before(() => {
          Utility.storage = {
            container: config.runtime.msgContainer,
          };
          ClientLib.createMsgBox();
        });
        After(() => {
          config.runtime.msgContainer = Utility.storage.container;
        });
        AfterEach(() => {
          config.runtime.msgContainer.innerHTML = '';
        });
        It('Before executing the method the parameter "msgContainer" contains an empty HTMLDivElement.', () => {
          const container = config.runtime.msgContainer;
          container.should.is.a('HTMLDivElement', 'msgContainer');
          container.innerHTML.should.equal('', 'innerHTML');
        });
        It(`Input: an even array with valid colors, result: the colored message is added to the container. ${sampleCode('addMessage(["foo", "master", "bar", "slave"]);')}`, () => {
          const sampleData = [
            'foo', 'master',
            'bar', 'slave',
          ];
          ClientLib.addMessage(sampleData);
          const container = config.runtime.msgContainer.firstChild;
          container.tagName.should.equal('DIV', 'tagName');
          container.className.should.include('popupMsgUnit', 'className');
          container.className.should.include('appendAnimation', 'className');
          container.childNodes.length.should.equal(2, 'childNodes.length');
          container.childNodes[0].tagName.should.equal('SPAN', 'tagName');
          container.childNodes[0].innerHTML.should.include('foo', 'innerHTML');
          container.childNodes[1].tagName.should.equal('SPAN', 'tagName');
          container.childNodes[1].innerHTML.should.include('bar', 'innerHTML');
        });
        It(`Input: an even array with invalid colors, result: a message without a coloring is added to the container. ${sampleCode('addMessage(["foo", "invalid", "bar", "wrong"]);')}`, () => {
          const sampleData = [
            'foo', 'invalid',
            'bar', 'wrong',
          ];
          ClientLib.addMessage(sampleData);
          config.runtime.msgContainer.firstChild.innerHTML.should.equal('foobar', 'innerHTML');
        });
        It(`Input: an odd array with valid colors, result: the message will not be added. ${sampleCode('addMessage(["foo", "master", "bar"]);')}`, () => {
          const sampleData = [
            'foo', 'master', 'bar',
          ];
          ClientLib.addMessage(sampleData);
          config.runtime.msgContainer.innerHTML.should.equal('', 'innerHTML');
        });
        It(`Input: an empty array, result: the message will not be added. ${sampleCode('addMessage([]);')}`, () => {
          ClientLib.addMessage([]);
          config.runtime.msgContainer.innerHTML.should.equal('', 'innerHTML');
        });
        It(`Input: not an array, result: the message will not be added. ${sampleCode('addMessage(true);')}`, () => {
          ClientLib.addMessage(true);
          config.runtime.msgContainer.innerHTML.should.equal('', 'innerHTML');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('popupContainerClear', () => {
      Describe(Utility.method('method "popupContainerClear()":'), () => {
        Before(() => {
          Utility.storage = config.runtime.msgContainer;
          ClientLib.createMsgBox();
          ClientLib.addMessage(['foo', 'master']);
        });
        After(() => {
          config.runtime.msgContainer = Utility.storage;
        });
        It('Before executing the method: the container is not empty.', () => {
          config.runtime.msgContainer.innerHTML.should.include('foo', 'innerHTML');
        });
        It('After the method is executed, the container becomes empty.', () => {
          ClientLib.popupContainerClear();
          config.runtime.msgContainer.innerHTML.should.equal('', 'innerHTML');
        });
        It('If the message container is empty.', () => {
          config.runtime.msgContainer = null;
          ClientLib.popupContainerClear();
          should.equal(config.runtime.msgContainer, null, 'container must be empty');
        });
      });
    });

    //--------------------------------------------------
    testManagement.run('getObserver', () => {
      Describe(Utility.method('method "getObserver()":'), () => {
        Before(() => {
          Utility.storage = config.runtime.observer;
          ClientLib.createMsgBox();
        });
        After(() => {
          config.runtime.observer = Utility.storage;
        });
        It('Before executing the method: the "observer" container must be empty.', () => {
          config.runtime.observer.innerHTML.should.equal('', 'innerHTML');
        });
        It('After the method is executed, the container becomes empty.', () => {
          ClientLib.getObserver();
          const container = config.runtime.observer;
          container.firstChild.tagName.should.equal('DIV', 'tagName');
          container.firstChild.className.should.include('popupMsgObserver', 'className');
          container.firstChild.className.should.include('appendAnimation', 'className');
          container.firstChild.innerHTML.should.equal('', 'innerHTML');
        });
        It('Add a message to the observer.', () => {
          ClientLib.getObserver().innerText = 'foo';
          const container = config.runtime.observer;
          container.firstChild.innerHTML.should.equal('foo', 'innerHTML');
        });
        It('Click on the message to clear observer.', () => {
          const container = config.runtime.observer;
          container.style.display.should.equal('block');
          container.click();
          container.style.display.should.equal('none');
        });
      });
    });
  });
});

