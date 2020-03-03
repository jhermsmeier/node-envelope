const assert = require( 'assert' )
const fs = require( 'fs' )
const path = require( 'path' )
const Envelope = require( '..' )

describe( 'Envelope', function() {

  context( '.parse()', function() {

    context( 'test vectors', function() {

      const ls = fs.readdirSync( path.join( __dirname, 'data' ) )
        .map( function( filename ) {
          filename = path.join( __dirname, 'data', filename )
          return {
            name: path.basename( filename ),
            path: filename,
            stats: fs.statSync( filename ),
          }
        })
        .filter( function( file ) {
          return file.stats.isFile()
        })

      ls.forEach( function( file ) {
        specify( `parses ${file.name}`, function() {
          const data = fs.readFileSync( file.path )
          /* var mail = */ new Envelope( data )
          // console.log( mail )
        })
      })

    })

  })

  context( '.getAttachments()', function() {

    context( 'with inline attachments', function() {

      specify( 'returns all attachments, including inlined attachments', function() {

        const filename = path.join( __dirname, 'data', 'message-image-text-attachments.txt' )
        const buffer = fs.readFileSync( filename )
        const mail = Envelope.parse( buffer )

        const attachments = mail.getAttachments()

        // console.log( attachments )

        assert.strictEqual( attachments.length, 2 )

      })

    })

    context( 'without inline attachments', function() {

      specify( 'returns all attachments, excluding inline attachments', function() {

        const filename = path.join( __dirname, 'data', 'message-image-text-attachments.txt' )
        const buffer = fs.readFileSync( filename )
        const mail = Envelope.parse( buffer )

        const attachments = mail.getAttachments( false )

        // console.log( attachments )

        assert.strictEqual( attachments.length, 1 )

      })

    })

  })

  context( '.getText()', function() {

    specify( 'returns the body of a plain text message', function() {

      const filename = path.join( __dirname, 'data', 'plain-text-only.txt' )
      const buffer = fs.readFileSync( filename )
      const mail = Envelope.parse( buffer )

      const text = mail.getText()

      assert.strictEqual( text, 'This message contains only plain text.\r\n' )

    })

    specify( 'returns the text part of a multipart message with text & HTML', function() {

      const filename = path.join( __dirname, 'data', 'html.txt' )
      const buffer = fs.readFileSync( filename )
      const mail = Envelope.parse( buffer )

      const text = mail.getText()

      assert.strictEqual( text, 'this\r\nis\r\nhtml\r\n' )

    })

  })

  context( '.getHTML()', function() {

    specify( 'returns `null` for a plain text only message', function() {

      const filename = path.join( __dirname, 'data', 'plain-text-only.txt' )
      const buffer = fs.readFileSync( filename )
      const mail = Envelope.parse( buffer )

      const html = mail.getHTML()

      assert.strictEqual( html, null )

    })

    specify( 'returns the HTML part of a multipart message with text & HTML', function() {

      const filename = path.join( __dirname, 'data', 'html.txt' )
      const buffer = fs.readFileSync( filename )
      const mail = Envelope.parse( buffer )

      const html = mail.getHTML()
      const expected = '<html><body style="word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space; "><ul class="MailOutline"><li>this</li><li>is</li><li>html</li></ul></body></html>\r\n'

      assert.strictEqual( html, expected )

    })

  })

})
