import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { Ionicons } from "@expo/vector-icons";
import { SMALL_BUTTON_HIT_SLOP } from "modules/app/constants";
import styled from "styled-components/native";

import { GroupItem, TaskItem } from "../../types";
import AddGroupButton from "../groups/AddGroupButton";
import ArchivedSubtasksListSection from "../groups/ArchivedSubtasksListSection";
import GroupBottomSheet from "../groups/GroupBottomSheet";
import SubgroupsListSection from "../groups/SubgroupsListSection";
import SubtasksListSection from "../tasks/SubtasksListSection";
import TaskBottomSheet from "../tasks/TaskBottomSheet";

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
          <TasksSearchContent onItemSelect={setSelectedItem} />
          {selectedItem &&
            (isTask ? (
              <TaskBottomSheet
                task={selectedItem}
                openByDefault
                onClose={() => setSelectedItem(null)}
                content={() => <SubtasksListSection task={selectedItem} />}
              >
                {() => <></>}
              </TaskBottomSheet>
            ) : (
              <GroupBottomSheet
                group={selectedItem}
                openByDefault
                onClose={() => setSelectedItem(null)}
                content={() => (
                  <ContentContainer>
                    <SubgroupsListSection group={selectedItem} />
                    <AddGroupButton parentGroupId={selectedItem._id} />
                    <ArchivedSubtasksListSection groupId={selectedItem._id} />
                  </ContentContainer>
                )}
              >
                {() => <></>}
              </GroupBottomSheet>
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

const ContentContainer = styled.View`
  margin-top: 12px;
  gap: 12px;
`;

export default React.memo(TasksSearch);
