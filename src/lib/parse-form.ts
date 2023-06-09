import type { NextApiRequest } from "next";
import mime from "mime";
import { join } from "path";
import formidable from "formidable";
import { mkdir, stat } from "fs/promises";

export const FormidableError = formidable.errors.FormidableError;

export const ROOT_UPLOAD_DIR = '/uploads';

export const convertToRelativePath = (filePath: string) => {
  return filePath.replace(process.env.ROOT_DIR || process.cwd(), '').replaceAll('\\', '/').replace(ROOT_UPLOAD_DIR, '');
}

export const convertToAbsolutePath = (filePath: string) => {
  return `${process.env.ROOT_DIR || process.cwd()}${ROOT_UPLOAD_DIR}${filePath}`;
}

export const parseForm = async (
  req: NextApiRequest, uploadPath: string
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return await new Promise(async (resolve, reject) => {
    const uploadDir = join(
      process.env.ROOT_DIR || process.cwd(),
      uploadPath
    );

    try {
      await stat(uploadDir);
    } catch (e: any) {
      if (e.code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true });
      } else {
        console.error(e);
        reject(e);
        return;
      }
    }

    const form = formidable({
      maxFiles: 10,
      maxFileSize: 1024 * 1024 * 10, // 10mb
      uploadDir,
      filename: (_name, _ext, part) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${part.name || "unknown"}-${uniqueSuffix}.${
          mime.getExtension(part.mimetype || "") || "unknown"
        }`;
        return filename;
      },
      filter: (part) => {
        return (
          part.name === "media" && (part.mimetype?.includes("image") || false)
        );
      },
    });

    form.parse(req, function (err, fields, files) {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};
