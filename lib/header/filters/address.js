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
  [ /<([^>]+)>/, 1 ]
]

/**
 * Desperately tries to get a name
 * from a contact definition.
 *
 * @param  {String} input
 * @return {Object|Array}
 */
function address( input ) {

  // Run over multiple addresses
  if( ~input.indexOf( ',' ) )
    return input.split( ',' ).map( address )

  var pattern, fmt, i, m
  var contact = {
    address: input,
    name: null
  }

  for( fmt in patterns ) {
    i = patterns[ fmt ]
    if( m = i[0].exec( input ) ) {
      contact.address = m[ i[1] ] || null
      contact.name = m[ i[2] ] || null
      break
    }
  }

  return contact

}

module.exports = address
