[![build status](https://secure.travis-ci.org/jhermsmeier/node-envelope.png)](http://travis-ci.org/jhermsmeier/node-envelope)
# Envelope

Envelope translates raw emails into objects.


## Install with [npm](https://npmjs.org)

```sh
$ npm install envelope
```


## Usage

```javascript
var fs = require( 'fs' )
var Envelope = require( 'envelope' )

// Read email into a buffer
var data = fs.readFileSync( './test.eml' )

// Construct envelope
var email = new Envelope( data )

console.log( email )
```

Example Output:

```js
{
  received: [
    'by 10.216.232.26 with SMTP id m26csp10350weq; Mon, 30 Jul 2012 07:44:49 -0700 (PDT)',
    'by 10.216.183.140 with SMTP id q12mr5294522wem.58.1343659483851; Mon, 30 Jul 2012 07:44:43-0700 (PDT)'
  ],
  delivered_to: 'myself@example.tld',
  return_path: '<someone@example.tld>',
  message_id: '<900030350169DCB@example.tld>',
  date: 'Mon, 30 Jul 2012 16:44:27 +0200',
  subject: 'Sample Subject',
  to: {
    address: 'myself@example.tld',
    name: 'Jonas Hermsmeier'
  },
  from: {
    address: 'someone@example.tld',
    name: 'Some One'
  },
  mime_version: '1.0',
  content_type: {
    mime: 'multipart/alternative',
    boundary: '030300090403080807050803'
  }
  '0': {
    content_transfer_encoding: 'quoted-printable',
    content_type: {
      mime: 'text/plain',
      charset: 'ISO-8859-15'
    },
    body: 'Hello World!'
  },
}
```


## API

### new Envelope( *buffer* )
Contructs a new envelope object from a buffer.

### Envelope.parse( *buffer* )
Same as `new Envelope()`


## License (MIT)

Copyright (c) 2012 [Jonas Hermsmeier](http://jhermsmeier.de)

Permission is hereby granted, free of charge, to any person obtaining a copy 
of this software and associated documentation files (the "Software"), to deal 
in the Software without restriction, including without limitation the rights 
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in 
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
