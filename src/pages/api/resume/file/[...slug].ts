import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { convertToAbsolutePath } from "@/lib/parse-form";
import { isArray } from "lodash";
import { IMAGES_URL } from ".";

export const getImagePath = (imageName: string, path: string) => {
  return convertToAbsolutePath(`${path}/${imageName}`);
}

export const getImageFromName = (imageName: string, path: string) => {
  try {
    return fs.readFileSync(getImagePath(imageName, path).replace('..', '.'));
  } catch (e) {
    console.error(e);
    return '';
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const imagePath = isArray(req.query.slug) ? req.query.slug.join('/') : req.query.slug!;
  const imageBuffer = getImageFromName(imagePath, IMAGES_URL);
  if (imageBuffer) {
    // res.setHeader("Content-Type", "image");
    res.setHeader("Content-Type", ["text/plain", "charset=x-user-defined"]);
    return res.status(200).send(imageBuffer);
  }
  return res.status(404);
}