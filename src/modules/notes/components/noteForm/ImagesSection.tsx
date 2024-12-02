import React, { useCallback, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import FastImage from "react-native-fast-image";
import ImageViewing from "react-native-image-viewing";
import theme from "theme";

import { Ionicons } from "@expo/vector-icons";
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
  const [isViewerVisible, setViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleDragEnd = useCallback(
    ({ data }: { data: Image[] }) => {
      setCurrentImages(data);
    },
    [setCurrentImages],
  );
  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setViewerVisible(true);
  };

  const renderItem = useCallback(
    ({ item, getIndex, drag }: RenderItemParams<Image>) => {
      const index = getIndex() ?? 0;

      return (
        <ImageContainer isLast={index === currentImages.length - 1}>
          <TouchableContainer
            onLongPress={isLocked ? undefined : drag}
            onPress={() => openImageViewer(index)}
          >
            <FastImage
              style={styles.image}
              resizeMode={FastImage.resizeMode.cover}
              source={{ uri: item.url }}
            />
          </TouchableContainer>
          {!isLocked && (
            <DeleteIconContainer
              onPress={() =>
                setCurrentImages((prev) =>
                  prev.filter((image) => image._id !== item._id),
                )
              }
            >
              <Ionicons name="close" size={22} color={theme.colors.white} />
            </DeleteIconContainer>
          )}
        </ImageContainer>
      );
    },
    [currentImages.length, isLocked, setCurrentImages],
  );

  if (!currentImages.length) return null;

  return (
    <>
      <ImageViewing
        images={currentImages.map((image) => ({ uri: image.url }))}
        imageIndex={currentImageIndex}
        visible={isViewerVisible}
        onRequestClose={() => setViewerVisible(false)}
      />

      <DraggableFlatList
        data={currentImages}
        keyExtractor={(item) => item._id}
        horizontal
        contentContainerStyle={styles.container}
        renderItem={renderItem}
        onDragEnd={handleDragEnd}
      />
    </>
  );
};

const DeleteIconContainer = styled.TouchableOpacity`
  border-radius: 999px;
  background-color: ${theme.colors.cyan600};
  position: absolute;
  right: 4px;
  top: 4px;
  padding: 2px;
  elevation: 10;
`;

const ImageContainer = styled.View<{ isLast: boolean }>`
  ${({ isLast }) => !isLast && `margin-right: ${IMAGE_MARGIN}px;`}
`;

const TouchableContainer = styled.TouchableOpacity``;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 8,
  },
});

export default React.memo(ImagesSection);
