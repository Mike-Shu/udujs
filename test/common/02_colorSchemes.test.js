// Dependencies.
const mocha = require('mocha');

// Module for testing and helper set.
const colorSchemes = require('../../lib/colorScheme');
const Utility = require('../misc/utility');

// Tools.
const Describe = mocha.describe;
const It = mocha.it;

// Test management: useful for debugging to enable or disable test sets.
Utility.managementFor('server');
const testManagement = Utility.testManagement([
  'fileExists',
  'schemes',
]);

Utility.run('colorSchemes', () => {
  Describe(Utility.name('Set of color schemes'), () => {
    testManagement.run('fileExists', () => {
      It('The file exists and contains the object.', () => {
        colorSchemes.should.is.an('Object');
      });
    });
    testManagement.run('schemes', () => {
      const schemePattern = {
        console: {
          schemes: [
            'dark',
            'bright',
            'custom',
          ],
          properties: [
            'heading',
            'master',
            'slave',
            'attention',
          ],
        },
        popup: {
          schemes: [
            'dark',
            'bright',
            'custom',
          ],
          properties: [
            'background',
            'border',
            'appendBG',
            'hoverBG',
            'master',
            'slave',
            'attention',
          ],
        },
        server: {
          schemes: [
            'dark',
            'bright',
            'custom',
          ],
          properties: [
            'heading',
            'master',
            'slave',
            'attention',
          ],
        },
      };

      Object.keys(schemePattern).forEach((section) => {
        Describe(Utility.method(`Checking "${section}" schemes:`), () => {
          It(`env "${section}"`, () => {
            colorSchemes.should.have.property(section);
          });
          schemePattern[section].schemes.forEach((scheme) => {
            It(`scheme "${scheme}"`, () => {
              colorSchemes[section].should.have.property(scheme);
            });
            Describe(`${scheme}:`, () => {
              schemePattern[section].properties.forEach((property) => {
                It(`${property}`, () => {
                  colorSchemes[section][scheme].should.have.property(property);
                });
              });
            });
          });
        });
      });
    });
  });
});
