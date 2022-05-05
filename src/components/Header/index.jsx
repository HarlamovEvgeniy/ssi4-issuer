import React from "react";
import {Link, useHistory, useLocation} from "react-router-dom";

import imgLogo from "../../images/logo.png";
import Button from "../Button";
import classes from "./index.module.scss";

export default function Header() {
  const location = useLocation();
  const history = useHistory();

  function handleLogin() {
    history.push("/connect");
  }

  return (
    <header className={classes.container}>
      <Link to="/" title="To home page">
        <img src={imgLogo} alt="Logo Radianceteam" width="172" height="45" />
      </Link>
      {location.pathname === "/" && (
        <Button onClick={handleLogin}>Log in</Button>
      )}
    </header>
  );
}
