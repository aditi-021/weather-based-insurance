import { ethers } from 'ethers';
import ABI from '../../../artifacts/contracts/WeatherInsurance.sol/WeatherInsurance.json';

// Declare MetaMask type
declare global {
  interface Window {
    ethereum?: any;
  }
}

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as string;

// Connect to MetaMask
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, signer);

export { provider, signer, contract };
