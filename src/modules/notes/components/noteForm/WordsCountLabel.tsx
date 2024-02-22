import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Typography from "components/Typography";
import removeMarkdown from "modules/notes/util/removeMarkdown";
import styled from "styled-components/native";
import { getContentWords } from "utils/getContentWords";

import FormLabel from "./FormLabel";

type Props = {
  contentHTML: string;
};

const WordsCountLabel = ({ contentHTML }: Props): JSX.Element => {
  const { t } = useTranslation();

  const wordsCount = useMemo(
    () => getContentWords(removeMarkdown(contentHTML)),
    [contentHTML],
  );

  return (
    <Section>
      <TextContainer>
        <Typography fontSize="lg" numberOfLines={1}>
          {wordsCount}
        </Typography>
      </TextContainer>
      <FormLabel label={t("note.words")} />
    </Section>
  );
};

const Section = styled.View`
  min-width: 40px;
  flex: 0.15;
  flex-direction: row;
  justify-content: center;
  margin-top: 6px;
`;

const TextContainer = styled.View`
  justify-content: center;
`;

export default WordsCountLabel;
