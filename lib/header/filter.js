
function filter( key, value ) {
  
  for( var i in filter.map ) {
    if( ~filter.map[i].indexOf( key ) )
      return filter.fn[i]( value )
  }
  
  return value
  
}

/**
 * Maps header field names
 * to their filter functions.
 * 
 * @type {Object}
 */
filter.map = {
  address: [ 'from', 'reply_to', 'to', 'cc', 'bcc', 'sender' ],
  subject: [ 'subject' ],
  content_type: [ 'content_type' ]
}

/**
 * Filter functions
 * 
 * @type {Object}
 */
filter.fn = {
  
  /**
   * Desperately tries to get a name
   * from a contact definition.
   * 
   * @param  {String} input
   * @return {Object} 
   */
  address: function( input ) {
    
    // Address formats
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
    ]
    
    var pattern, i, m
    
    for( var fmt in patterns ) {
      i = patterns[ fmt ]
      if( m = i[0].exec( input ) ) {
        input = {
          address: m[ i[1] ] || null,
          name: m[ i[2] ] || null
        }
        break
      }
    }
    
    return input
    
  },
  
  /**
   * Strips 'Re:' and 'Fwd:' from the subject line,
   * the "reply" or "forwarded" status should be determined
   * through the mail headers anyway...
   * 
   * Also, subject lines like "Fwd: Re: Re: Re: Actual subject"
   * are fucking annoying.
   * 
   * @param  {String} input
   * @return {String} 
   */
  subject: function( input ) {
    return input.replace(
      /(Re): |(Fwd): /gi,
      ''
      // function( match, re, fwd ) {
      //   console.log( match, !!re, !!fwd );
      // }
    )
  },
  
  /**
   * Converts mime strings like
   * `text/plain; charset="utf-8"; format="fixed"`
   * to an object of this form:
   *     
   *     {
   *       mime: 'text/plain',
   *       charset: 'utf-8',
   *       format: 'fixed'
   *     }
   *     
   * @param  {String} input
   * @return {Object} 
   */
  content_type: function( input ) {
    
    var pattern = /^(.*?)([=](['"]?)(.*)\3)?$/
    var m, object = {}
    
    input = input.split( '; ' )
    object.mime = input.shift()
    
    for( var i in input ) {
      if( m = pattern.exec( input[i] ) ) {
        if( m[4] ) object[ m[1] ] = m[4]
      }
    }
    
    return object
    
  },
  
}

module.exports = filter
