import { renderToStaticMarkup } from 'react-dom/server';
import puppeteer from 'puppeteer';

const IMG_RE = /<img(.|\n)*src="([^"]*)/g;

const componentToPDFBuffer = async (component: any) => {
    let html = renderToStaticMarkup(component);
    let match;
    do {
        match = IMG_RE.exec(html);
        if (match) {
            html.replace(match[2], `${process.env.PUPPETEER_URL}${match[2]}`);
        }
    } while (match);
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        headless: 'new',
        ignoreHTTPSErrors :true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--allow-file-access-from-files',
            '--enable-local-file-accesses'
        ]
    });

    const page = await browser.newPage();
    await page.goto(`data:text/html,${html}`, {
        waitUntil: [
            'domcontentloaded', 
            'networkidle0', 
            'load'
        ], 
        timeout: 30000
    });
    await page.emulateMediaType('screen');
    const pdf = await page.pdf({
        format: 'A4',
        scale: 0.7,
        margin: {
            top: '40px',
            bottom: '40px',
            left: '20px',
            right: '20px',
        },
        printBackground: true
    });
    await browser.close();
    return pdf;
}

export default {
    componentToPDFBuffer
}
