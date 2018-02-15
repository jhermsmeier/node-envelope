/**
 * Envelope
 * @param {String|Buffer} mail
 */
function Envelope( mail ) {

  if( !(this instanceof Envelope) )
    return new Envelope( mail )

  mail = mail.toString()

  var parts = mail.replace('\r\n', '\n').split('\n\n');

  // if( !~boundary ) {
  //   boundary = boundary < 0 ? 0 : boundary
  // }

  this.header = new Envelope.Header(
    parts.shift()
  )

  Envelope.Body.call(
    this, this.header,
    parts.join('\n')
  )

}

Envelope.prototype = Object.create( null )

Envelope.Header = require( './header' )
Envelope.Body   = require( './body' )

module.exports = Envelope
