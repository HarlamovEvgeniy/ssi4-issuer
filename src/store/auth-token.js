import {makeAutoObservable} from "mobx";

class AuthTokenStore {
  value;

  constructor() {
    makeAutoObservable(this);
  }

  setValue(value) {
    this.value = value;
  }
}

const authTokenStore = new AuthTokenStore();

export default authTokenStore;
