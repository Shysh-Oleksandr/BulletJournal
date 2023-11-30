import React from "react";
import { Dimensions } from "react-native";
import FastImage from "react-native-fast-image";

import { Image } from "modules/notes/types";
import styled from "styled-components/native";

const { width: screenWidth } = Dimensions.get("window");

const HORIZONTAL_FORM_PADDING = 20;
const DEFAULT_IMAGE_HEIGHT_RATIO = 0.75;
const SINGLE_IMAGE_HEIGHT_RATIO = 1;

const cardWidth = screenWidth - HORIZONTAL_FORM_PADDING * 2;
const halfCardWidth = cardWidth / 2;

type Props = {
  bgColor: string;
  images?: Image[];
};

const ImageSlider = ({ bgColor, images }: Props): JSX.Element | null => {
  if (!images || !images.length) return null;

  const isOneImage = images.length === 1;

  const imageHeight =
    halfCardWidth *
    (isOneImage ? SINGLE_IMAGE_HEIGHT_RATIO : DEFAULT_IMAGE_HEIGHT_RATIO);

  return (
    <ImagesContainer
      horizontal
      showsHorizontalScrollIndicator={false}
      overScrollMode="never"
      pagingEnabled
      snapToAlignment="start"
      decelerationRate="fast"
    >
      <Cont>
        {images.map(({ _id, url }, index, array) => (
          <ImageContainer
            key={_id}
            bgColor={bgColor}
            isLast={index === array.length - 1}
          >
            <FastImage
              style={{
                width: isOneImage ? cardWidth : halfCardWidth,
                height: imageHeight,
              }}
              resizeMode={FastImage.resizeMode.cover}
              source={{ uri: url }}
            />
          </ImageContainer>
        ))}
      </Cont>
    </ImagesContainer>
  );
};

const ImagesContainer = styled.ScrollView`
  margin-bottom: -1px;
`;

const Cont = styled.View`
  flex-direction: row;
  align-center: center;
`;

const ImageContainer = styled.View<{ isLast: boolean; bgColor: string }>`
  background-color: ${({ bgColor }) => bgColor};
`;

export default React.memo(ImageSlider);
