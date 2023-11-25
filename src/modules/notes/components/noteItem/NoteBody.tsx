import React, { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";
import { Shadow } from "react-native-shadow-2";
import theme from "theme";

import { FontAwesome } from "@expo/vector-icons";
import Typography from "components/Typography";
import { getLabelsIds } from "modules/notes/NotesSlice";
import { getTimeByDate } from "modules/notes/util/getFormattedDate";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";
import { getDifferentColor } from "utils/getDifferentColor";

import { CustomLabel, Image } from "../../types";

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
  const allLabelsIds = useAppSelector(getLabelsIds);

  const { width } = useWindowDimensions();

  const isImageSliderScrollable = images && images?.length > 2;

  const textColor = useMemo(() => getDifferentColor(color, 185), [color]);

  const relevantCategories = useMemo(
    () =>
      (type && category ? [type, ...category] : category).filter((label) =>
        allLabelsIds.includes(label._id),
      ),
    [category, type, allLabelsIds],
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
    <StyledDropShadow distance={10} offset={[0, 5]} startColor="#00000015">
      <Container
        onPress={onPress}
        disabled={!onPress || isImageSliderScrollable}
        activeOpacity={0.3}
      >
        <ImageSlider images={images} />
        <InnerContainer
          onPress={onPress}
          disabled={!onPress || !isImageSliderScrollable}
          activeOpacity={0.3}
          bgColor={color}
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
      </Container>
    </StyledDropShadow>
  );
};

const InnerContainer = styled.TouchableOpacity<{
  bgColor?: string;
}>`
  width: 100%;
  background-color: ${({ bgColor }) => bgColor ?? theme.colors.cyan600};

  padding: 16px 16px 12px;
`;

const Container = styled.TouchableOpacity``;

const LabelsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
`;

const ContentContainer = styled.View`
  width: 100%;
  margin-left: 3px;
`;

const StyledDropShadow = styled(Shadow)`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
`;

export default React.memo(NoteBody);
