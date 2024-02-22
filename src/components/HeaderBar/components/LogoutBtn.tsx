import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { Entypo } from "@expo/vector-icons";
import ConfirmAlert from "components/ConfirmAlert";
import { SMALL_BUTTON_HIT_SLOP } from "modules/app/constants";
import { logout } from "modules/auth/AuthSlice";
import { useAppDispatch } from "store/helpers/storeHooks";
import styled from "styled-components/native";

const LogoutBtn = (): JSX.Element => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  return (
    <>
      <LogoutButtonContainer
        onPress={() => setIsDialogVisible(true)}
        hitSlop={SMALL_BUTTON_HIT_SLOP}
      >
        <Entypo name="log-out" size={24} color={theme.colors.white} />
      </LogoutButtonContainer>
      <ConfirmAlert
        message={t("auth.logoutConfirmation")}
        isDialogVisible={isDialogVisible}
        setIsDialogVisible={setIsDialogVisible}
        onConfirm={() => dispatch(logout())}
      />
    </>
  );
};

const LogoutButtonContainer = styled.TouchableOpacity`
  background-color: ${theme.colors.cyan600};
  border-radius: 6px;
  padding: 7px 9px 7px 12px;
  align-items: center;
  justify-content: center;
`;

export default React.memo(LogoutBtn);
