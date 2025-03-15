import React from "react";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native";
import theme from "theme";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import Input from "components/Input";
import styled from "styled-components/native";

type Props = {
  description: string;
  color: string;
  inputRef?: React.MutableRefObject<TextInput | null>;
  setDescription: (description: string) => void;
  onBlur?: () => void;
};

const TaskDescriptionInput = ({
  description,
  color,
  inputRef,
  setDescription,
  onBlur,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Input
      inputRef={inputRef}
      style={{ paddingRight: 8 }}
      value={description}
      paddingHorizontal={28}
      paddingVertical={4}
      maxLength={2000}
      placeholder={t("tasks.descriptionPlaceholder")}
      bgColor="transparent"
      fontSize="md"
      fontWeight="medium"
      multiline
      numberOfLines={3}
      maxHeight={70}
      onChange={setDescription}
      onBlur={onBlur}
      LeftContent={
        <DescriptionIconContainer>
          <MaterialCommunityIcons
            name="text-long"
            color={color}
            size={theme.fontSizes.xl}
          />
        </DescriptionIconContainer>
      }
      labelColor={color}
    />
  );
};

const DescriptionIconContainer = styled.View`
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -${theme.fontSizes.xl / 2}px;
  z-index: 10;
`;

export default React.memo(TaskDescriptionInput);
