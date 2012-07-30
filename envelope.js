
var buffer = require( './lib/buffer' )

function Envelope( mail ) {
  
  if( !(this instanceof Envelope) )
    return new Envelope( mail )
  
  this.original = mail
  this.header   = {}
  this.body     = {}
  
  if( mail != null ) {
    this.parse()
  }
  
}

Envelope.Header = require( './lib/header' )
Envelope.Body   = require( './lib/body' )

Envelope.parse = function( mail ) {
  return new Envelope( mail )
}

Envelope.prototype = {
  
  parse: function( source ) {
    
    if( source != null ) {
      this.original = source
    }
    
    if( !Buffer.isBuffer( this.original ) ) {
      this.original = new Buffer( this.original )
    }
    
    var boundary = buffer.indexOf(
      new Buffer( "\r\n\r\n" ),
      this.original
    )
    
    var header = this.original.slice( 0, boundary )
    var body   = this.original.slice( boundary )
    
    this.header = new Envelope.Header( header )
    // this.body   = new Envelope.Body
    this.body   = body
    
  },
  
}

module.exports = Envelope
