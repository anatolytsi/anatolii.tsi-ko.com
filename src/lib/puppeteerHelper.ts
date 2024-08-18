import fs from "fs";
import { renderToStaticMarkup } from 'react-dom/server';
import puppeteer, { Page, Viewport } from 'puppeteer';
import { getImageFromName } from '@/pages/api/resume/file/[...slug]';

const IMG_RE = /<img(.|\n)*src="([^"]*)/g;
const EXT_RE = /(?:\.([^.]+))?$/;

const PATH_FONT_1 = '../styles/fonts/tw_cen_mt.ttf';
const PATH_FONT_2 = '../styles/fonts/tw_cen_mt_bold.ttf';
const HEAD_END_HTML = '</head>';
const CUSTOM_FONT_CLASS_NAME = 'customFont';
const SRC_TO_REPLACE_STR = 'sourceToReplace';
const STYLE_CUSTOM_FONT = `
<style>
.${CUSTOM_FONT_CLASS_NAME} {
    @font-face {
        font-family: 'Tw Cen MT';
        src: ${SRC_TO_REPLACE_STR};
        font-weight: normal;
        font-style: normal;
    }
}
</style>`;
const MAIN_START_HTML = '<main>';
const MAIN_CUSTOM_FONT = `<main class="${CUSTOM_FONT_CLASS_NAME}">`;

const addCustomFont = (html: string): string => {
    html = html.replace(MAIN_START_HTML, MAIN_CUSTOM_FONT);

    let font1 = fs.readFileSync(PATH_FONT_1);
    let font2 = fs.readFileSync(PATH_FONT_2);
    let fontStyle = STYLE_CUSTOM_FONT.replace(SRC_TO_REPLACE_STR, 
        `url(data:application/font-woff2;charset=utf-8;base64,${font1.toString('base64')}),
        url(data:application/font-woff;charset=utf-8;base64,${font2.toString('base64')})`)
    html = html.replace(HEAD_END_HTML, `${fontStyle}\n${HEAD_END_HTML}`);

    console.log(`fontStyle: ${fontStyle}`);

    return html;
}

export const preparePage = async (component: any, imageUrl: string, imagesPath: string, callback: (page: Page) => Promise<void>,
                                  viewport: Viewport = {width: 0, height: 0}) => {
    let html = renderToStaticMarkup(component);
    let match;
    do {
        match = IMG_RE.exec(html);
        if (match) {
            let url = match[2];
            const imageName = url.replace(`${imageUrl}/`, '');
            const imageBuffer = getImageFromName(imageName, imagesPath);
            let extension = 'jpeg';
            if (imageName.includes('.')) {
                let m = EXT_RE.exec(imageName);
                extension = m ? m[1] : 'jpeg';
            }
            const imageForPdf = `data:image/${extension};charset=utf-8;base64,${imageBuffer.toString('base64')}`;
            html = html.replace(match[2], imageForPdf);
        }
    } while (match);
    html = addCustomFont(html);
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        ignoreHTTPSErrors :true,
        headless: 'new',
        args: [
            '--no-sandbox'
        ]
    });

    const page = await browser.newPage();
    await page.emulateMediaType('screen');
    if (viewport.width && viewport.height) {
        await page.setViewport(viewport);
    }
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });

    await callback(page);
        
    await browser.close();
}
