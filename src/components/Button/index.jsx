import LoadingButton from "@mui/lab/LoadingButton";
import React from "react";

import classes from "./index.module.scss";

export default function Button(props) {
  return (
    <LoadingButton
      classes={{
        root: classes.button,
      }}
      variant="contained"
      disableRipple
      {...props}
    />
  );
}
