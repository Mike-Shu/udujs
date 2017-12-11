/**
 * Entry point.
 * Returns the module depending on the environment: server-side, or client-side.
 */
module.exports = ((typeof process === 'object') && (typeof process.release === 'object') && (process.release.name === 'node'))
  ? require('./Server')
  : require('./Client');
