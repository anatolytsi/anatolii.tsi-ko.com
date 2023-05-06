import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { convertToAbsolutePath } from "@/lib/parse-form";
import { isArray } from "lodash";
import { IMAGES_URL } from ".";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const imagePath = isArray(req.query.slug) ? req.query.slug.join('/') : req.query.slug!;
  const imageBuffer = fs.readFileSync(convertToAbsolutePath(`${IMAGES_URL}/${imagePath}`).replace('..', '.'));
  res.setHeader("Content-Type", "image");
  return res.send(imageBuffer);
}