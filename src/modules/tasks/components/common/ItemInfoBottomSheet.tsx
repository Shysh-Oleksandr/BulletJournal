import React, { useCallback, useState } from "react";

import BottomModal, { BottomModalProps } from "components/BottomModal";
import styled from "styled-components/native";

type Props = {
  onClose: () => void;
  onOpen?: () => void;
  bottomModalProps?: Partial<BottomModalProps>;
  content: (closeModal: () => void) => JSX.Element;
  children: (openModal: () => void) => JSX.Element;
};

const ItemInfoBottomSheet = ({
  onClose,
  onOpen,
  content,
  bottomModalProps,
  children,
}: Props): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const [closeTriggered, setCloseTriggered] = useState(false);

  const handleClose = () => {
    onClose();

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
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        onClose={handleClose}
        closeTriggered={closeTriggered}
        setCloseTriggered={setCloseTriggered}
        bgOpacity={0.4}
        modalAnimationTime={200}
        maxHeight="85%"
        {...bottomModalProps}
      >
        <ContentContainer
          bounces
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          contentContainerStyle={{ paddingVertical: 16 }}
        >
          {content(() => setIsVisible(false))}
        </ContentContainer>
      </BottomModal>
    </>
  );
};

const ContentContainer = styled.ScrollView``;

export default React.memo(ItemInfoBottomSheet);
