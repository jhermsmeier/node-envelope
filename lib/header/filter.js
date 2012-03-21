
module.exports = (function() {
  
  function filter( key, value ) {
    
    for( var i in filter.map ) {
      if( ~filter.map[i].indexOf( key ) )
        return filter.fn[i]( value );
    }
    
    return value;
    
  }
  
  /**
   * Maps header field names
   * to their filter functions.
   * 
   * @type {Object}
   */
  filter.map = {
    address: [ 'from', 'reply_to', 'to', 'cc', 'bcc', 'sender' ],
    // subject: [ 'subject' ],
    content_type: [ 'content_type' ]
  };
  
  /**
   * Filter functions
   * 
   * @type {Object}
   */
  filter.fn = {
    
    address: function( input ) {
      
      // ADDRESS FORMATS
      var patterns = [
        // "Example Name" <hello@example.com>
        [ /"([^"]+)"\s+<([^>]+)>/, 2, 1 ],
        // 'Example Name' <hello@example.com>
        [ /'([^']+)'\s+<([^>]+)>/, 2, 1 ],
        // Example Name <hello@example.com>
        [ /(.+)\s+<([^>]+)>/, 2, 1 ],
        // <hello@example.com> (Example Name)
        [ /([^\s]+)\s+[(][^)]+[)]/, 1, 2 ],
        // hello@example.com (Example Name)
        [ /<([^>]+)>\s+[(][^)]+[)]/, 1, 2 ],
        // <hello@example.com>
        [ /<([^>]+)>/, 1, 1e2 ],
        // hello@example.com
        [ /.*/, 0, 1e2 ]
        // " <- Syntax highlighter fix (Sublime Text 2)
      ];
      
      var pattern, i, m;
      
      for( var fmt in patterns ) {
        i = patterns[fmt];
        if( m = i[0].exec( input ) ) {
          input = {
            address: m[ i[1] ] || null,
            name: m[ i[2] ] || null
          }
          break;
        }
      }
      
      return input;
      
    },
    
    // subject: function( input ) {
    //   return input.replace(
    //     /(Re): |(Fwd): /gi,
    //     ''
    //     // function( match, re, fwd ) {
    //     //   console.log( match, !!re, !!fwd );
    //     // }
    //   );
    // },
    
    content_type: function( input ) {
      
      // CONVERT
      // text/plain; charset="utf-8"; format="fixed"
      // TO
      // {
      //   mime: 'text/plain',
      //   charset: 'utf-8',
      //   format: 'fixed'
      // }
      
      var pattern = /^(.*?)([=](['"]?)(.*)\3)?$/,
          object = {}, m;
      
      input = input.split( '; ' );
      object.mime = input.shift();
      
      for( var i in input ) {
        if( m = pattern.exec( input[i] ) ) {
          if( m[4] ) object[ m[1] ] = m[4];
        }
      }
      
      return object;
      
    },
    
  };
  
  return filter;
  
})();
