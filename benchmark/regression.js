var read = require( 'fs' ).readFileSync

var outlook = read( __dirname+'/../test/data/outlook-2007.txt' )
var mid = read( __dirname+'/../test/data/the-gamut.txt' )
var big = read( __dirname+'/../test/data/testcase1.txt' )
var utf8 = read( __dirname+'/../test/data/outlook-2007.txt', 'utf8' )
var chinese = read( __dirname+'/../test/data/chinesemail.txt' )

function create( path ) {
  
  return function() {
    
    var Envelope = require( path )
    
    bench( 'Ctor', function() {
      var email = new Envelope()
    })
    
    bench( 'Ctor.parse( string ) [3KB]', function() {
      var email = Envelope.parse( utf8 )
    })
    
    bench( 'Ctor.parse( buffer ) [3KB]', function() {
      var email = Envelope.parse( outlook )
    })
    
    bench( 'Ctor.parse( buffer ) [11KB]', function() {
      var email = Envelope.parse( mid )
    })
    
    bench( 'Ctor.parse( buffer ) [266KB]', function() {
      var email = Envelope.parse( big )
    })
    
    bench( 'Ctor.parse( buffer ) [chinese, 5KB]', function() {
      var email = Envelope.parse( chinese )
    })
    
    bench( 'Header.parse( buffer ) [3KB]', function() {
      var email = new Envelope.Header()
        .parse( outlook )
    })
    
    if( Envelope.version == null ) {
      bench( 'Part.parse( buffer ) [3KB]', function() {
        var email = Envelope.Part.parse( outlook )
      })
      bench( 'Part.parse( buffer ) [chinese, 5KB]', function() {
        var email = Envelope.Part.parse( chinese )
      })
    }
    
    // var outlookmail = Envelope.parse( outlook )
    // var utf8mail = Envelope.parse( utf8 )
    // var chinesemail = Envelope.parse( chinese )
    
    // bench( 'env.toString()', function() {
    //   var str = outlookmail.toString()
    // })
    
    // bench( 'env.toString( encoding )', function() {
    //   var str = utf8mail.toString( 'ascii' )
    // })
    
    // bench( 'env.toString() [chinese]', function() {
    //   var str = chinesemail.toString()
    // })
    
  }
}

// suite( 'Envelope (previous)', create( '../' ) )
suite( 'Envelope (current)', create( '../' ) )
