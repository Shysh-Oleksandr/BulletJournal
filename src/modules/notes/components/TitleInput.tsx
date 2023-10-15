import React from "react";

import Input from "components/Input";
import styled from "styled-components/native";

type Props = {
  currentTitle: string;
  setCurrentTitle: React.Dispatch<React.SetStateAction<string>>;
};

const TitleInput = ({ currentTitle, setCurrentTitle }: Props): JSX.Element => {
  const onChange = (text: string) => {
    setCurrentTitle(text);
  };

  return (
    <Section>
      <Input
        value={currentTitle}
        paddingHorizontal={0}
        placeholder="Title"
        isCentered
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
