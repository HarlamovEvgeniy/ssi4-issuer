import {useSnackbar} from "notistack";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import {useMount} from "react-use";

import DisplayVc from "./components/DisplayVc";
import Footer from "./components/Footer";
import Greeting from "./components/Greeting";
import Header from "./components/Header";
import VcManagement from "./components/VcManagement";
import AppPage from "./sdk/AppPage";
import ConnectWalletPage from "./sdk/ConnectWalletPage";
import LoginDidPage from "./sdk/LoginDidPage";
import LoginPage from "./sdk/LoginPage";
import WelcomeDidPage from "./sdk/WelcomeDidPage";
import WelcomeDidPageEver from "./sdk/WelcomeDidPageEver";
import {changeTheme, hideTip, showPopup} from "./store/actions/app";
import {
  enterSeedPhraseEmptyStorage,
  setEncryptedSeedPhrase,
  showEnterSeedPhraseUnlock,
} from "./store/actions/enterSeedPhrase";
import {
  setAssetsFromGraphQL,
  setLiquidityList,
  setPairsList,
  setSubscribeReceiveTokens,
  setTokenList,
  setTransactionsList,
  setWallet,
} from "./store/actions/wallet";
import vcStore from "./store/vc";

function App() {
  const {enqueueSnackbar} = useSnackbar();
  const dispatch = useDispatch();
  const appTheme = useSelector((state) => state.appReducer.appTheme);

  const [onloading, setonloading] = useState(false);
  const chrome = localStorage.getItem("chrome");
  if (chrome === null) showChromePopup();
  else if (chrome === "false") showChromePopup();

  function showChromePopup() {
    dispatch(showPopup({type: "chrome"}));
    localStorage.setItem("chrome", "true");
  }

  useEffect(async () => {
    setonloading(true);
    const theme =
      localStorage.getItem("appTheme") === null
        ? "light"
        : localStorage.getItem("appTheme");
    if (appTheme !== theme) dispatch(changeTheme(theme));
    setonloading(false);
    console.log("setonloading", onloading);
  }, []);

  async function checkOnLogin() {
    const esp = localStorage.getItem("esp");
    if (esp === null) dispatch(enterSeedPhraseEmptyStorage(true));
    else if (typeof esp === "string") {
      dispatch(enterSeedPhraseEmptyStorage(false));
      dispatch(setEncryptedSeedPhrase(esp));
      dispatch(showEnterSeedPhraseUnlock());
    } else dispatch(enterSeedPhraseEmptyStorage(true));
  }

  useMount(async () => {
    await checkOnLogin();
  });

  const tips = useSelector((state) => state.appReducer.tips);
  const transListReceiveTokens = useSelector(
    (state) => state.walletReducer.transListReceiveTokens,
  );

  useEffect(async () => {
    console.log("tips22222", tips);
    if (!tips) return;
    if (
      tips.type === "error" ||
      tips.message === "Sended message to blockchain" ||
      tips.message === "Copied"
    ) {
      enqueueSnackbar({type: tips.type, message: tips.message});
      return;
    }
    const newTransList = JSON.parse(JSON.stringify(transListReceiveTokens));
    console.log("newTransList", newTransList);

    enqueueSnackbar({type: tips.type, message: tips.message});
    newTransList.push(tips);
    dispatch(setSubscribeReceiveTokens(newTransList));
  }, [tips]);

  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={Greeting} />
        <Route path="/management" component={VcManagement} />
        <Route path="/display" component={DisplayVc} />
        <Route path="/connect" component={ConnectWalletPage} />
        <Route path="/welcome-did" component={WelcomeDidPage} />
        <Route exact path="/welcome-did-ever" component={WelcomeDidPageEver}></Route>
        <Route exact path="/login" component={LoginPage} />
        <Route path="/login-did" component={LoginDidPage} />
        <Route path="/app" component={AppPage} />
      </Switch>
      <Footer style={{marginTop: "auto"}} />
    </Router>
  );
}

export default App;
