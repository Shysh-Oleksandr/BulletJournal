import React from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import Typography from "components/Typography";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import { getSubGroupsByGroupId } from "../../TasksSelectors";
import { GroupItem } from "../../types";

import AddGroup from "./AddGroup";
import GroupHeaderDisplayItem from "./GroupHeaderDisplayItem";

type Props = {
  group: GroupItem;
  depth: number;
};

const SubgroupsListSection = ({ group, depth }: Props): JSX.Element => {
  const { t } = useTranslation();

  const subgroups = useAppSelector((state) =>
    getSubGroupsByGroupId(state, group._id),
  );

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
        {subgroups.map((subgroup) => (
          <GroupHeaderDisplayItem
            key={subgroup._id}
            group={subgroup}
            depth={depth + 1}
          />
        ))}
      </SubGroupsContainer>
      <AddGroup parentGroupId={group._id} isSubgroup />
    </SubGroupsSectionContainer>
  );
};

const SubGroupsSectionContainer = styled.View`
  margin-vertical: 12px;
  gap: 10px;
`;
const SubGroupsContainer = styled.View`
  gap: 12px;
  padding-horizontal: 8px;
`;

export default React.memo(SubgroupsListSection);
