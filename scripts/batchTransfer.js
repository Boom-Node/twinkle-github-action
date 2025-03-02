require("dotenv").config();
const { ethers } = require("ethers");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const TOKEN_ADDRESS = "0xdf7952b35f24acf7fc0487d01c8d5690a60dba07";
const RECIPIENTS = process.env.RECIPIENTS.split(",");
const AMOUNTS = process.env.AMOUNTS.split(",").map(a => ethers.parseUnits(a, 18));

const ABI = [
  "function transfer(address to, uint256 amount) public returns (bool)"
];

async function batchTransfer() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const token = new ethers.Contract(TOKEN_ADDRESS, ABI, wallet);

  console.log("Executing batch transfer...");

  const txs = RECIPIENTS.map((recipient, index) => token.transfer(recipient, AMOUNTS[index]));
  await Promise.all(txs.map(tx => tx.wait()));

  console.log("✅ Batch transfer successful!");
}

batchTransfer().catch(console.error);
