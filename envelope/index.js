
function Envelope() {
  
  if( !(this instanceof Envelope) )
    return new Envelope()
  
  this.body = new Envelope.Part()
  this.header = this.body.header
  
}

// Exports
module.exports = Envelope

Envelope.Header = require( './header' )
Envelope.Part = require( './part' )
// Envelope.Parser = require( './parser' )

Envelope.create = function() {
  return new Envelope()
}

Envelope.parse = function( value ) {
  return new Envelope().parse( value )
}

/**
 * Envelope prototype
 * @type {Object}
 */
Envelope.prototype = {
  
  constructor: Envelope,
  
  get attachments() {
    
    var attachments = []
    var parts = this.body.parts
    
    function fetch( parts ) {
      var attachments = []
      for( var i = 0; i < parts.length; i++ ) {
        if( parts[i].isAttachment ) {
          attachments.push( parts[i] )
        } else {
          attachments = attachments.concat(
            fetch( parts[i].parts )
          )
        }
      }
      return attachments
    }
    
    attachments = fetch( parts )
    
    return attachments
    
  },
  
  // Parsing
  
  parse: function( value ) {
    this.body.parse( value )
    return this
  },
  
  // Accessors
  
  getHeader: function( field ) {
    return this.header.get( field )
  },
  
  setHeader: function( field, value ) {
    this.header.set( field, value )
    return this
  },
  
  getPart: function( id ) {
    
    var n = id.split( /^\d/g )
    var i, part = this.body
    
    while( (i = n.shift()) != null ) {
      if( part[i] instanceof Envelope.Part ) {
        part = part[i]
      } else {
        return null
      }
    }
    
    return part
    
  },
  
  // Convenience
  
  id: function( value ) {
    this.header.set( 'Message-Id', value )
    return this
  },
  
  from: function( name, address ) {
    this.header.set( 'From', {
      name: name, address: address
    })
    return this
  },
  
  to: function( name, address ) {
    this.header.set( 'To', {
      name: name, address: address
    })
    return this
  },
  
  cc: function( name, address ) {
    this.header.set( 'CC', {
      name: name, address: address
    })
    return this
  },
  
  bcc: function( name, address ) {
    this.header.set( 'BCC', {
      name: name, address: address
    })
    return this
  },
  
  inReplyTo: function( value ) {
    this.header.set( 'In-Reply-To', value )
    return this
  },
  
  subject: function( value ) {
    this.header.set( 'Subject', value )
    return this
  },
  
  // Content
  
  text: function( value, props ) {
    return this
  },
  
  attach: function( value, props ) {
    return this
  },
  
  // Middleware
  
  apply: function( fn, done ) {
    
    if( fn.length > 1 ) {
      // async
    } else {
      // sync
    }
    
    return this
    
  },
  
  // Serialization
  
  toJSON: function() {
    return JSON.stringify( this, null, 2 )
  },
  
  toString: function( encoding ) {
    return this.body.toString( encoding )
  }
  
}
