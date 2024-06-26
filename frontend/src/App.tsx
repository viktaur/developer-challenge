import { FormEvent, useEffect, useState } from "react";
import "./App.css";
import Provider from "./Provider";
import { DiscoverWalletProviders } from "./components/DiscoverWalletProviders"

function App() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [desiredValue, setDesiredValue] = useState("test");
  const [value, setValue] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [balances, setBalances] = useState({});

  // async function setContractValue() {
  //   setLoading(true);
  //   setErrorMsg(null);
  //   try {
  //     const res = await fetch(`/api/value`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         x: desiredValue,
  //       }),
  //     });
  //     const { error } = await res.json();
  //     if (!res.ok) {
  //       setErrorMsg(error);
  //     }
  //   } catch (err: any) {
  //     setErrorMsg(err.stack);
  //   }
  //   setLoading(false);
  // }

  // async function getContractValue() {
  //   setLoading(true);
  //   setErrorMsg(null);
  //   try {
  //     const res = await fetch(`/api/value`);
  //     const { x, error } = await res.json();
  //     if (!res.ok) {
  //       setErrorMsg(error);
  //     } else {
  //       setValue(x);
  //     }
  //   } catch (err: any) {
  //     setErrorMsg(err.stack);
  //   }
  //   setLoading(false);
  // }

  // async function mintToken() {
  //   setLoading(true);
  //   setErrorMsg(null);
  //   const randomTokenId = Math.floor(Math.random() * 1000);
  //   try {
  //     const res = await fetch(`/api/mintToken`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         tokenId: randomTokenId,
  //       }),
  //     });
  //     const { tokenId, error } = await res.json();
  //     if (!res.ok) {
  //       setErrorMsg(error);
  //     } else {
  //       setTokenId(tokenId);
  //     }
  //   } catch (err: any) {
  //     setErrorMsg(err.stack);
  //   }
  //   setLoading(false);
  // }

  async function mintTokens(address: string, amount: number) {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/mint', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          amount
        })
      })
    } catch (e: any) {
      setErrorMsg(e.stack);
    }
    setLoading(false);
  }

  async function fetchBalanceOf(address: string) {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/balanceOf/' + address, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      setBalances(prevBalances => ({ ...prevBalances, [address]: data.balance}))
    } catch (e: any) {
      setErrorMsg(e.stack);
    }
    setLoading(false);
  }

  function handleChange(event: FormEvent<HTMLInputElement>) {
    setDesiredValue(event.currentTarget.value);
  }

  const providers = [
    {
      name: "Benson Woods",
      address: "0x8a25d77dffeecb93ab1ef1d9cf1c2a637ac6c0b1",
      description: "Benson Woods is a serene, picturesque woodland area known for its lush greenery, diverse wildlife, and tranquil walking trails. Perfect for nature enthusiasts, it offers a peaceful escape for hiking, birdwatching, and picnicking amidst the beauty of mature trees and seasonal wildflowers.",
      imageCid: "QmSmuHyJ2VkfmhTmua9AuWkqPY2KGa7hyUEJwgsapvtiea",
      price: 0.2
    },
    {
      name: "Blatherwycke Estate",
      address: "0xed81284e0e48e922230062b8b827c71562c10245",
      description: "Blatherwycke Estate is a historic property renowned for its elegant architecture, expansive gardens, and rich cultural heritage. The estate features a stately mansion, beautifully landscaped grounds, and scenic walking paths, making it a popular destination for history buffs, garden enthusiasts, and those seeking a picturesque setting for leisurely strolls and special events.",
      imageCid: "QmeVCbXDdR35c3fR8UoZ1R3LLkuPPqXEUfwhm766WGnWKK",
      price: 0.23
    },
    {
      name: "Forest of Marston Vale",
      address: "0x409122347a731e5c909b970ced8432c32ce22d5e",
      description: "The Forest of Marston Vale is a vibrant environmental regeneration project transforming 61 square miles of Bedfordshire countryside. It features extensive woodlands, diverse wildlife habitats, and a network of trails for walking, cycling, and horseback riding. This community-driven initiative aims to enhance biodiversity, promote sustainable land use, and provide a green space for recreation and education, creating a lasting legacy for future generations.",
      imageCid: "QmeR28294waHLpFtqc1shN6GKvotGrYRFV4J7n9Rbg8baW",
      price: 0.25
    }
  ]

  useEffect(() => {
    providers.forEach(p => {
      fetchBalanceOf(p.address);
      console.log(`Current balances are ${balances}`)
      console.log(`Balance of ${p.address} is ${balances[p.address]}`);
    });
  }, []);

  return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img
  //         src={"/kaleido_logo.svg"}
  //         className="App-logo"
  //         alt="logo"
  //         aria-busy={loading}
  //       />
  //       <p>
  //         <input className="App-input" onChange={handleChange} />
  //         <button
  //           type="button"
  //           className="App-button"
  //           onClick={setContractValue}
  //         >
  //           Set Value
  //         </button>
  //       </p>
  //       <p>
  //         <button
  //           type="button"
  //           className="App-button"
  //           onClick={getContractValue}
  //         >
  //           Get Value
  //         </button>
  //         {value !== "" ? <p>Retrieved value: {value}</p> : <p>&nbsp;</p>}
  //       </p>
  //       <p>
  //         <button type="button" className="App-button" onClick={mintToken}>
  //           Mint a Token
  //         </button>
  //         {tokenId !== "" ? <p>Minted Token ID: {tokenId}</p> : <p>&nbsp;</p>}
  //       </p>
  //       {errorMsg && <pre className="App-error">Error: {errorMsg}</pre>}
  //     </header>
  //   </div>
  // );
  <div className="App">
    <div className="listing">
      <DiscoverWalletProviders/>
      <h1>Buy carbon offset</h1>
      {providers.map(e => (
        <Provider key={e.address} {...e} availability={balances[e.address]} />
      ))}
    </div>
  </div>
  )
}

export default App;
