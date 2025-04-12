import { LinearGradient } from "expo-linear-gradient";
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
  gradientColors?: string[];
  titleColor?: string;
};

const BottomModal = ({
  modalAnimationTime = 300,
  closeTriggered,
  paddingHorizontal = 20,
  maxHeight = "85%",
  isVisible,
  children,
  height,
  minHeight,
  title,
  bgOpacity = 0.75,
  borderRadius = BOX_BORDER_RADIUS,
  withHeader = true,
  withDividerBelowHeader = true,
  gradientColors,
  titleColor = theme.colors.darkBlueText,
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

  const gradientBgColors = useMemo(() => {
    if (gradientColors) return gradientColors;

    return [theme.colors.white, theme.colors.cyan300];
  }, [gradientColors]);

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
      <SLinearGradient
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        colors={gradientBgColors}
        maxHeight={modalMaxHeight}
        height={modalHeight}
        minHeight={minHeight}
        topBorderRadius={borderRadius}
        paddingHorizontal={paddingHorizontal}
      >
        {withHeader && (
          <>
            <SModalHeader withPadding={paddingHorizontal === 0}>
              <Typography
                fontSize="xl"
                align="center"
                fontWeight="bold"
                lineHeight={27}
                color={titleColor}
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
      </SLinearGradient>
      <Toast topOffset={60} visibilityTime={2000} />
    </AnimatedModalContainer>
  );
};

const SLinearGradient = styled(LinearGradient)<{
  maxHeight: string;
  minHeight?: string;
  height?: string;
  topBorderRadius: number;
  paddingHorizontal: number;
}>`
  width: 100%;
  max-height: ${(props) => props.maxHeight};
  ${(props) => props.height && `height: ${props.height};`}
  ${(props) => props.minHeight && `min-height: ${props.minHeight};`}
  border-top-right-radius: ${({ topBorderRadius }) => topBorderRadius}px;
  border-top-left-radius: ${({ topBorderRadius }) => topBorderRadius}px;
  padding-horizontal: ${({ paddingHorizontal }) => paddingHorizontal}px;
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
