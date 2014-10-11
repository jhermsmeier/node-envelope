if( 'describe' in global ) return

var fs = require( 'fs' )
var path = require( 'path' )
var util = require( 'util' )
var Envelope = require( '../envelope/index.js' )

function log( value ) {
  console.log( util.inspect( value, {
    depth: null,
    colors: true,
    showHidden: true
  }))
}

function ls( path ) {
  return fs.readdirSync(
    __dirname + '/' + path
  ).map( function( file ) {
    return __dirname + '/' + path + '/' + file
  })
}

function logtime( time ) {
  var ms = Math.round( (time[1] * 10e-7)*1000 )/1000 + ( time[0] / 1000 )
  return ( ms.toString() + ' ms' )
}

var emails = ls( 'data' )

var result = emails.map( function( file ) {
  var data = fs.readFileSync( file )
  var start = process.hrtime()
  var email, error
  try { email = Envelope.parse( data ) }
  catch( e ) { error = e }
  var end = process.hrtime( start )
  // log( email )
  return error ? error : {
    time: logtime( end ),
    path: path.basename( file ),
    size: (Math.round( (data.length / 1024) * 100 ) / 100) + ' KB',
    email: email
  }
}).sort( function( a, b ) {
  
  var x = parseFloat( a.time )
  var y = parseFloat( b.time )
  
  if( x > y ) return  1
  if( x < y ) return -1
  
  return 0
  
}).filter( function( t ) {
  !(t instanceof Error) ?
    console.log( t.time, '–', t.size, '–', t.path ) :
    console.error( t.message )
  return !(t instanceof Error)
})

// log( result[ result.length - 1 ] )

return

var startTime = process.hrtime()
var email = Envelope.parse( data )
var time = process.hrtime( startTime )

console.log( path.basename( random ) )
console.log( '' )
console.log( (Math.round(time[1] * 10e-6) + (time[0] / 1000)).toString(), 'ms' )
// console.log( '' )
// log( email )
// console.log( '' )
// log( email.attachments )
// console.log( '' )

// console.log( '' )
// console.log( email.attachments )

return

var random = emails[ Math.floor( Math.random() * emails.length ) ]
var data = fs.readFileSync(
  random
  // __dirname + '/data/' + 'chinesemail.txt'
  // __dirname + '/data/' + 'plain-text-and-two-identical-attachments.txt'
)

console.log( '' )
log( random )
console.log( '' )

var stream = fs.createReadStream( random )
var parser = new Envelope.Parser({
  // ...
})

parser.on( 'readable', function() {
  log( this.read() )
})

stream.pipe( parser )
