
module.exports = {
  
  /**
   * [encodeQP description]
   * 
   * @param  {String} input 
   * @param  {Boolean} multibyte 
   * @param  {Boolean} wordMode 
   * @return {String} 
   */
  encodeQP: function( input, multibyte, wordMode ) {
    
    var pattern = ( !wordMode )
      ? /[\x3D]|[^\x09\x0D\x0A\x20-\x7E]/gm
      : /[\x3D\x5F\x3F]|[^\x21-\x7E]/gm;
    
    input = input.replace( pattern, function( match ) {
      match = ( multibyte )
        ? encodeURIComponent( match )
        : escape( match );
      return match.replace( /%/g, '=' );
    });
    
    return ( !wordMode )
      ? input.replace( /(.{73}(?!\r\n))/g, "$1=\r\n" )
      : input;
    
  },
  
  /**
   * [encodeWord description]
   * 
   * @param  {String} input 
   * @param  {String} type 
   * @param  {String} charset 
   * @return {String} 
   */
  encodeWord: function( input, type, charset ) {
    
    type = ( type )
      ? type.toUpperCase()
      : 'Q';
    
    if( type === 'B' ) {
      input = this.encodeBase64( input, charset );
    }
    
    input = this.encodeQP( input, charset, true );
    input = [ charset, type, input ].join( '?' );
    
    return '=?' + input + '?=';
    
  },
  
  /**
   * [decodeQP description]
   * 
   * @param  {String} input 
   * @param  {Boolean} multibyte 
   * @param  {Boolean} wordMode 
   * @return {String} 
   */
  decodeQP: function( input, multibyte, wordMode ) {
    
    if( !wordMode ) {
      input = input.replace( /[=]\r\n/gm, '' );
      input = input.replace( /[=]$/, '' );
    }
    else {
      input = input.replace( /_/g, ' ' );
    }
    
    input = input.replace( /[=]([A-F0-9]{2})/g, "%$1" );
    
    return ( multibyte )
      ? decodeURIComponent( input )
      : unescape( input );
    
  },
  
  /**
   * [decodeWord description]
   * 
   * @param  {String} input 
   * @return {String} 
   */
  decodeWord: function( input ) {
    
    var self = this;
    
    return input.replace(
      /[=][?]([^?]+)[?]([a-z])[?]([^?]*)[?][=]/gi,
      function( match, charset, type, data ) {
        
        type = type.toUpperCase();
        data = self.decodeQP( data, charset, true );
        
        if( type === 'B' ) {
          data = self.decodeBase64( data, 'utf-8' );
        }
        
        return data;
        
      }
    );
    
  }
  
};
