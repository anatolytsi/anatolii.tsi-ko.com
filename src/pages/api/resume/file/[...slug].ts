import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { convertToAbsolutePath } from "@/lib/parse-form";
import { isArray } from "lodash";
import { IMAGES_URL } from ".";

export const getImagePath = (imageName: string) => {
  return convertToAbsolutePath(`${IMAGES_URL}/${imageName}`);
}

export const getImageFromName = (imageName: string) => {
  return fs.readFileSync(getImagePath(imageName).replace('..', '.'));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const imagePath = isArray(req.query.slug) ? req.query.slug.join('/') : req.query.slug!;
  const imageBuffer = getImageFromName(imagePath);
  res.setHeader("Content-Type", "image");
  return res.send(imageBuffer);
}