import { parse } from 'path';
import slugify from 'slugify';
import { getTimeStamp } from './date-time-utils';

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
  const { name, ext } = parse(originalname);
  const fileName = `${name}_${getTimeStamp()}${ext}`;

  if (env === 'local') {
    const url = `http://${endPoint}:${port}/${bucketName}/${fileName}`;
    return {
      fileName,
      url,
      ext,
    };
  }
  const url = `https://${endPoint}/${bucketName}/${fileName}`;

  return {
    fileName,
    url,
    ext,
  };
};

export const createArrayWithLength = <T>(size: number, callBack: () => T) => {
  return [...Array(size)].map(callBack);
};
