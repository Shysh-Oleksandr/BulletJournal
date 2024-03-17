import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { EventArg, NavigationAction } from "@react-navigation/native";
import { useAppNavigation } from "modules/navigation/NavigationService";

import ConfirmAlert from "./ConfirmAlert";

type BeforeRemoveEvent = EventArg<
  "beforeRemove",
  true,
  {
    action: NavigationAction;
  }
>;

type Props = {
  hasChanges: boolean;
  onConfirm: (() => Promise<void>) | (() => void);
};

const LeaveConfirmAlert = ({ hasChanges, onConfirm }: Props): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useAppNavigation();

  const [isLeaveDialogVisible, setIsLeaveDialogVisible] = useState(false);
  const [leaveNavigationAction, setLeaveNavigationAction] =
    useState<NavigationAction | null>(null);

  useEffect(() => {
    const callback = (e: BeforeRemoveEvent) => {
      if (!hasChanges || isLeaveDialogVisible) {
        return;
      }

      e.preventDefault();

      setIsLeaveDialogVisible(true);
      setLeaveNavigationAction(e.data.action);
    };

    navigation.addListener("beforeRemove", callback);

    return () => {
      navigation.removeListener("beforeRemove", callback);
    };
  }, [navigation, hasChanges, isLeaveDialogVisible]);

  return (
    <ConfirmAlert
      message={t("note.saveBeforeLeaving")}
      isDialogVisible={isLeaveDialogVisible}
      setIsDialogVisible={setIsLeaveDialogVisible}
      onDeny={() =>
        leaveNavigationAction && navigation.dispatch(leaveNavigationAction)
      }
      onConfirm={async () => {
        await onConfirm();

        leaveNavigationAction && navigation.dispatch(leaveNavigationAction);
      }}
    />
  );
};

export default LeaveConfirmAlert;
