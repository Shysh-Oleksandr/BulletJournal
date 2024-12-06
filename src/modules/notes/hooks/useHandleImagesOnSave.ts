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

      const imageUrlsToUploadToServer = await uploadLocalImagesToS3(
        currentImages.map((image) => image.url), // It will skip already-uploaded images
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
      const newImages = currentImages.map((image) => {
        // Use existing image if it hasn't changed
        const unchangedImage = notChangedImages.find(
          (notChanged) => notChanged.url === image.url,
        );

        // Otherwise, use the newly uploaded image
        const uploadedImage = uploadedImagesData.find(
          (uploaded) => uploaded.url === image.url,
        );

        return unchangedImage || uploadedImage!;
      });

      return newImages;
    },
    [createImagesEntries, deleteImagesEntriesFromServer, userId],
  );

  return handleImages;
};
