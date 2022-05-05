import {combineReducers} from "redux";

import appReducer from "./app";
import enterSeedPhrase from "./enterSeedPhrase";
import walletReducer from "./wallet";

export default combineReducers({
  appReducer,
  walletReducer,
  enterSeedPhrase,
});
