import { Page } from "puppeteer";
import { preparePage } from "./puppeteerHelper";
import { IMAGES_URL, convertToApiPath } from "@/pages/api/pagePreviews";
import { getImagePath } from "@/pages/api/resume/file/[...slug]";

export const DEFAULT_EXTENSION = 'jpg'

export const createPagePreview = async (component: any, imageUrl: string, imagePath: string, pageName: string) => {
    let apiPath = '';

    const callback = async (page: Page) => {
        let absolutePath = getImagePath(`${pageName}.${DEFAULT_EXTENSION}`, IMAGES_URL).replace('..', '.');
        apiPath = convertToApiPath(absolutePath);
        await page.screenshot({ path: absolutePath, fullPage: true });
    }

    await preparePage(component, imageUrl, imagePath, callback, {width: 1280, height: 1527});

    return apiPath;
}