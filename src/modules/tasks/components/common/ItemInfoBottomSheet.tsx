import React, { useCallback, useState } from "react";
import { Keyboard } from "react-native";

import BottomModal, { BottomModalProps } from "components/BottomModal";
import styled from "styled-components/native";

type Props = {
  onClose?: () => void;
  onOpen?: () => void;
  openByDefault?: boolean;
  withContentContainer?: boolean;
  bottomModalProps?: Partial<BottomModalProps>;
  content: (closeModal: () => void) => JSX.Element;
  children: (openModal: () => void) => JSX.Element;
};

const ItemInfoBottomSheet = ({
  onClose,
  onOpen,
  content,
  openByDefault = false,
  withContentContainer = true,
  bottomModalProps,
  children,
}: Props): JSX.Element => {
  const [isVisible, setIsVisible] = useState(openByDefault);
  const [closeTriggered, setCloseTriggered] = useState(false);

  const isOpen = isVisible || !!bottomModalProps?.isVisible;

  const handleClose = () => {
    onClose?.();

    Keyboard.dismiss();
    setIsVisible(false);
  };

  const openModal = useCallback(() => {
    setIsVisible(true);

    onOpen?.();
  }, [onOpen]);

  return (
    <>
      {children(openModal)}

      <BottomModal
        paddingHorizontal={16}
        withHeader={false}
        setIsVisible={setIsVisible}
        onClose={handleClose}
        closeTriggered={closeTriggered}
        setCloseTriggered={setCloseTriggered}
        bgOpacity={0.4}
        modalAnimationTime={200}
        {...bottomModalProps}
        isVisible={isOpen}
      >
        {isOpen &&
          (withContentContainer ? (
            <ContentContainer
              bounces
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              overScrollMode="never"
              contentContainerStyle={{ paddingVertical: 16 }}
            >
              {content(() => setIsVisible(false))}
            </ContentContainer>
          ) : (
            content(() => setIsVisible(false))
          ))}
      </BottomModal>
    </>
  );
};

const ContentContainer = styled.ScrollView``;

export default React.memo(ItemInfoBottomSheet);
