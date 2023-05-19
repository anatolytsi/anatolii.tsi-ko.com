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
        ignoreHTTPSErrors :true,
        args: [
            '--no-sandbox'
        ]
    });

    const page = await browser.newPage();
    await page.emulateMediaType('screen');
    await page.goto(`${process.env.PUPPETEER_URL}/resume`);
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });
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
