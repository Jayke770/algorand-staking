import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang='en' className='dark'>
            <Head>
                <meta name="name" content="$ALGO Stake" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/assets/logo.png"></link>
                <meta name="theme-color" content="#1b8520" />
                <script src="https://telegram.org/js/telegram-web-app.js" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}