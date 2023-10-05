import React, { PropsWithChildren } from "react";
import { Modal } from "react-native";
import theme from "theme";

import styled from "styled-components/native";

import Divider from "./Divider";
import { BUTTON_HIT_SLOP } from "./HeaderBar";
import Typography from "./Typography";

type Props = {
  isVisible: boolean;
  modalTitle?: string;
  height?: string | number;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const CustomModal = ({
  isVisible,
  modalTitle,
  height = "45%",
  setIsVisible,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const dismissModal = () => {
    setIsVisible(false);
  };

  return (
    <Modal
      transparent
      statusBarTranslucent
      visible={isVisible}
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={dismissModal}
    >
      <ModalBackground>
        <Container height={height}>
          <Card>
            {modalTitle && (
              <>
                <Typography
                  fontSize="xs"
                  paddingBottom={13}
                  paddingTop={13}
                  align="center"
                >
                  {modalTitle}
                </Typography>
                <DividerWrapper>
                  <Divider dashed marginBottom={20} marginTop={20} />
                </DividerWrapper>
              </>
            )}

            <ContentContainer>{children}</ContentContainer>
            <ModalFooterContainer>
              <CloseButton onPress={dismissModal} hitSlop={BUTTON_HIT_SLOP}>
                <Typography
                  fontSize="md"
                  fontWeight="bold"
                  align="center"
                  uppercase
                  color={theme.colors.darkBlueText}
                >
                  Close
                </Typography>
              </CloseButton>
            </ModalFooterContainer>
          </Card>
        </Container>
      </ModalBackground>
    </Modal>
  );
};

const ModalBackground = styled.View`
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  background-color: rgba(0, 0, 0, 0.7);
`;

const Container = styled.View<{ height: string | number }>`
  width: 100%;
  height: ${({ height }) =>
    typeof height === "number" ? `${height}px` : height};
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const Card = styled.View`
  align-items: center;

  padding-top: 20px;
  width: 93%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 12px;
  shadow-color: ${(props) => props.theme.colors.black};
  shadow-offset: 0 10px;
  shadow-opacity: 0.5;
  shadow-radius: 10px;
  elevation: 10;
`;

const ContentContainer = styled.View`
  width: 100%;
  flex: 1;
  align-items: center;
  padding-horizontal: 20px;
`;

const ModalFooterContainer = styled.View`
  width: 100%;
  padding: 30px;
`;

const CloseButton = styled.TouchableOpacity`
  width: 100%;
`;

const DividerWrapper = styled.View`
  width: 90%;
`;

export default CustomModal;
