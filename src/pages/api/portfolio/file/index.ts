import { NextApiRequest, NextApiResponse } from "next";
import { parseForm, FormidableError, convertToRelativePath, ROOT_UPLOAD_DIR, convertToAbsolutePath } from "@/lib/parse-form";
import { readdir } from "fs/promises";

export const IMAGES_URL = '/image/portfolio';
export const IMAGES_PATH = `${ROOT_UPLOAD_DIR}${IMAGES_URL}`;

export const API_URL = '/api/portfolio/file'

const IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'svg', 'gif'];

const convertToApiPath = (filePath: string) => {
  return `${API_URL}${convertToRelativePath(filePath).replace(IMAGES_URL, '')}`;
}

export const getFiles = async (dirpath: string) => {
  try {
    let files = await readdir(convertToAbsolutePath(dirpath));
    files = await Promise.all(files.map((async (file) => {
      return convertToApiPath(`/${file}`);
    })))
    return files;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export const getImages = async (dirpath: string) => {
  let files = await getFiles(dirpath);
  let images = await Promise.all(files.filter(((file) => {
    let splitStr = file.split('.');
    if (splitStr.length) {
      let extension = splitStr[splitStr.length - 1];
      return IMAGE_TYPES.includes(extension);
    }
    return false;
  })))
  return images;
}

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<{
      data: {
        url: string | string[];
      } | null;
      error: string | null;
    }>
  ) => {
    if (req.method === "GET") {
      let images = await getFiles(IMAGES_URL);
      res.status(200).send({data: {url: images}, error: null});
      return;
    }
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      res.status(405).json({
        data: null,
        error: "Method Not Allowed",
      });
      return;
    }
    // Just after the "Method Not Allowed" code
    try {
      const { fields, files } = await parseForm(req, IMAGES_PATH);
  
      const file = files.media;
      let url = Array.isArray(file) ? file.map((f) => convertToApiPath(f.filepath)) : convertToApiPath(file.filepath);
  
      res.status(200).json({
        data: {
          url,
        },
        error: null,
      });
    } catch (e) {
      if (e instanceof FormidableError) {
        res.status(e.httpCode || 400).json({ data: null, error: e.message });
      } else {
        console.error(e);
        res.status(500).json({ data: null, error: "Internal Server Error" });
      }
    }
  };
  
  export const config = {
    api: {
      bodyParser: false,
    },
  };
  
  export default handler;
