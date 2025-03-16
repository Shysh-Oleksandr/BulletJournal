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
import Toast from "react-native-toast-message";
import theme from "theme";

import Divider from "components/Divider";
import { CustomLabel, LabelFor } from "modules/customLabels/types";
import ItemInfoBottomSheet from "modules/tasks/components/common/ItemInfoBottomSheet";

import AddLabelInput from "./AddLabelInput";
import LabelItem, { LabelItemProps } from "./LabelItem";

const keyExtractor = (item: CustomLabel) => item._id;
const ItemSeparatorComponent = () => (
  <Divider lineColor={theme.colors.cyan400} />
);

type Props = {
  labels: CustomLabel[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  currentColor: string;
  onSelectColor: (color: string) => void;
  isMultiSelect?: boolean;
  labelKey: string;
  inputPlaceholderKey: string;
  createdLabelKey: string;
  existsLabelKey: string;
  labelFor: LabelFor;
  labelItemProps: Pick<LabelItemProps, "updatedLabelKey" | "deletedLabelKey">;
  isVisible?: boolean;
  onClose?: () => void;
  children?: (openModal: () => void, selectedLabels: string) => JSX.Element;
};

const LabelSelector = ({
  labels,
  selectedIds,
  setSelectedIds,
  currentColor,
  onSelectColor,
  isMultiSelect = true,
  labelKey,
  createdLabelKey,
  existsLabelKey,
  labelItemProps,
  labelFor,
  inputPlaceholderKey,
  isVisible,
  onClose,
  children,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const [items, setItems] = useState(labels);
  const [closeTriggered, setCloseTriggered] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedItems, setSearchedItems] = useState<CustomLabel[]>(items);
  const flatListRef = useRef<KeyboardAwareFlatList>(null);

  const selectedLabels = useMemo(
    () =>
      items
        .filter((item) => selectedIds.includes(item._id))
        .map((item) => item.labelName)
        .join(", "),
    [selectedIds, items],
  );

  const onEditBtnPress = useCallback((itemId: string | null) => {
    setEditingItemId(itemId);
  }, []);

  const onCreate = useCallback(
    (newLabel: CustomLabel) => {
      setSelectedIds(
        isMultiSelect ? [...selectedIds, newLabel._id] : [newLabel._id],
      );
      setItems((prev) => [...prev, newLabel]);
      setEditingItemId(null);
      setTimeout(() => flatListRef.current?.scrollToEnd(true), 200);
    },
    [setSelectedIds, isMultiSelect, selectedIds],
  );

  const onChoose = useCallback(
    (itemId: string | null) => {
      if (!itemId) return;

      setEditingItemId(null);
      setSelectedIds(
        isMultiSelect
          ? selectedIds.includes(itemId)
            ? selectedIds.filter((id) => id !== itemId)
            : [...selectedIds, itemId]
          : [itemId],
      );

      if (!isMultiSelect) {
        setCloseTriggered(true);
      }
    },
    [setSelectedIds, isMultiSelect, selectedIds],
  );

  const checkLabelExists = useCallback(
    (labelName: string) => {
      if (!items.some((item) => item.labelName === labelName)) return false;

      Toast.show({
        type: "error",
        text1: t("general.failure"),
        text2: t(existsLabelKey, { label: labelName }),
      });

      return true;
    },
    [existsLabelKey, items, t],
  );

  const renderItem: ListRenderItem<CustomLabel> = useCallback(
    ({ item, index }) => (
      <LabelItem
        key={index}
        label={item}
        isActive={selectedIds.includes(item._id)}
        isEditing={item._id === editingItemId}
        currentItemColor={currentColor}
        onChoose={onChoose}
        onEditBtnPress={onEditBtnPress}
        setItems={setItems}
        onSelectColor={onSelectColor}
        labelFor={labelFor}
        inputPlaceholderKey={inputPlaceholderKey}
        {...labelItemProps}
      />
    ),
    [
      selectedIds,
      editingItemId,
      currentColor,
      onChoose,
      onEditBtnPress,
      onSelectColor,
      labelFor,
      inputPlaceholderKey,
      labelItemProps,
    ],
  );

  const handleClose = useCallback(() => {
    setEditingItemId(null);
    setSearchQuery("");

    onClose?.();
  }, [onClose]);

  const searchItems = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim().toLowerCase();

      setSearchedItems(
        items.filter((item) =>
          item.labelName.toLowerCase().includes(trimmedQuery),
        ),
      );
    },
    [items],
  );

  const searchDebouncer = useMemo(
    () => debounce(searchItems, 300),
    [searchItems],
  );

  useEffect(() => {
    searchDebouncer(searchQuery);
  }, [searchQuery, searchDebouncer]);

  return (
    <ItemInfoBottomSheet
      bottomModalProps={{
        minHeight: "85%",
        withHeader: true,
        title: t(labelKey),
        closeTriggered,
        setCloseTriggered,
        isVisible,
      }}
      onClose={handleClose}
      withContentContainer={false}
      content={() => (
        <>
          <AddLabelInput
            setSearchQuery={setSearchQuery}
            allLabels={items}
            onCreate={onCreate}
            labelFor={labelFor}
            inputPlaceholderKey={inputPlaceholderKey}
            checkLabelExists={checkLabelExists}
            createdLabelKey={createdLabelKey}
          />
          <KeyboardAwareFlatList
            data={searchQuery.trim() ? searchedItems : items}
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
        </>
      )}
    >
      {(openModal) => children?.(openModal, selectedLabels) ?? <></>}
    </ItemInfoBottomSheet>
  );
};

export default React.memo(LabelSelector);
