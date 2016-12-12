/**
 * Envelope
 * @param {String|Buffer} mail
 */
function Envelope( mail ) {

  if( !(this instanceof Envelope) )
    return new Envelope( mail )

  mail = mail.toString()

  var boundary = mail.indexOf( '\r\n\r\n' )

  if( !~boundary ) {
    boundary = boundary < 0 ? 0 : boundary
  }

  this.header = new Envelope.Header(
    mail.slice( 0, boundary )
  )

  Envelope.Body.call(
    this, this.header,
    mail.slice( boundary )
  )

}

Envelope.prototype = Object.create( null )

Envelope.Header = require( './header' )
Envelope.Body   = require( './body' )

module.exports = Envelope
