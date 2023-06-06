import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import Markdown from 'markdown-to-jsx';

import { IPersonalInfoCommonProps } from "./common"
import { DescriptionClamp } from '../common/DescriptionClamp';

const SimpleMDEEditor = dynamic(
    () => import('react-simplemde-editor'),
    {ssr: false}
);

export const Summary = ({ personalInfo, styles, setter, keyDown, isEditing, forExport }: IPersonalInfoCommonProps) => {
    return (
        <>
            <h2>
                <FontAwesomeIcon icon={faListAlt} />
                Summary
            </h2>
            <div className={styles.summary} onKeyDown={keyDown}>
                {isEditing ? (
                <SimpleMDEEditor
                    value={personalInfo!.summary}
                    onChange={value =>
                        setter({ ...personalInfo, summary: value })
                    }
                />
                ) : (
                <DescriptionClamp styles={styles} showClamp={!forExport}>
                    <Markdown>{personalInfo!.summary}</Markdown>
                </DescriptionClamp>
                )}
            </div>
        </>
    );
}
