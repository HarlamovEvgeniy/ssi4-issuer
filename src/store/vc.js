import {makeAutoObservable} from "mobx";

import backendVerifierService from "../services/backend-verifier";

class VcStore {
  value;
  loading = false;
  error;

  constructor() {
    makeAutoObservable(this);
  }

  async issueVc(token) {
    this.loading = true;

    try {
      const {data} = await backendVerifierService.issueVc(token);
      this.value = data;
    } catch (e) {
      this.error = JSON.stringify(e, null, 2);
    }

    this.loading = false;
  }
}

const vcStore = new VcStore();

export default vcStore;
