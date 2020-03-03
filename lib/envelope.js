const iconv = require( 'iconv-lite' )
const qp = require( './quoted-printable' )

const EOH = Buffer.from( '\r\n\r\n', 'ascii' )

class Envelope extends Array {

  /**
   * Create a new Envelope
   * @extends {Array}
   * @param {Buffer|String} [value]
   * @returns {Envelope}
   */
  constructor( value ) {

    super()

    this.header = new Envelope.Header()
    this.body = null

    if( value ) {
      this.parse( value )
    }

  }

  /**
   * Parse an email
   * @param {Buffer|String} buffer
   * @param {Number} [offset=0]
   * @param {Number} [length]
   * @returns {Envelope}
   */
  static parse( buffer, offset, length ) {
    return new Envelope().parse( buffer, offset, length )
  }

  /**
   * Whether it is a multipart message
   * @return {Boolean} [description]
   */
  get isMultipart() {
    const content = this.header.get( 'content-type' )
    return content && content.type.startsWith( 'multipart' )
  }

  // TODO: Generalize this further, so it can also be used by `.getAttachments()`
  getContent( type, withDisposition = true ) {

    if( !this.isMultipart ) {
      const content = this.header.get( 'content-type' )
      const hasDisposition = withDisposition && this.header.has( 'content-disposition' )
      return content && !hasDisposition && content.type === type ?
        this.body : null
    }

    for( let i = 0; i < this.length; i++ ) {
      const content = this[i].header.get( 'content-type' )
      const hasDisposition = withDisposition && this[i].header.has( 'content-disposition' )
      if( content && !hasDisposition && content.type === type ) {
        return this[i].body
      }
    }

    return null

  }

  /**
   * Get the plaintext part of a message
   * @returns {String}
   */
  getText() {
    return this.getContent( 'text/plain', false )
  }

  /**
   * Get the HTML part of a message
   * @returns {String}
   */
  getHTML() {
    return this.getContent( 'text/html', false )
  }

  /**
   * Get all attachments contained in the message
   * @param {Boolean} [withInline=true] - Whether to include inline attachments
   * @returns {Array<Envelope>}
   */
  getAttachments( withInline = true ) {

    const attachments = []

    if( !this.isMultipart ) {
      return attachments
    }

    for( let i = 0; i < this.length; i++ ) {
      const disposition = this[i].header.get( 'content-disposition' )
      if( disposition ) {
        const isAttachment = withInline ?
          disposition.type === 'attachment' || disposition.type === 'inline' :
          disposition.type === 'attachment'
        if( isAttachment ) {
          attachments.push( this[i] )
        }
      } else if( this[i].isMultipart ) {
        attachments.push( ...this[i].getAttachments() )
      }
    }

    return attachments

  }

  /**
   * Parse an email
   * @param {Buffer|String} buffer
   * @param {Number} [offset=0]
   * @param {Number} [length]
   * @returns {Envelope}
   */
  parse( buffer, offset, length ) {

    offset = offset || 0
    length = length || buffer.length

    buffer = Buffer.isBuffer( buffer ) ?
      buffer : Buffer.from( buffer )

    const eoh = buffer.indexOf( EOH, offset )
    if( eoh === -1 || ( eoh > ( offset + length )) ) {
      throw new Error( 'Missing header' )
    }

    this.header.clear()
    this.header.parse( buffer, offset, eoh - offset )

    const content = this.header.get( 'content-type' )
    if( content && /^multipart\//i.test( content.type ) && content.parameters.boundary != null ) {

      const {boundary} = content.parameters
      const boundaryLength = Buffer.byteLength( boundary ) + 4
      const boundaryStart = '--' + boundary + '\r\n'
      const boundaryEnd = '--' + boundary + '--'

      let boundaryOffset = buffer.indexOf( boundaryStart, eoh + EOH.length )
      let boundaryOffsetEnd = buffer.lastIndexOf( boundaryEnd, offset + length )

      if( boundaryOffset === -1 ) {
        throw new Error( 'Missing specified multipart boundary in message body' )
      }

      boundaryOffsetEnd = boundaryOffsetEnd !== -1 ?
        Math.min( boundaryOffsetEnd, offset + length ) :
        offset + length

      let i = 0
      const regions = []
      let start = boundaryOffset

      while( !!~boundaryOffset && boundaryOffset < boundaryOffsetEnd ) {
        if( ++i & 1 ) {
          start = boundaryOffset + boundaryLength
        } else {
          regions.push([ start, boundaryOffset ])
          start = boundaryOffset + boundaryLength
        }
        boundaryOffset = buffer.indexOf( boundaryStart, boundaryOffset + 1 )
      }

      regions.push([ start, boundaryOffsetEnd ])

      regions.forEach(( region ) => {
        if( region[0] >= region[1] ) {
          // This happens for messages with a start boundary marker as
          // an ending boundary marker (i.e. broken last boundary);
          return
        }
        const part = new Envelope().parse( buffer, region[0], region[1] - region[0] )
        // this.parts.set( this.parts.size, part )
        this.push( part )
      })

    } else {
      const part = Buffer.alloc( length - ( eoh + EOH.length - offset ) )
      buffer.copy( part, 0, eoh + EOH.length )
      // this.parts.set( this.parts.size, part )
      if( content && content.type.startsWith( 'text' ) && content.parameters.charset ) {
        if( /quoted-printable/i.test( this.header.get( 'content-transfer-encoding' ) ) ) {
          this.body = qp.decode( part, content.parameters.charset )
        } else if( iconv.encodingExists( content.parameters.charset ) ) {
          this.body = iconv.decode( part, content.parameters.charset )
        } else {
          this.body = part
        }
      } else {
        this.body = part
      }
    }

    return this

  }

}

Envelope.Header = require( './header' )

// Exports
module.exports = Envelope
