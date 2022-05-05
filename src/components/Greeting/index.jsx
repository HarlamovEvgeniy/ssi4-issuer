import React from "react";

import classes from "./index.module.scss";

export default function Greeting() {
  return (
    <main className={classes.container}>
      <h1 className={classes.title}>SSI Demo Issuer</h1>
      <p className={classes.desc}>
        Blockchain technologies allows you cut out the middleman from many
        processes. By reducing third-party involvement, business.
      </p>
    </main>
  );
}
