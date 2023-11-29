import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { ActivityIndicator } from "react-native";
import theme from "theme";

import styled from "styled-components/native";
import { getDifferentColor } from "utils/getDifferentColor";

import Typography, { TypographyProps } from "./Typography";

type Props = {
  label?: string;
  onPress?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  isTransparent?: boolean;
  wide?: boolean;
  marginTop?: number | string;
  marginBottom?: number | string;
  activeOpacity?: number;
  borderColor?: string;
  showLoadingIndicator?: boolean;
  loadingIndicatorColor?: string;
  adjustsFontSizeToFit?: boolean;
  bgColor?: string;
  width?: string;
  labelProps?: TypographyProps;
  Icon?: JSX.Element;
  shouldReverseBgColor?: boolean;
};

const Button = ({
  label,
  onPress,
  disabled,
  isLoading = false,
  isTransparent,
  labelProps,
  adjustsFontSizeToFit,
  wide,
  marginTop = 0,
  marginBottom = 0,
  activeOpacity = 0.2,
  borderColor,
  bgColor = theme.colors.cyan500,
  showLoadingIndicator = true,
  loadingIndicatorColor = theme.colors.white,
  width,
  Icon,
  shouldReverseBgColor,
}: Props): JSX.Element => {
  const [topGradientColor, bottomGradientColor] = useMemo(() => {
    if (disabled) {
      return [theme.colors.gray, theme.colors.gray];
    }

    return [
      getDifferentColor(bgColor, 10, shouldReverseBgColor),
      getDifferentColor(bgColor, -15, shouldReverseBgColor),
    ];
  }, [bgColor, disabled, shouldReverseBgColor]);

  return (
    <ButtonWrapper
      onPress={() => {
        if (isLoading || disabled) return;
        onPress?.();
      }}
      activeOpacity={isLoading ? 1 : activeOpacity}
      disabled={disabled || isLoading}
      marginTop={marginTop}
      marginBottom={marginBottom}
      isTransparent={isTransparent}
      wide={wide}
      borderColor={borderColor}
      bgColor={bgColor}
      width={width}
    >
      <SLinearGradient colors={[topGradientColor, bottomGradientColor]}>
        {Icon && <IconContainer>{Icon}</IconContainer>}
        {showLoadingIndicator && isLoading && (
          <LoaderWrapper>
            <ActivityIndicator size={24} color={loadingIndicatorColor} />
          </LoaderWrapper>
        )}
        <LabelContainer isLoading={isLoading}>
          <Typography
            fontWeight="semibold"
            fontSize="lg"
            adjustsFontSizeToFit={adjustsFontSizeToFit}
            color={theme.colors.white}
            paddingVertical={8}
            paddingHorizontal={16}
            {...labelProps}
          >
            {label}
          </Typography>
        </LabelContainer>
      </SLinearGradient>
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled.TouchableOpacity<{
  marginTop: number | string;
  marginBottom: number | string;
  wide?: boolean;
  disabled?: boolean;
  isTransparent?: boolean;
  borderColor?: string;
  bgColor: string;
  width?: string;
}>`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  elevation: 10;
  border-radius: 6px;
  ${(props) => props.borderColor && `border: 1px solid ${props.borderColor}`}
  margin-top: ${({ marginTop }) =>
    typeof marginTop === "number" ? `${marginTop}px` : marginTop};
  margin-bottom: ${({ marginBottom }) =>
    typeof marginBottom === "number" ? `${marginBottom}px` : marginBottom};

  ${(props) => props.borderColor && `border: 1px solid ${props.borderColor}`}

  ${(props) =>
    props.disabled && `background-color: ${theme.colors.gray}; elevation: 0;`}

  ${({ wide }) => wide && "width: 100%;"}
  ${({ width }) => width && `width: ${width};`}
`;

const SLinearGradient = styled(LinearGradient)`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  border-radius: 6px;
`;

const LabelContainer = styled.View<{
  isLoading: boolean;
}>`
  flex-direction: row;
  ${(props) => props.isLoading && `opacity: 0`};
`;

const LoaderWrapper = styled.View`
  position: absolute;
`;

const IconContainer = styled.View``;

export default Button;
