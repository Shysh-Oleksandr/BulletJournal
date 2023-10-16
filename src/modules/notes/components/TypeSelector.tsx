import React, { useCallback, useRef, useState } from "react";
import { FlatList, ListRenderItem, TextInput } from "react-native";
import theme from "theme";

import BottomModal from "components/BottomModal";
import Divider from "components/Divider";
import Input from "components/Input";
import Typography from "components/Typography";
import styled from "styled-components/native";

import FormLabel from "./FormLabel";
import TypeItem from "./TypeItem";

const initialTypes = ["Note", "Event", "Programming", "Work", "Random"];

const PLUS_TYPE = "+";

const keyExtractor = (item: string, i: number) => `${i}-${item}`;

type Props = {
  currentType: string;
  setCurrentType: React.Dispatch<React.SetStateAction<string>>;
};

const TypeSelector = ({ currentType, setCurrentType }: Props): JSX.Element => {
  const [inputValue, setInputValue] = useState("");
  const [types, setTypes] = useState(initialTypes);
  const [closeTriggered, setCloseTriggered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const inputRef = useRef<TextInput | null>(null);
  const flatListRef = useRef<FlatList<string>>(null);

  const openModal = useCallback(() => {
    setIsVisible(true);
  }, []);

  const onChange = (text: string) => {
    setInputValue(text);
  };

  const onChoose = useCallback(
    (type: string) => {
      if (type === PLUS_TYPE) {
        setCloseTriggered(true);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);

        return;
      }
      setCurrentType(type);
      setCloseTriggered(true);
    },
    [setCurrentType, setCloseTriggered],
  );

  const onSubmitEditing = useCallback(() => {
    if (inputValue.trim() === "") {
      return;
    }

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 200);

    setInputValue("");
    setCurrentType(inputValue);
    setTypes((prev) => [...prev, inputValue]);
  }, [inputValue, setCurrentType]);

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item, index }) => (
      <TypeItem
        key={index}
        type={item}
        isActive={item === currentType}
        onChoose={onChoose}
      />
    ),
    [currentType, onChoose],
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
          {currentType}
        </Typography>
      </SelectedTypeContainer>
      <BottomModal
        title="Choose a type"
        maxHeight="80%"
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        onClose={() => setIsVisible(false)}
        closeTriggered={closeTriggered}
        setCloseTriggered={setCloseTriggered}
        withCloseButtonDivider={false}
      >
        <Input
          value={inputValue}
          placeholder="Enter a new type"
          isCentered
          inputRef={inputRef}
          onChange={onChange}
          onSubmitEditing={onSubmitEditing}
        />
        <FlatList
          data={types}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={undefined}
          ItemSeparatorComponent={Divider}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          ref={flatListRef}
          bounces={false}
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
