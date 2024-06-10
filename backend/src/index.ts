import FireFly from "@hyperledger/firefly-sdk";
import bodyparser from "body-parser";
import express from "express";
import simplestorage from "../../solidity/artifacts/contracts/simple_storage.sol/SimpleStorage.json";
import token from "../../solidity/artifacts/contracts/token.sol/Token.json";
import wcu from "../../solidity/artifacts/contracts/WCU_token.sol/WCUToken.json"

const PORT = 4001;
// const HOST = "http://localhost:5000";
const HOST = "localhost"
const NAMESPACE = "default";
const SIMPLE_STORAGE_ADDRESS = "0xE0D3AFABE1A9e78dbB47891d042ba02fD32Af55B";
const TOKEN_ADDRESS = "0xf65EE03499d6592Cd1e0e750Bec23C94CDF04957";
const WCU_ADDRESS = ""; // TODO
const app = express();
const firefly = new FireFly({
  host: HOST,
  namespace: NAMESPACE,
});

const ffiAndApiVersion = 2;
const ssFfiName: string = `simpleStorageFFI-${ffiAndApiVersion}`;
const ssApiName: string = `simpleStorageApi-${ffiAndApiVersion}`;
const tokenFfiName: string = `tokenFFI-${ffiAndApiVersion}`;
const tokenApiName: string = `tokenApi-${ffiAndApiVersion}`;
const wcuFfiName: string = `wcuFFI-${ffiAndApiVersion}`;
const wcuApiName: string = `wcuAPI-${ffiAndApiVersion}`;

app.use(bodyparser.json());

app.get("/api/value", async (req, res) => {
  res.send(await firefly.queryContractAPI(ssApiName, "get", {}));
});

app.post("/api/value", async (req, res) => {
  try {
    const fireflyRes = await firefly.invokeContractAPI(ssApiName, "set", {
      input: {
        x: req.body.x,
      },
    });
    res.status(202).send({
      id: fireflyRes.id,
    });
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (e: any) {
    res.status(500).send({
      error: e.message,
    });
  }
});

app.post("/api/mintToken", async (req, res) => {
  try {
    const fireflyRes = await firefly.invokeContractAPI(
      tokenApiName,
      "safeMint",
      {
        input: {
          tokenId: Number(req.body.tokenId),
        },
      }
    );
    res.status(202).send({
      tokenId: fireflyRes.input.input.tokenId,
    });
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (e: any) {
    res.status(500).send({
      error: e.message,
    });
  }
});

async function init() {
  // Simple storage
  await firefly
    .generateContractInterface({
      name: ssFfiName,
      namespace: NAMESPACE,
      version: "1.0",
      description: "Deployed simple-storage contract",
      input: {
        abi: simplestorage.abi,
      },
    })
    .then(async (ssGeneratedFFI) => {
      if (!ssGeneratedFFI) return;
      return await firefly.createContractInterface(ssGeneratedFFI, {
        confirm: true,
      });
    })
    .then(async (ssContractInterface) => {
      if (!ssContractInterface) return;
      return await firefly.createContractAPI(
        {
          interface: {
            id: ssContractInterface.id,
          },
          location: {
            address: SIMPLE_STORAGE_ADDRESS,
          },
          name: ssApiName,
        },
        { confirm: true }
      );
    })
    .catch((e) => {
      const err = JSON.parse(JSON.stringify(e.originalError));

      if (err.status === 409) {
        console.log("'simpleStorageFFI' already exists in FireFly. Ignoring.");
      } else {
        return;
      }
    });

  // Token
  await firefly
    .generateContractInterface({
      name: tokenFfiName,
      namespace: NAMESPACE,
      version: "1.0",
      description: "Deployed token contract",
      input: {
        abi: token.abi,
      },
    })
    .then(async (tokenGeneratedFFI) => {
      if (!tokenGeneratedFFI) return;
      return await firefly.createContractInterface(tokenGeneratedFFI, {
        confirm: true,
      });
    })
    .then(async (tokenContractInterface) => {
      if (!tokenContractInterface) return;
      return await firefly.createContractAPI(
        {
          interface: {
            id: tokenContractInterface.id,
          },
          location: {
            address: TOKEN_ADDRESS,
          },
          name: tokenApiName,
        },
        { confirm: true }
      );
    })
    .catch((e) => {
      const err = JSON.parse(JSON.stringify(e.originalError));

      if (err.status === 409) {
        console.log("'tokenFFI' already exists in FireFly. Ignoring.");
      } else {
        return;
      }
    });
  
  // WCU
    await firefly
      .generateContractInterface({
        name: wcuFfiName,
        namespace: NAMESPACE,
        version: "1.0",
        description: "Deployed WCU contract",
        input: {
          abi: wcu.abi,
        },
      })
      .then(async (wcuGeneratedFFI) => {
        if (!wcuGeneratedFFI) return;
        return await firefly.createContractInterface(wcuGeneratedFFI, {
          confirm: true,
        });
      })
      .then(async (wcuContractInterface) => {
        if (!wcuContractInterface) return;
        return await firefly.createContractAPI(
          {
            interface: {
              id: wcuContractInterface.id,
            },
            location: {
              address: WCU_ADDRESS,
            },
            name: wcuApiName,
          },
          { confirm: true }
        );
      })
      .catch((e) => {
        const err = JSON.parse(JSON.stringify(e.originalError));

        if (err.status === 409) {
          console.log("'wcuFFI' already exists in FireFly. Ignoring.")
        } else {
          return;
        }
      })

  // Listeners
  // Simple storage listener
  await firefly
    .createContractAPIListener(ssApiName, "Changed", {
      topic: "changed",
    })
    .catch((e) => {
      const err = JSON.parse(JSON.stringify(e.originalError));

      if (err.status === 409) {
        console.log(
          "Simple storage 'changed' event listener already exists in FireFly. Ignoring."
        );
      } else {
        console.log(
          `Error creating listener for simple_storage "changed" event: ${err.message}`
        );
      }
    });

  // Token listener
  await firefly
    .createContractAPIListener(tokenApiName, "Transfer", {
      topic: "transfer",
    })
    .catch((e) => {
      const err = JSON.parse(JSON.stringify(e.originalError));

      if (err.status === 409) {
        console.log(
          "Token 'transfer' event listener already exists in FireFly. Ignoring."
        );
      } else {
        console.log(
          `Error creating listener for token "transfer" event: ${err.message}`
        );
      }
    });

  // WCU Token listener
  await firefly
    .createContractAPIListener(wcuApiName, "Transfer", {
      topic: "transfer",
    })
    .catch((e) => {
      const err = JSON.parse(JSON.stringify(e.originalError));

      if (err.status = 409) {
        console.log(
          "WCU token 'transfer' event listener already exists in FireFly. Ignoring."
        );
      } else {
        console.log(
          `Error creating listener for WCU token "transfer" event: ${err.message}`
        );
      }
    });
  
  await firefly
    .createContractAPIListener(wcuApiName, "Mint", {
      topic: "mint",
    })
    .catch((e) => {
      const err = JSON.parse(JSON.stringify(e.originalError));

      if (err.status = 409) {
        console.log(
          "WCU token 'mint' event listener already exists in FireFly. Ignoring."
        );
      } else {
        console.log(
          `Error creating listener for WCU token "mint" event: ${err.message}`
        );
      }
    })

  firefly.listen(
    {
      filter: {
        events: "blockchain_event_received",
      },
    },
    async (socket, event) => {
      console.log(
        `${event.blockchainEvent?.info.signature}: ${JSON.stringify(
          event.blockchainEvent?.output,
          null,
          2
        )}`
      );
    }
  );

  // Start listening
  app.listen(PORT, () =>
    console.log(`Kaleido DApp backend listening on port ${PORT}!`)
  );
}

init().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});

module.exports = {
  app,
};
