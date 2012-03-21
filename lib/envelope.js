
var buffer = require( './buffer' );

var envelope = {
  route: require( './route' ),
  header: require( './header' )
};

module.exports = (function() {
  
  'use strict';
  
  function Envelope( mail ) {
    
    if( !(this instanceof Envelope) )
      return new Envelope( mail );
    
    this.route  = null;
    this.header = null;
    this.body   = null;
    
    this.parse( mail );
    
  }
  
  Envelope.prototype = {
    
    /**
     * [parse description]
     * 
     * @param  {Buffer} mail
     * @return {Null} 
     */
    parse: function( mail ) {
      
      if( mail == null ) return;
      
      if( !Buffer.isBuffer( mail ) )
        mail = new Buffer( mail );
      
      var boundary, header, body;
      
      boundary = new Buffer( "\r\n\r\n" );
      boundary = buffer.indexOf( boundary, mail );
      
      header = mail.slice( 0, boundary );
      body   = mail.slice( boundary );
      
      header = header.toString( 'ascii' );
      header = header.replace( /\r\n\s+/g, ' ' );
      header = header.split( "\r\n" );
      
      this.route = new envelope.route( header );
      this.header = new envelope.header( header );
      this.body = body;
      
    },
    
    toString: function() {
      // TODO:
      // Return a RFC compliant textual
      // representation of the mail body.
    },
    
    valueOf: function() {
      // TODO:
      // Return a simple structured
      // object for easy and quick use.
    }
    
  };
  
  return Envelope;
  
})();
