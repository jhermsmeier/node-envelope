var assert = require( 'assert' )
var fs = require( 'fs' )
var path = require( 'path' )
var Envelope = require( '..' )

describe( 'Issues', function() {

  context( '#13', function() {

    specify( 'should not remove newlines or linefeeds from qp encoded body', function() {
      var filename = path.join( __dirname, 'data', 'issues', '13.txt' )
      var data = fs.readFileSync( filename )
      var mail = new Envelope( data )
      assert.ok( mail['0'].body.indexOf( '\r\n' ) >= 0 )
    })

  })

})
