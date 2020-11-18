const Misc = require('./misc');

// eslint-disable-next-line no-undef
const Debug = new UduJS({
  maxWidth: 'auto',
  showClearTitle: false,
  consoleColorScheme: 'bright',
});
const allTypes = Misc.allTypesObject;
const someCode = Misc.doSomeCode;
const party = Misc.multiObject;

// View the value of some variable.
Debug.log(party, 'Friday\'s party.');

// Measurement with control points.
Debug.rttPoint();
someCode();
Debug.rttPoint('Some code was executed.');
someCode();
Debug.rttPoint('More code.');

// A single measurement.
Debug.rttStart('Single testing of some code.');
someCode();
Debug.rttFinish();

// A single measurement with the calculation of the average result.
Debug.rttAverage(someCode, 10, 'The average execution time of some code.', true);

// A pop-up message with a value of some variable.
Debug.popup('Some variable.');

// The message either to the console or to a pop-up message (specified in the config).
Debug.show(party, 'Friday\'s party.');

// A fixed field in a pop-up message with debugging information.
const someVariable = 123;
Debug.observer(someVariable);

// An example of interaction with the interface.
$(document).ready(() => {
  let numberOfClicks = 0;
  $('button#addTestString').on('mouseover', () => {
    Debug.observer(`Number of clicks: ${numberOfClicks}`);
  }).on('mouseleave', () => {
    Debug.observer('The add button has lost focus.');
  }).on('click', () => {
    Debug.show(`${$('textarea#textField').val()} #${numberOfClicks += 1}`);
  });
  $('button#addTestObject').on('click', () => {
    Debug.show(allTypes);
    numberOfClicks += 1;
  });
  $('button#toConsole').on('click', () => {
    Debug.log(allTypes);
    numberOfClicks += 1;
  });
  $('button#clearPopup').on('click', () => {
    Debug.popupReset();
    numberOfClicks += 1;
  });
});
