import { Api, JsonRpc } from "eosjs";
import ScatterJS from "scatterjs-core";
import ScatterEOS from "scatterjs-plugin-eosjs2";
import ScatterLynx from "scatterjs-plugin-lynx";

const currentNetwork = {
  blockchain: "eos",
  protocol: "https",
  host: "peer.main.alohaeos.com",
  port: 9876
};

class EOSIOClient {
  constructor(dappName) {
    const { protocol, host, port } = currentNetwork;
    this.dappName = dappName;
    this.rpc = new JsonRpc(`${protocol}://${host}:${port}`);
    window.ScatterJS = null;
  }

  connect = async () => {
    ScatterJS.plugins(new ScatterEOS(), new ScatterLynx());
    const connectionOptions = { initTimeout: 10000 };

    try {
      // eslint-disable-next-line consistent-return
      await ScatterJS.scatter
        .connect(this.dappName, connectionOptions)
        .then(connected => {
          // User does not have Scatter Desktop, Mobile or Classic installed.
          if (!connected)
            throw "We couldn't connect to Scatter.";

          const { scatter } = ScatterJS;
          this.scatter = scatter;
        });

      const requiredFields = {
        accounts: [currentNetwork]
      };

      await this.scatter.getIdentity(requiredFields).then(() => {
        this.account = this.scatter.identity.accounts.find(
          x => x.blockchain === "eos"
        );

        this.eos = this.scatter.eos(currentNetwork, Api, {
          rpc: this.rpc,
          beta3: true
        });
        console.log(this.account);
      });
    } catch (error) {
      console.log(this.error);
      throw error;
    }
  };
}

export default EOSIOClient;
