var assert = require( 'assert' )
var fs = require( 'fs' )
var path = require( 'path' )
var Envelope = require( '..' )
var inspect = require( './inspect' )

suite( 'Envelope', function() {

  suite( 'Issue #13', function() {

    test( 'should not remove newlines or linefeeds from qp encoded body', function() {
      var filename = path.join( __dirname, 'data', 'issues', '13.txt' )
      var data = fs.readFileSync( filename )
      var mail = new Envelope( data )
      inspect.print( mail )
      assert.ok( mail['0']['0'].indexOf( '\r\n' ) >= 0 )
    })

  })

})
