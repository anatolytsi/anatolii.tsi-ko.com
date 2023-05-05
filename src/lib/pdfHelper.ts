import { renderToStaticMarkup } from 'react-dom/server';
import pdf, { CreateOptions } from 'html-pdf';

const componentToPDFBuffer = (component: any) => {
    return new Promise((resolve, reject) => {
        let html = renderToStaticMarkup(component);
        // html = html.replace('h3', 'p');
        // html = html.replace('h4', 'p');
        // html = html.replace('h5', 'p');
        // html = html.replace('div', 'p');
        // html = html.replace('input', 'p');
        // html = html.replace('<p', '<p style="font-size: 8px;"');
        
        // html = html.replace('<p', '<p style="font-size: 14px;"');
        // html = html.replace('<p', '<p style="font-size: 14px;"');
        // html = html.replace('<p', '<p style="font-size: 14px;"');
        // html = html.replace('<p', '<p style="font-size: 14px;"');

        const options: CreateOptions = {
            format: 'A4',
            orientation: 'portrait',
            border: '10mm',
            footer: {
                height: '10mm',
            },
            type: 'pdf',
            timeout: 30000,
        };

        const buffer = pdf.create(html, options).toBuffer((err: any, buffer: any) => {
            if (err) {
                return reject(err);
            }
        
            return resolve(buffer);
        });
    });
}

export default {
    componentToPDFBuffer
}
