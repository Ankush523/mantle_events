var ethers = require("ethers");
const address = "0x816fe884C2D2137C4F210E6a1d925583fa4A917d"
var url = "wss://ws.testnet.mantle.xyz";


var init = function () {
  var customWsProvider = new ethers.providers.WebSocketProvider('wss://polygon-mumbai.g.alchemy.com/v2/B_5czQpQeXc_6pZlC-wDa_-QD1xhTI86');
  customWsProvider.on("pending", (tx) => {
    customWsProvider.getTransaction(tx).then(function (transaction) {
      if(transaction.from == address || transaction.to == address)
      {
        console.log(transaction);
      }
    });
  });

  customWsProvider._websocket.on("error", async () => {
    console.log(`Unable to connect to ${ep.subdomain} retrying in 3s...`);
    setTimeout(init, 3000);
  });
  customWsProvider._websocket.on("close", async (code) => {
    console.log(
      `Connection lost with code ${code}! Attempting reconnect in 3s...`
    );
    customWsProvider._websocket.terminate();
    setTimeout(init, 3000);
  });
};

init();