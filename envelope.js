
var buffer = require( './lib/buffer' )

function Envelope( mail ) {
  
  if( !(this instanceof Envelope) )
    return new Envelope( mail )
  
  this.header = null
  this.body   = null
  
  if( mail != null ) {
    this.parse( mail )
  }
  
}

Envelope.Header = require( './lib/header' )
Envelope.Body   = require( './lib/body' )

Envelope.parse = function( mail ) {
  return new Envelope( mail )
}

Envelope.prototype = {
  
  parse: function( source ) {
    
    if( !Buffer.isBuffer( source ) ) {
      source = new Buffer( source )
    }
    
    var boundary = buffer.indexOf(
      new Buffer( "\r\n\r\n" ),
      source
    )
    
    var header = source.slice( 0, boundary )
    var body   = source.slice( boundary )
    
    this.header = new Envelope.Header( header )
    // this.body   = new Envelope.Body( body )
    this.body   = body
    
  },
  
}

module.exports = Envelope
