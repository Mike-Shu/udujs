// Dependencies.
const UduJS = require('../Server');
const Misc = require('./misc');

const Debug = new UduJS({
  consoleEOL: '\r\n',
});
const someCode = Misc.doSomeCode;

// View the value of some variable.
Debug.log(Misc.multiObject, 'Friday\'s party.');

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
