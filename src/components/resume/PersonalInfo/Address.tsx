import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IPersonalInfoCommonProps } from "./common"
import { faHome } from "@fortawesome/free-solid-svg-icons";

export const Address = ({ personalInfo, styles, setter, keyDown, isEditing }: IPersonalInfoCommonProps) => {
    const isDisplayed = !!personalInfo?.address || isEditing;
    return (
        <div className={isDisplayed ? styles.contactItem : ''}>
            {isDisplayed ? 
                <FontAwesomeIcon icon={faHome} />
            :<></>}
            <span
                id='address'
                onKeyDown={keyDown}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e =>
                    setter({ ...personalInfo, address: e.target.innerText })
                }
            >
                {personalInfo?.address}
            </span>
        </div>
    );
}
