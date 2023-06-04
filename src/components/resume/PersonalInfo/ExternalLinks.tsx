
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGlobe,
  faChain
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

import { EWebsite, IPersonalInfoCommonProps } from "./common"


interface IExternalLinkProps {
    isEditing: boolean
    styles: any
    name: EWebsite
    link: string | undefined
    icon: IconProp
    updater: any
}

export const ExternalLink = ({ isEditing,
                               styles,
                               name,
                               link='',
                               icon,
                               updater }: IExternalLinkProps) => {
    if (isEditing) {
        return (
            <div className={styles.website}>
                {name}:
                <span
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e =>
                    updater(name, e.target.innerText)
                }
                >
                {link}
                </span>
            </div>
        );
    } else {
        if (link) {
            return (
                <a className={styles.extLink} href={link}>
                <FontAwesomeIcon icon={icon} />
                </a>
            );
        } else {
            return <></>;
        }
    }
}

export const ExternalLinks = ({ personalInfo, styles, isEditing, setter }: IPersonalInfoCommonProps) => {
    const anyWebsites = !!personalInfo?.websites?.[EWebsite.website] || !!personalInfo?.websites?.[EWebsite.github] || !!personalInfo?.websites?.[EWebsite.linkedin];
    const updateWebsite = ( name: EWebsite, link: string ) => {
        let websites = {...personalInfo?.websites, [name]: link};
        setter({...personalInfo, websites });
    }
    return (
        <div className={styles.contactItem}>
            <div className={styles.websites}>
                {anyWebsites || isEditing ? 
                    <FontAwesomeIcon icon={faChain} />
                : <></>}
                <ExternalLink isEditing={isEditing} name={EWebsite.website} link={personalInfo?.websites?.[EWebsite.website]} icon={faGlobe} updater={updateWebsite} styles={styles}/>
                <ExternalLink isEditing={isEditing} name={EWebsite.github} link={personalInfo?.websites?.[EWebsite.github]} icon={faGithub} updater={updateWebsite} styles={styles}/>
                <ExternalLink isEditing={isEditing} name={EWebsite.linkedin} link={personalInfo?.websites?.[EWebsite.linkedin]} icon={faLinkedinIn} updater={updateWebsite} styles={styles}/>
            </div>
        </div>
    );
}
