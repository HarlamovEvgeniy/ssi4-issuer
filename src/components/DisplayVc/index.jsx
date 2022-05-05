import {observer} from "mobx-react";
import React from "react";

import vcStore from "../../store/vc";
import downloadAsJson from "../../utils/downloadAsJson";
import Button from "../Button";
import classes from "./index.module.scss";

function DisplayVc() {
  function handleDownloadClick() {
    downloadAsJson(JSON.stringify(vcStore.value, null, 2));
  }

  return (
    <main>
      <p className={classes.title}>Your VC</p>
      <p className={classes.helper_text}>
        You can download vc or upload to blockchain Select VC type and click
      </p>
      <div className={classes.code_wrapper}>
        <h2 className={classes.code_title}>Your VC</h2>
        <code className={classes.code}>
          {JSON.stringify(vcStore.value, null, 2)}
        </code>
      </div>
      <div className={classes.buttons_container}>
        <Button onClick={handleDownloadClick} title="Download file as vc.json">
          Download VC
        </Button>
        <Button disabled>Upload to blockchain</Button>
      </div>
    </main>
  );
}

export default observer(DisplayVc);
