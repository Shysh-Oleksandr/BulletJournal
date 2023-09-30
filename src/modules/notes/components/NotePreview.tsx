import React, { useMemo } from "react";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";
import DropShadow from "react-native-drop-shadow";
import RenderHTML from "react-native-render-html";
import theme from "theme";

import { FontAwesome } from "@expo/vector-icons";
import Typography from "components/Typography";
import styled from "styled-components/native";
import { getDifferentColor } from "utils/getDifferentColor";

import { Note } from "../types";

import NoteLabel from "./NoteLabel";

const MAX_CONTENT_SYMBOLS = 260;

type Props = {
  item: Note;
  isLast: boolean;
  onPress?: () => void;
};

const NotePreview = ({ item, isLast, onPress }: Props): JSX.Element => {
  const {
    title,
    content,
    startDate,
    type,
    category,
    rating,
    color,
    isStarred,
  } = item;

  const { width } = useWindowDimensions();

  const textColor = getDifferentColor(color, 185);

  const date = useMemo(() => new Date(startDate).toDateString(), [startDate]);

  const relevantCategories = useMemo(
    () => (type && category ? [type, ...category] : category),
    [category, type],
  );

  const source = {
    html:
      content.slice(0, MAX_CONTENT_SYMBOLS) +
      (content.length > MAX_CONTENT_SYMBOLS ? "..." : ""),
  };

  return (
    <View>
      <DateContainer>
        <Typography
          fontWeight="medium"
          fontSize="lg"
          paddingBottom={2}
          color={theme.colors.darkBlueText}
        >
          {date}
        </Typography>
        <VerticalLine />
      </DateContainer>
      <StyledDropShadow>
        <Container onPress={onPress} activeOpacity={0.3} bgColor={color}>
          <Typography fontWeight="bold" fontSize="xl" color={textColor}>
            {title}
          </Typography>
          <RenderHTML
            defaultTextProps={{ style: { color: textColor } }}
            contentWidth={width - 80}
            source={source}
          />
          <LabelsContainer>
            {isStarred && (
              <NoteLabel
                label={<FontAwesome name="star" size={20} color={textColor} />}
                color={color}
              />
            )}
            <NoteLabel label={`${rating}/10`} color={color} />
            {relevantCategories?.map((category, index, array) => (
              <NoteLabel
                key={category._id}
                label={category.labelName}
                color={color}
                isLast={index === array.length - 1}
              />
            ))}
          </LabelsContainer>
        </Container>
      </StyledDropShadow>
      {!isLast && <VerticalLine />}
    </View>
  );
};

const Container = styled(TouchableOpacity)<{ bgColor?: string }>`
  width: 100%;
  background-color: ${({ bgColor }) => bgColor ?? theme.colors.cyan600};
  border-radius: 8px;
  padding: 16px 20px 12px;
`;

const StyledDropShadow = styled(DropShadow)`
  shadow-color: ${theme.colors.black};
  shadow-offset: 0 5px;
  shadow-opacity: 0.2;
  shadow-radius: 10px;
`;

const DateContainer = styled.View`
  width: 100%;
`;

const VerticalLine = styled.View`
  width: 4px;
  height: 24px;
  background-color: ${theme.colors.gray};
  border-radius: 15px;
  margin-left: 30px;
`;

const LabelsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
`;

export default NotePreview;
