var Envelope = require( '../' )

var read = require( 'fs' ).readFileSync

var email = Envelope.parse(
  read( __dirname+'/../test/data/outlook-2007.txt' )
)

suite( 'Envelope', function() {
  
  bench( 'toString', function() {
    var value = email.toString()
  })
  
  // bench( 'toJSON', function() {
  //   var value = email.toJSON()
  // })
  
})

suite( 'Header', function() {
  
  bench( 'toString', function() {
    var value = email.header.toString()
  })
  
  // bench( 'toJSON', function() {
  //   var value = email.header.toJSON()
  // })
  
})

suite( 'Body', function() {
  
  bench( 'toString', function() {
    var value = email.body.toString()
  })
  
  // bench( 'toJSON', function() {
  //   var value = email.body.toJSON()
  // })
  
})
