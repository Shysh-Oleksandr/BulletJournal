import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import theme from "theme";

import { FontAwesome5 } from "@expo/vector-icons";
import Typography from "components/Typography";
import styled from "styled-components/native";

import { getFormattedDate } from "../util/getFormattedDate";

type Props = {
  currentStartDate: number;
  setCurrentStartDate: React.Dispatch<React.SetStateAction<number>>;
};

const DatePicker = ({
  currentStartDate,
  setCurrentStartDate,
}: Props): JSX.Element => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const initialDate = getFormattedDate(currentStartDate);

  const [date, setDate] = useState(initialDate);

  const showDatePicker = () => {
    setIsPickerVisible(true);
  };

  const hideDatePicker = () => {
    setIsPickerVisible(false);
  };

  const handleConfirm = (newDate: Date) => {
    setDate(getFormattedDate(newDate));
    setCurrentStartDate(newDate.getTime());
    hideDatePicker();
  };

  return (
    <Section>
      <ButtonContainer onPress={showDatePicker}>
        <FontAwesome5
          name="calendar"
          size={20}
          color={theme.colors.darkBlueText}
        />
        <Typography
          fontWeight="medium"
          fontSize="lg"
          align="center"
          color={theme.colors.darkBlueText}
          paddingLeft={8}
        >
          {date}
        </Typography>
      </ButtonContainer>
      <DateTimePickerModal
        isVisible={isPickerVisible}
        date={new Date(date)}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </Section>
  );
};

const Section = styled.View`
  flex-direction: row;
  align-center: center;
  justify-content: center;
  width: 100%;
  padding-vertical: 10px;
  border-bottom-width: 2px;
  border-color: ${theme.colors.cyan200};
`;

const ButtonContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-center: center;
  justify-content: center;
`;

export default React.memo(DatePicker);
