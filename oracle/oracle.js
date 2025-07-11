require("dotenv").config();
const axios = require("axios");
const { ethers } = require("ethers");
const abi = require("../artifacts/contracts/WeatherInsurance.sol/WeatherInsurance.json").abi;

// Load env variables
const {
  RPC_URL,
  PRIVATE_KEY,
  CONTRACT_ADDRESS,
  OPENWEATHER_API_KEY,
} = process.env;

// Setup provider and signer
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

// Weather check & contract trigger
async function checkWeatherAndFulfill(policyId, location) {
  try {
    console.log(`📡 Checking weather for: ${location}`);

    const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        q: location,
        appid: OPENWEATHER_API_KEY,
        units: "metric",
      },
    });

    const rain = response.data.rain?.["1h"] || 0;
    const didRain = rain > 0;

    console.log(`🌧️ Did it rain? ${didRain ? "Yes" : "No"}`);

    // Call the contract's fulfillPolicy function
    const tx = await contract.fulfillPolicy(policyId, didRain);
    console.log(`📤 Sent tx: ${tx.hash}`);
    const receipt = await tx.wait();

    console.log(`✅ Fulfilled in block: ${receipt.blockNumber}`);
  } catch (err) {
    console.error("❌ Oracle error:", err.message);
  }
}

// Example call
checkWeatherAndFulfill(0, "London");
