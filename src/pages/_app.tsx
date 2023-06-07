import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/layout'
import Script from 'next/script';

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Navbar/>
      <Component {...pageProps} />
      <div className="container">
        {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
        <Script
          src={`"https://www.googletagmanager.com/gtag/js?id=${process.env.GA_MEASUREMENT_ID}"`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.GA_MEASUREMENT_ID}');
          `}
        </Script>
      </div>
    </SessionProvider>
  )
}
