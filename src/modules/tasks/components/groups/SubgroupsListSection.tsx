import React from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import Typography from "components/Typography";
import { useSubGroupsByGroupId } from "modules/tasks/api/tasksSelectors";
import styled from "styled-components/native";

import { GroupItem } from "../../types";

import AddGroup from "./AddGroup";
import GroupHeaderDisplayItem from "./GroupHeaderDisplayItem";

type Props = {
  group: GroupItem;
  depth: number;
};

const SubgroupsListSection = ({ group, depth }: Props): JSX.Element => {
  const { t } = useTranslation();

  const { subGroups } = useSubGroupsByGroupId(group._id);

  return (
    <SubGroupsSectionContainer>
      {subGroups.length > 0 && (
        <>
          <Typography
            fontWeight="semibold"
            fontSize="xl"
            color={theme.colors.darkBlueText}
          >
            {t("tasks.subgroups")}:
          </Typography>
          <SubGroupsContainer>
            {subGroups.map((subGroup) => (
              <SubGroupItemContainer key={subGroup._id}>
                <GroupHeaderDisplayItem group={subGroup} depth={depth + 1} />
              </SubGroupItemContainer>
            ))}
          </SubGroupsContainer>
        </>
      )}
      <AddGroup parentGroupId={group._id} isSubgroup />
    </SubGroupsSectionContainer>
  );
};

const SubGroupsSectionContainer = styled.View`
  margin-vertical: 12px;
  gap: 10px;
`;
const SubGroupsContainer = styled.View`
  gap: 8px;
`;

const SubGroupItemContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  padding: 8px 12px;
  elevation: 1;
`;

export default React.memo(SubgroupsListSection);
