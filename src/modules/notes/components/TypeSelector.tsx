import React, { useCallback, useRef, useState } from "react";
import { Animated, TextInput } from "react-native";
import theme from "theme";

import { Entypo } from "@expo/vector-icons";
import Input from "components/Input";
import styled from "styled-components/native";

import FormLabel from "./FormLabel";
import TypeItem from "./TypeItem";

const initialTypes = ["Note", "Event", "Programming", "Work", "Random"];

const PLUS_TYPE = "+";

type Props = {
  currentType: string;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentType: React.Dispatch<React.SetStateAction<string>>;
};

const TypeSelector = ({
  currentType,
  isExpanded,
  setIsExpanded,
  setCurrentType,
}: Props): JSX.Element => {
  const [inputValue, setInputValue] = useState(currentType);
  const [isAdding, setIsAdding] = useState(false);
  const [types, setTypes] = useState(initialTypes);

  const inputRef = useRef<TextInput | null>(null);

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  const toggleSelector = useCallback(() => {
    const toValue = isExpanded ? 0 : 1;

    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: toValue,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: toValue,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();

    setTimeout(() => {
      setIsExpanded((prev) => !prev);
    }, 100);
  }, [animatedHeight, animatedOpacity, isExpanded, setIsExpanded]);

  const onChange = (text: string) => {
    setInputValue(text);
  };

  const onBlur = () => {
    toggleSelector();
    setIsAdding(false);
    setInputValue(currentType);
  };

  const onChoose = useCallback(
    (type: string) => {
      if (type === PLUS_TYPE) {
        setInputValue("");
        setIsAdding(true);
        toggleSelector();

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);

        return;
      }
      setCurrentType(type);
      setInputValue(type);
      toggleSelector();
    },
    [setCurrentType, toggleSelector],
  );
  const onSubmitEditing = () => {
    if (inputValue.trim() === "") {
      return;
    }

    setCurrentType(inputValue);
    setTypes((prev) => [...prev, inputValue]);
  };

  return (
    <Section>
      <InputContainer disabled={isAdding} onPress={toggleSelector}>
        <Input
          value={inputValue}
          placeholder="Enter a new type"
          isCentered
          editable={isAdding}
          inputRef={inputRef}
          onBlur={onBlur}
          onChange={onChange}
          onSubmitEditing={onSubmitEditing}
        />
      </InputContainer>
      <TypesContainer
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        style={{
          height: animatedHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 400],
          }),
          opacity: animatedOpacity,
        }}
      >
        <TypeItem
          type={PLUS_TYPE}
          Icon={AddIcon}
          isActive={false}
          isLast={false}
          onChoose={onChoose}
        />
        {types.map((type, index, array) => {
          const isLast = index === array.length - 1;
          const isActive = currentType === type;

          return (
            <TypeItem
              key={index}
              type={type}
              isActive={isActive}
              isLast={isLast}
              onChoose={onChoose}
            />
          );
        })}
      </TypesContainer>
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

const InputContainer = styled.TouchableOpacity`
  width: 100%;
`;

const AddIconContainer = styled.View`
  flex-direction: row;
  align-center: center;
  justify-content: center;
`;

const TypesContainer = styled(Animated.ScrollView)`
  z-index: 1000000;
  position: absolute;
  top: 46px;
  width: 100%;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
`;

const AddIcon = (
  <AddIconContainer>
    <Entypo name="circle-with-plus" size={20} color={theme.colors.white} />
  </AddIconContainer>
);

export default TypeSelector;
