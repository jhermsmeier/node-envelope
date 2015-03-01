var fs = require( 'fs' )
var util = require( 'util' )
var Envelope = require( '..' )

var tests = fs.readdirSync( __dirname + '/data/' )

tests.forEach( function( path ) {
  if( path === 'index.js' ) { return }
  console.log( '\n---------------------------------------------------------------' )
  console.log( path )
  console.log( '---------------------------------------------------------------' )
  var e = new Envelope(
    fs.readFileSync( __dirname + '/data/' + path )
  )
  process.stdout.write(
    util.inspect( e, false, null, true )
  )
  console.log( '' )
})
