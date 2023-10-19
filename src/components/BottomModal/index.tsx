import React, { PropsWithChildren, useMemo } from "react";
import theme from "theme";

import Divider from "components/Divider";
import Typography from "components/Typography";
import styled from "styled-components/native";

import AnimatedModalContainer from "./AnimatedModalContainer";

const BOX_BORDER_RADIUS = 10;

type Props = {
  isVisible: boolean;
  modalAnimationTime?: number;
  closeTriggered?: boolean;
  paddingVertical?: number;
  paddingHorizontal?: number;
  maxHeight?: string | number;
  height?: string | number;
  bgOpacity?: number;
  borderRadius?: number;
  statusBarTranslucent?: boolean;
  withCloseButton?: boolean;
  withCloseButtonDivider?: boolean;
  closeButtonDividerColor?: string;
  closeButtonContainerHeight?: number;
  withHeader?: boolean;
  title?: string;
  subtitle?: string;
  setIsVisible: (arg: boolean) => void;
  onClose?: () => void;
  setCloseTriggered?: (value: boolean) => void;
  withDividerBelowHeader?: boolean;
  shouldCenterContent?: boolean;
  inHeaderComponent?: JSX.Element | null;
};

const BottomModal = ({
  modalAnimationTime = 300,
  closeTriggered,
  paddingVertical = 0,
  paddingHorizontal = 20,
  maxHeight,
  isVisible,
  children,
  height,
  bgOpacity = 0.75,
  borderRadius = BOX_BORDER_RADIUS,
  withCloseButton = true,
  closeButtonContainerHeight = 90,
  withHeader = true,
  title,
  subtitle,
  onClose,
  setCloseTriggered,
  setIsVisible,
  withDividerBelowHeader = true,
}: PropsWithChildren<Props>): JSX.Element => {
  const modalHeight = useMemo(() => {
    if (maxHeight && !height) {
      return "auto";
    }
    if (!height) {
      return "86.5%";
    }

    return typeof height === "number" ? `${height}px` : height;
  }, [height, maxHeight]);

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
        paddingVertical={paddingVertical}
        paddingHorizontal={paddingHorizontal}
        maxHeight={modalMaxHeight}
        height={modalHeight}
        topBorderRadius={borderRadius}
      >
        {withHeader && (
          <>
            <SModalHeader>
              {Boolean(subtitle) && (
                <Typography
                  fontSize="xs"
                  color={theme.colors.darkBlueText}
                  paddingBottom={6}
                  uppercase
                >
                  {subtitle}
                </Typography>
              )}
              <Typography
                fontSize="xl"
                align="center"
                fontWeight="bold"
                color={theme.colors.darkBlueText}
                lineHeight={27}
              >
                {title}
              </Typography>
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

        {withCloseButton && (
          <>
            <Divider />
            <CloseButtonContainer
              closeButtonContainerHeight={closeButtonContainerHeight}
              withPadding={!paddingHorizontal}
              onPress={closeModal}
            >
              <Typography
                color={theme.colors.darkBlueText}
                fontWeight="semibold"
                uppercase
              >
                Close
              </Typography>
            </CloseButtonContainer>
          </>
        )}
      </SContentContainer>
    </AnimatedModalContainer>
  );
};

const SContentContainer = styled.View<{
  paddingVertical: number;
  paddingHorizontal: number;
  maxHeight: string;
  height: string;
  topBorderRadius: number;
}>`
  width: 100%;
  height: ${(props) => props.height};
  max-height: ${(props) => props.maxHeight};
  padding-vertical: ${({ paddingVertical }) => paddingVertical}px;
  padding-horizontal: ${({ paddingHorizontal }) => paddingHorizontal}px;
  border-top-right-radius: ${({ topBorderRadius }) => topBorderRadius}px;
  border-top-left-radius: ${({ topBorderRadius }) => topBorderRadius}px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const SModalHeader = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-vertical: 24px;
`;

const CloseButtonContainer = styled.TouchableOpacity<{
  closeButtonContainerHeight: number;
  withPadding: boolean;
}>`
  height: ${({ closeButtonContainerHeight }) => closeButtonContainerHeight}px;
  width: 100%;
  justify-content: center;
  align-items: center;
  ${({ withPadding }) => withPadding && "padding-horizontal: 20px;"}
`;

export default React.memo(BottomModal);
