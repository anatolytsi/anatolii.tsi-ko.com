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

export const ExpDescription = ({ styles,
                                 isEditing,
                                 keyDown=() => {},
                                 showClamp,
                                 setter,
                                 exp }: ICommonExperienceProps) => {
    return (
        <div
            id='description'
            className={styles.description}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onKeyDown={keyDown}
        >
            {isEditing ? (
                <SimpleMDEEditor
                    value={exp?.description}
                    onChange={value =>
                        setter({ ...exp, description: value })
                    }
                />
            ) : (
                <DescriptionClamp styles={styles} showClamp={showClamp}>
                    <Markdown>
                        {`${exp?.description}`}
                    </Markdown>
                </DescriptionClamp>
            )}
        </div>
    );
}