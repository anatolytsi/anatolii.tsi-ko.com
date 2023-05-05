import React from 'react';
import { NextPageContext } from 'next';

import Resume from '@/pages/resume';
import { IResumeProps } from '@/components/resume/common';
import PDFLayout from '@/components/resume/PdfLayout';
import pdfHelper from '@/lib/pdfHelper';


export default function ResumePdf(props: IResumeProps) {
    return (
        <Resume {...props}/>
    )
}

ResumePdf.getInitialProps = async (context: NextPageContext) => {
    // const res = await fetch('https://api.github.com/repos/vercel/next.js')
    // const json = await res.json()
    // // return { stars: json.stargazers_count }
    const exportPDF = context.query.exportPDF === 'true';
    const isServer = !!context.req;
    const props: IResumeProps = {
        isAdmin: false,
        forExport: true,
        personalInfo: require('@/fixtures/personalInfo.json'),
        jobExperience: require('@/fixtures/jobs.json'),
        education: require('@/fixtures/education.json'),
        internships: require('@/fixtures/internship.json'),
        skills: require('@/fixtures/skills.json'),
        languages: require('@/fixtures/languages.json'),
        certifications: require('@/fixtures/certifications.json'),
        hobbies: require('@/fixtures/hobbies.json')
    };

    if (isServer && exportPDF) {
        const buffer = await pdfHelper.componentToPDFBuffer(
            <PDFLayout>
                <Resume {...props}/>
            </PDFLayout>
        );

        // with this header, your browser will prompt you to download the file
        // without this header, your browse will open the pdf directly
        context.res!.setHeader('Content-disposition', 'attachment; filename="CV_Tsirkunenko.pdf');
        
        // set content type
        context.res!.setHeader('Content-Type', 'application/pdf');

        // output the pdf buffer. once res.end is triggered, it won't trigger the render method
        context.res!.end(buffer);
    }

    return props;
}
