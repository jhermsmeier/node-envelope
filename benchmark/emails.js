var bench = require( 'nanobench' )
var fs = require( 'fs' )
var path = require( 'path' )
var Envelope = require( '..' )

var ITERATIONS = 1000

var dirname = path.join( __dirname, '..', 'test', 'data' )

var emails = fs.readdirSync( dirname )
  .filter( function( filename ) {
    return /\.txt$/.test( filename )
  }).map( function( filename ) {
    return path.join( dirname, filename )
  })

emails.forEach( function( filename ) {

  bench( `${path.basename( filename )} ⨉ ${ITERATIONS}`, function( run ) {
    var buffer = fs.readFileSync( filename )
    run.start()
    for( var i = 0; i < ITERATIONS; i++ ) {
      new Envelope( buffer )
    }
    run.end()
  })

})
