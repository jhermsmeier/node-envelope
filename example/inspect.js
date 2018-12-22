#!/usr/bin/env node
var Envelope = require( '..' )
var fs = require( 'fs' )
var argv = process.argv.slice( 2 )
var inspect = require( '../test/inspect' )

console.log( inspect( new Envelope( fs.readFileSync( argv.shift() ) ) ) )
