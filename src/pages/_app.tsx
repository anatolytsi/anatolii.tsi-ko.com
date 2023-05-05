import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/layout'

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Navbar/>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
