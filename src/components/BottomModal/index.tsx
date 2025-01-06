import React, { PropsWithChildren, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import theme from "theme";

import Divider from "components/Divider";
import Typography from "components/Typography";
import { BIG_BUTTON_HIT_SLOP } from "modules/app/constants";
import styled from "styled-components/native";

import AnimatedModalContainer from "./AnimatedModalContainer";

const BOX_BORDER_RADIUS = 10;

export type BottomModalProps = {
  isVisible: boolean;
  modalAnimationTime?: number;
  closeTriggered?: boolean;
  paddingHorizontal?: number;
  maxHeight?: string | number;
  height?: string | number;
  minHeight?: string;
  bgOpacity?: number;
  borderRadius?: number;
  withHeader?: boolean;
  title?: string;
  setIsVisible: (arg: boolean) => void;
  onClose?: () => void;
  setCloseTriggered?: (value: boolean) => void;
  withDividerBelowHeader?: boolean;
};

const BottomModal = ({
  modalAnimationTime = 300,
  closeTriggered,
  paddingHorizontal = 20,
  maxHeight,
  isVisible,
  children,
  height,
  minHeight,
  title,
  bgOpacity = 0.75,
  borderRadius = BOX_BORDER_RADIUS,
  withHeader = true,
  withDividerBelowHeader = true,
  onClose,
  setCloseTriggered,
  setIsVisible,
}: PropsWithChildren<BottomModalProps>): JSX.Element => {
  const { t } = useTranslation();

  const modalHeight = useMemo(() => {
    if (!height) {
      return undefined;
    }

    return typeof height === "number" ? `${height}px` : height;
  }, [height]);

  const modalMaxHeight = useMemo(() => {
    if (maxHeight) {
      return typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
    }

    return "auto";
  }, [maxHeight]);

  const closeModal = () => {
    setCloseTriggered?.(true);
  };

  return (
    <AnimatedModalContainer
      modalAnimationTime={modalAnimationTime}
      isVisible={isVisible}
      bgOpacity={bgOpacity}
      closeTriggered={closeTriggered}
      setIsVisible={setIsVisible}
      setCloseTriggered={setCloseTriggered}
      onClose={onClose}
    >
      <SContentContainer
        paddingHorizontal={paddingHorizontal}
        maxHeight={modalMaxHeight}
        height={modalHeight}
        minHeight={minHeight}
        topBorderRadius={borderRadius}
      >
        {withHeader && (
          <>
            <SModalHeader withPadding={paddingHorizontal === 0}>
              <Typography
                fontSize="xl"
                align="center"
                fontWeight="bold"
                lineHeight={27}
              >
                {title}
              </Typography>

              <CloseButtonContainer
                onPress={closeModal}
                hitSlop={BIG_BUTTON_HIT_SLOP}
              >
                <Typography
                  fontWeight="semibold"
                  fontSize="md"
                  color={theme.colors.darkGray}
                >
                  {t("general.close")}
                </Typography>
              </CloseButtonContainer>
            </SModalHeader>

            {withDividerBelowHeader && (
              <Divider
                lineColor={theme.colors.darkBlueText}
                lineOpacity={0.2}
              />
            )}
          </>
        )}

        {children}
      </SContentContainer>
      <Toast topOffset={60} visibilityTime={2000} />
    </AnimatedModalContainer>
  );
};

const SContentContainer = styled.View<{
  paddingHorizontal: number;
  maxHeight: string;
  minHeight?: string;
  height?: string;
  topBorderRadius: number;
}>`
  width: 100%;
  height: ${(props) => props.height};
  max-height: ${(props) => props.maxHeight};
  ${(props) => props.height && `height: ${props.height};`}
  ${(props) => props.minHeight && `min-height: ${props.minHeight};`}
  padding-horizontal: ${({ paddingHorizontal }) => paddingHorizontal}px;
  border-top-right-radius: ${({ topBorderRadius }) => topBorderRadius}px;
  border-top-left-radius: ${({ topBorderRadius }) => topBorderRadius}px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const SModalHeader = styled.View<{ withPadding: boolean }>`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-vertical: 24px;
  ${({ withPadding }) => withPadding && "padding-horizontal: 16px;"}
`;

const CloseButtonContainer = styled.TouchableOpacity``;

export default React.memo(BottomModal);
