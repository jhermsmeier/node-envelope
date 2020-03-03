const bench = require( 'nanobench' )
const fs = require( 'fs' )
const path = require( 'path' )
const Envelope = require( '..' )

const ITERATIONS = 1000

const dirname = path.join( __dirname, '..', 'test', 'data' )

const emails = fs.readdirSync( dirname )
  .filter( function( filename ) {
    return /\.txt$/.test( filename )
  }).map( function( filename ) {
    return path.join( dirname, filename )
  })

emails.forEach( function( filename ) {

  bench( `${path.basename( filename )} ⨉ ${ITERATIONS}`, function( run ) {
    const buffer = fs.readFileSync( filename )
    run.start()
    for( let i = 0; i < ITERATIONS; i++ ) {
      new Envelope( buffer )
    }
    run.end()
  })

})
