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

  context( '#22', function() {

    specify( 'should parse the "Subject" header correctly', function() {
      var header = `Subject: =?utf-8?B?QVc6IEdyb8OfZSBHZWJ1cnRzdGFncy1QYXJ0eSBpbSBN?=\r\n\t=?utf-8?B?YWkgKGljaCBmZWllcmUgbmFjaHRyw6RnbGljaCkh?=\r\n\r\n`
      var mail = new Envelope( header )
      assert.strictEqual( mail.header.get( 'subject' ), 'AW: Große Geburtstags-Party im Mai (ich feiere nachträglich)!' )
    })

  })

  context( '#23', function() {

    specify( 'should parse the "From" header correctly', function() {
      var header = 'From: "Almaifd, Tim" <T.Almaifd@redacted.com>\r\n\r\n'
      var mail = new Envelope( header )
      assert.deepEqual( mail.header.get( 'from' ), [
        { name: 'Almaifd, Tim', address: 'T.Almaifd@redacted.com' },
      ])
    })

  })

})
