require("dotenv").config();
const { ethers } = require("ethers");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const TOKEN_ADDRESS = "0xdf7952b35f24acf7fc0487d01c8d5690a60dba07";
const WBNB_ADDRESS = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
const ROUTER_ADDRESS = "0x10ED43C718714eb63d5aA57B78B54704E256024E"; // PancakeSwap V2

const ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)"
];

async function addLiquidity() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const router = new ethers.Contract(ROUTER_ADDRESS, ABI, wallet);
  const token = new ethers.Contract(TOKEN_ADDRESS, ABI, wallet);

  const amountTwinkle = ethers.parseUnits("100", 18); // 100 Twinkle
  const amountBNB = ethers.parseUnits("0.1", 18); // 0.1 BNB

  // Approve Router to spend Twinkle
  console.log("Approving Router...");
  const approveTx = await token.approve(ROUTER_ADDRESS, amountTwinkle);
  await approveTx.wait();

  // Add Liquidity
  console.log("Adding liquidity...");
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes
  const addLiquidityTx = await router.addLiquidityETH(
    TOKEN_ADDRESS, amountTwinkle, 0, 0, wallet.address, deadline,
    { value: amountBNB }
  );
  await addLiquidityTx.wait();

  console.log(`✅ Liquidity added! TX: ${addLiquidityTx.hash}`);
}

addLiquidity().catch(console.error);
