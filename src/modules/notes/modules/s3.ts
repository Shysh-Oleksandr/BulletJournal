import { v4 as uuid } from "uuid";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { AwsCredentialIdentity } from "@aws-sdk/types";
import AppConfig from "config/AppConfig";

const credentials: AwsCredentialIdentity = {
  accessKeyId: AppConfig.awsAccessKeyId ?? "",
  secretAccessKey: AppConfig.awsSecretAccessKey ?? "",
};

const s3 = new S3Client({
  credentials,
  region: "eu-north-1",
  maxAttempts: 3,
});

type Props = {
  imagePath: string;
  userId: string;
};
type ReturnType = Promise<{ key: string } | { error: string }>;

const uploadToS3 = async ({ imagePath, userId }: Props): ReturnType => {
  const key = `${userId}/${uuid()}`;

  const imageExt = imagePath.split(".").pop();
  const imageMime = `image/${imageExt}`;

  const file = {
    uri: `file://${imagePath}`,
    name: key,
    type: imageMime,
  } as any;

  const command = new PutObjectCommand({
    Bucket: AppConfig.s3Bucket,
    Key: key,
    Body: file,
    ContentType: imageMime,
  });

  try {
    s3.send(command);

    return { key };
  } catch (error) {
    console.error(error);

    return { error: "Unknown error happened" };
  }
};

export const uploadLocalImagesToS3 = async (
  imagesUri: string[],
  userId: string,
): Promise<string[]> => {
  const uploadPromises = imagesUri.map(async (imagePath) => {
    const isAlreadyUploaded = !imagePath.startsWith("file");

    if (isAlreadyUploaded) return undefined;

    const result = await uploadToS3({
      imagePath,
      userId,
    });

    if ("error" in result) {
      console.error(result.error);

      return;
    }
    const newImageUri = AppConfig.s3BucketImageUrl! + result.key;

    return newImageUri;
  });

  const uploadedImagesUri = await Promise.all(uploadPromises);

  // this needed to avoid getting images from s3 right away as they're not available at that time and could return 403
  await new Promise((resolve) => setTimeout(resolve, 100));

  return uploadedImagesUri.filter((uri) => !!uri) as string[];
};

const deleteFromS3 = async (imageUrl: string): ReturnType => {
  const key = imageUrl.split(AppConfig.s3BucketImageUrl!).pop() ?? "";

  if (!key) return { error: "No key" };

  const command = new DeleteObjectCommand({
    Bucket: AppConfig.s3Bucket,
    Key: key,
  });

  try {
    s3.send(command);

    return { key };
  } catch (error) {
    console.error(error);

    return { error: "Unknown error happened while deleting" };
  }
};

export const deleteImagesFromS3 = async (imagesUrl: string[]) => {
  if (!imagesUrl.length) return;

  const uploadPromises = imagesUrl.map(async (imageUrl) => {
    const result = await deleteFromS3(imageUrl);

    if ("error" in result) {
      console.error(result.error);

      return;
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 100));

  await Promise.all(uploadPromises);
};
