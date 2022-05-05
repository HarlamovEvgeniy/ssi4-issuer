import React from "react";

import logoService from "./img/logo-service.png";
import Service from "./Service";

function AppPage() {
  return (
    <div className="main">
      <div className="container">
        <div className="row">
          <div className="menu col-4 d-flex justify-content-center align-items-between">
            <span className="active">Available VCs</span>
            <div className="break" />
            <span>State Documents</span>
            <div className="break" />
            <span>Social Networks</span>
            <div className="break" />
            <span>DeFi Ownership</span>
            <div className="break" />
            <span className="last">Games</span>
          </div>
          <div className="menu-services col-7 offset-md-1">
            <div className="title">Available Services</div>
            <div className="services d-flex">
              <Service
                title="Defi Space Swap"
                logo={logoService}
                description="Test Description Test Description Test Description Test Description Test Description Test Description"
              />
              <Service
                title="Defi Space Swap"
                logo={logoService}
                description="Test Description Test Description Test Description Test Description Test Description Test Description"
              />
              <Service
                title="Defi Space Swap"
                logo={logoService}
                description="Test Description Test Description Test Description Test Description Test Description Test Description"
              />
              <Service
                title="Defi Space Swap"
                logo={logoService}
                description="Test Description Test Description Test Description Test Description Test Description Test Description"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppPage;
