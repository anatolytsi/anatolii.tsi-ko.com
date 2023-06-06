import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IPersonalInfoCommonProps } from "./common"
import { faPhone } from "@fortawesome/free-solid-svg-icons";

export const Phone = ({ personalInfo, styles, setter, keyDown, isEditing }: IPersonalInfoCommonProps) => {
    const isDisplayed = !!personalInfo!.phone || isEditing;
    return (
        <div className={isDisplayed ? styles.contactItem : ''}>
            {isDisplayed ? 
                <FontAwesomeIcon icon={faPhone} />
            :<></>}
            <span
                id='phone'
                onKeyDown={keyDown}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e =>
                    setter({ ...personalInfo, phone: e.target.innerText })
                }
            >
                {personalInfo!.phone}
            </span>
        </div>
    );
}
