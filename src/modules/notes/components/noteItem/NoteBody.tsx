import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";

import { FontAwesome } from "@expo/vector-icons";
import Typography from "components/Typography";
import { useNoteLabels } from "modules/customLabels/api/customLabelsSelectors";
import { CustomLabel } from "modules/customLabels/types";
import { getTimeByDate } from "modules/notes/util/getFormattedDate";
import styled from "styled-components/native";
import { getDifferentColor } from "utils/getDifferentColor";

import { Image } from "../../types";

import ImageSlider from "./ImageSlider";
import NoteLabel from "./NoteLabel";

const MAX_CONTENT_SYMBOLS = 260;

type Props = {
  title: string;
  content: string;
  color: string;
  rating: number;
  startDate: number;
  isStarred: boolean;
  type: CustomLabel | null;
  category: CustomLabel[];
  images?: Image[];
  onPress?: () => void;
};

const NoteBody = ({
  title,
  content,
  type,
  category,
  startDate,
  rating,
  color,
  isStarred,
  images,
  onPress,
}: Props): JSX.Element => {
  const { labels } = useNoteLabels();

  const { width } = useWindowDimensions();

  const isImageSliderScrollable = images && images?.length > 2;

  const [textColor, gradientBg] = useMemo(
    () => [getDifferentColor(color, 100), getDifferentColor(color, 25)],
    [color],
  );

  const relevantCategories = useMemo(
    () =>
      (type && category ? [type, ...category] : category).filter((label) =>
        labels.some((item) => item._id === label._id),
      ),
    [category, type, labels],
  );

  const source = useMemo(
    () => ({
      html:
        content.slice(0, MAX_CONTENT_SYMBOLS) +
        (content.length > MAX_CONTENT_SYMBOLS ? "..." : ""),
    }),
    [content],
  );

  return (
    <Container
      onPress={onPress}
      disabled={!onPress || isImageSliderScrollable}
      activeOpacity={0.3}
    >
      <ImageSlider bgColor={color} images={images} />
      <LinearGradient colors={[color, gradientBg]}>
        <InnerContainer
          onPress={onPress}
          disabled={!onPress || !isImageSliderScrollable}
          activeOpacity={0.3}
        >
          <Typography fontWeight="bold" fontSize="xl" color={textColor}>
            {title}
          </Typography>
          <ContentContainer>
            <RenderHTML
              defaultTextProps={{ style: { color: textColor } }}
              contentWidth={width - 80}
              source={source}
            />
          </ContentContainer>
          <LabelsContainer>
            {isStarred && (
              <NoteLabel
                label={<FontAwesome name="star" size={20} color={textColor} />}
                color={color}
              />
            )}
            <NoteLabel label={getTimeByDate(startDate)} color={color} />
            <NoteLabel label={`${rating}/10`} color={color} />
            {relevantCategories?.map((category, index, array) => (
              <NoteLabel
                key={category.labelName + category._id}
                label={category.labelName}
                color={color}
                isLast={index === array.length - 1}
              />
            ))}
          </LabelsContainer>
        </InnerContainer>
      </LinearGradient>
    </Container>
  );
};

const InnerContainer = styled.TouchableOpacity`
  width: 100%;
  padding: 16px 16px 12px;
`;

const Container = styled.TouchableOpacity`
  elevation: 12;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
`;

const LabelsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
`;

const ContentContainer = styled.View`
  width: 100%;
  margin-left: 3px;
`;

export default React.memo(NoteBody);
