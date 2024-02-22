import React from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import Typography from "components/Typography";
import styled from "styled-components/native";

interface DeleteItemModalProps {
  warningMessage: string;
  confirmMessage: string;
  yesHandler: () => void;
  noHandler: () => void;
}

const DeleteItemModal: React.FC<DeleteItemModalProps> = ({
  warningMessage,
  confirmMessage,
  noHandler,
  yesHandler,
}) => {
  const { t } = useTranslation();

  return (
    <ConfirmItemDelete>
      <ConfirmItemDeleteMessageWrap>
        <Typography
          fontSize="xs"
          fontWeight="light"
          color={theme.colors.white}
          lineHeight={12}
        >
          {warningMessage}
        </Typography>
        <Typography fontSize="sm" color={theme.colors.white} lineHeight={14}>
          {confirmMessage}
        </Typography>
      </ConfirmItemDeleteMessageWrap>
      <ConfirmItemDeleteButton onPress={noHandler} testID="deleteItemModalNo">
        <Typography
          fontSize="sm"
          fontWeight="bold"
          uppercase
          color={theme.colors.red600}
          lineHeight={17}
        >
          {t("general.no")}
        </Typography>
      </ConfirmItemDeleteButton>
      <ConfirmItemDeleteButton onPress={yesHandler} testID="deleteItemModalYes">
        <Typography
          fontSize="sm"
          fontWeight="bold"
          uppercase
          color={theme.colors.red600}
          lineHeight={17}
        >
          {t("general.yes")}
        </Typography>
      </ConfirmItemDeleteButton>
    </ConfirmItemDelete>
  );
};

const ConfirmItemDelete = styled.View`
  flex: 1;
  padding-horizontal: 15px;
  align-items: center;
  height: 68px;
  width: 100%;
  align-self: center;
  align-items: center;
  flex-direction: row;
  background: ${theme.colors.red600};
  border-radius: 4px;
`;

const ConfirmItemDeleteMessageWrap = styled.View`
  flex: 1;
`;

const ConfirmItemDeleteButton = styled.TouchableOpacity`
  background: ${(props) => props.theme.colors.white};
  width: 63px;
  height: 25px;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  margin-horizontal: 10px;
`;

export default DeleteItemModal;
