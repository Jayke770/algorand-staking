import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { App } from 'konsta/react'
import NextNProgress from "nextjs-progressbar"
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextNProgress
        color="#2afe30"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
      />
      <App theme='material' safeAreas dark>
        <Component {...pageProps} />
      </App>
    </>
  )
}
