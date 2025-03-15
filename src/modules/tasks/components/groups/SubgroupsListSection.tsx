import React from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import Typography from "components/Typography";
import { useSubGroupsByGroupId } from "modules/tasks/api/tasksSelectors";
import styled from "styled-components/native";

import { GroupItem } from "../../types";

import GroupDisplayItem from "./GroupDisplayItem";

type Props = {
  group: GroupItem;
  depth?: number;
};

const SubgroupsListSection = ({
  group,
  depth = 0,
}: Props): JSX.Element | null => {
  const { t } = useTranslation();

  const subGroups = useSubGroupsByGroupId(group._id).subGroups;

  if (subGroups.length === 0) return null;

  return (
    <SubGroupsSectionContainer>
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
            <GroupDisplayItem group={subGroup} depth={depth + 1} />
          </SubGroupItemContainer>
        ))}
      </SubGroupsContainer>
    </SubGroupsSectionContainer>
  );
};

const SubGroupsSectionContainer = styled.View`
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
