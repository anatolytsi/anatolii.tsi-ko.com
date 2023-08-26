import { Page } from 'puppeteer';
import { preparePage } from './puppeteerHelper';

const FOOTER_TEMPLATE = `
<div style="display: flex; justify-content: space-between; width: 297mm; font-size: 8px;">
    <div style="margin-left: 1.0cm; color: #969696;"> 
        Anatolii Tsirkunenko | %s
    </div>
    <div style="margin-right: 1.0cm; color: #969696;"> 
        Page <span class="pageNumber"></span> of <span class="totalPages"></span>
    </div>
</div>`;
const FOOTER_TEMPLATE_SINGLE = `
<div style="display: flex; justify-content: center; width: 297mm; font-size: 8px;">
    <div style="color: #969696;"> 
        Anatolii Tsirkunenko | %s
    </div>
</div>`;

const componentToPDFBuffer = async (component: any, imageUrl: string, imagePath: string, pageName='Resume', singlePage=false) => {
    let pdf: any;
    const callback = async (page: Page) => {
        pdf = await page.pdf({
            format: 'A4',
            scale: 0.65,
            margin: {
                top: '1.2cm',
                bottom: '1.0cm',
                left: '1.0cm',
                right: '1.0cm',
            },
            displayHeaderFooter: true,
            headerTemplate: "<div/>",
            footerTemplate: (singlePage ? FOOTER_TEMPLATE_SINGLE : FOOTER_TEMPLATE).replace('%s', pageName),
            printBackground: true
        });
    }

    await preparePage(component, imageUrl, imagePath, callback);

    return pdf;
}

export default {
    componentToPDFBuffer
}
