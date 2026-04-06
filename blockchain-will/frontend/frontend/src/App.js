import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import "./App.css";

function App() {
  const [account, setAccount] = useState(null);
  const [inheritance, setInheritance] = useState("0");
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const abi = [
    "function deposit() external payable",
    "function declareDeceased() public",
    "function inheritance() view returns (uint256)",
  ];

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
    const contract = new ethers.Contract(contractAddress, abi, await provider.getSigner());
    const amount = await contract.inheritance();
    setInheritance(ethers.formatEther(amount));
  };

  const depositEth = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.deposit({ value: ethers.parseEther("0.5") });
    await tx.wait();
    alert("Deposited 0.5 ETH!");
  };

  const declareDeceased = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.declareDeceased();
    await tx.wait();
    alert("Inheritance transferred!");
  };

  const refreshInheritance = async () => {
    const res = await axios.get(`${backendUrl}/inheritance`);
    setInheritance(res.data.inheritance);
  };

  return (
    <div style={styles.container}>
      <h1>⚖️ Blockchain Will Executor</h1>
      {!account ? (
        <button onClick={connectWallet} style={styles.button}>Connect MetaMask</button>
      ) : (
        <>
          <p>Connected Account: {account}</p>
          <p>Inheritance: {inheritance}</p>
          <div style={styles.actions}>
            <button onClick={depositEth} style={styles.button}> Deposit 0.5 ETH</button>
            <button onClick={declareDeceased} style={styles.button}> Declare Deceased</button>
            <button onClick={refreshInheritance} style={styles.button}> Refresh</button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#121212",
    color: "white",
    minHeight: "100vh",
    textAlign: "center",
    padding: "3rem",
  },
  button: {
    backgroundColor: "#1e88e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    margin: "10px",
    cursor: "pointer",
    fontSize: "16px",
  },
  actions: {
    marginTop: "20px",
  },
};

export default App;
