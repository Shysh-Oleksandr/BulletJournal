import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native";
import Toast from "react-native-toast-message";
import theme from "theme";

import { MaterialIcons } from "@expo/vector-icons";
import { BUTTON_HIT_SLOP } from "components/HeaderBar";
import Input from "components/Input";
import { CustomUserEvents } from "modules/app/types";
import { getUserId } from "modules/auth/AuthSlice";
import { notesApi } from "modules/notes/api/notesApi";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";
import { addCrashlyticsLog } from "utils/addCrashlyticsLog";
import { generateRandomColor } from "utils/generateRandomColor";
import { logUserEvent } from "utils/logUserEvent";

import { CustomLabel } from "../../types";
import ColorPicker from "../noteForm/ColorPicker";

type Props = {
  allLabels: CustomLabel[];
  isCategoryLabel?: boolean;
  onCreate: (newLabel: CustomLabel) => void;
  setSearchQuery?: (query: string) => void;
};

const AddLabelInput = ({
  allLabels,
  isCategoryLabel = false,
  onCreate,
  setSearchQuery,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const { mutateAsync: createLabel } = notesApi.useCreateLabelMutation();

  const userId = useAppSelector(getUserId);

  const [inputValue, setInputValue] = useState("");
  const [currentColor, setCurrentColor] = useState(generateRandomColor());

  const inputRef = useRef<TextInput | null>(null);

  const isEmpty = !inputValue.length;

  const onChange = (text: string) => {
    setInputValue(text);
    setSearchQuery?.(text);
  };

  const saveChanges = useCallback(async () => {
    inputRef.current?.blur();

    const label = inputValue.trim();

    if (label === "") {
      return;
    }

    if (allLabels.some((item) => item.labelName === label)) {
      Toast.show({
        type: "error",
        text1: t("general.failure"),
        text2: t(
          isCategoryLabel
            ? "note.categoryAlreadyExists"
            : "note.typeAlreadyExists",
          { label },
        ),
      });

      return;
    }

    const createLabelData = {
      labelName: label,
      isCategoryLabel,
      user: userId,
      color: currentColor,
    };

    logUserEvent(CustomUserEvents.CREATE_LABEL);
    addCrashlyticsLog(`User tries to create a label`);

    const response = await createLabel(createLabelData);

    const newLabelId = response.data.customLabel._id ?? "";

    if (newLabelId) {
      Toast.show({
        type: "success",
        text1: t("general.success"),
        text2: t(isCategoryLabel ? "note.categoryCreated" : "note.typeCreated"),
      });
    }

    onCreate({ ...createLabelData, _id: newLabelId });
    setInputValue("");
    setSearchQuery?.("");
    setCurrentColor(generateRandomColor());
  }, [
    inputValue,
    userId,
    allLabels,
    isCategoryLabel,
    currentColor,
    createLabel,
    onCreate,
    setSearchQuery,
    t,
  ]);

  return (
    <InputContainer>
      {!isEmpty && (
        <ColorPickerContainer>
          <ColorPicker
            currentColor={currentColor}
            setCurrentColor={setCurrentColor}
            isFormItem={false}
          />
        </ColorPickerContainer>
      )}
      <Input
        value={inputValue}
        placeholder={t(
          isCategoryLabel ? "note.enterNewCategory" : "note.enterNewType",
        )}
        isCentered
        inputRef={inputRef}
        onChange={onChange}
        onSubmitEditing={saveChanges}
        minHeight={62}
        paddingHorizontal={50}
      />
      {!isEmpty && (
        <SaveIconContainer hitSlop={BUTTON_HIT_SLOP} onPress={saveChanges}>
          <MaterialIcons name="check" size={30} color={theme.colors.cyan500} />
        </SaveIconContainer>
      )}
    </InputContainer>
  );
};

const InputContainer = styled.View`
  width: 100%;
`;

const SaveIconContainer = styled.TouchableOpacity`
  width: 36px;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 12px;
  top: 15px;
  z-index: 999999;
`;

const ColorPickerContainer = styled.View`
  position: absolute;
  left: 12px;
  top: 15px;
  z-index: 999999;
`;

export default React.memo(AddLabelInput);
