const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Hardhat local blockchain
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Will contract ABI
const abi = [
    "function deposit() external payable",
    "function declareDeceased() public",
    "function inheritance() view returns (uint256)",
];

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, provider);

// GET - Inheritance amount
app.get("/inheritance", async (req, res) => {
    try {
        const amount = await contract.inheritance();
        res.json({ inheritance: ethers.formatEther(amount) + " ETH" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Deposit ETH
app.post("/deposit", async (req, res) => {
    try {
        const privateKey = req.body.privateKey;
        const wallet = new ethers.Wallet(privateKey, provider);
        const contractWithSigner = contract.connect(wallet);
        const tx = await contractWithSigner.deposit({ value: ethers.parseEther("0.5") });
        await tx.wait();
        res.json({ message: "Deposited 0.5 ETH!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Declare deceased
app.post("/declare", async (req, res) => {
    try {
        const privateKey = req.body.privateKey;
        const wallet = new ethers.Wallet(privateKey, provider);
        const contractWithSigner = contract.connect(wallet);
        const tx = await contractWithSigner.declareDeceased();
        await tx.wait();
        res.json({ message: "Deceased declared. Inheritance transferred." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log("✅ Backend running on http://localhost:5000"));
