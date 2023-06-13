import dynamic from 'next/dynamic';
import React from 'react';
import Markdown from 'markdown-to-jsx';
import 'easymde/dist/easymde.min.css';

import { ICommonExperienceProps } from '../common';
import { DescriptionClamp } from '../../common/DescriptionClamp';

const SimpleMDEEditor = dynamic(
    () => import('react-simplemde-editor'),
    {ssr: false}
);

const MAIN_POINTS_PATTERN = /\*\*([^\*]+)\*\*/g;

export const ExpDescription = ({ styles,
                                 isEditing,
                                 keyDown=() => {},
                                 forExport,
                                 setter,
                                 exp,
                                 shortVersion=false }: ICommonExperienceProps) => {       
    let description = exp?.description;
    if (description && shortVersion) {
        let matches = [...description.matchAll(MAIN_POINTS_PATTERN)];
        let mainSkills: string[] = [];
        for (let arr of matches) {
            const [match, g1] = arr;
            mainSkills.push(g1);
        }
        description = `${matches.length ? 'Keywords: ': ''}${[...new Set(mainSkills)].join(', ')}`;
    }

    const Description = () => {
        if (isEditing) {
            return <SimpleMDEEditor
                        value={exp?.description}
                        onChange={value =>
                            setter({ ...exp, description: value })
                        }
                    />
        } else {
            if (exp?.description) {
                return <DescriptionClamp styles={styles} showClamp={!(forExport || shortVersion)}>
                            <Markdown>
                                {`${description}`}
                            </Markdown>
                        </DescriptionClamp>
            } else {
                return <></>
            }
        }
    }

    return (
        <div
            id='description'
            className={styles.description}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onKeyDown={keyDown}
        >
            <Description />
        </div>
    );
}