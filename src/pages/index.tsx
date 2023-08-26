import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.scss'
import { NextPageContext } from 'next'
import clientPromise from '@/lib/mongodb'
import { getServerSideProps as getResumeServerSideProps } from './resume'
import { getServerSideProps as getPortfolioServerSideProps } from './portfolio'
import '@fortawesome/fontawesome-svg-core/styles.css';
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

interface IHomeProps {
  resumePreviewUrl: string
  portfolioPreviewUrl: string
}

export default function Home({resumePreviewUrl, portfolioPreviewUrl}: IHomeProps) {
  return (
    <>
      <Head>
        <title>Home | Anatolii Tsirkunenko</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Anatolii Tsirkunenko"/>
        <meta name="description" content="Software Developer with Embedded and Web experience"/>
        <meta name="keywords" content="software, developer, embedded, web, bms, c, python, can, iso26262, react, rtos, django"/>
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
                <Image src={resumePreviewUrl} className={styles.docImg} alt='resume' width={200} height={283} quality={100}/>
              </Link>
              <p className={styles.docName}>
                <Link href='/resume' className={styles.inlineLink}>Click</Link> to view my CV online 
                or <Link href='/resume?pdf=true' className={styles.inlineLink}>download</Link> the pdf directly
              </p>
            </div>
            <div className={styles.docCard}>
              <Link href='/portfolio'>
                <Image src={portfolioPreviewUrl} className={styles.docImg} alt='resume' width={200} height={283} quality={100} />
              </Link>
              <p className={styles.docName}>
                <Link href='/portfolio' className={styles.inlineLink}>Click</Link> to view my Portfolio online 
                or <Link href='/portfolio?pdf=true' className={styles.inlineLink}>download</Link> the pdf directly
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export async function getStaticProps() {
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
    revalidate: 10,
  }
}

// export async function getServerSideProps(context: NextPageContext) {
//   // return {
//   //   redirect: {
//   //     destination: '/resume',
//   //     permanent: true,
//   //   },
//   // };
 
//   return {
//     props: {},
//   };
// }
