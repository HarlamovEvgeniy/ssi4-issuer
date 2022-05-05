// import "../index.scss";
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap";

import React from "react";
import {HashRouter as Router, Route,Switch} from "react-router-dom";

import AppPageHeader from "./AppPageHeader";
import logo from "./img/radiance logo.png";
import StartPageHeader from "./StartPageHeader";
import WelcomeDidPageHeader from "./WelcomeDidPageHeader";

function Header() {
  return (
    <Router>
      <div className="header">
        <div className="container">
          <header className="d-flex flex-wrap justify-content-sm-around py-3 mb-4">
            <a
              href="#/"
              className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none"
            >
              <img src={logo} alt="logo" className="logo" />
              <span className="fs-4">RADIANCETEAM</span>
            </a>

            <span>Issuance of Verifiable Credentials (VC)</span>

            <Switch>
              {/* <Route exact path="/" component={StartPageHeader}></Route> */}
              {/* <Route exact path="/connect-wallet" component={StartPageHeader}></Route> */}
              <Route
                exact
                path="/welcome-did"
                component={WelcomeDidPageHeader}
              />
              <Route exact path="/login-did" component={WelcomeDidPageHeader} />
              <Route exact path="/login" component={WelcomeDidPageHeader} />
              <Route exact path="/app" component={AppPageHeader} />
            </Switch>
          </header>
        </div>
      </div>
    </Router>
  );
}

export default Header;
