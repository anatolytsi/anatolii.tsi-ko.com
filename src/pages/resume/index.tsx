import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faPencil, faSave, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

import '@fortawesome/fontawesome-svg-core/styles.css';

import { ICommonReqResumeSectionProps, IResumeComponentLists, IResumeComponentSections, IResumeProps, IResumeReqSectionComponent, TResumeSectionName, TResumeSectionOrder, TResumeSectionVisibility, sortByKey } from '@/components/resume/common';
import { PersonalInfo } from '@/components/resume/PersonalInfo';
import { JobExperienceList, JobExperienceSection } from '@/components/resume/Job';
import { EduExperienceList, EduSection } from '@/components/resume/Education';
import { InternshipList, InternshipSection } from '@/components/resume/Internship';
import { SkillsList, SkillsSection } from '@/components/resume/Skills';
import { LanguagesList, LanguagesSection } from '@/components/resume/Languages';
import { CertificationList, CertificationsSection } from '@/components/resume/Certifications';
import { ProjectsList, ProjectsSection } from '@/components/resume/Projects';
import { PublicationsList, PublicationsSection } from '@/components/resume/Publications';
import { HobbiesList, HobbiesSection } from '@/components/resume/Hobbies';

import styles from './resume.module.scss';
import { getSession } from 'next-auth/react';
import { NextPageContext } from 'next';
import Head from 'next/head';
import clientPromise from '@/lib/mongodb';
import PDFLayout from '@/components/resume/PdfLayout';
import pdfHelper from '@/lib/pdfHelper';
import axios from 'axios';
import Router from 'next/router';
import { compUpdate } from '@/components/resume/common/api-helpers';

interface IResumeSection {
  _id?: string
  name: TResumeSectionName
  isVisible: boolean
  order: number
}

const TODAY = new Date();
const DATE_STRING = TODAY.toISOString().slice(0, 10).replaceAll('-', '');

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
      axios.post('/api/resume', file, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        Router.reload();
      })
    }
  }

  const exportJson = () => {
    axios.get('/api/resume', {responseType: 'blob'})
      .then((response) => {
        // create file link in browser's memory
        const href = URL.createObjectURL(response.data);
    
        // create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', `${DATE_STRING}_resumeData.json`); //or any other extension
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

const PdfDownloadButton = () => {
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

  return (
    <>
      <div 
        className={`${styles.downloadButton}`}
        onClick={() => {setIsOpen(!isOpen)}}
      >
        <span className={isOpen ? `${styles.downloadTooltipText} ${styles.opened}` : styles.downloadTooltipText}>
          Download PDF
        </span>
        <FontAwesomeIcon icon={faFilePdf} size='xl' />
      </div>
      <div className={isOpen ? `${styles.downloadPanel} ${styles.opened}` : styles.downloadPanel}
           ref={ref}>
        <a className={styles.downloadEl}
           href="/resume?pdf=true"
           target="_blank"
           rel="noopener noreferrer"
        >
          Download Full
        </a>
        <a className={styles.downloadEl}
           href="/resume?pdf=true&outline=true"
           target="_blank"
           rel="noopener noreferrer"
        >
          Download Short
        </a>
      </div>
    </>
  );
}

const PdfDownloadButtonSingle = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <a
      href="/resume?pdf=true"
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

export default function Resume( props: IResumeProps ) {
  let resumeListsMapping: IResumeComponentLists = {
    jobExperience: JobExperienceList,
    education: EduExperienceList,
    internships: InternshipList,
    skills: SkillsList,
    languages: LanguagesList,
    certifications: CertificationList,
    projects: ProjectsList,
    publications: PublicationsList,
    hobbies: HobbiesList,
  }
  
  let resumeSectionsMapping: IResumeComponentSections = {
    jobExperience: JobExperienceSection,
    education: EduSection,
    internships: InternshipSection,
    skills: SkillsSection,
    languages: LanguagesSection,
    certifications: CertificationsSection,
    projects: ProjectsSection,
    publications: PublicationsSection,
    hobbies: HobbiesSection,
  }

  const [resumeSections, setResumeSections] = useState<IResumeSection[]>(sortByKey(props.resumeSections, 'order', true));
  const [editModeEnabled, setEditModeEnabled] = useState(false);
  const [isReloadPending, setIsReloadPending] = useState(false);

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

  const changeResumeSection = (name: TResumeSectionName, parameter: string, value: number | boolean ) => {
    let section: IResumeSection | undefined;
    setResumeSections((previousResumeSections: IResumeSection[]) =>
      previousResumeSections.map((resumeSection: IResumeSection, idx: number) => {
        if (resumeSection.name === name) {
            section = {...resumeSection, [parameter]: value};
            return section;
        } else {
          return resumeSection;
        }
      }))
    if (section?._id) {
      compUpdate('resume', 'resumeSections', section, section._id);
    }
  };

  const handleSectionVisibility: TResumeSectionVisibility = (section, isVisible) => {
    changeResumeSection(section, 'isVisible', isVisible);
  }

  const handleSectionOrder: TResumeSectionOrder = (section, order) => {
    changeResumeSection(section, 'order', order);
    setIsReloadPending(true);
  }

  const updateResumeSections = () => {
    if (isReloadPending) {
      Router.reload();
    }
  }

  const renderEditResume = () => {
    if (editModeEnabled) {
      return (
        <div 
          className={`${styles.editResume} ${styles.stop}`}
          onClick={() => {
            setEditModeEnabled(false);
            updateResumeSections();
          }}
        >
          <FontAwesomeIcon icon={faSave} size='xl' />
        </div>
      );
    } else {
      return (
        <div 
          className={`${styles.editResume} ${styles.edit}`}
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
          {renderEditResume()}
          <RestButton/>
        </>
      )
    }
    return <></>;
  }

  const commonSectionProps: ICommonReqResumeSectionProps = {
    editModeEnabled: editModeEnabled,
    order: 0, 
    isVisible: true,
    orderSetter: handleSectionOrder,
    visibilitySetter: handleSectionVisibility,
    shortVersion: props.shortVersion
  }

  const commonSectionCompProps: IResumeReqSectionComponent = {
    editModeEnabled: editModeEnabled, 
    sectionVisible: true,
    forExport: props.forExport,
    shortVersion: props.shortVersion
  }

  return (
    <>
    <Head>
      <title>Resume{props.forExport ? ' Export' : ''} | Anatolii Tsirkunenko</title>
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
    <div className={`${styles.resume} ${props.forExport ? styles.forExport : ''}`} id={styles.root}>
      {props.shortVersion ? 
        <div className={styles.onePage}>
          <PersonalInfo
            data={props?.personalInfo}
            editModeEnabled={editModeEnabled}
            forExport={props.forExport}
            singlePage={props.shortVersion}
          />
          <div className={styles.container}>
            <div className={styles.left}>
              {resumeSectionsMapping['jobExperience']({ ...commonSectionProps, sectionName: 'jobExperience' })}
              {resumeListsMapping['jobExperience']({ ...commonSectionCompProps, data: props['jobExperience'] })}
              {resumeSectionsMapping['projects']({ ...commonSectionProps, sectionName: 'projects' })}
              {resumeListsMapping['projects']({ ...commonSectionCompProps, data: props['projects'] })}
              {resumeSectionsMapping['education']({ ...commonSectionProps, sectionName: 'education' })}
              {resumeListsMapping['education']({ ...commonSectionCompProps, data: props['education'] })}
            </div>
            <div className={styles.right}>
              {resumeSectionsMapping['skills']({ ...commonSectionProps, sectionName: 'skills' })}
              {resumeListsMapping['skills']({ ...commonSectionCompProps, data: props['skills'] })}
              {resumeSectionsMapping['certifications']({ ...commonSectionProps, sectionName: 'certifications' })}
              {resumeListsMapping['certifications']({ ...commonSectionCompProps, data: props['certifications'] })}
              {resumeSectionsMapping['publications']({ ...commonSectionProps, sectionName: 'publications' })}
              {resumeListsMapping['publications']({ ...commonSectionCompProps, data: props['publications'] })}
              {resumeSectionsMapping['hobbies']({ ...commonSectionProps, sectionName: 'hobbies' })}
              {resumeListsMapping['hobbies']({ ...commonSectionCompProps, data: props['hobbies'] })}
            </div>
          </div>
        </div>
      :
        <>
          <PersonalInfo
            data={props?.personalInfo}
            editModeEnabled={editModeEnabled}
            forExport={props.forExport}
          />
          {resumeSections.map((resumeSection: IResumeSection, idx: number) => (
            <div key={idx}>
              {resumeSectionsMapping[resumeSection.name]({ editModeEnabled: editModeEnabled, 
                                                          sectionName: resumeSection.name,
                                                          order: resumeSection.order, 
                                                          isVisible: resumeSection.isVisible,
                                                          orderSetter: handleSectionOrder,
                                                          visibilitySetter: handleSectionVisibility })}
              {resumeListsMapping[resumeSection.name]({ data: props[resumeSection.name],
                                                        editModeEnabled: editModeEnabled, 
                                                        sectionVisible: resumeSection.isVisible,
                                                        forExport: props.forExport,
                                                        shortVersion: props.shortVersion })}
              </div>
          ))}
        </>
      }
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
    const singlePage = context.query.singlePage === 'true';
    const phoneAllow = context.query.phone === 'true';
    const isServer = !!context.req;

    if (!collectionNames.length) {
      await db.collection('personalInfo').insertOne(require('@/fixtures/personalInfo.json'));
      await db.collection('skills').insertOne(require('@/fixtures/skills.json'));
      await db.collection('resumeSections').insertMany(require('@/fixtures/resumeSections.json'));
      await db.collection('jobExperience').insertMany(require('@/fixtures/jobExperience.json'));
      await db.collection('education').insertMany(require('@/fixtures/education.json'));
      await db.collection('internships').insertMany(require('@/fixtures/internships.json'));
      await db.collection('languages').insertMany(require('@/fixtures/languages.json'));
      await db.collection('certifications').insertMany(require('@/fixtures/certifications.json'));
      await db.collection('projects').insertMany(require('@/fixtures/projects.json'));
      await db.collection('publications').insertMany(require('@/fixtures/publications.json'));
      await db.collection('hobbies').insertMany(require('@/fixtures/hobbies.json'));
    }

    let personalInfo = JSON.parse(JSON.stringify(await db.collection('personalInfo').findOne()));
    const skills = JSON.parse(JSON.stringify(await db.collection('skills').findOne()));
    
    const resumeSectionsCur = db.collection('resumeSections').find({});
    const jobExperienceCur = db.collection('jobExperience').find({});
    const educationCur = db.collection('education').find({});
    const internshipsCur = db.collection('internships').find({});
    const languagesCur = db.collection('languages').find({});
    const certificationsCur = db.collection('certifications').find({});
    const projectsCur = db.collection('projects').find({});
    const publicationsCur = db.collection('publications').find({});
    const hobbiesCur = db.collection('hobbies').find({});
    
    let resumeSections;
    let jobExperience;
    let education;
    let internships;
    let languages;
    let certifications;
    let projects;
    let publications;
    let hobbies;

    if (!isAdmin && !phoneAllow)
    {
      personalInfo['phone'] = '';
    }

    if (exportPDF || !isAdmin) {
      resumeSections = JSON.parse(JSON.stringify(await resumeSectionsCur.filter({ isVisible: true }).toArray()))
      jobExperience = JSON.parse(JSON.stringify(await jobExperienceCur.filter({ isVisible: true, startDate: { $lt: TODAY.getTime() } }).toArray()))
      education = JSON.parse(JSON.stringify(await educationCur.filter({ isVisible: true, startDate: { $lt: TODAY.getTime() } }).toArray()))
      internships = JSON.parse(JSON.stringify(await internshipsCur.filter({ isVisible: true, startDate: { $lt: TODAY.getTime() } }).toArray()))
      languages = JSON.parse(JSON.stringify(await languagesCur.filter({ isVisible: true }).toArray()))
      certifications = JSON.parse(JSON.stringify(await certificationsCur.filter({ isVisible: true }).toArray()))
      projects = JSON.parse(JSON.stringify(await projectsCur.filter({ isVisible: true, startDate: { $lt: TODAY.getTime() } }).toArray()))
      publications = JSON.parse(JSON.stringify(await publicationsCur.filter({ isVisible: true }).toArray()))
      hobbies = JSON.parse(JSON.stringify(await hobbiesCur.filter({ isVisible: true }).toArray()))
    } else {
      resumeSections = JSON.parse(JSON.stringify(await resumeSectionsCur.toArray()))
      jobExperience = JSON.parse(JSON.stringify(await jobExperienceCur.toArray()))
      education = JSON.parse(JSON.stringify(await educationCur.toArray()))
      internships = JSON.parse(JSON.stringify(await internshipsCur.toArray()))
      languages = JSON.parse(JSON.stringify(await languagesCur.toArray()))
      certifications = JSON.parse(JSON.stringify(await certificationsCur.toArray()))
      projects = JSON.parse(JSON.stringify(await projectsCur.toArray()))
      publications = JSON.parse(JSON.stringify(await publicationsCur.toArray()))
      hobbies = JSON.parse(JSON.stringify(await hobbiesCur.toArray()))
    }

    // if (singlePage) {
    //   resumeSections = resumeSections.filter((el: any) => el.name !== 'certifications');
    // }

    const props: IResumeProps = {
      shortVersion: singlePage,
      forExport: false,
      isAdmin,
      resumeSections,
      personalInfo,
      jobExperience,
      education,
      internships,
      skills,
      languages,
      certifications,
      projects,
      publications,
      hobbies
    }

    if (isServer && exportPDF) {
        props.forExport = true;
        props.isAdmin = false;
        const buffer = await pdfHelper.componentToPDFBuffer(
            <PDFLayout>
                <Resume {...props}/>
            </PDFLayout>,
            'Resume',
            singlePage
        );

        let prefix = singlePage ? 'SinglePage_' : '';
        // with this header, your browser will prompt you to download the file
        // without this header, your browse will open the pdf directly
        context.res!.setHeader('Content-disposition', `attachment; filename="${DATE_STRING}_${prefix}Tsirkunenko_CV.pdf"`);
        
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
      resumeSections: require('@/fixtures/resumeSections.json'),
      personalInfo: {},
      jobExperience: [],
      education: [],
      internships: [],
      skills: {},
      languages: [],
      certifications: [],
      projects: [],
      publications: [],
      hobbies: []
    }
  };
}
