import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faPencil, faSave, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

import '@fortawesome/fontawesome-svg-core/styles.css';

import { IResumeComponentLists, IResumeComponentSections, IResumeProps, TResumeSectionName, TResumeSectionOrder, TResumeSectionVisibility, sortByKey } from '@/components/resume/common';
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
        link.setAttribute('download', 'exportedResume.json'); //or any other extension
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
      compUpdate('resumeSections', section, section._id);
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

  return (
    <>
    <Head>
      <title>Resume</title>
      <meta name="description" content="Anatolii Tsirkunenko Resume" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    {props.forExport ? (
      <></>
    ) : (
      <>
        <a href="/resume?pdf=true"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.downloadButton}
        >
            <FontAwesomeIcon icon={faFilePdf} size='xl' />
        </a>
        {renderAdminButtons()}
      </>
    )}
    <div className={`${styles.resume} ${props.forExport && styles.forExport}`} id={styles.root}>
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
                                                      forExport: props.forExport })}
            </div>
        ))}
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

    const personalInfo = await db.collection('personalInfo').findOne();
    const skills = await db.collection('skills').findOne();
    
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

    if (exportPDF || !isAdmin) {
      resumeSections = await resumeSectionsCur.filter({ isVisible: true }).toArray()
      jobExperience = await jobExperienceCur.filter({ isVisible: true }).toArray()
      education = await educationCur.filter({ isVisible: true }).toArray()
      internships = await internshipsCur.filter({ isVisible: true }).toArray()
      languages = await languagesCur.filter({ isVisible: true }).toArray()
      certifications = await certificationsCur.filter({ isVisible: true }).toArray()
      projects = await projectsCur.filter({ isVisible: true }).toArray()
      publications = await publicationsCur.filter({ isVisible: true }).toArray()
      hobbies = await hobbiesCur.filter({ isVisible: true }).toArray()
    } else {
      resumeSections = await resumeSectionsCur.toArray()
      jobExperience = await jobExperienceCur.toArray()
      education = await educationCur.toArray()
      internships = await internshipsCur.toArray()
      languages = await languagesCur.toArray()
      certifications = await certificationsCur.toArray()
      projects = await projectsCur.toArray()
      publications = await publicationsCur.toArray()
      hobbies = await hobbiesCur.toArray()
    }

    const props: IResumeProps = {
      forExport: false,
      isAdmin,
      resumeSections: JSON.parse(JSON.stringify(resumeSections)),
      personalInfo: JSON.parse(JSON.stringify(personalInfo)),
      jobExperience: JSON.parse(JSON.stringify(jobExperience)),
      education: JSON.parse(JSON.stringify(education)),
      internships: JSON.parse(JSON.stringify(internships)),
      skills: JSON.parse(JSON.stringify(skills)),
      languages: JSON.parse(JSON.stringify(languages)),
      certifications: JSON.parse(JSON.stringify(certifications)),
      projects: JSON.parse(JSON.stringify(projects)),
      publications:  JSON.parse(JSON.stringify(publications)),
      hobbies: JSON.parse(JSON.stringify(hobbies))
    }

    if (isServer && exportPDF) {
        props.forExport = true;
        props.isAdmin = false;
        const buffer = await pdfHelper.componentToPDFBuffer(
            <PDFLayout>
                <Resume {...props}/>
            </PDFLayout>
        );
  
        let date = new Date();
        // with this header, your browser will prompt you to download the file
        // without this header, your browse will open the pdf directly
        context.res!.setHeader('Content-disposition', `attachment; filename="CV_Tsirkunenko_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}.pdf`);
        
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
