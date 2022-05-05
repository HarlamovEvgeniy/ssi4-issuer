import React from "react";

import classes from "./index.module.scss";

export default function Footer(props) {
  return (
    <footer className={classes.paragraph} {...props}>
      This is a test site, at the moment documents are issued with fake data
    </footer>
  );
}
