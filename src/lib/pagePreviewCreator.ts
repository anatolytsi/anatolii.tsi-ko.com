import { Page } from "puppeteer";
import { preparePage } from "./puppeteerHelper";
import { API_URL, IMAGES_URL, convertToApiPath } from "@/pages/api/pagePreviews";
import { getImagePath } from "@/pages/api/resume/file/[...slug]";

export const DEFAULT_EXTENSION = 'jpg'

export const createPagePreview = async (component: any, pageName: string) => {
    let apiPath = '';

    const callback = async (page: Page) => {
        let absolutePath = getImagePath(`${pageName}.${DEFAULT_EXTENSION}`, IMAGES_URL).replace('..', '.');
        console.log(absolutePath)
        apiPath = convertToApiPath(absolutePath);
        console.log(apiPath)
        await page.screenshot({ path: `${IMAGES_URL}/${pageName}.${DEFAULT_EXTENSION}` });
    }

    await preparePage(component, API_URL, IMAGES_URL, callback);

    return apiPath;
}