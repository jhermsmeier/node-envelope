var assert = require( 'assert' )
var fs = require( 'fs' )
var path = require( 'path' )
var Envelope = require( '..' )
var inspect = require( './inspect' )

suite( 'Envelope', function() {

  suite( '.parse()', function() {

    var ls = fs.readdirSync( path.join( __dirname, 'data' ) )
      .map( function( filename ) {
        filename = path.join( __dirname, 'data', filename )
        return {
          name: path.basename( filename ),
          path: filename,
          stats: fs.statSync( filename ),
        }
      })
      .filter( function( file ) {
        return file.stats.isFile()
      })

    ls.forEach( function( file ) {
      test( file.name, function() {
        var data = fs.readFileSync( file.path )
        var mail = new Envelope( data )
        inspect.print( mail )
      })
    })

  })

})
