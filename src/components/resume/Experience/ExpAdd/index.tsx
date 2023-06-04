import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IExpAddProps {
    editModeEnabled: boolean
    handleAddExperience: any
    styles: any
}

export const ExpAdd = ({editModeEnabled, handleAddExperience, styles}: IExpAddProps) => {

    return (
        <>
            {editModeEnabled ?
                <button
                    type='button'
                    onClick={handleAddExperience}
                    className={styles.addExperience}
                >
                    <FontAwesomeIcon icon={faPlusCircle} size='lg' />
                </button>
            : ''}
        </>
    );
};
