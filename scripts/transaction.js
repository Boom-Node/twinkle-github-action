require("dotenv").config();
const { ethers } = require("ethers");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const TOKEN_ADDRESS = "0xdf7952b35f24acf7fc0487d01c8d5690a60dba07";
const RECIPIENTS = process.env.RECIPIENTS.split(","); // List of addresses
const AMOUNT = ethers.parseUnits("5", 18); // Amount per recipient (5 Twinkle)

const ABI = [
  "function transfer(address to, uint256 amount) public returns (bool)"
];

async function airdropTokens() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const token = new ethers.Contract(TOKEN_ADDRESS, ABI, wallet);

  for (const recipient of RECIPIENTS) {
    console.log(`Sending ${AMOUNT} Twinkle to ${recipient}...`);
    const tx = await token.transfer(recipient, AMOUNT);
    await tx.wait();
    console.log(`✅ Sent to ${recipient}: ${tx.hash}`);
  }
}

airdropTokens().catch(console.error);
