import {MenuItem, Select} from "@mui/material";
import {observer} from "mobx-react";
import React from "react";
import {useHistory} from "react-router-dom";

import authTokenStore from "../../store/auth-token";
import vcStore from "../../store/vc";
import Button from "../Button";
import classes from "./index.module.scss";

function VcManagement() {
  const history = useHistory();

  async function handleIssueVc() {
    await vcStore.issueVc(authTokenStore.value);
    history.push("/display");
  }

  return (
    <main className={classes.container}>
      <h1 className={classes.title}>VC Management</h1>
      <p className={classes.description}>Select VC type and click ‘Issue VC’</p>
      <div className={classes.inputs_wrapper}>
        <Select value="default" readOnly className={classes.input_select}>
          <MenuItem value="default">Default</MenuItem>
        </Select>
        <Button loading={vcStore.loading} onClick={handleIssueVc}>
          Issue VC
        </Button>
      </div>
    </main>
  );
}

export default observer(VcManagement);
