
var fs = require( 'fs' )
var envelope = require( __dirname + '/../' )

var tests = fs.readdirSync( __dirname )

tests.forEach( function( path ) {
  if( path === 'index.js' ) { return }
  console.log( '---------------------------------------------------------------' )
  console.log( path )
  console.log( '---------------------------------------------------------------' )
  var e = new envelope(
    fs.readFileSync( __dirname + '/' + path )
  )
  console.log( e )
})
