import { IPersonalInfoCommonProps } from "./common"

export const FullName = ({ personalInfo, styles, setter, keyDown, isEditing }: IPersonalInfoCommonProps) => {
    return (
        <h1 
            id='fullName'
            onKeyDown={keyDown}
            className={styles.name}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={e =>
                setter({ ...personalInfo, fullName: e.target.innerText })
            }
        >
            {personalInfo!.fullName}
        </h1>
    );
}
