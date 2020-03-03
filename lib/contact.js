const qp = require( './quoted-printable' )

class Contact {

  /**
   * Create a new Contact
   * @param {String} [address]
   * @param {String} [name]
   * @returns {Contact}
   */
  constructor( address, name ) {
    /** @type {String} Contact name */
    this.name = name || ''
    /** @type {String} Email address */
    this.address = address || ''
  }

  /**
   * Parse an address
   * @param {String} value
   * @returns {Contact}
   */
  static parse( value ) {
    return new Contact().parse( value )
  }

  /**
   * Format a contact into a string
   * @param {Object} obj
   * @returns {String}
   */
  static format( obj ) {
    return obj.name ?
      `"${obj.name}" <${obj.address}>` :
      `<${obj.address}>`
  }

  /**
   * Parse an address
   * @param {String} value
   * @returns {Contact}
   */
  parse( value ) {

    let pattern, match

    for( let i = 0; i < Contact.patterns.length; i++ ) {
      pattern = Contact.patterns[i]
      if( (match = pattern[0].exec( value )) ) {
        this.address = match[ pattern[1] ] || ''
        this.name = match[ pattern[2] ] || ''
        break
      }
    }

    if( this.name != null && /^=\?[A-Z0-9-_]+\?[QB]\?/i.test( this.name ) ) {
      try { this.name = qp.decodeWord( this.name ) } catch( e ) {}
    }

    // Fall back to input value if we couldn't get an address
    this.address = ( this.address || value || '' ).trim()
    this.name = this.name.trim()

    return this

  }

  /**
   * Stringify the contact
   * @returns {String}
   */
  toString() {
    return Contact.format( this )
  }

}

/**
 * Contact format patterns and match groups
 * @type {Array<Array<RegExp,Number,Number>>}
 * @constant
 */
Contact.patterns = [
  // "Example Name" <hello@example.com>
  [ /"([^"]+)"\s+<([^>]+)>/, 2, 1 ],
  // 'Example Name' <hello@example.com>
  [ /'([^']+)'\s+<([^>]+)>/, 2, 1 ],
  // Example Name <hello@example.com>
  [ /(.+)\s+<([^>]+)>/, 2, 1 ],
  // hello@example.com (Example Name)
  [ /([^\s]+)\s+[(][^)]+[)]/, 1, 2 ],
  // <hello@example.com> (Example Name)
  [ /<([^>]+)>\s+[(][^)]+[)]/, 1, 2 ],
  // <hello@example.com>
  [ /<([^>]+)>/, 1 ]
]

module.exports = Contact
