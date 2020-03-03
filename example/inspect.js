#!/usr/bin/env node
const Envelope = require( '..' )
const fs = require( 'fs' )
const argv = process.argv.slice( 2 )
const inspect = require( '../test/inspect' )

console.log( inspect( new Envelope( fs.readFileSync( argv.shift() ) ) ) )
