import React, { useRef } from "react";
import { faArrowDown, faArrowUp, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IPersonalInfo } from "@/components/resume/PersonalInfo";
import { IJobExperience, JobExperienceList } from '@/components/resume/Job';
import { EduExperienceList, IEduExperience } from '@/components/resume/Education';
import { IInternship, InternshipList } from '@/components/resume/Internship';
import { ISkill, SkillsList } from '@/components/resume/Skills';
import { ILanguage, LanguagesList } from '@/components/resume/Languages';
import { CertificationList, ICertification } from '@/components/resume/Certifications';
import { HobbiesList, IHobby } from '@/components/resume/Hobbies';

export interface IResumeComponentSections {
    forExport?: boolean
    isAdmin?: any
    personalInfo?: any
    jobExperience: typeof JobExperienceList;
    education: typeof EduExperienceList;
    internships: typeof InternshipList;
    skills: typeof SkillsList;
    languages: typeof LanguagesList;
    certifications: typeof CertificationList;
    hobbies: typeof HobbiesList;
};

export interface IResumeProps {
    forExport?: boolean
    isAdmin?: boolean
    personalInfo: IPersonalInfo
    jobExperience: IJobExperience[]
    education: IEduExperience[]
    internships: IInternship[]
    skills: ISkill[]
    languages: ILanguage[]
    certifications: ICertification[]
    hobbies: IHobby[]
}
  
export type TResumeSectionName = keyof IResumeComponentSections | keyof IResumeProps;

export interface IResumeSectionComponent {
    data: any
    isAdmin: boolean
    forExport?: boolean
    key?: number
    sectionName?: TResumeSectionName
    sectionOrder?: number
    sectionVisibility?: boolean
    handleSectionVisibility?: any
    handleSectionOrder?: any
}

export const sortByKey = (skills: {[key: string]: any}, key: string, reverse: boolean=false) => {
    return skills.sort(function(a: {[key: string]: any}, b: {[key: string]: any}) {
        let order1: any = a[key]; 
        let order2: any = b[key];
        if (reverse) return ((order1 > order2) ? -1 : ((order1 < order2) ? 1 : 0));
        return ((order1 < order2) ? -1 : ((order1 > order2) ? 1 : 0));
    });
}

interface ISectionEditableProps {
    children: any
    isAdmin: boolean
    styles: any
    visibilityState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    orderingState: [number, React.Dispatch<React.SetStateAction<number>>]
}

export const SectionControls = ({ children, 
                                  isAdmin,
                                  styles, 
                                  visibilityState, 
                                  orderingState }: ISectionEditableProps) => {

    return (
        <div className={styles.controlHeader}>
            {children}
            {isAdmin ? (
                <div className={styles.controls}>
                    <button 
                        type="button" 
                        onClick={() => {orderingState[1](orderingState[0] + 1)}}
                        className={styles.editButton}
                    >
                        <FontAwesomeIcon icon={faArrowUp} size='lg' />
                    </button>
                    <button 
                        type="button" 
                        onClick={() => {orderingState[1](orderingState[0] - 1)}}
                        className={styles.editButton}
                    >
                        <FontAwesomeIcon icon={faArrowDown} size='lg' />
                    </button>
                    <button
                        type='button'
                        onClick={() => {visibilityState[1](!visibilityState[0])}}
                        className={styles.visibilityButton}
                    >
                    {visibilityState[0] ? 
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