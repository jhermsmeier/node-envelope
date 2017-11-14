var util = require( 'util' )

function inspect( value ) {
  return util.inspect( value, inspect.options )
}

inspect.options = {
  colors: process.stdout.isTTY,
  depth: null,
}

inspect.print = function( value ) {
  process.stdout.write( inspect( value ) )
  process.stdout.write( '\n' )
}

module.exports = inspect
