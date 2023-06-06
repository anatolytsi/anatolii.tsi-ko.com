import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IPersonalInfoCommonProps } from "./common"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export const Email = ({ personalInfo, styles, setter, keyDown, isEditing }: IPersonalInfoCommonProps) => {
    const isDisplayed = !!personalInfo?.email || isEditing;
    return (
        <div className={isDisplayed ? styles.contactItem : ''}>
            {isDisplayed ? 
                <FontAwesomeIcon icon={faEnvelope} />
            :<></>}
            <a href={`mailto:${personalInfo?.email}`}>
                <span
                    id='email'
                    onKeyDown={keyDown}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={e =>
                        setter({ ...personalInfo, email: e.target.innerText })
                    }
                >
                    {personalInfo?.email}
                </span>
            </a>
        </div>
    );
}
