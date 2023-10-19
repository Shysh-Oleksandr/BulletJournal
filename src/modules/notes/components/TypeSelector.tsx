import React, { useCallback, useMemo, useRef, useState } from "react";
import { ListRenderItem } from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import theme from "theme";

import BottomModal from "components/BottomModal";
import Divider from "components/Divider";
import Typography from "components/Typography";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import { getCustomTypes } from "../NotesSlice";
import { CustomLabel } from "../types";

import AddLabelInput from "./AddLabelInput";
import FormLabel from "./FormLabel";
import TypeItem from "./TypeItem";

const keyExtractor = (item: CustomLabel) => item._id;
const ItemSeparatorComponent = () => (
  <Divider lineColor={theme.colors.cyan400} />
);

type Props = {
  currentTypeId: string | null;
  currentColor: string;
  setCurrentTypeId: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
};

const TypeSelector = ({
  currentTypeId,
  currentColor,
  setCurrentTypeId,
  setCurrentColor,
}: Props): JSX.Element => {
  const initialTypes = useAppSelector(getCustomTypes);

  const [types, setTypes] = useState(initialTypes);
  const [closeTriggered, setCloseTriggered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const flatListRef = useRef<KeyboardAwareFlatList>(null);

  const currentType = useMemo(
    () => types.find((type) => type._id === currentTypeId),
    [currentTypeId, types],
  );

  const openModal = useCallback(() => {
    setIsVisible(true);
  }, []);

  const onEditBtnPress = useCallback((typeId: string | null) => {
    setEditingItemId(typeId);
  }, []);

  const onCreate = useCallback(
    (newLabel: CustomLabel) => {
      setCurrentTypeId(newLabel._id);
      setTypes((prev) => [...prev, newLabel]);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd(true);
      }, 200);
    },
    [setCurrentTypeId],
  );

  const onSelectColor = useCallback(
    (color: string) => {
      setCurrentColor(color);
    },
    [setCurrentColor],
  );

  const onChoose = useCallback(
    (typeId: string | null, shouldCloseModal = true) => {
      setEditingItemId(null);
      setCurrentTypeId(typeId);

      if (shouldCloseModal) {
        setCloseTriggered(true);
      }
    },
    [setCurrentTypeId, setCloseTriggered],
  );

  const renderItem: ListRenderItem<CustomLabel> = useCallback(
    ({ item, index }) => (
      <TypeItem
        key={index}
        type={item}
        isActive={item._id === currentTypeId}
        isEditing={item._id === editingItemId}
        currentNoteColor={currentColor}
        onChoose={onChoose}
        onEditBtnPress={onEditBtnPress}
        setTypes={setTypes}
        onSelectColor={onSelectColor}
      />
    ),
    [
      currentTypeId,
      editingItemId,
      currentColor,
      onChoose,
      onSelectColor,
      onEditBtnPress,
    ],
  );

  return (
    <Section>
      <SelectedTypeContainer onPress={openModal}>
        <Typography
          fontWeight="medium"
          fontSize="md"
          align="center"
          color={theme.colors.darkBlueText}
        >
          {currentType?.labelName ?? ""}
        </Typography>
      </SelectedTypeContainer>
      <BottomModal
        title="Choose a type"
        maxHeight="80%"
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        onClose={() => {
          setIsVisible(false);
          setEditingItemId(null);
        }}
        closeTriggered={closeTriggered}
        setCloseTriggered={setCloseTriggered}
        withCloseButtonDivider={false}
      >
        <AddLabelInput allLabels={types} onCreate={onCreate} />
        <KeyboardAwareFlatList
          data={types}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={ItemSeparatorComponent}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          ref={flatListRef}
          bounces={false}
          enableOnAndroid
          extraScrollHeight={20}
          extraHeight={150}
        />
      </BottomModal>
      <FormLabel label="Type" bottomOffset={-13} />
    </Section>
  );
};

const Section = styled.View`
  flex-direction: row;
  align-center: center;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
  z-index: 100000;
`;

const SelectedTypeContainer = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 40px;
  padding-horizontal: 20px;
  background-color: ${theme.colors.cyan300};
  border-bottom-width: 2px;
  border-color: ${theme.colors.cyan200};
`;

export default TypeSelector;
