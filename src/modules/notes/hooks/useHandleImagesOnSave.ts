import { useCallback } from "react";

import { getUserId } from "modules/auth/AuthSlice";
import { useAppSelector } from "store/helpers/storeHooks";

import { deleteImagesFromS3, uploadLocalImagesToS3 } from "../modules/s3";
import { notesApi } from "../NotesApi";
import { Image, Note } from "../types";

export const useHandleImagesOnSave = () => {
  const [createImagesEntries] = notesApi.useCreateImagesMutation();
  const [deleteImagesEntriesFromServer] = notesApi.useDeleteImagesMutation();

  const userId = useAppSelector(getUserId) ?? "";

  const handleImages = useCallback(
    async (currentImages: Image[], savedNote: Note) => {
      const notChangedImages: Image[] = [];
      const imagesToDelete: Image[] = [];

      savedNote.images.forEach((image) =>
        currentImages.some((currImage) => currImage.url === image.url)
          ? notChangedImages.push(image)
          : imagesToDelete.push(image),
      );

      if (imagesToDelete.length) {
        await deleteImagesFromS3(imagesToDelete.map((image) => image.url));
        await deleteImagesEntriesFromServer({
          imageIdsToDelete: imagesToDelete.map((image) => image._id),
        });
      }

      const localImages = currentImages.filter((image) =>
        image.url.startsWith("file"),
      );

      const imageUrlsToUploadToServer = await uploadLocalImagesToS3(
        localImages.map((image) => image.url),
        userId,
      );

      const uploadedImagesData: Image[] = imageUrlsToUploadToServer.length
        ? (
            await createImagesEntries({
              author: userId,
              noteId: savedNote._id || undefined, // If a note is not created yet, we still send undefined noteId which will be replaced with a real one during note creation on BE
              urls: imageUrlsToUploadToServer,
            }).unwrap()
          ).createdImages
        : [];

      // Map currentImages to preserve order
      const newImages = currentImages
        .map((image) => {
          // If unchanged, use the existing image
          const unchangedImage = notChangedImages.find(
            (notChanged) => notChanged.url === image.url,
          );

          if (unchangedImage) return unchangedImage;

          // If newly uploaded, match by the initial file path
          const uploadedImage = uploadedImagesData.find(
            (_, index) => localImages[index]?.url === image.url, // Match by local file path order
          );

          return uploadedImage;
        })
        .filter(Boolean) as Image[];

      return { newImages, uploadedNewImages: uploadedImagesData.length > 0 };
    },
    [createImagesEntries, deleteImagesEntriesFromServer, userId],
  );

  return handleImages;
};
