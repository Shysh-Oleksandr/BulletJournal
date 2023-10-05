import React from "react";
import theme from "theme";

import { Entypo, MaterialIcons } from "@expo/vector-icons";
import Button from "components/Button";

const SaveIcon = <Entypo name="save" size={20} color={theme.colors.white} />;
const DeleteIcon = (
  <MaterialIcons name="delete" size={20} color={theme.colors.white} />
);

const NoteActionButtons = (): JSX.Element => (
  <>
    <Button
      label="Update"
      bgColor={theme.colors.cyan600}
      marginTop={20}
      labelProps={{
        fontWeight: "bold",
        fontSize: "xl",
        paddingHorizontal: 8,
      }}
      Icon={SaveIcon}
    />
    <Button
      label="Delete"
      bgColor={theme.colors.red600}
      marginTop={8}
      labelProps={{
        fontWeight: "bold",
        fontSize: "xl",
        paddingHorizontal: 8,
      }}
      Icon={DeleteIcon}
    />
  </>
);

export default NoteActionButtons;
