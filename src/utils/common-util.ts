import { parse, basename } from 'path';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

export const slugGenerate = (value: string) => {
  return slugify(value, { trim: true, lower: true });
};

export const uniqueBy = <T>(arr: T[], id: string): T[] => {
  if (arr.length === 0) {
    return [];
  }
  return [...new Map(arr.map((m) => [m[id], m])).values()];
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const generateFileUrl = (originalname: string) => {
  const env = process.env.NODE_ENV;
  const bucketName = process.env.MINIO_BUCKET_NAME;
  const endPoint = process.env.MINIO_ENDPOINT;
  const port = process.env.MINIO_PORT;
  const timeStamp = new Date().getTime();
  const { name, ext } = parse(originalname);
  const fileName = `${name}_${timeStamp}${ext}`;

  const protocol = env === 'local' ? 'http' : 'https';
  const baseUrl = `${endPoint}:${port}/${bucketName}/${fileName}`;
  const url = `${protocol}://${baseUrl}`;

  return {
    fileName,
    url,
  };
};
