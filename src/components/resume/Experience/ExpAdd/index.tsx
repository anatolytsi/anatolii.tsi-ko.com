import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IExpAddProps {
    isAdmin: boolean
    handleAddExperience: any
    styles: any
}

export const ExpAdd = ({isAdmin, handleAddExperience, styles}: IExpAddProps) => {

    return (
        <>
            {isAdmin ?
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
