import debounce from "lodash.debounce";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { ListRenderItem } from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import theme from "theme";

import BottomModal from "components/BottomModal";
import Divider from "components/Divider";
import Typography from "components/Typography";
import { useCustomTypes } from "modules/notes/api/notesSelectors";
import styled from "styled-components/native";

import { CustomLabel } from "../../types";
import FormLabel from "../noteForm/FormLabel";

import AddLabelInput from "./AddLabelInput";
import LabelItem from "./LabelItem";

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
  const { t } = useTranslation();

  const { customTypes: initialTypes } = useCustomTypes();

  const [types, setTypes] = useState(initialTypes);
  const [closeTriggered, setCloseTriggered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedTypes, setSearchedTypes] = useState<CustomLabel[]>(types);
  const trimmedSearchQuery = searchQuery.trim().toLowerCase();

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
      setEditingItemId(null);

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
      <LabelItem
        key={index}
        label={item}
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

  const onClose = useCallback(() => {
    setIsVisible(false);
    setEditingItemId(null);
    setSearchQuery("");
  }, []);

  const searchTypes = useCallback(
    (searchQuery: string) => {
      const trimmedSearchQuery = searchQuery.trim().toLowerCase();

      setSearchedTypes(
        types.filter((item) =>
          item.labelName.toLowerCase().includes(trimmedSearchQuery),
        ),
      );
    },
    [types],
  );

  const searchTypesDebouncer = useMemo(
    () => debounce(searchTypes, 300),
    [searchTypes],
  );

  useEffect(() => {
    searchTypesDebouncer(searchQuery);
  }, [searchQuery, searchTypesDebouncer]);

  return (
    <Section>
      <SelectedTypeContainer onPress={openModal}>
        <Typography align="center">{currentType?.labelName ?? ""}</Typography>
      </SelectedTypeContainer>
      <BottomModal
        title={t("note.chooseType")}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        onClose={onClose}
        closeTriggered={closeTriggered}
        setCloseTriggered={setCloseTriggered}
      >
        <AddLabelInput
          setSearchQuery={setSearchQuery}
          allLabels={types}
          onCreate={onCreate}
        />
        <KeyboardAwareFlatList
          data={trimmedSearchQuery ? searchedTypes : types}
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
          contentContainerStyle={{ paddingBottom: 10 }}
          keyboardShouldPersistTaps="handled"
        />
      </BottomModal>
      <FormLabel label={t("note.Type")} bottomOffset={-13} />
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

export default React.memo(TypeSelector);
