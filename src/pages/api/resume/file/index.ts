import { NextApiRequest, NextApiResponse } from "next";
import { parseForm, FormidableError, convertToRelativePath } from "@/lib/parse-form";

export const IMAGES_URL = '/image/resume';
export const IMAGES_PATH = `/public${IMAGES_URL}`;

const API_URL = '/api/resume/file'

const convertToApiPath = (filePath: string) => {
  return `${API_URL}${convertToRelativePath(filePath)}`;
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
