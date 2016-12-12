var assert = require( 'assert' )
var tools = require( './tools' )
var Envelope = require( '..' )

suite( 'Envelope', function() {

  suite( 'Issue #13', function() {

    test( 'should not remove newlines or linefeeds from qp encoded body', function() {
      var data = tools.read( 'issues/13' )
      var mail = new Envelope( data )
      assert.ok( mail['0']['0'].indexOf( '\r\n' ) >= 0 )
    })

  })

})
