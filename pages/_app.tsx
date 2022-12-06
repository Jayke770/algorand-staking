import '../styles/globals.css'
import 'animate.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { App } from 'konsta/react'
import NextNProgress from "nextjs-progressbar"
import { useRouter } from 'next/router'
export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <NextNProgress
        color="#2afe30"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
      />
      <App theme='material' safeAreas dark>
        <Component {...pageProps} />
      </App>
    </SessionProvider>
  )
}
