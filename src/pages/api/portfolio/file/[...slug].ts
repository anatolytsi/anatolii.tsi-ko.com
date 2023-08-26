import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { isArray } from "lodash";
import { IMAGES_URL } from ".";
import { getImageFromName } from "../../resume/file/[...slug]";

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