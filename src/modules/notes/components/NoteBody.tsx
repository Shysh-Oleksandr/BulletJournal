import React, { useMemo } from "react";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";
import { Shadow } from "react-native-shadow-2";
import theme from "theme";

import { FontAwesome } from "@expo/vector-icons";
import Typography from "components/Typography";
import styled from "styled-components/native";
import { getDifferentColor } from "utils/getDifferentColor";

import { Category } from "../types";

import NoteLabel from "./NoteLabel";

const MAX_CONTENT_SYMBOLS = 260;

type Props = {
  title: string;
  content: string;
  color: string;
  rating: number;
  isStarred: boolean;
  type: Category | null;
  category: Category[];
  onPress?: () => void;
};

const NoteBody = ({
  title,
  content,
  type,
  category,
  rating,
  color,
  isStarred,
  onPress,
}: Props): JSX.Element => {
  const { width } = useWindowDimensions();

  const textColor = getDifferentColor(color, 185);

  const relevantCategories = useMemo(
    () => (type && category ? [type, ...category] : category),
    [category, type],
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
        disabled={!onPress}
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
      </Container>
    </StyledDropShadow>
  );
};

const Container = styled(TouchableOpacity)<{ bgColor?: string }>`
  width: 100%;
  background-color: ${({ bgColor }) => bgColor ?? theme.colors.cyan600};
  border-radius: 8px;
  padding: 16px 20px 12px;
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

const StyledDropShadow = styled(Shadow)`
  width: 100%;
`;

export default React.memo(NoteBody);
