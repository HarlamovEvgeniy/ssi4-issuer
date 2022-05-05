import {Account} from "@eversdk/appkit";
import {libWeb} from "@eversdk/lib-web";
import React, {useState} from "react";

import refresh from "./img/refresh.png";

const {TonClient} = require("@eversdk/core");

TonClient.useBinaryLibrary(libWeb);
const client = new TonClient({network: {endpoints: ["main.ton.dev"]}});

function WelcomeDidPageHeader() {
  async function getClientBalance(clientAddress) {
    console.log("clientAddress", clientAddress);
    const address = clientAddress;
    if (
      clientAddress ===
      "0:0000000000000000000000000000000000000000000000000000000000000000"
    )
      return 0;
    try {
      const clientBalance = await client.net.query_collection({
        collection: "accounts",
        filter: {
          id: {
            eq: address,
          },
        },
        result: "balance",
      });
      console.log("clientBalance", clientBalance);
      return +clientBalance.result[0].balance / 1000000000;
    } catch (e) {
      console.log("catch E", e);
      return e;
    }
  }

  const [bal, setBal] = useState();

  // let bal1 = getClientBalance(localStorage.address);
  // bal1.then(
  // 	(data) => {
  // 		let temp = String(data).slice(0,3)
  // 		setBal(temp);
  // 	},
  // 	(error) => {
  // 		console.log(error);
  // 	}
  // )

  function refreshBal() {
    const bal1 = getClientBalance(localStorage.address);
    bal1.then(
      (data) => {
        const temp = String(data).slice(0, 3);
        setBal(temp);
      },
      (error) => {
        console.log(error);
      },
    );
  }
  refreshBal();

  return (
    <div className="acc-info">
      {/* <div className="balance">
				<div className="bal">{bal} TON</div>
				<button className="refresh-bal" onClick={refreshBal}>
					<img src={refresh}></img>
				</button>
			</div> */}
      <div className="acc">
        <div className="acc-logo" />

        <div className="content">
          <div className="acc-status">Connected</div>
          <div className="break" />
          <div className="acc-wallet">{localStorage.address}</div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeDidPageHeader;
