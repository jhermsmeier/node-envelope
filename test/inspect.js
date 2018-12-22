var util = require( 'util' )

function inspect( value ) {
  return util.inspect( value, inspect.options )
}

inspect.options = {
  depth: null,
  colors: process.stdout.isTTY,
}

inspect.log = function( value ) {
  process.stdout.write( inspect( value ) )
  process.stdout.write( '\n' )
}

module.exports = inspect
