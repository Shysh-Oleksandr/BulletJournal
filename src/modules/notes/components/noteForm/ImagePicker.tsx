import * as ExpoImagePicker from "expo-image-picker";
import React from "react";
import theme from "theme";

import { Ionicons } from "@expo/vector-icons";
import { BUTTON_HIT_SLOP } from "components/HeaderBar";
import logging from "config/logging";
import { CustomUserEvents } from "modules/app/types";
import { getUserId } from "modules/auth/AuthSlice";
import { Image } from "modules/notes/types";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";
import { addCrashlyticsLog } from "utils/addCrashlyticsLog";
import { alertError } from "utils/alertMessages";
import { logUserEvent } from "utils/logUserEvent";

import FormLabel from "./FormLabel";

type Props = {
  noteId?: string;
  setCurrentImages: React.Dispatch<React.SetStateAction<Image[]>>;
};

const ImagePicker = ({ noteId, setCurrentImages }: Props): JSX.Element => {
  const userId = useAppSelector(getUserId);

  const onPress = async (isCamera = false) => {
    logUserEvent(
      isCamera
        ? CustomUserEvents.MAKE_A_PHOTO
        : CustomUserEvents.PICK_IMAGE_FROM_GALLERY,
    );
    addCrashlyticsLog(`User tries to ${isCamera ? "make" : "pick"} an image`);

    const pickerResult = await (isCamera
      ? ExpoImagePicker.launchCameraAsync()
      : ExpoImagePicker.launchImageLibraryAsync({
          mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
          orderedSelection: true,
          selectionLimit: 20,
          allowsMultipleSelection: true,
          quality: 1,
        }));

    try {
      if (pickerResult.canceled || !userId) return;

      const newImagesUri = pickerResult.assets.map((image) => ({
        _id: image.uri,
        author: userId,
        url: image.uri,
        noteId: noteId || undefined,
      }));

      setCurrentImages((prev) => [...prev, ...newImagesUri]);
    } catch (e) {
      logging.error(e);
      addCrashlyticsLog(e as string);
      alertError();
    }
  };

  return (
    <Section>
      <ButtonsContainer>
        <ButtonContainer
          onPress={() => onPress(false)}
          mr={12}
          hitSlop={BUTTON_HIT_SLOP}
        >
          <Ionicons name="image" size={26} color={theme.colors.cyan500} />
        </ButtonContainer>
        <ButtonContainer
          onPress={() => onPress(true)}
          hitSlop={BUTTON_HIT_SLOP}
        >
          <Ionicons name="camera" size={26} color={theme.colors.cyan500} />
        </ButtonContainer>
      </ButtonsContainer>

      <FormLabel label="Images" />
    </Section>
  );
};

const Section = styled.View`
  flex-direction: row;
  flex: 1;
  align-center: center;
  justify-content: center;
  margin: 4px 0px 0;
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ButtonContainer = styled.TouchableOpacity<{ mr?: number }>`
  margin-right: ${({ mr }) => mr ?? 0}px;
`;

export default React.memo(ImagePicker);
