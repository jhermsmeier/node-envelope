var Envelope = require( '../' )

var read = require( 'fs' ).readFileSync

suite( 'set header', function() {
  
  var email = new Envelope()
  
  bench( 'setHeader(), cardinality 1', function() {
    email.setHeader( 'from', 'Jonas Hermsmeier <jhermsmeier@gmail.com>' )
  })
  
  bench( 'header.set, cardinality 1', function() {
    email.header.set( 'from', 'Jonas Hermsmeier <jhermsmeier@gmail.com>' )
  })
  
  bench( 'setHeader(), cardinality *', function() {
    email.setHeader( 'received', 'with ESMTP' )
  })
  
  bench( 'header.set, cardinality *', function() {
    email.header.set( 'received', 'with ESMTP' )
  })
  
})

suite( 'get header', function() {
  
  var email = new Envelope()
  email.setHeader( 'from', 'Jonas Hermsmeier <jhermsmeier@gmail.com>' )
  email.setHeader( 'received', 'with ESMTP' )
  email.setHeader( 'received', 'with SMTP' )
  email.setHeader( 'from', 'Jonas Hermsmeier <jhermsmeier@gmail.com>' )
  
  bench( 'getHeader(), cardinality 1', function() {
    var value = email.getHeader( 'from' )
  })
  
  bench( 'header.get, cardinality 1', function() {
    var value = email.header.get( 'from' )
  })
  
  bench( 'getHeader(), cardinality *', function() {
    var value = email.getHeader( 'received' )
  })
  
  bench( 'header.get, cardinality *', function() {
    var value = email.header.get( 'received' )
  })
  
  bench( 'getHeader(), cardinality 1', function() {
    var value = email.getHeader( 'from' )
  })
  
  bench( 'header.get, cardinality 1', function() {
    var value = email.header.get( 'from' )
  })
  
})
