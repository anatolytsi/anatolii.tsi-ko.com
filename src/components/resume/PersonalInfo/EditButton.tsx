import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IPersonalInfoCommonProps } from "./common"
import { faSave, faEdit } from "@fortawesome/free-solid-svg-icons";

export const EditButton = ({ styles, setSave, setEdit, isEditing, editModeEnabled }: IPersonalInfoCommonProps) => {
    if (editModeEnabled) {
      return (
        <div className={styles.controls}>
          <button 
              type="button" 
              onClick={isEditing ? setSave : setEdit}
              className={isEditing ? `${styles.editButton} ${styles.isEditing}` : styles.editButton}
          >
              {isEditing ? (
                  <FontAwesomeIcon icon={faSave} />
              ) : (
                  <FontAwesomeIcon icon={faEdit} />
              )}
          </button>
        </div>
      );
    }
    return <></>;
}
