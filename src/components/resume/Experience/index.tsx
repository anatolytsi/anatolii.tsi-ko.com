import { IExperience, IExperienceListProps, ICommonExperienceProps } from './common';
import { ExpAdd as AddNew } from './ExpAdd';
import { ExpContent as Content } from './ExpContent';
import { ExpDate as Date, ExpDates as Dates } from './ExpDates';
import { ExpDescription as Description } from './ExpDescription';
import { ExpEditableContent as EditableContent } from './ExpEditableContent';
import { ExpGrades as Grades } from './ExpGrades';
import { ExpHeader as Header } from './ExpHeader';
import { ExpHeaderLine as HeaderLine } from './ExpHeaderLine';
import { ExpList as List, IExpListProps } from './ExpList';
import { ExpPlace as Place } from './ExpPlace';
import { ExpTitle as Title } from './ExpTitle';
import { ExpTopic as Topic } from './ExpTopic';
import { ExpWebsite as Website } from './ExpWebsite';
import { ExpWebsites as Websites } from './ExpWebsite';
import { ExpIssuer as Issuer } from './ExpIssuer';
import { ExpCredentials as Credentials } from './ExpCredentials';
import { ExpConference as Conference } from './ExpConference';

export type {
    IExperience,
    IExperienceListProps,
    ICommonExperienceProps,
    IExpListProps
}

export {
    AddNew,
    Content,
    Date,
    Dates,
    Description,
    EditableContent,
    Grades,
    Header,
    HeaderLine,
    List,
    Place,
    Title,
    Topic,
    Website,
    Websites,
    Issuer,
    Credentials,
    Conference,
}

export const handleExpKeyDown = (event: any, isEditing: boolean, experience: IExperience, experienceSetter: any, handleSave: () => void) => {
    if (isEditing) {
        let charCode = String.fromCharCode(event.which).toLowerCase();
        if((event.ctrlKey || event.metaKey) && charCode === 's') {
            event.preventDefault();
            console.log(event.target)
            if (event.target.id && event.target.innerText && event.target.id in experience) {
                experienceSetter({...experience, [`${event.target.id}`]: event.target.innerText});
                // console.log(`${event.target.id}: ${event.target.innerText}`)
                handleSave();
            } else if (event.target.parentNode?.parentNode?.childNodes[5]?.className === 'CodeMirror-scroll' && 
                       event.target.parentNode?.parentNode?.childNodes[5]?.textContent && 
                       event.target.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.id &&
                       event.target.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.id in experience) {
                // Handle markdown area
                let compId = event.target.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.id;
                let text = event.target.parentNode?.parentNode?.childNodes[5]?.textContent;
                experienceSetter({...experience, [`${compId}`]: text});
                // console.log(`${compId}: ${text}`)
                handleSave();
            }
        }
    }
}

