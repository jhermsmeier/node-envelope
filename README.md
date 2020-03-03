# Envelope
[![npm](https://img.shields.io/npm/v/envelope.svg?style=flat-square)](https://npmjs.com/package/envelope)
[![npm](https://img.shields.io/npm/l/envelope.svg?style=flat-square)](https://npmjs.com/package/envelope)
[![npm downloads](https://img.shields.io/npm/dm/envelope.svg?style=flat-square)](https://npmjs.com/package/envelope)
[![build status](https://img.shields.io/travis/jhermsmeier/node-envelope.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-envelope)

Envelope parses emails quite liberally into an object structure which makes it easy to work with.

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save envelope
```

## Features

- Parses almost everything. If it doesn't: file an issue
- Decodes MIME words, base64, ...
- Automatically converts to UTF8 w/ iconv (codes)
- Converts attachments to buffers


## Performance

On an Intel Core i5-3427U CPU @ 1.80GHz it processes about **20.1 MB per second**,
which equals roughly **215.8 mails per second**.

## Usage

### Parsing an email

```javascript
const fs = require( 'fs' )
const Envelope = require( 'envelope' )

// Read email into a buffer
const data = fs.readFileSync( './test.eml' )

// Construct envelope
const email = new Envelope( data )

console.log( email )
```

Example Output:

```js
{
  header: {
    received: [
      'by mail-wi0-f175.google.com with SMTP id hm11so5717280wib.2 for <me@jhermsmeier.de>; Sat, 22 Dec 2012 07:49:06 -0800 (PST)',
      'by 10.194.78.162 with SMTP id c2mr28698959wjx.46.1356191346691; Sat, 22 Dec 2012 07:49:06 -0800 (PST)',
      'by 10.194.64.229 with HTTP; Sat, 22 Dec 2012 07:49:06 -0800 (PST)'
    ],
    dkimSignature: 'v=1; a=rsa-sha256; c=relaxed/relaxed; d=gmail.com; s=20120113; h=mime-version:date:message-id:subject:from:to:content-type; bh=DrlXO8ocnosZnW5ZN7P4S/fIdR8vwHj0TyzoPISZF2Q=; b=gOHBExs2JcJFRrozPDw88Js0dc0AHOo6YTZqrDTedfcK/jM/mxfu5rfVzuUnKAGiS5 ZvRvXvwYjIW0B9t0DDHDOs5soIukuEXeUw9OV2QD8qc5pmOShuRQWyW5pRftTF87omkj gV2Eik5K2f8FpNlyvuLDjMUmyP8RpLaRrii6+kRRsoJzzP41IqALmlLmJfvtnkeu5kM0 v4XnQ4hBNcaLuCmq3fZfCQFDexofECQOZ8FWE0VfdASG8HOJ6jgxuKwYtNfy11ySUSrI wFFlrjTfiNqSD9nzQns3j+xXLtqsvviJQXJgkC8O6mLel3GDwm8LHzBoszzqZ/FiL4rg Vdfw==',
    mimeVersion: '1.0',
    date: 'Sat, 22 Dec 2012 16:49:06 +0100',
    messageId: '<CA+0p7-rrsAij-6nzDgk3R62ZHRZrjdJvOjxhCsHQ+m=nERwCJA@mail.gmail.com>',
    subject: 'AGAIN',
    from: {
      address: 'jhermsmeier@gmail.com',
      name: 'Jonas Hermsmeier'
    },
    to: {
      address: 'me@jhermsmeier.de',
      name: null
    },
    contentType: {
      mime: 'multipart/alternative',
      boundary: '047d7bfd046e778e8d04d172e7cb'
    }
  },
  '0': {
    '0': 'HELO',
    header: {
      contentType: {
        mime: 'text/plain',
        charset: 'UTF-8'
      }
    }
  },
  '1': {
    '0': '<div dir=\\"ltr\\">HELO</div>',
    header: {
      contentType: {
        mime: 'text/html',
        charset: 'UTF-8'
      }
    }
  }
}
```

### Using filters

#### Transforming header field values

You can easily add your own transformation functions to Envelope.
To transform a specific header field value, just make sure the field identifiers are written in camelCase:

```javascript
Envelope.Header.filter.add(
  'dkimSignature', function dkim( value ) {
    // ...
    return newValue
  }
)
```

If you want to apply your transformation to a set of header fields, simply use an array of field names,
e.g. instead of `'contentType'` use `[ 'contentType', 'contentDisposition' ]`.


## API

### new Envelope( *buffer* )

Contructs a new envelope object from a buffer.
