import React, { useRef } from "react";
import { faArrowDown, faArrowUp, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IPersonalInfo } from "@/components/resume/PersonalInfo/common";
import { IJobExperience, JobExperienceList, JobExperienceSection } from '@/components/resume/Job';
import { EduExperienceList, EduSection, IEduExperience } from '@/components/resume/Education';
import { IInternship, InternshipList, InternshipSection } from '@/components/resume/Internship';
import { ISimpleSkills, SkillsList, SkillsSection } from '@/components/resume/Skills';
import { ILanguage, LanguagesList, LanguagesSection } from '@/components/resume/Languages';
import { CertificationList, CertificationsSection, ICertification } from '@/components/resume/Certifications';
import { ProjectsList, IProject, ProjectsSection } from "@/components/resume/Projects";
import { PublicationsList, IPublication, PublicationsSection } from "@/components/resume/Publications";
import { HobbiesList, HobbiesSection, IHobby } from '@/components/resume/Hobbies';

export const WAIT_EFFECT = parseInt(process.env.WAIT_EFFECT ?? '2');

export interface IResumeComponentLists {
    shortVersion?: boolean
    forExport?: boolean
    isAdmin?: boolean
    editModeEnabled?: any
    personalInfo?: any
    resumeSections?: any
    jobExperience: typeof JobExperienceList;
    education: typeof EduExperienceList;
    internships: typeof InternshipList;
    skills: typeof SkillsList;
    languages: typeof LanguagesList;
    certifications: typeof CertificationList;
    publications: typeof PublicationsList;
    projects: typeof ProjectsList;
    hobbies: typeof HobbiesList;
};

export interface IResumeProps {
    shortVersion?: boolean
    forExport?: boolean
    isAdmin?: boolean
    editModeEnabled?: any
    resumeSections: any
    personalInfo: IPersonalInfo
    jobExperience: IJobExperience[]
    education: IEduExperience[]
    internships: IInternship[]
    skills: ISimpleSkills
    languages: ILanguage[]
    certifications: ICertification[]
    publications: IPublication[]
    projects: IProject[]
    hobbies: IHobby[]
}

export interface IResumeSectionComponent {
    data: any
    editModeEnabled: boolean
    sectionVisible: boolean
    forExport?: boolean
    shortVersion?: boolean
}

export interface IResumeComponentSections {
    forExport?: boolean
    shortVersion?: boolean
    isAdmin?: boolean
    editModeEnabled?: any
    personalInfo?: any
    resumeSections?: any
    jobExperience: typeof JobExperienceSection;
    education: typeof EduSection;
    internships: typeof InternshipSection;
    skills: typeof SkillsSection;
    languages: typeof LanguagesSection;
    certifications: typeof CertificationsSection;
    publications: typeof PublicationsSection;
    projects: typeof ProjectsSection;
    hobbies: typeof HobbiesSection;
}
  
export type TResumeSectionName = keyof IResumeComponentLists | keyof IResumeProps | keyof IResumeComponentSections;

export type TResumeSectionOrder = (section: TResumeSectionName, order: number) => void;
export type TResumeSectionVisibility = (section: TResumeSectionName, isVisible: boolean) => void;

export interface ICommonResumeSectionProps {
    editModeEnabled: boolean
    sectionName: TResumeSectionName
    order: number
    isVisible: boolean
    orderSetter: TResumeSectionOrder
    visibilitySetter: TResumeSectionVisibility
}

export const sortByKey = (skills: {[key: string]: any}, key: string, reverse: boolean=false) => {
    return skills.sort(function(a: {[key: string]: any}, b: {[key: string]: any}) {
        let order1: any = a[key]; 
        let order2: any = b[key];
        if (reverse) return ((order1 > order2) ? -1 : ((order1 < order2) ? 1 : 0));
        return ((order1 < order2) ? -1 : ((order1 > order2) ? 1 : 0));
    });
}

interface ISectionEditableProps extends ICommonResumeSectionProps {
    children: any
    editModeEnabled: boolean
    styles: any
}

export const SectionControls = ({ children, 
                                  editModeEnabled,
                                  styles, 
                                  sectionName,
                                  order,
                                  isVisible,
                                  orderSetter, 
                                  visibilitySetter }: ISectionEditableProps) => {

    return (
        <div className={styles.controlHeader}>
            {children}
            {editModeEnabled ? (
                <div className={styles.controls}>
                    <p className={styles.order}>{order}</p>
                    <button 
                        type="button" 
                        onClick={() => orderSetter(sectionName, order + 1)}
                        className={styles.editButton}
                    >
                        <FontAwesomeIcon icon={faArrowUp} size='lg' />
                    </button>
                    <button 
                        type="button" 
                        onClick={() => orderSetter(sectionName, order - 1)}
                        className={styles.editButton}
                    >
                        <FontAwesomeIcon icon={faArrowDown} size='lg' />
                    </button>
                    <button
                        type='button'
                        onClick={() => visibilitySetter(sectionName, !isVisible)}
                        className={styles.visibilityButton}
                    >
                    {isVisible ? 
                        (
                        <FontAwesomeIcon icon={faEye} size='lg' />
                        ) : (
                        <FontAwesomeIcon icon={faEyeSlash} size='lg' />
                        )
                    }
                    </button>
                </div>
            ) : (
                <></>
            )}
        </div>
    )
};