import {makeAutoObservable} from "mobx";

class WalletStore {
  pin;
  seedPhrase;
  pubkey;
  secret;
  address;

  constructor() {
    makeAutoObservable(this);
  }

  setPin(pin) {
    this.pin = pin;
  }

  setSeedPhrase(seedPhrase) {
    this.seedPhrase = seedPhrase;
  }

  setAddress(address) {
    this.address = address;
  }

  setPubkey(pubkey) {
    this.pubkey = pubkey;
  }

  setSecret(secret) {
    this.secret = secret;
  }
}

const walletStore = new WalletStore();

export default walletStore;
