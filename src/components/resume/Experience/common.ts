import { IResumeSectionComponent } from "../common"

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

export interface IExperienceListProps extends IResumeSectionComponent {
    isAdmin: boolean
}

export interface ICommonExperienceProps {
    styles: any
    isEditing?: boolean
    setter?: any
    keyDown?: any
    exp?: IExperience
    children?: any
    showClamp?: boolean
    isLast?: boolean
    isAdmin?: boolean
    saver?: any
    editor?: any
    deleter?: any
    website? : IExpWebsite
    websiteIdx?: number
}