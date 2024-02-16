import React from "react";
import { useTranslation } from "react-i18next";

import Input from "components/Input";
import styled from "styled-components/native";

type Props = {
  currentTitle: string;
  isNewNote: boolean;
  setCurrentTitle: React.Dispatch<React.SetStateAction<string>>;
};

const TitleInput = ({
  currentTitle,
  isNewNote,
  setCurrentTitle,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const onChange = (text: string) => {
    setCurrentTitle(text);
  };

  return (
    <Section>
      <Input
        value={currentTitle}
        paddingHorizontal={0}
        placeholder={t("note.title")}
        isCentered
        withAutoFocus={isNewNote}
        multiline={currentTitle.length > 30}
        numberOfLines={currentTitle.length > 30 ? 2 : 1}
        maxLength={200}
        bgColor="transparent"
        fontSize="xl"
        fontWeight="semibold"
        onChange={onChange}
      />
    </Section>
  );
};

const Section = styled.View`
  flex-direction: row;
  align-center: center;
  justify-content: center;
  width: 100%;
`;

export default TitleInput;
