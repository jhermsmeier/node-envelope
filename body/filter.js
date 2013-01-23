
function filter( body ) {
  
}

filter.add = function() {
  
  var part = [].slice.call( arguments )
  var fn = part.pop()
  
  if( typeof fn !== 'function' ) {
    throw new TypeError( 'Filter is not a function.' )
  }
  
}

filter.fn = {}

module.exports = filter
