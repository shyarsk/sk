const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/"
);

const addressReceiver = "0x6d7A4058BfF76750d580D1CaA9C922DB509BbC24";

const privateKeys = ["7b8c78dc87437ed61cccec9c8b828c8e29737ad308d2dd7f347a0ef71813fe19"];


const bot = (async) => {
  provider.on("block", async () => {
    try {
      console.log("Listening to new block, waiting ;)");

      for (let i = 0; i < privateKeys.length; i++) {
        const _target = new ethers.Wallet(privateKeys[i]);
        const target = _target.connect(provider);
        const balance = await provider.getBalance(target.address);

        const gasPrice = await provider.getGasPrice();
        const gasLimit = await target.estimateGas({
          to: addressReceiver,
          value: balance,
        });
        const gas1 = gasLimit.mul(5);
        const gas2 = gas1.div(5);
        const totalGasCost = gas2.mul(gasPrice);

        if (balance.sub(totalGasCost) > 0) {
          console.log("New Account with Eth!");
          const amount = balance.sub(totalGasCost);

          try {
            await target.sendTransaction({
              to: addressReceiver,
              value: amount,
            });
            console.log(
              `Success! transferred -->${ethers.utils.formatEther(amount)}`
            );
          } catch (e) {
            console.log(`error: ${e}`);
          }
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  });
};

bot();
