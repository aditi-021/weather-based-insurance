require("dotenv").config();
const { ethers } = require("ethers");
const axios = require("axios");
const abi = require("../artifacts/contracts/WeatherInsurance.sol/WeatherInsurance.json").abi;

const {
  PRIVATE_KEY,
  RPC_URL,
  CONTRACT_ADDRESS,
  OPENWEATHER_API_KEY,
} = process.env;

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

const location = "London";
const premium = ethers.utils.parseEther("0.01");
const waitSeconds = 15; // how long to wait after buying

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getWeather(location) {
  const res = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
    params: {
      q: location,
      appid: OPENWEATHER_API_KEY,
      units: "metric",
    },
  });

  const rain = res.data.rain?.["1h"] || 0;
  return rain > 0;
}

async function main() {
  console.log("🛒 Buying a new policy...");
  const now = Math.floor(Date.now() / 1000);
  const tx = await contract.buyPolicy(location, { value: premium });
  await tx.wait();

  const policyId = (await contract.nextPolicyId()).toNumber() - 1;
  console.log(`✅ Policy ${policyId} bought for location "${location}".`);

  console.log(`⏳ Waiting ${waitSeconds}s for unlock...`);
  await wait(waitSeconds * 1000);

  console.log("📡 Checking weather...");
  const didRain = await getWeather(location);
  console.log(`🌧️ Did it rain? ${didRain ? "Yes" : "No"}`);

  console.log("📤 Fulfilling policy...");
  const tx2 = await contract.fulfillPolicy(policyId, didRain);
  await tx2.wait();

  console.log("✅ Policy fulfilled.");
}

main().catch((err) => {
  console.error("❌ Test error:", err.message);
  process.exit(1);
});
