module.exports = {
  DEXConnectorContract: {
    abi: {
      "ABI version": 2,
      version: "2.2",
      header: ["pubkey", "time", "expire"],
      functions: [
        {name: "constructor", inputs: [], outputs: []},
        {
          name: "deployEmptyWallet",
          inputs: [{name: "root", type: "address"}],
          outputs: [],
        },
        {
          name: "askWalletOwner",
          inputs: [{name: "walletAddr", type: "address"}],
          outputs: [],
        },
        {
          name: "setWalletAddress",
          inputs: [{name: "walletOwner", type: "address"}],
          outputs: [],
        },
        {
          name: "transfer",
          inputs: [
            {name: "to", type: "address"},
            {name: "tokens", type: "uint128"},
            {name: "payload", type: "cell"},
          ],
          outputs: [],
        },
        {
          name: "onAcceptTokensTransfer",
          inputs: [
            {name: "tokenRoot", type: "address"},
            {name: "amount", type: "uint128"},
            {name: "sender", type: "address"},
            {name: "senderWallet", type: "address"},
            {name: "remainingGasTo", type: "address"},
            {name: "payload", type: "cell"},
          ],
          outputs: [],
        },
        {
          name: "burn",
          inputs: [
            {name: "tokens", type: "uint128"},
            {name: "callback_address", type: "address"},
            {name: "callback_payload", type: "cell"},
          ],
          outputs: [],
        },
        {
          name: "getBalance",
          inputs: [],
          outputs: [{name: "balance", type: "uint128"}],
        },
        {
          name: "soUINT",
          inputs: [],
          outputs: [{name: "soUINT", type: "uint256"}],
        },
        {
          name: "dexclient",
          inputs: [],
          outputs: [{name: "dexclient", type: "address"}],
        },
        {
          name: "drivenRoot",
          inputs: [],
          outputs: [{name: "drivenRoot", type: "address"}],
        },
        {
          name: "checkWalletAddr",
          inputs: [],
          outputs: [{name: "checkWalletAddr", type: "address"}],
        },
        {
          name: "driven",
          inputs: [],
          outputs: [{name: "driven", type: "address"}],
        },
        {
          name: "statusConnected",
          inputs: [],
          outputs: [{name: "statusConnected", type: "bool"}],
        },
      ],
      data: [
        {key: 1, name: "soUINT", type: "uint256"},
        {key: 2, name: "dexclient", type: "address"},
      ],
      events: [],
      fields: [
        {name: "_pubkey", type: "uint256"},
        {name: "_timestamp", type: "uint64"},
        {name: "_constructorFlag", type: "bool"},
        {name: "soUINT", type: "uint256"},
        {name: "dexclient", type: "address"},
        {name: "drivenRoot", type: "address"},
        {name: "checkWalletAddr", type: "address"},
        {name: "driven", type: "address"},
        {name: "statusConnected", type: "bool"},
      ],
    },
    tvc: "te6ccgECLAEABt8AAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgBCSK7VMg4wMgwP/jAiDA/uMC8gspBQQrA77tRNDXScMB+GaJ+Gkh2zzTAAGOGoECANcYIPkBAdMAAZTT/wMBkwL4QuL5EPKoldMAAfJ64tM/AfhDIbnytCD4I4ED6KiCCBt3QKC58rT4Y9MfAfgjvPK50x8B2zzyPBQRBgNS7UTQ10nDAfhmItDTA/pAMPhpqTgA3CHHAOMCIdcNH/K8IeMDAds88jwoKAYEUCCCEC6I4sS74wIgghBb0RUbu+MCIIIQbSqOI7vjAiCCEHexXk674wIcFgwHAiggghBw2J/JuuMCIIIQd7FeTrrjAgoIAzYw+Eby4Ez4Qm7jACGT1NHQ3vpA0ds8MNs88gAnCSQBiPhJ+E3HBQH4KMcFsPLgZvgnbxBopv5gobV/cvsCf/hv+E34bon4bfhOyM+QsZdkPs7J+EvIz4WIznHPC27MyYEAgPsAFANaMPhG8uBM+EJu4wAhk9TR0N76QNN/1NHQ+kDU0dD6QNTR0PpA1NHbPDDbPPIAJwskALz4SfhOxwXy4G/4J28QaKb+YKG1f3L7AnBVIQJwVRUB+En4S3/Iz4WAygDPhEDOcc8LblWAyM+RZQR+5s5VcMjOy3/L/1VAyM5VMMjOVSDIzst/zM3Nzc3NyYEAgPsABFAgghBfM89JuuMCIIIQaLVfP7rjAiCCEGqHjTO64wIgghBtKo4juuMCFRAPDQM8MPhG8uBM+EJu4wAhk9TR0N7Tf/pA1NHbPDDbPPIAJw4kAHz4SfhLxwXy4GX4J28QaKb+YKG1f3L7AgH4S1UCyM+RWJUitst/zlnIzszNyfhOyM+FiM5xzwtuzMmBAID7AAFOMNHbPPhLIY4bjQRwAAAAAAAAAAAAAAAAOqHjTODIzs7JcPsA3vIAJwI6MPhCbuMA+Ebyc9H4SfhLxwXy4GX4AHD4b9s88gARJAIW7UTQ10nCAY6A4w0SJwJ0cO1E0PQFcSGAQPQOk9cL/5Fw4nIigED0Do6A34lfIHD4b/hu+G34bPhr+GqAQPQO8r3XC//4YnD4YxMUAQKJFABDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAFQMNHbPPhPIY4cjQRwAAAAAAAAAAAAAAAAN8zz0mDIzsoAyXD7AN7yACcEUCCCEDM2pVK64wIgghBOvv9RuuMCIIIQVzuC+7rjAiCCEFvRFRu64wIbGRgXAU4w0ds8+EwhjhuNBHAAAAAAAAAAAAAAAAA29EVG4MjOzslw+wDe8gAnAU4w0ds8+E4hjhuNBHAAAAAAAAAAAAAAAAA1zuC+4MjOzslw+wDe8gAnAzww+Eby4Ez4Qm7jACGT1NHQ3vpA03/U0ds8MNs88gAnGiQAgvhJ+EvHBfLgZfgnbxBopv5gobV/cvsCf/hLVRLIz5Eap1+yy3/OVSDIzsoAzM3J+E7Iz4WIznHPC27MyYEAgPsAAVAw0ds8+EohjhyNBHAAAAAAAAAAAAAAAAAszalUoMjOy//JcPsA3vIAJwRQIIIQClc5C7rjAiCCEBc3YB264wIgghAmJ2hxuuMCIIIQLojixLrjAiYjIB0DNjD4RvLgTPhCbuMAIZPU0dDe+kDR2zww2zzyACceJAH8+En4S8cF8uBlaKb+YIIQstBeALV/vvLgZ/gnbxBopv5gobV/cvsC+E+OQyD4bIIQLLQXgPgoIn/Iz4WAygDPhEDOgoAiy0F4AAAAAAAAAAAAAAAAAAHPC45Zi4Me3Uxxc3YB2MjOzst/zclw+wDf+EvIz4WIzoBvz0DJgQCAHwAG+wAwAl4w+Eby4EzR2zwhjhwj0NMB+kAwMcjPhyDOghCmJ2hxzwuBy3/JcPsAkTDi4wDyACIhACjtRNDT/9M/MfhDWMjL/8s/zsntVAAe+En4S8cF8uBl+AD4J28QAzYw+Eby4Ez4Qm7jACGT1NHQ3vpA0ds8MNs88gAnJSQAYvhP+E74TfhM+Ev4SvhD+ELIy//LP8+Dy/9VQMjOVTDIzlUgyM5ZyM7KAM3Nzc3J7VQAdPhJ+EzHBfLgZSD4bX/Iz4WAygDPhEDOgsAiy0F4AAAAAAAAAAAAAAAAAAAfATKRd7FeTs8Lzslw+wABTjDR2zz4TSGOG40EcAAAAAAAAAAAAAAAACKVzkLgyM7OyXD7AN7yACcAZu1E0NP/0z/TADHT/9TR0PpA1NHQ+kDU0dD6QNTR0PpA0gDR+G/4bvht+Gz4a/hq+GP4YgAK+Eby4EwCCvSkIPShKyoAFHNvbCAwLjU4LjEAAA==",
    code: "te6ccgECKQEABrIABCSK7VMg4wMgwP/jAiDA/uMC8gsmAgEoA77tRNDXScMB+GaJ+Gkh2zzTAAGOGoECANcYIPkBAdMAAZTT/wMBkwL4QuL5EPKoldMAAfJ64tM/AfhDIbnytCD4I4ED6KiCCBt3QKC58rT4Y9MfAfgjvPK50x8B2zzyPBEOAwNS7UTQ10nDAfhmItDTA/pAMPhpqTgA3CHHAOMCIdcNH/K8IeMDAds88jwlJQMEUCCCEC6I4sS74wIgghBb0RUbu+MCIIIQbSqOI7vjAiCCEHexXk674wIZEwkEAiggghBw2J/JuuMCIIIQd7FeTrrjAgcFAzYw+Eby4Ez4Qm7jACGT1NHQ3vpA0ds8MNs88gAkBiEBiPhJ+E3HBQH4KMcFsPLgZvgnbxBopv5gobV/cvsCf/hv+E34bon4bfhOyM+QsZdkPs7J+EvIz4WIznHPC27MyYEAgPsAEQNaMPhG8uBM+EJu4wAhk9TR0N76QNN/1NHQ+kDU0dD6QNTR0PpA1NHbPDDbPPIAJAghALz4SfhOxwXy4G/4J28QaKb+YKG1f3L7AnBVIQJwVRUB+En4S3/Iz4WAygDPhEDOcc8LblWAyM+RZQR+5s5VcMjOy3/L/1VAyM5VMMjOVSDIzst/zM3Nzc3NyYEAgPsABFAgghBfM89JuuMCIIIQaLVfP7rjAiCCEGqHjTO64wIgghBtKo4juuMCEg0MCgM8MPhG8uBM+EJu4wAhk9TR0N7Tf/pA1NHbPDDbPPIAJAshAHz4SfhLxwXy4GX4J28QaKb+YKG1f3L7AgH4S1UCyM+RWJUitst/zlnIzszNyfhOyM+FiM5xzwtuzMmBAID7AAFOMNHbPPhLIY4bjQRwAAAAAAAAAAAAAAAAOqHjTODIzs7JcPsA3vIAJAI6MPhCbuMA+Ebyc9H4SfhLxwXy4GX4AHD4b9s88gAOIQIW7UTQ10nCAY6A4w0PJAJ0cO1E0PQFcSGAQPQOk9cL/5Fw4nIigED0Do6A34lfIHD4b/hu+G34bPhr+GqAQPQO8r3XC//4YnD4YxARAQKJEQBDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAFQMNHbPPhPIY4cjQRwAAAAAAAAAAAAAAAAN8zz0mDIzsoAyXD7AN7yACQEUCCCEDM2pVK64wIgghBOvv9RuuMCIIIQVzuC+7rjAiCCEFvRFRu64wIYFhUUAU4w0ds8+EwhjhuNBHAAAAAAAAAAAAAAAAA29EVG4MjOzslw+wDe8gAkAU4w0ds8+E4hjhuNBHAAAAAAAAAAAAAAAAA1zuC+4MjOzslw+wDe8gAkAzww+Eby4Ez4Qm7jACGT1NHQ3vpA03/U0ds8MNs88gAkFyEAgvhJ+EvHBfLgZfgnbxBopv5gobV/cvsCf/hLVRLIz5Eap1+yy3/OVSDIzsoAzM3J+E7Iz4WIznHPC27MyYEAgPsAAVAw0ds8+EohjhyNBHAAAAAAAAAAAAAAAAAszalUoMjOy//JcPsA3vIAJARQIIIQClc5C7rjAiCCEBc3YB264wIgghAmJ2hxuuMCIIIQLojixLrjAiMgHRoDNjD4RvLgTPhCbuMAIZPU0dDe+kDR2zww2zzyACQbIQH8+En4S8cF8uBlaKb+YIIQstBeALV/vvLgZ/gnbxBopv5gobV/cvsC+E+OQyD4bIIQLLQXgPgoIn/Iz4WAygDPhEDOgoAiy0F4AAAAAAAAAAAAAAAAAAHPC45Zi4Me3Uxxc3YB2MjOzst/zclw+wDf+EvIz4WIzoBvz0DJgQCAHAAG+wAwAl4w+Eby4EzR2zwhjhwj0NMB+kAwMcjPhyDOghCmJ2hxzwuBy3/JcPsAkTDi4wDyAB8eACjtRNDT/9M/MfhDWMjL/8s/zsntVAAe+En4S8cF8uBl+AD4J28QAzYw+Eby4Ez4Qm7jACGT1NHQ3vpA0ds8MNs88gAkIiEAYvhP+E74TfhM+Ev4SvhD+ELIy//LP8+Dy/9VQMjOVTDIzlUgyM5ZyM7KAM3Nzc3J7VQAdPhJ+EzHBfLgZSD4bX/Iz4WAygDPhEDOgsAiy0F4AAAAAAAAAAAAAAAAAAAfATKRd7FeTs8Lzslw+wABTjDR2zz4TSGOG40EcAAAAAAAAAAAAAAAACKVzkLgyM7OyXD7AN7yACQAZu1E0NP/0z/TADHT/9TR0PpA1NHQ+kDU0dD6QNTR0PpA0gDR+G/4bvht+Gz4a/hq+GP4YgAK+Eby4EwCCvSkIPShKCcAFHNvbCAwLjU4LjEAAA==",
  },
};
