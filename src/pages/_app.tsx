import '@/styles/globals.scss'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/layout'
import { GoogleAnalytics, event as gaEvent } from 'nextjs-google-analytics';


export function reportWebVitals({ id,
                                  name,
                                  label,
                                  value }: NextWebVitalsMetric) {
  gaEvent(name, {
    category: label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
    value: Math.round(name === "CLS" ? value * 1000 : value), // values must be integers
    label: id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate.
  });
}

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        <GoogleAnalytics trackPageViews />
        <Navbar/>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}
