import React from "react";
import { Dimensions } from "react-native";
import FastImage from "react-native-fast-image";
import theme from "theme";

import { Ionicons } from "@expo/vector-icons";
import { BUTTON_HIT_SLOP } from "components/HeaderBar";
import { Image } from "modules/notes/types";
import styled from "styled-components/native";

const { width: screenWidth } = Dimensions.get("window");

const HORIZONTAL_FORM_PADDING = 36;
const IMAGE_MARGIN = 10;
const IMAGE_HEIGHT_RATIO = 0.75;

const IMAGE_WIDTH =
  (screenWidth - HORIZONTAL_FORM_PADDING * 2 - IMAGE_MARGIN) / 2;
const IMAGE_HEIGHT = IMAGE_WIDTH * IMAGE_HEIGHT_RATIO;

type Props = {
  currentImages: Image[];
  isLocked: boolean;
  setCurrentImages: React.Dispatch<React.SetStateAction<Image[]>>;
};

const ImagesSection = ({
  currentImages,
  isLocked,
  setCurrentImages,
}: Props): JSX.Element | null => {
  if (!currentImages.length) return null;

  return (
    <ImagesContainer
      horizontal
      showsHorizontalScrollIndicator={false}
      overScrollMode="never"
    >
      {currentImages.map(({ _id, url }, index, array) => (
        <ImageContainer key={_id} isLast={index === array.length - 1}>
          <FastImage
            style={{
              width: IMAGE_WIDTH,
              height: IMAGE_HEIGHT,
              borderRadius: 8,
            }}
            resizeMode={FastImage.resizeMode.cover}
            source={{ uri: url }}
          />
          {!isLocked && (
            <DeleteIconContainer
              hitSlop={BUTTON_HIT_SLOP}
              onPress={() =>
                setCurrentImages((prev) =>
                  prev.filter((image) => image.url !== url),
                )
              }
            >
              <Ionicons name="close" size={22} color={theme.colors.white} />
            </DeleteIconContainer>
          )}
        </ImageContainer>
      ))}
    </ImagesContainer>
  );
};

const DeleteIconContainer = styled.TouchableOpacity`
  border-radius: 999px;
  background-color: ${theme.colors.cyan600};
  position: absolute;
  right: 4px;
  top: 4px;
  padding: 2px;
`;

const ImagesContainer = styled.ScrollView`
  flex-direction: row;
  align-center: center;
  margin-top: 20px;
`;

const ImageContainer = styled.View<{ isLast: boolean }>`
  ${({ isLast }) => !isLast && `margin-right: ${IMAGE_MARGIN}px;`}
`;

export default React.memo(ImagesSection);
