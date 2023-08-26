import { Page } from "puppeteer";
import { preparePage } from "./puppeteerHelper";
import { API_URL, IMAGES_URL, convertToApiPath } from "@/pages/api/pagePreviews";
import { getImagePath } from "@/pages/api/resume/file/[...slug]";

export const DEFAULT_EXTENSION = 'jpg'

export const createPagePreview = async (component: any, pageName: string) => {
    let apiPath = '';

    const callback = async (page: Page) => {
        let absolutePath = getImagePath(`${pageName}.${DEFAULT_EXTENSION}`, IMAGES_URL).replace('..', '.');
        apiPath = convertToApiPath(absolutePath);
        await page.screenshot({ path: absolutePath });
    }

    await preparePage(component, API_URL, IMAGES_URL, callback);

    return apiPath;
}