var Stream = require( 'stream' )
var Envelope = require( './' )

/**
 * Parser constructor
 * @param {Object} options
 */
function Parser( options ) {
  
  if( !(this instanceof Parser) )
    return new Parser( options )
  
  // Inherit from Transform stream
  Stream.Transform.call( this, options )
  
  this.options = options || {}
  
  this._buffer = new Buffer( 0 )
  this._position = 0
  
  this._envelope = new Envelope()
  
  this._headerComplete = false
  this._messageComplete = false
  
}

// Exports
module.exports = Parser

/**
 * Parser prototype
 * @type {Object}
 */
Parser.prototype = {
  
  /**
   * Constructor
   * @type {Function}
   */
  constructor: Parser,
  
  /**
   * Reinitializes the parser to it's initial state
   * @return {Parser}
   */
  reinitialize: function() {
    return this.constructor.call(
      this, this.options
    )
  },
  
  _indexOf: function( byte ) {
    
    for( var i = 0; i < this._buffer.length; i++ ) {
      if( this._buffer[i] === byte ) {
        return i
      }
    }
    
    return -1
    
  },
  
  _indexOfEOH: function() {
    
    if( this._buffer.length < 2 )
      return -1
    
    var i = this._position
    
    for( ; i < this._buffer.length; i++ ) {
      if( this._buffer.readUInt32BE( i ) === 0x0D0A0D0A ) {
        return i
      }
    }
    
    return -1
    
  },
  
  /**
   * Stream transform enty point
   * @param  {Buffer}   chunk
   * @param  {String}   encoding
   * @param  {Function} done
   */
  _transform: function( chunk, encoding, done ) {
    
    console.log( chunk.length, chunk )
    
    if( this._buffer.length === 0 ) {
      this._buffer = chunk
    } else {
      this._buffer = Buffer.concat([
        this._buffer, chunk
      ])
    }
    
    if( !this._headerComplete ) {
      
      var EOH = this._indexOfEOH()
      if( ~EOH ) {
        
        this._envelope.header.parse(
          this._buffer.toString( 'utf8', 0, EOH )
        )
        
        this._headerComplete = true
        this._buffer = this._buffer.slice( EOH + 4 )
        this.emit( 'header', this._envelope.header )
        
      }
      
    }
    
    if( !this._messageComplete ) {
      
      console.log( this._envelope.header )
      
      
    } else {
      // End the stream
      this.push( null )
    }
    
    done()
    
  }
  
}

// Inherit from Transform stream
Parser.prototype.__proto__ =
  Stream.Transform.prototype
