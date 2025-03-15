import React from "react";
import { useTranslation } from "react-i18next";

import AddItemButton from "../common/AddItemButton";

import GroupBottomSheet from "./GroupBottomSheet";

type Props = {
  parentGroupId?: string;
};

const AddGroupButton = ({ parentGroupId }: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <GroupBottomSheet parentGroupId={parentGroupId}>
      {(openModal) => (
        <AddItemButton
          label={t(parentGroupId ? "tasks.subgroup" : "tasks.group")}
          onPress={openModal}
        />
      )}
    </GroupBottomSheet>
  );
};

export default React.memo(AddGroupButton);
