import Router from "next/router";
import { NextPageContext } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { getSession } from "next-auth/react";
import clientPromise from "@/lib/mongodb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faFilePdf, faPencil, faSave } from "@fortawesome/free-solid-svg-icons";
import '@fortawesome/fontawesome-svg-core/styles.css';
import axios from "axios";

import styles from './portfolio.module.scss';
import { IPortfolioExperience, PortfolioExperience } from "@/components/portfolio/PortfolioExperience";
import { IMAGES_URL, getFiles, getImages } from "../api/portfolio/file";
import pdfHelper from "@/lib/pdfHelper";
import PDFLayout from "@/components/resume/PdfLayout";

interface IPortfolioProps {
    forExport: boolean
    isAdmin: boolean
    portfolioExps: IPortfolioExperience[]
    photosList: string[]
}

const DATE_STRING = new Date().toISOString().slice(0, 10).replaceAll('-', '');

const RestButton = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (isOpen && ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const importJson = (event: any) => {
    const file = event.target?.files?.[0];
    if (file) {
      axios.post('/api/portfolio', file, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        Router.reload();
      })
    }
  }

  const exportJson = () => {
    axios.get('/api/portfolio', {responseType: 'blob'})
      .then((response) => {
        // create file link in browser's memory
        const href = URL.createObjectURL(response.data);
    
        // create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', `${DATE_STRING}_portfolioData.json`); //or any other extension
        document.body.appendChild(link);
        link.click();
    
        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
        setIsOpen(false);
      });
  }

  return (
    <>
      <div 
        className={`${styles.restButton}`}
        onClick={() => {setIsOpen(!isOpen)}}
      >
        <FontAwesomeIcon icon={faEllipsisV} size='xl' />
      </div>
      <div className={isOpen ? `${styles.restPanel} ${styles.opened}` : styles.restPanel}
           ref={ref}>
        <p className={styles.restEl}>
          <input type="file" onChange={importJson} id="resumeUpload" accept="application/JSON" style={{display: "none"}}/>
          <label htmlFor="resumeUpload">
            Import JSON
          </label>
          </p>
        <p className={styles.restEl} onClick={exportJson}>
          Export JSON
        </p>
      </div>
    </>
  );
}

const PdfDownloadButtonSingle = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <a
      href="/portfolio?pdf=true"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={`${styles.downloadButton}`}>
        <span className={styles.downloadTooltipText}>
          Download PDF
        </span>
          <FontAwesomeIcon icon={faFilePdf} size='xl' />
      </div>
    </a>
  );
}

export default function Portfolio( props: IPortfolioProps ) {
    const [editModeEnabled, setEditModeEnabled] = useState(false);
    const [portfolioExps, setPortfolioExps] = useState(props.portfolioExps);
    const [gallery, setGallery] = useState(props.photosList);
  
    useEffect(() => {
      function handleKeyDown(e: KeyboardEvent) {
        let charCode = String.fromCharCode(e.which).toLowerCase();
        if ((e.ctrlKey || e.metaKey) && charCode === 's') {
            e.preventDefault();
            setEditModeEnabled(false);
        }
      }
  
      document.addEventListener('keydown', handleKeyDown);
  
      // Don't forget to clean up
      return function cleanup() {
        document.removeEventListener('keydown', handleKeyDown);
      }
    }, []);

    const addPictureToGallery = (pictureUrl: string) => {
      setGallery([...gallery, pictureUrl]);
    }

    const renderEditPortfolio = () => {
      if (editModeEnabled) {
        return (
          <div 
            className={`${styles.editPortfolio} ${styles.stop}`}
            onClick={() => {
              setEditModeEnabled(false);
            }}
          >
            <FontAwesomeIcon icon={faSave} size='xl' />
          </div>
        );
      } else {
        return (
          <div 
            className={`${styles.editPortfolio} ${styles.edit}`}
            onClick={() => {setEditModeEnabled(true)}}
          >
            <FontAwesomeIcon icon={faPencil} size='xl' />
          </div>
        );
      }
    }
  
    const renderAdminButtons = () => {
      if (props.isAdmin) {
        return (
          <>
            {renderEditPortfolio()}
            <RestButton/>
          </>
        )
      }
      return <></>;
    }

    return (
        <>
            <Head>
                <title>Portfolio{props.forExport ? ' Export' : ''} | Anatolii Tsirkunenko</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="author" content="Anatolii Tsirkunenko"/>
                <meta name="description" content="Software Developer with Embedded and Web experience"/>
                <meta name="keywords" content="software, developer, embedded, web, bms, c, python, can, iso26262, react, rtos, django"/>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {props.forExport ? (
            <></>
            ) : (
            <>
                <PdfDownloadButtonSingle/>
                {renderAdminButtons()}
            </>
            )}
            <div className={`${styles.portfolio} ${props.forExport ? styles.forExport : ''}`} id={styles.root}>
                <div className={styles.head}>
                    <h1>
                        Portfolio
                    </h1>
                    <p>
                        Anatolii Tsirkunenko
                    </p>
                </div>
                <div className={styles.experiences}>
                    {portfolioExps.map((portfolioExp: IPortfolioExperience, idx: number) => (
                        <PortfolioExperience forExport={props.forExport} editModeEnabled={editModeEnabled} isAdmin={props.isAdmin}
                                             portfolioExperience={portfolioExp} key={idx} isLast={idx === (portfolioExps.length - 1)}
                                             gallery={gallery} addPictureToGallery={addPictureToGallery} />
                    ))}
                </div>
            </div>
        </>
    );
}

export const getServerSideProps = async (context: NextPageContext) => {
    try {
        const session = await getSession(context);
        const isAdmin = session?.user?.role === 'admin';
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        const exportPDF = context.query.pdf === 'true';
        const isServer = !!context.req;


        if (!collectionNames.length) {
            await db.collection('jobExperience').insertMany(require('@/fixtures/jobExperience.json'));
            await db.collection('education').insertMany(require('@/fixtures/education.json'));
            await db.collection('internships').insertMany(require('@/fixtures/internships.json'));
            await db.collection('projects').insertMany(require('@/fixtures/projects.json'));
        }
    
        const jobExperienceCursor = db.collection('jobExperience');
        const educationCursor = db.collection('education');
        const internshipsCursor = db.collection('internships');
        const projectsCursor = db.collection('projects');
    
        let jobExperiences = [];
        let education = [];
        let internships = [];
        let projects = [];
        let photosList: any[] = [];

        if (exportPDF || !isAdmin) {
            jobExperiences = [...JSON.parse(JSON.stringify(await jobExperienceCursor.find({ isVisible: true, endDate: 0 }).sort({ startDate: -1 }).toArray())), 
                              ...JSON.parse(JSON.stringify(await jobExperienceCursor.find({ isVisible: true, endDate: { $gt: 0 } }).sort({ endDate: -1 }).toArray()))];
            education = [...JSON.parse(JSON.stringify(await educationCursor.find({ isVisible: true, endDate: 0 }).sort({ startDate: -1 }).toArray())), 
                         ...JSON.parse(JSON.stringify(await educationCursor.find({ isVisible: true, endDate: { $gt: 0 } }).sort({ endDate: -1 }).toArray()))];
            internships = [...JSON.parse(JSON.stringify(await internshipsCursor.find({ isVisible: true, endDate: 0 }).sort({ startDate: -1 }).toArray())), 
                           ...JSON.parse(JSON.stringify(await internshipsCursor.find({ isVisible: true, endDate: { $gt: 0 } }).sort({ endDate: -1 }).toArray()))];
            projects = [...JSON.parse(JSON.stringify(await projectsCursor.find({ isVisible: true, endDate: 0 }).sort({ startDate: -1 }).toArray())), 
                        ...JSON.parse(JSON.stringify(await projectsCursor.find({ isVisible: true, endDate: { $gt: 0 } }).sort({ endDate: -1 }).toArray()))];
        } else {
            jobExperiences = [...JSON.parse(JSON.stringify(await jobExperienceCursor.find({ endDate: 0 }).sort({ startDate: -1 }).toArray())), 
                              ...JSON.parse(JSON.stringify(await jobExperienceCursor.find({ endDate: { $gt: 0 } }).sort({ endDate: -1 }).toArray()))];
            education = [...JSON.parse(JSON.stringify(await educationCursor.find({ endDate: 0 }).sort({ startDate: -1 }).toArray())), 
                        ...JSON.parse(JSON.stringify(await educationCursor.find({ endDate: { $gt: 0 } }).sort({ endDate: -1 }).toArray()))];
            internships = [...JSON.parse(JSON.stringify(await internshipsCursor.find({ endDate: 0 }).sort({ startDate: -1 }).toArray())), 
                            ...JSON.parse(JSON.stringify(await internshipsCursor.find({ endDate: { $gt: 0 } }).sort({ endDate: -1 }).toArray()))];
            projects = [...JSON.parse(JSON.stringify(await projectsCursor.find({ endDate: 0 }).sort({ startDate: -1 }).toArray())), 
                        ...JSON.parse(JSON.stringify(await projectsCursor.find({ endDate: { $gt: 0 } }).sort({ endDate: -1 }).toArray()))];
            photosList = await getImages(IMAGES_URL);
        }

        let portfolioExps: any[] = [];
        let experiences = [...jobExperiences, ...education, ...internships, ...projects];

        await new Promise((resolve, reject) => {
            experiences.forEach(async (experience, idx) => {
                let expPortfolio = JSON.parse(JSON.stringify(await db.collection('expPortfolios').findOne({experience: experience._id})));
                if (!expPortfolio) {
                    expPortfolio = {
                        experience: experience._id,
                        description: ''
                    }
                    let result = await db.collection('expPortfolios').insertOne(expPortfolio);
                    expPortfolio._id = result.insertedId.toString();
                }
                if (isAdmin || expPortfolio.description)
                {
                    portfolioExps.push({
                        _id: expPortfolio._id,
                        experience,
                        description: expPortfolio.description
                    })
                }
                if (idx === (experiences.length - 1)) {
                    resolve(true);
                }
            })
        });

        let props = {
            forExport: exportPDF,
            isAdmin,
            portfolioExps,
            photosList
        };

        if (isServer && exportPDF) {
            props.forExport = true;
            props.isAdmin = false;
            const buffer = await pdfHelper.componentToPDFBuffer(
                <PDFLayout>
                    <Portfolio {...props}/>
                </PDFLayout>,
                'Portfolio'
            );
    
            // with this header, your browser will prompt you to download the file
            // without this header, your browse will open the pdf directly
            context.res!.setHeader('Content-disposition', `attachment; filename="${DATE_STRING}_Tsirkunenko_Portfolio.pdf"`);
            
            // set content type
            context.res!.setHeader('Content-Type', 'application/pdf');
      
            // output the pdf buffer. once res.end is triggered, it won't trigger the render method
            context.res!.end(buffer);
        }
        return {props};
    } catch (e) {
        console.error(e);
    }
    return {
        props: {
            shortVersion: false,
            forExport: false,
            isAdmin: false,
            portfolioExps: [],
            photosList: []
        }
    };
}