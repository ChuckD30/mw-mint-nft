import { useState } from "react";
import { MirrorWorld, ClusterEnvironment } from "@mirrorworld/web3.js";

import "./App.css";
import { useEffect } from "react";

function App() {
  const [refresh, setRefreshTok] = useState(
    localStorage.getItem(`app-refresh-token`)
  );

  let [mirrorworld, setMirrorWorld] = useState(
    new MirrorWorld({
      apiKey: import.meta.env.VITE_MW_API_KEY,
      env: ClusterEnvironment.testnet,
      autoLoginCredentials: refresh ?? undefined,
    })
  );

  const [user, setUser] = useState();

  async function login() {
    const { user, refreshToken } = await mirrorworld.login();
    localStorage.setItem(`app-refresh-token`, refreshToken);
    setRefreshTok(refreshToken);
    setUser(user);
  }

  async function nft() {
    const res = await mirrorworld.mintNFT({
      name: `Vida`,
      symbol: `MWM`,
      metadataUri: "https://my-collection-metadata-uri/metadata.json",
      collection: import.meta.env.VITE_MW_COLLECTION,
    });
    console.log(res);
  }

  useEffect(() => {
    if (refresh) {
      // console.log(refresh);
      setMirrorWorld(
        new MirrorWorld({
          apiKey: import.meta.env.VITE_MW_API_KEY,
          env: ClusterEnvironment.testnet,
          autoLoginCredentials: refresh,
        })
      );
    }
  }, [refresh]);

  return (
    <div className="App">
      {!user ? (
        <button onClick={login}>Login to Mirror World</button>
      ) : (
        <div>
          <button onClick={nft}>Mint NFT</button>
        </div>
      )}
      {user ? (
        <div className="user-info">
          <p>{user.username} successfully logged in</p>
        </div>
      ) : (
        <p>No User available</p>
      )}
    </div>
  );
}

export default App;
