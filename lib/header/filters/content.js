var mime = require( 'mime-lib' )

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
module.exports = function( input ) {

  var pattern = /^(.*?)([=](['"]?)(.*)\3)?$/
  var i, m, object = {}

  input = input.split( /;\s*/g )
  object.mime = input.shift()

  for( i in input ) {
    if( m = pattern.exec( input[i] ) ) {
      if( m[4] ) {
        m[1] = m[1].toLowerCase().replace(
          /-([^-])/ig, function( m, chr ) {
            return chr.toUpperCase()
          }
        )
        object[ m[1] ] = mime.decodeWord( m[4] )
      }
    }
  }

  return object

}
