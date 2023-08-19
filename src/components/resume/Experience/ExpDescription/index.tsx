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
const LINKS_PATTERN = /\[([^\[]+)\]/;

export const ExpDescription = ({ styles,
                                 isEditing,
                                 keyDown=() => {},
                                 forExport,
                                 setter,
                                 exp,
                                 shortVersion=false }: ICommonExperienceProps) => {
    
    const getDescription = () => {
        if (exp?.description && shortVersion) {
            let matches = [...exp?.description.matchAll(MAIN_POINTS_PATTERN)];
            let mainSkills: string[] = [];
            for (let arr of matches) {
                const [match, g1] = arr;
                const link = g1.match(LINKS_PATTERN)?.[1];
                mainSkills.push(link || g1);
            }
            let output = `${matches.length ? 'Keywords: ': ''}${[...new Set(mainSkills)].join(', ')}`;
            if (exp?.topic)
            {
                output = `Topic: ${exp?.topic}\n\n${output}`
            }
            return output;
        }
        return exp?.description;
    }

    return (
        <div
            id='description'
            className={styles.description}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onKeyDown={keyDown}
        >
            {isEditing ? 
                <SimpleMDEEditor
                    value={getDescription()}
                    onChange={value =>
                        setter({ ...exp, description: value })
                    }
                />
            :
                // <DescriptionClamp styles={styles} showClamp={!(forExport || shortVersion)}>
                    <Markdown>
                        {`${getDescription()}`}
                    </Markdown>
                // </DescriptionClamp>
            }
        </div>
    );
}