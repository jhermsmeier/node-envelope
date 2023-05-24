var util = require( 'util' )

/**
 * @param {any} value
 * @returns {string}
 */
function inspect( value ) {
  return util.inspect( value, inspect.options )
}

inspect.options = {
  depth: null,
  colors: process.stdout.isTTY,
}

/**
 * @param {any} value
 * @returns {void}
 */
inspect.log = function( value ) {
  process.stdout.write( inspect( value ) )
  process.stdout.write( '\n' )
}

module.exports = inspect
