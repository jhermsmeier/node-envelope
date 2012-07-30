
var buffer = require( './lib/buffer' )

/**
 * Envelope
 * @param {String|Buffer} mail
 */
function Envelope( mail ) {
  
  if( !(this instanceof Envelope) )
    return new Envelope( mail )
  
  var boundary
  
  if( !Buffer.isBuffer( mail ) )
    mail = new Buffer( mail )
  
  boundary = new Buffer( "\r\n\r\n" )
  boundary = buffer.indexOf( boundary, mail )
  
  this.header = new Envelope.Header(
    mail.slice( 0, boundary )
  )
  
  // this.body = new Envelope.Body(
  //   mail.slice( boundary )
  // )
  
  this.body = mail.slice( boundary )
  
}

Envelope.Header = require( './lib/header' )
Envelope.Body   = require( './lib/body' )

Envelope.parse = function( mail ) {
  return new Envelope( mail )
}

/**
 * Envelope prototype
 * @type {Object}
 */
Envelope.prototype = {
  
}

module.exports = Envelope
