import {makeAutoObservable} from "mobx";

class DidStore {
  value;

  constructor() {
    makeAutoObservable(this);
  }

  setValue(value) {
    this.value = value;
  }
}

const didStore = new DidStore();

export default didStore;
