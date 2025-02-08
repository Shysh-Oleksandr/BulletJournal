import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { Ionicons } from "@expo/vector-icons";
import { SMALL_BUTTON_HIT_SLOP } from "modules/app/constants";
import styled from "styled-components/native";

import { GroupItem, TaskItem } from "../../types";
import SubtasksListSection from "../tasks/SubtasksListSection";
import TaskBottomSheet from "../tasks/TaskBottomSheet";

import ItemActionsList from "./ItemActionsList";
import ItemInfoBottomSheet from "./ItemInfoBottomSheet";
import TasksSearchContent from "./TasksSearchContent";

const TasksSearch = (): JSX.Element | null => {
  const { t } = useTranslation();

  const [selectedItem, setSelectedItem] = useState<GroupItem | TaskItem | null>(
    null,
  );

  const isTask = selectedItem && "type" in selectedItem;

  return (
    <ItemInfoBottomSheet
      bottomModalProps={{
        minHeight: "49%",
        withHeader: true,
        title: t("search.search"),
      }}
      content={() => (
        <>
          <TasksSearchContent setSelectedItem={setSelectedItem} />
          {selectedItem &&
            (isTask ? (
              <TaskBottomSheet
                task={selectedItem}
                openByDefault
                onClose={() => setSelectedItem(null)}
                content={(closeModal) => (
                  <>
                    <ItemActionsList
                      item={selectedItem}
                      closeModal={closeModal}
                    />
                    <SubtasksListSection task={selectedItem} />
                  </>
                )}
              >
                {() => <></>}
              </TaskBottomSheet>
            ) : (
              // TODO: Add group item
              <></>
            ))}
        </>
      )}
    >
      {(openModal) => (
        <SearchButtonContainer
          onPress={openModal}
          hitSlop={SMALL_BUTTON_HIT_SLOP}
        >
          <Ionicons name="search" size={26} color={theme.colors.white} />
        </SearchButtonContainer>
      )}
    </ItemInfoBottomSheet>
  );
};

const SearchButtonContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

export default React.memo(TasksSearch);
