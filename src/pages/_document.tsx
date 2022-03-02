import Document, { Html, Head, Main, NextScript } from 'next/document'


export default class MyDocument extends Document {
  render () {
    return (

      <Html>
        <Head>

          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Open+Sans&family=Poppins:wght@400;700&family=Roboto:wght@900&display=swap" rel="stylesheet" />
          
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}