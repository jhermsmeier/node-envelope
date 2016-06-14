var tools = module.exports

tools.read = function read( name ) {
  var fs = require( 'fs' )
  return fs.readFileSync( __dirname + '/data/' + name + '.txt' )
}
