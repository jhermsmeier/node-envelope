/**
 * Desperately tries to get a name
 * from a contact definition.
 *
 * @param  {String} input
 * @return {Object|Array}
 */
module.exports = function address( input ) {

  // Run over multiple addresses
  if( ~input.indexOf( ',' ) )
    return input.split( ',' ).map( address )

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
    [ /<([^>]+)>/, 1 ],
    // hello@example.com
    [ /.*/, 0 ]
  ]

  var pattern, fmt, i, m

  for( fmt in patterns ) {
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

}
