require("dotenv").config();
const { ethers } = require("ethers");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const RECIPIENT = process.env.RECIPIENT;
const TOKEN_ADDRESS = "0xdf7952b35f24acf7fc0487d01c8d5690a60dba07";
const ABI = [
  "function transfer(address to, uint256 amount) public returns (bool)"
];

async function sendTokens() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const token = new ethers.Contract(TOKEN_ADDRESS, ABI, wallet);

  const amount = ethers.parseUnits("10", 18); // Sending 10 Twinkle tokens

  console.log(`Sending ${amount} Twinkle to ${RECIPIENT}...`);
  const tx = await token.transfer(RECIPIENT, amount);
  await tx.wait();

  console.log(`Transaction successful: ${tx.hash}`);
}

sendTokens().catch(console.error);
