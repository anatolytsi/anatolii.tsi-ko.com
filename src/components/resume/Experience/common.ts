import { IResumeSectionComponent, sortByKey } from "../common"

export interface IExpWebsite {
    name: string
    link: string
}

export interface IExperience {
    _id?: number
    title: string
    isVisible: boolean
    place?: string
    placeLink?: string
    placeLocation?: string
    date?: number
    startDate?: number
    endDate?: number
    description?: string
    topic?: string
    grades?: string
    websites?: IExpWebsite[]
    issuer?: string
    issuerLink?: string
    credentialId?: string
    credentialLink?: string
    conference?: string
    conferenceLink?: string
    workType?: string
}

export interface IExperienceListProps extends IResumeSectionComponent {}

export interface ICommonExperienceProps {
    styles: any
    isEditing?: boolean
    setter?: any
    keyDown?: any
    exp?: IExperience
    children?: any
    forExport?: boolean
    isLast?: boolean
    editModeEnabled?: boolean
    saver?: any
    editor?: any
    deleter?: any
    website? : IExpWebsite
    websiteIdx?: number
    shortVersion?: boolean
}

export const sortByEndDate = (data: IExperience[]) => {
  let currentTime = (new Date()).getTime();  
  let experiences = data.map((exp: IExperience) => {
    if (!exp.endDate) {
      exp.endDate = currentTime;
    }
    return exp;
  });
  
  return sortByKey(experiences, 'endDate', true).map((exp: IExperience) => {
    if (exp.endDate === currentTime) {
      exp.endDate = 0;
    }
    return exp;
  });
}