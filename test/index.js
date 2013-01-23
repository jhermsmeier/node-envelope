
var fs = require( 'fs' )
var util = require( 'util' )
var envelope = require( __dirname + '/../' )

var tests = fs.readdirSync( __dirname )

tests.forEach( function( path ) {
  if( path === 'index.js' ) { return }
  console.log( '\n---------------------------------------------------------------' )
  console.log( path )
  console.log( '---------------------------------------------------------------' )
  var e = new envelope(
    fs.readFileSync( __dirname + '/' + path )
  )
  process.stdout.write(
    util.inspect( e, false, null, true )
  )
})
