export enum EWebsite {
    github = 'GitHub',
    website = 'Website',
    linkedin = 'LinkedIn'
}
  
export type IWebsite = {
    [key in EWebsite]: string;
}

export interface IPersonalInfo {
    _id?: string
    fullName: string
    birthday: number
    photoSrc: any
    address: string
    phone: string
    email: string
    summary: string
    websites?: IWebsite;
}

export interface IPersonalInfoCommonProps {
    personalInfo?: IPersonalInfo
    styles: any
    setter?: any
    isEditing: boolean
    keyDown?: any
    forExport?: boolean
    editModeEnabled?: boolean
    setSave?: any
    setEdit?: any
}
