require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const WeatherInsurance = await ethers.getContractFactory("WeatherInsurance");
  const contract = await WeatherInsurance.deploy();
  await contract.deployed();

  console.log(`WeatherInsurance deployed at: ${contract.address}`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exit(1);
});
