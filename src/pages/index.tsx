import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.scss'
import { NextPageContext } from 'next'
import clientPromise from '@/lib/mongodb'
import { DEFAULT_PREVIEW_URL as DEFAULT_RESUME_PREVIEW_URL, getServerSideProps as getResumeServerSideProps } from './resume'
import { DEFAULT_PREVIEW_URL as DEFAULT_PORTFOLIO_PREVIEW_URL, getServerSideProps as getPortfolioServerSideProps } from './portfolio'
import '@fortawesome/fontawesome-svg-core/styles.css';
import Link from 'next/link'
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

interface IHomeProps {
  resumePreviewUrl: string
  portfolioPreviewUrl: string
}

export default function Home({resumePreviewUrl, portfolioPreviewUrl}: IHomeProps) {
  const [clickedResume, setClickedResume] = useState(false);
  const [clickedPortfolio, setClickedPortfolio] = useState(false);
  return (
    <>
      <Head>
        <title>Home | Anatolii Tsirkunenko</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Anatolii Tsirkunenko"/>
        <meta name="description" content="Software Developer with Embedded and Web experience"/>
        <meta name="keywords" content="software, developer, embedded, web, bms, c, python, can, iso26262, react, rtos, django"/>
        <meta name="google-site-verification" content="Bg2kkqcxN64RJ2TRKNBikJO7p4K0vYgD5jgG_HI2JPk" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles.welcomeSection}>
          <div className={styles.textPart}>
            <h1 className={styles.title}>
              Software Engineer
            </h1>
            <p className={styles.caption}>
              I am Anatolii Tsirkunenko, a Software Engineer in Embeded and Web domains.
            </p>
          </div>
        </div>
        <div className={styles.docSection}>
          <div className={styles.descriptionSection}>
            <h2 className={styles.title}>
              Familiarize yourself with my experience
            </h2>
            <p className={styles.description}>
              Carefully crafted resume that represents my experiences in a user-friendly fashion.
            </p>
            <p className={styles.description}>
              Check &apos;em out!
            </p>
          </div>
          <div className={styles.docCards}>
            <div className={styles.docCard}>
              <Link href='/resume'>
                <img src={resumePreviewUrl} className={`${clickedResume ? styles.clicked : ''} ${styles.docImg}`} alt='resume' width={200} height={283}
                     onClick={() => {setClickedResume(true)}} />
              </Link>
              <p className={styles.docName}>
                <Link href='/resume' className={styles.inlineLink}>Click</Link> to view my CV online 
                or <Link href='/resume?pdf=true' target="_blank" className={styles.inlineLink}>download</Link> the pdf directly
              </p>
            </div>
            <div className={styles.docCard}>
              <Link href='/portfolio'>
                <img src={portfolioPreviewUrl} className={`${clickedPortfolio ? styles.clicked : ''} ${styles.docImg}`} alt='resume' width={200} height={283} 
                     onClick={() => {setClickedPortfolio(true)}} />
              </Link>
              <p className={styles.docName}>
                <Link href='/portfolio' className={styles.inlineLink}>Click</Link> to view my Portfolio online 
                or <Link href='/portfolio?pdf=true' target="_blank" className={styles.inlineLink}>download</Link> the pdf directly
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export async function getStaticProps() {
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    return {
      props: {
        resumePreviewUrl: DEFAULT_RESUME_PREVIEW_URL,
        portfolioPreviewUrl: DEFAULT_PORTFOLIO_PREVIEW_URL,
      }
    }
  }
  let tempPreviewUrl = '';
  let context: NextPageContext | any = {
    query: {preview: 'true'},
    res: {
      setHeader: () => {},
      end: (data: any) => {
        tempPreviewUrl = data
      }
    }
  }
  
  await getResumeServerSideProps(context, true)
  let resumePreviewUrl = tempPreviewUrl;
  await getPortfolioServerSideProps(context, true)
  let portfolioPreviewUrl = tempPreviewUrl;

  return {
    props: {
      resumePreviewUrl,
      portfolioPreviewUrl
    },
    revalidate: 600,
  }
}
