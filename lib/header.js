var contentType = require( 'content-type' )
var contentDisposition = require( 'content-disposition' )
var qp = require( './quoted-printable' )
var Contact = require( './contact' )

/**
 * @extends {Map}
 */
class Header extends Map {

  /**
   * Create a new envelope header
   * @param {...[any, any]} argv
   */
  constructor( ...argv ) {

    super( ...argv )

    /** @type {Array<Array<string>>} Raw headers */
    this.raw = []

    Object.defineProperty( this, 'raw', {
      enumerable: false,
    })

  }

  /**
   * Parse an email message header
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @param {Number} [length]
   * @returns {Header}
   */
  static parse( buffer, offset, length ) {
    return new Header().parse( buffer, offset, length )
  }

  /* eslint-disable no-unused-vars */
  /**
   * @param {Header} header
   */
  static format( header ) {
    throw new Error( 'Not implemented' )
  }
  /* eslint-enable no-unused-vars */

  /**
   * Parse an email message header
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @param {Number} [length]
   * @returns {Header}
   */
  parse( buffer, offset = 0, length ) {
    var headers = buffer.toString( 'utf8', offset, length ? offset + length : undefined )
      .replace( /\r\n\s+/g, ' ' )
      .split( /\r\n/g )

    this.raw = headers.map(( line ) => {
      var eof = line.indexOf( ':' )
      if( eof === -1 ) {
        throw new Error( 'Invalid header – missing ":" delimiter' )
      }
      var field = line.slice( 0, eof )
      var value = line.slice( eof + 1 ).trim()
      return [ field, value ]
    })

    this.raw.forEach(( header ) => {

      var field = header[0].toLowerCase()
      var newValue = null

      switch( field ) {
        case 'content-type':
          newValue = contentType.parse( header[1] )
          break
        case 'content-disposition':
          newValue = contentDisposition.parse( header[1] )
          break
        case 'bcc':
        case 'cc':
        case 'from':
        case 'reply-to':
        case 'return-path':
        case 'sender':
        case 'to':
          newValue = header[1].split( ',' ).map( Contact.parse )
          break
        case 'subject':
          try {
            newValue = qp.decodeWord( header[1], true )
          } catch( e ) {
            newValue = header[1]
          }
          break
        default: newValue = header[1]; break
      }

      if( this.has( field ) ) {
        var value = this.get( field )
        if( Array.isArray( value ) ) {
          value.push( newValue )
        } else {
          this.set( field, [ value, newValue ] )
        }
      } else {
        this.set( field, newValue )
      }

    })

    return this

  }

  toString() {
    return Header.format( this )
  }

}

module.exports = Header
