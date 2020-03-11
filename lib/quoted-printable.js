var iconv = require( 'iconv-lite' )
var transcode = require( 'buffer' ).transcode
var qp = module.exports

function encode( input, charset ) {

  var buffer = null

  charset = charset || 'utf8'

  if( Buffer.isEncoding( charset ) ) {
    buffer = transcode( input, 'utf8', charset )
  } else if( iconv.encodingExists( charset ) ) {
    buffer = iconv.encode( input, charset )
  } else {
    throw new Error( `Unsupported charset "${charset}"` )
  }

  return buffer

}

function decode( input, charset ) {

  charset = charset || 'utf8'

  if( Buffer.isEncoding( charset ) ) {
    return transcode( input, charset, 'utf8' )
  } else if( iconv.encodingExists( charset ) ) {
    return iconv.decode( input, charset )
  } else {
    throw new Error( `Unsupported charset "${charset}"` )
  }

}

qp.encodeBase64 = function( input, charset ) {
  return encode( input, charset ).toString( 'base64' )
}

qp.decodeBase64 = function( input, charset ) {
  return decode( Buffer.from( input, 'base64' ), charset )
}

qp.encode = function( input, wordMode ) {

  var bytes = !Buffer.isBuffer( input )
    ? Buffer.from( input ) : input

  var chr, out = '', len = bytes.length

  for( var i = 0; i < len; i++ ) {
    chr = bytes[i]
    if( wordMode ) {
      // if matches /[\x3D]|[^\x09\x0D\x0A\x20-\x7E]/gm
      out = chr !== 0x3D && ( chr >= 0x20 && chr <= 0x007E ) || ( chr === 0x09 || chr === 0x0D || chr === 0x0A )
        ? out + String.fromCharCode( chr )
        : out + '=' + chr.toString( 16 ).toUpperCase()
    } else {
      // if matches /[\x3D\x5F\x3F]|[^\x21-\x7E]/gm
      out = ( chr !== 0x3D && chr !== 0x5F && chr !== 0x3F ) && ( chr >= 0x21 && chr <= 0x007E )
        ? out + String.fromCharCode( chr )
        : out + '=' + chr.toString( 16 ).toUpperCase()
    }
  }

  return out

}

qp.decode = function( input, charset, wordMode ) {

  input = input + ''

  if( !wordMode ) {
    input = input.replace( /[=]\r?\n/gm, '' )
    input = input.replace( /[=]$/, '' )
  } else {
    input = input.replace( /_/g, ' ' )
  }

  var byteLength = Buffer.byteLength( input ) - (( input.match( /=[0-9A-F]{2}/gi ) || [] ).length * 2 )
  var buffer = Buffer.alloc( byteLength )
  var pos = 0
  var hex = null

  charset = ( charset || 'utf8' ).toLowerCase()

  for( var i = 0; i < input.length; i++ ) {
    if( input[i] === '=' ) {
      hex = input.substr( i + 1, 2 )
      if( /[A-F0-9]{2}/i.test( hex ) ) {
        buffer[ pos++ ] = parseInt( hex, 16 )
        i += 2
        continue
      }
    }
    buffer[ pos++ ] = input.charCodeAt( i )
  }

  return decode( buffer, charset )

}

qp.encodeWord = function( input, type, charset ) {

  type = ( type || 'Q' ).toUpperCase()
  charset = ( charset || 'UTF-8' ).toUpperCase()

  switch( type ) {
    case 'B': input = qp.encodeBase64( input, charset ); break
    case 'Q': input = qp.encode( input, true ); break
    default:
      throw new Error( `Invalid encoding type "${type}"` )
  }

  return '=?' + [ charset, type, input ].join( '?' ) + '?='

}

qp.decodeWord = function( input, consumeSubsequentSeparator ) {
  return input.replace(
    consumeSubsequentSeparator
      ? /[=][?]([^?]+)[?]([a-z])[?]([^?]*)[?][=]([\t ])?/gi
      : /[=][?]([^?]+)[?]([a-z])[?]([^?]*)[?][=]/gi,
    function( match, charset, type, data /* , optionalWSSeparator */ ) {

      type = type.toUpperCase()

      return type === 'B' ?
        qp.decodeBase64( data, charset ) :
        qp.decode( data, charset, true )

    }
  )
}
