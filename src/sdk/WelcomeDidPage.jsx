import {Account} from "@eversdk/appkit";
import {signerKeys, signerNone, TonClient} from "@eversdk/core";
import {libWeb} from "@eversdk/lib-web";
import sha256 from "crypto-js/sha256";
import {observer} from "mobx-react";
import * as ed from "noble-ed25519";
import React, {useState} from "react";
import {useQuery} from "react-query";
import {HashRouter as Router, useHistory} from "react-router-dom";
import {ProviderRpcClient, RawProviderApiResponse} from "ton-inpage-provider";

import {DEXClientContract} from "../extensions/contracts/testNet/DEXClientMainNet.js";
import authTokenStore from "../store/auth-token.js";
import didStore from "../store/did";
import walletStore from "../store/wallet";
import {DidDocumentContract} from "./contracts/new/DidDocumentContractDev.js";
import {DidStorageContract} from "./contracts/new/DidStorageContractDev.js";

const config = require("./config.json");

TonClient.useBinaryLibrary(libWeb);
const client = new TonClient({network: {endpoints: [config.DappServer]}});

const pidCrypt = require("pidcrypt");
require("pidcrypt/aes_cbc");

const dexrootAddr = config.storageroot;

function WelcomeDidPage() {
  const history = useHistory();

  const [didDoc, setDidDoc] = useState();

  const [loader, setLoader] = useState(false);

  const [DID, setDID] = useState();

  const [menuCurent, setMenuCurent] = useState(0);

  const attributes = [
    "id",
    "@context",
    "controller",
    "alsoKnownAs",
    "verificationMethod",
    "authentication",
    "assertionMethod",
    "keyAgreement",
    "capabilityInvocation",
    "capabilityDelegation",
    "service",
  ];

  const [curentAttr, setCurentAttr] = useState();

  const [curentStatus, setCurentStatus] = useState();

  const [curentAddr, setCurentAddr] = useState();

  const [alertW, setAlertW] = useState({
    hidden: true,
    text: "",
    title: "",
  });

  const aes = new pidCrypt.AES.CBC();

  async function getClientKeys(phrase) {
    // todo change with only pubkey returns
    console.log(phrase);

    const test = await client.crypto.mnemonic_derive_sign_keys({
      phrase,
      path: "m/44'/396'/0'/0/0",
      dictionary: 1,
      word_count: 12,
    });
    return test;
  }

  function decryptSeed(pin) {
    const decrypted = aes.decryptText(sessionStorage.seedHash, pin);

    const engPattern = /[a-z]/;

    if (!engPattern.test(decrypted)) {
      alert("Wrong PIN");
      return false;
    }

    const seed_arr = decrypted.split(" ");

    if (!seed_arr == 12) {
      alert("Wrong PIN");
      return false;
    }

    for (let i = 0; i < seed_arr.length; i++) {
      for (let j = 0; j < seed_arr[i].length; j++) {
        if (!engPattern.test(seed_arr[i][j])) {
          alert("Wrong PIN");
          return false;
        }
      }
    }

    return decrypted;
  }

  async function getClientBalance(clientAddress) {
    console.log("clientAddress", clientAddress);
    const address = clientAddress;
    if (
      clientAddress ===
      "0:0000000000000000000000000000000000000000000000000000000000000000"
    ) {
      console.log(0);
      return 0;
    }
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

  async function createDID3() {
    const pass = prompt("Enter your PIN");

    const seed = decryptSeed(pass);

    if (!seed) {
      return;
    }

    create();

    async function create() {
      const bal = getClientBalance(sessionStorage.address);

      bal.then(async (data) => {
        if (data < 0.5) {
          alert("Insufficient balance");
        } else {
          setLoader(true);

          const acc = new Account(DEXClientContract, {
            address: sessionStorage.address,
            signer: signerKeys(await getClientKeys(seed)),
            client,
          });

          const pubkey = (await getClientKeys(seed)).public;

          try {
            const newDIDDoc = {
              id: `did:everscale:${pubkey.toString()}`,
              // createdAt: new Date().getTime().toString(),
              "@context": [
                "https://www.w3.org/ns/did/v1",
                "https://w3id.org/security/suites/ed25519-2020/v1",
              ],
              publicKey: pubkey.toString(),
              verificationMethod: {
                id: `did:everscale:${pubkey.toString()}`,
                type: "Ed25519VerificationKey2020",
                controller: `did:everscale:${pubkey.toString()}`,
                publicKeyMultibase: pubkey,
              },
            };

            const {body} = await client.abi.encode_message_body({
              abi: {type: "Contract", value: DidStorageContract.abi},
              signer: {type: "None"},
              is_internal: true,
              call_set: {
                function_name: "addDid",
                input: {
                  pubKey: `0x${pubkey}`,
                  didDocument: JSON.stringify(newDIDDoc),
                  addr: sessionStorage.address,
                },
              },
            });

            const res = await acc.run("sendTransaction", {
              dest: dexrootAddr,
              value: 500000000,
              bounce: true,
              flags: 3,
              payload: body,
            });

            console.log(res);
          } catch (e) {
            console.log(e);
            setLoader(false);
          }

          setTimeout(async () => {
            const acc2 = new Account(DidStorageContract, {
              address: dexrootAddr,
              signer: signerNone(),
              client,
            });
            const res2 = await acc2.runLocal("resolveDidDocument", {
              id: `0x${pubkey}`,
            });

            console.log(res2);

            const addrDidDoc =
              res2.decoded.out_messages[0].value.addrDidDocument;

            try {
              const accDid = new Account(DidDocumentContract, {
                address: addrDidDoc,
                signer: signerNone(),
                client,
              });

              const resInit = await accDid.run(
                "init",
                {
                  issuerAddr: sessionStorage.address,
                },
                {
                  signer: signerKeys(await getClientKeys(seed)),
                },
              );

              console.log(resInit);
            } catch (e) {
              console.log(e);
              setLoader(false);
              alert("Error Init!");
              return;
            }

            const didAcc = new Account(DidDocumentContract, {
              address: addrDidDoc,
              signer: signerNone(),
              client,
            });

            const resDid = await didAcc.runLocal("getDid", {});

            // setDidDoc(resDid.decoded.out_messages[0].value.value0);
            console.log(resDid.decoded.out_messages[0].value.value0);

            const tempDoc = JSON.parse(
              resDid.decoded.out_messages[0].value.value0.didDocument,
            );

            const tempDid = tempDoc.id;
            didStore.setValue(tempDid);

            setLoader(false);
            setAlertW({
              hidden: false,
              text: `Your DID has been created: ${tempDid}`,
              title: "Congratulations",
            });
          }, 20000);
        }
      });
    }
  }

  async function resolveDID() {
    didStore.setValue(DID);
    const tempDid = DID.split(":")[2];
    console.log(DID);

    setLoader(true);

    const acc2 = new Account(DidStorageContract, {
      address: dexrootAddr,
      signer: signerNone(),
      client,
    });

    let res2;

    try {
      res2 = await acc2.runLocal("resolveDidDocument", {
        id: `0x${tempDid}`,
      });
    } catch {
      setLoader(false);
      alert("Incorrect format DID");
      return;
    }

    console.log(res2);

    const addrDidDoc = res2.decoded.out_messages[0].value.addrDidDocument;

    try {
      const didAcc = new Account(DidDocumentContract, {
        address: addrDidDoc,
        signer: signerNone(),
        client,
      });

      const did = await didAcc.runLocal("getDid", {});
      console.log(JSON.stringify(did, null, 2));
      await testreq();
    } catch (e) {
      console.log(e);
      alert(
        "Error! \n Possible reasons: \n - Wrong DID \n - This DID has been deleted",
      );
    }

    setLoader(false);
  }

  async function testreq() {
    const tempDid = DID.split(":")[2];

    async function sendSign(data) {
      return fetch("https://ssi2.cryptan.site/auth/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Connection: "keep-alive",
        },

        body: `{
					"user":
					{
						"signatureHex":"${data}",
						"did": "${tempDid}",
            "address": "${walletStore.address}"
				}
				}`,
      })
        .then((data) => data.json())
        .then((data) => testSign(data.user.token));
    }

    async function testSign(data) {
      return fetch("https://ssi2.cryptan.site/auth/user", {
        method: "get",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Connection: "keep-alive",
          Authorization: `Token ${data}`,
        },
      })
        .then((data) => data.json())
        .then((data) => {
          if (data.user.token == undefined) {
            alert("Login Error!");
          } else {
            console.log(data.user.token);
            sessionStorage.setItem("token", data.user.token);
            sessionStorage.setItem("did", tempDid);
            authTokenStore.setValue(data.user.token);
            history.push("/management");
          }
        });
    }

    return fetch("https://ssi2.cryptan.site/auth", {
      method: "post",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Connection: "keep-alive",
      },

      body: `{"user":{"did": "${tempDid}"}}`,
    })
      .then((response) => response.json())
      .then(async (data) => {
        // data is the parsed version of the JSON returned from the above endpoint.
        const msg = data.value;
        // const msgHash = crypto.createHash('sha256').update(msg).digest('hex');
        const msgHash = sha256(msg).toString();
        console.log(msgHash);

        return ed.sign(msgHash, walletStore.secret);
      })
      .then((data) => sendSign(data));
  }

  async function updateDIDDocument() {
    const pass = prompt("Enter your PIN");

    const seed = decryptSeed(pass);

    if (!seed) {
      return;
    }

    console.log(seed);

    temp();

    async function temp() {
      const tempDid = DID.split(":")[2];
      console.log(DID);

      setLoader(true);

      const keys = await getClientKeys(seed);

      const acc = new Account(DEXClientContract, {
        address: sessionStorage.address,
        signer: signerKeys(keys),
        client,
      });

      console.log(2);

      const acc2 = new Account(DidStorageContract, {
        address: dexrootAddr,
        signer: signerNone(),
        client,
      });

      const res2 = await acc2.runLocal("resolveDidDocument", {
        id: `0x${tempDid}`,
      });

      console.log(res2);

      const addrDidDoc = res2.decoded.out_messages[0].value.addrDidDocument;

      const didAcc = new Account(DidDocumentContract, {
        address: addrDidDoc,
        signer: signerNone(),
        client,
      });

      console.log(JSON.stringify(didDoc.didDocument));

      try {
        const {body} = await client.abi.encode_message_body({
          abi: {type: "Contract", value: DidDocumentContract.abi},
          signer: {type: "None"},
          is_internal: true,
          call_set: {
            function_name: "newDidDocument",
            input: {
              didDocument: didDoc.didDocument,
            },
          },
        });

        const res = await acc.run("sendTransaction", {
          dest: addrDidDoc,
          value: 300000000,
          bounce: true,
          flags: 3,
          payload: body,
        });

        console.log(res);
      } catch (e) {
        console.log(e);
      }

      setTimeout(async () => {
        try {
          const resDid = await didAcc.runLocal("getDid", {});

          setDidDoc(resDid.decoded.out_messages[0].value.value0);
          console.log(resDid.decoded.out_messages[0].value.value0);
          setLoader(false);
        } catch (e) {
          console.log(e);
          alert("Error!");
          setLoader(false);
        }
      }, 20000);
    }
  }

  function addAttribute() {
    console.log(curentAttr);
    Object.keys(JSON.parse(didDoc.didDocument)).map((item) => {
      if (item == curentAttr) {
        alert("This attribute already exist!");
      }
    });
    const tempDidDoc = {};
    console.log(didDoc);
    for (const key in didDoc) {
      const temp = didDoc[key];
      if (key == "didDocument") {
        const tempDoc = JSON.parse(temp);
        tempDoc[curentAttr] = "null";
        tempDidDoc[key] = JSON.stringify(tempDoc);
      } else {
        console.log(temp);
        tempDidDoc[key] = temp;
      }
    }
    console.log(tempDidDoc);
    setDidDoc(tempDidDoc);
  }

  function deleteAttribute(item) {
    console.log(item);

    const tempDidDoc = {};
    console.log(didDoc);
    for (const key in didDoc) {
      const temp = didDoc[key];
      if (key == "didDocument") {
        const tempDoc = JSON.parse(temp);
        delete tempDoc[item];
        tempDidDoc[key] = JSON.stringify(tempDoc);
      } else {
        console.log(temp);
        tempDidDoc[key] = temp;
      }
    }
    console.log(tempDidDoc);
    setDidDoc(tempDidDoc);
  }

  function saveAttribute(item, value) {
    const tempDidDoc = {};
    console.log(didDoc);
    for (const key in didDoc) {
      const temp = didDoc[key];
      if (key == "didDocument") {
        const tempDoc = JSON.parse(temp);
        tempDoc[item] = value;
        tempDidDoc[key] = JSON.stringify(tempDoc);
      } else {
        console.log(temp);
        tempDidDoc[key] = temp;
      }
    }
    console.log(tempDidDoc);
    setDidDoc(tempDidDoc);
  }

  async function updateDidStatus() {
    const pass = prompt("Enter your PIN");

    const seed = decryptSeed(pass);

    if (!seed) {
      return;
    }

    temp();

    async function temp() {
      if (curentStatus == undefined) {
        alert("Set status");
        return;
      }

      const tempDid = DID.split(":")[2];
      console.log(DID);

      const bal = getClientBalance(sessionStorage.address);

      bal.then(async (data) => {
        if (data < 1) {
          alert("Insufficient balance");
        } else {
          setLoader(true);

          const acc = new Account(DEXClientContract, {
            address: sessionStorage.address,
            signer: signerKeys(await getClientKeys(seed)),
            client,
          });

          const pubkey = (await getClientKeys(seed)).public;

          const acc2 = new Account(DidStorageContract, {
            address: dexrootAddr,
            signer: signerNone(),
            client,
          });

          const res2 = await acc2.runLocal("resolveDidDocument", {
            id: `0x${tempDid}`,
          });

          console.log(res2);

          const addrDidDoc = res2.decoded.out_messages[0].value.addrDidDocument;

          const didAcc = new Account(DidDocumentContract, {
            address: addrDidDoc,
            signer: signerNone(),
            client,
          });

          // console.log(JSON.stringify(didDoc.didDocument));

          try {
            const {body} = await client.abi.encode_message_body({
              abi: {type: "Contract", value: DidDocumentContract.abi},
              signer: {type: "None"},
              is_internal: true,
              call_set: {
                function_name: "newDidStatus",
                input: {
                  status: Number(curentStatus),
                },
              },
            });

            const res = await acc.run("sendTransaction", {
              dest: addrDidDoc,
              value: 300000000,
              bounce: true,
              flags: 3,
              payload: body,
            });

            console.log(res);
          } catch (e) {
            console.log(e);
          }

          setTimeout(async () => {
            const resDid = await didAcc.runLocal("getDid", {});

            setDidDoc(resDid.decoded.out_messages[0].value.value0);
            console.log(resDid.decoded.out_messages[0].value.value0);
            setLoader(false);
          }, 20000);
        }
      });
    }
  }

  async function updateDidPub() {
    const pass = prompt("Enter your PIN");

    const seed = decryptSeed(pass);

    if (!seed) {
      return;
    }

    temp();

    async function temp() {
      if (curentAddr == undefined) {
        alert("Set Address");
        return;
      }

      const tempDid = DID.split(":")[2];
      console.log(DID);

      const bal = getClientBalance(sessionStorage.address);

      bal.then(async (data) => {
        if (data < 1) {
          alert("Insufficient balance");
        } else {
          setLoader(true);

          const acc = new Account(DEXClientContract, {
            address: sessionStorage.address,
            signer: signerKeys(await getClientKeys(seed)),
            client,
          });

          const pubkey = (await getClientKeys(seed)).public;

          const acc2 = new Account(DidStorageContract, {
            address: dexrootAddr,
            signer: signerNone(),
            client,
          });

          const res2 = await acc2.runLocal("resolveDidDocument", {
            id: `0x${tempDid}`,
          });

          console.log(res2);

          const addrDidDoc = res2.decoded.out_messages[0].value.addrDidDocument;

          const didAcc = new Account(DidDocumentContract, {
            address: addrDidDoc,
            signer: signerNone(),
            client,
          });

          try {
            const {body} = await client.abi.encode_message_body({
              abi: {type: "Contract", value: DidDocumentContract.abi},
              signer: {type: "None"},
              is_internal: true,
              call_set: {
                function_name: "newDidIssuerAddr",
                input: {
                  issuerAddr: curentAddr,
                },
              },
            });

            const res = await acc.run("sendTransaction", {
              dest: addrDidDoc,
              value: 300000000,
              bounce: true,
              flags: 3,
              payload: body,
            });

            console.log(res);
          } catch (e) {
            console.log(e);
            setLoader(false);
            return;
          }

          setTimeout(async () => {
            try {
              const resDid = await didAcc.runLocal("getDid", {});

              setDidDoc(resDid.decoded.out_messages[0].value.value0);
              console.log(resDid.decoded.out_messages[0].value.value0);
              setLoader(false);
            } catch (e) {
              console.log(e);
              alert("Error!");
              setLoader(false);
            }
          }, 20000);
        }
      });
    }
  }

  async function deleteDid() {
    const pass = prompt("Enter your PIN");

    const seed = decryptSeed(pass);

    if (!seed) {
      return;
    }

    temp();

    async function temp() {
      const tempDid = DID.split(":")[2];
      console.log(DID);

      const bal = getClientBalance(sessionStorage.address);

      bal.then(async (data) => {
        if (data < 1) {
          alert("Insufficient balance");
        } else {
          setLoader(true);

          const acc = new Account(DEXClientContract, {
            address: sessionStorage.address,
            signer: signerKeys(await getClientKeys(seed)),
            client,
          });

          const pubkey = (await getClientKeys(seed)).public;

          const acc2 = new Account(DidStorageContract, {
            address: dexrootAddr,
            signer: signerNone(),
            client,
          });

          const res2 = await acc2.runLocal("resolveDidDocument", {
            id: `0x${tempDid}`,
          });

          console.log(res2);

          const addrDidDoc = res2.decoded.out_messages[0].value.addrDidDocument;

          const didAcc = new Account(DidDocumentContract, {
            address: addrDidDoc,
            signer: signerNone(),
            client,
          });

          try {
            const {body} = await client.abi.encode_message_body({
              abi: {type: "Contract", value: DidDocumentContract.abi},
              signer: {type: "None"},
              is_internal: true,
              call_set: {
                function_name: "deleteDidDocument",
                input: {},
              },
            });

            const res = await acc.run("sendTransaction", {
              dest: addrDidDoc,
              value: 300000000,
              bounce: true,
              flags: 3,
              payload: body,
            });

            console.log(res);
          } catch (e) {
            console.log(e);
            setLoader(false);
            return;
          }

          setTimeout(async () => {
            console.log(1);

            const res3 = await acc2.runLocal("resolveDidDocument", {
              id: `0x${tempDid}`,
            });

            console.log(res3);

            try {
              const resDid = await didAcc.runLocal("getDid", {});

              setDidDoc(resDid.decoded.out_messages[0].value.value0);
              console.log(resDid.decoded.out_messages[0].value.value0);
            } catch (e) {
              backToLogin();
              setLoader(false);
              alert("Did doc delete");
            }

            setLoader(false);
          }, 20000);
        }
      });
    }
  }

  function backToLogin() {
    setDidDoc("");
    setDID("");
  }

  return (
    <Router>
      <div className={alertW.hidden ? "hide" : "modal-w modal-welcome"}>
        <button
          className="close"
          onClick={() => setAlertW({hidden: true, text: "", title: ""})}
        >
          <span />
          <span />
        </button>

        <div className="text">{alertW.title}</div>

        <span className="content">{alertW.text}</span>
      </div>

      {didDoc ? (
        <div
          className={
            alertW.hidden ? "modal-w modal-welcome modal-did-document" : "hide"
          }
        >
          <div className={loader ? "lds-dual-ring" : "hide"} />
          <div className="text">DID Document</div>

          <div className="attribute">
            <span>status:</span>
            {didDoc.status}
          </div>
          <div className="attribute">
            <span>PubKey:</span>
            {didDoc.PubKey}
          </div>
          <div className="attribute">
            <span>issuerAddres:</span>
            {didDoc.issuerAddr}
          </div>
          <div className="attribute">
            {Object.keys(JSON.parse(didDoc.didDocument)).map((item, i) => (
              <div>
                <span>{item}:</span>{" "}
                {JSON.stringify(JSON.parse(didDoc.didDocument)[item])}
              </div>
            ))}
          </div>

          <div className="menu-document">
            <span
              className={menuCurent == 0 ? "active" : ""}
              onClick={() => setMenuCurent(0)}
            >
              Change document
            </span>
            <span
              className={menuCurent == 1 ? "active" : ""}
              onClick={() => setMenuCurent(1)}
            >
              Change status
            </span>
            <span
              className={menuCurent == 2 ? "active" : ""}
              onClick={() => setMenuCurent(2)}
            >
              Change controller
            </span>
            <span
              className={menuCurent == 3 ? "active" : ""}
              onClick={() => setMenuCurent(3)}
            >
              Delete document
            </span>
          </div>
          <div className="content-document">
            <div className={menuCurent == 0 ? "menu-item new-did" : "hide"}>
              <div className="curent-attr">
                {Object.keys(JSON.parse(didDoc.didDocument)).map((item, i) => {
                  let temp;
                  return (
                    <div>
                      <span>{item}:</span>{" "}
                      <input
                        type="text"
                        onChange={(ev) => {
                          temp = ev.target.value;
                        }}
                        placeholder={JSON.stringify(
                          JSON.parse(didDoc.didDocument)[item],
                        )}
                      />
                      <button onClick={() => deleteAttribute(item)}>
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          saveAttribute(item, temp);
                        }}
                      >
                        Save
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="new-attr">
                <select
                  name=""
                  id=""
                  onChange={(ev) => {
                    setCurentAttr(ev.target.value);
                  }}
                >
                  {attributes.map((item, i) => (
                    <option>{item}</option>
                  ))}
                </select>
                <button onClick={addAttribute}>Add attribute</button>
              </div>
              <button onClick={updateDIDDocument}>Save Changes</button>
            </div>
            <div className={menuCurent == 1 ? "menu-item" : "hide"}>
              <div>
                <select
                  name=""
                  id=""
                  onChange={(ev) => {
                    setCurentStatus(ev.target.value);
                  }}
                >
                  <option>1</option>
                  <option>0</option>
                </select>
              </div>
              <button onClick={updateDidStatus}>Save Changes</button>
            </div>
            <div className={menuCurent == 2 ? "menu-item" : "hide"}>
              <div>
                <input
                  type="text"
                  placeholder="New Address"
                  onChange={(ev) => {
                    setCurentAddr(ev.target.value);
                  }}
                />
              </div>
              <button onClick={updateDidPub}>Save Changes</button>
            </div>
            <div className={menuCurent == 3 ? "menu-item" : "hide"}>
              <button onClick={deleteDid}>Delete Document</button>
            </div>
          </div>

          <div className="note">
            Note: Transactions can take 5 to 15 seconds
          </div>
          <button onClick={backToLogin}>Back</button>
        </div>
      ) : (
        <div className={alertW.hidden ? "modal-w modal-welcome" : "hide"}>
          <div className={loader ? "lds-dual-ring" : "hide"} />
          <div className="text">Welcome!</div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={createDID3}
          >
            I want to create DID
          </button>

          <div className="text">I already have a DID</div>
          <input
            type="text"
            placeholder="DID"
            onChange={(ev) => {
              setDID(ev.target.value.trim());
            }}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={resolveDID}
          >
            Log in with DID
          </button>
        </div>
      )}
    </Router>
  );
}

export default observer(WelcomeDidPage);
