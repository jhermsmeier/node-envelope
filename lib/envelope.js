
module.exports = (function() {
  
  'use strict';
  
  function Envelope( mail ) {
    
    if( !(this instanceof Envelope) )
      return new Envelope( mail );
    
    if( (this.mail = mail) != null )
      Envelope.parse.call( this );
    
    this.mail = null;
    delete this.mail;
    
  }
  
  Envelope.parse = function( mail ) {
    
    if( !(this instanceof Envelope) )
      return new Envelope( mail );
    
    if( !Buffer.isBuffer( this.mail ) )
      this.mail = new Buffer( this.mail );
    
    require( './route' ).call( this );
    require( './header' ).call( this );
    require( './body' ).call( this );
    
  };
  
  Envelope.prototype = {
    
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
