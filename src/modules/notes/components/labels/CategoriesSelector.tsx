import debounce from "lodash.debounce";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ListRenderItem } from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import theme from "theme";

import BottomModal from "components/BottomModal";
import Divider from "components/Divider";
import Typography from "components/Typography";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import { getCustomCategories } from "../../NotesSlice";
import { CustomLabel } from "../../types";
import FormLabel from "../noteForm/FormLabel";

import AddLabelInput from "./AddLabelInput";
import LabelItem from "./LabelItem";

const keyExtractor = (item: CustomLabel) => item._id;
const ItemSeparatorComponent = () => (
  <Divider lineColor={theme.colors.cyan400} />
);

type Props = {
  currentCategoriesIds: string[];
  currentColor: string;
  setCurrentCategoriesIds: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
};

const CategoriesSelector = ({
  currentCategoriesIds,
  currentColor,
  setCurrentCategoriesIds,
  setCurrentColor,
}: Props): JSX.Element => {
  const initialCategories = useAppSelector(getCustomCategories);

  const [categories, setCategories] = useState(initialCategories);
  const [closeTriggered, setCloseTriggered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedCategories, setSearchedCategories] =
    useState<CustomLabel[]>(categories);
  const trimmedSearchQuery = searchQuery.trim().toLowerCase();

  const flatListRef = useRef<KeyboardAwareFlatList>(null);

  const selectedCategoriesLabel = useMemo(
    () =>
      categories
        .filter((category) => currentCategoriesIds?.includes(category._id))
        .map((category) => category.labelName)
        .join(", "),
    [currentCategoriesIds, categories],
  );

  const openModal = useCallback(() => {
    setIsVisible(true);
  }, []);

  const onEditBtnPress = useCallback((categoryId: string | null) => {
    setEditingItemId(categoryId);
  }, []);

  const onCreate = useCallback(
    (newLabel: CustomLabel) => {
      setCurrentCategoriesIds((prev) => [...prev, newLabel._id]);
      setCategories((prev) => [...prev, newLabel]);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd(true);
      }, 200);
    },
    [setCurrentCategoriesIds],
  );

  const onSelectColor = useCallback(
    (color: string) => {
      setCurrentColor(color);
    },
    [setCurrentColor],
  );

  const onChoose = useCallback(
    (categoryId: string | null) => {
      if (!categoryId) return;

      setEditingItemId(null);
      setCurrentCategoriesIds((prev) => {
        if (prev.includes(categoryId)) {
          return prev.filter((itemId) => itemId !== categoryId);
        }

        return [...prev, categoryId];
      });
    },
    [setCurrentCategoriesIds],
  );

  const renderItem: ListRenderItem<CustomLabel> = useCallback(
    ({ item, index }) => (
      <LabelItem
        key={index}
        label={item}
        isActive={currentCategoriesIds?.includes(item._id)}
        isEditing={item._id === editingItemId}
        allLabels={categories}
        currentNoteColor={currentColor}
        onChoose={onChoose}
        onEditBtnPress={onEditBtnPress}
        setTypes={setCategories}
        onSelectColor={onSelectColor}
      />
    ),
    [
      currentCategoriesIds,
      editingItemId,
      currentColor,
      categories,
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

  const searchCategories = useCallback(
    (searchQuery: string) => {
      const trimmedSearchQuery = searchQuery.trim().toLowerCase();

      setSearchedCategories(
        categories.filter((item) =>
          item.labelName.toLowerCase().includes(trimmedSearchQuery),
        ),
      );
    },
    [categories],
  );

  const searchCategoriesDebouncer = useMemo(
    () => debounce(searchCategories, 300),
    [searchCategories],
  );

  useEffect(() => {
    searchCategoriesDebouncer(searchQuery);
  }, [searchQuery, searchCategoriesDebouncer]);

  return (
    <Section>
      <SelectedTypeContainer onPress={openModal}>
        <Typography align="center">{selectedCategoriesLabel}</Typography>
      </SelectedTypeContainer>
      <BottomModal
        title="Choose categories"
        maxHeight="85%"
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        onClose={onClose}
        closeTriggered={closeTriggered}
        setCloseTriggered={setCloseTriggered}
        withCloseButtonDivider={false}
      >
        <AddLabelInput
          allLabels={categories}
          isCategoryLabel
          onCreate={onCreate}
          setSearchQuery={setSearchQuery}
        />
        <KeyboardAwareFlatList
          data={trimmedSearchQuery ? searchedCategories : categories}
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
      <FormLabel label="Categories" bottomOffset={-13} />
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

export default React.memo(CategoriesSelector);
