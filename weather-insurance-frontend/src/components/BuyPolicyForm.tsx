// src/components/BuyPolicyForm.tsx
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { contract } from '../utils/contract';

const BuyPolicyForm: React.FC = () => {
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBuyPolicy = async () => {
    if (!window.ethereum) {
      return alert('Please install MetaMask');
    }

    if (!location) {
      return alert('Please enter a location');
    }

    try {
      setLoading(true);
      setStatus('Connecting wallet...');

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();

      const policyContract = contract.connect(signer);

      const tx = await policyContract.buyPolicy(location, {
        value: ethers.utils.parseEther('0.01'),
      });

      setStatus('Transaction sent. Waiting for confirmation...');
      await tx.wait();

      setStatus('✅ Policy purchased successfully!');
      setLocation('');
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Buy Weather Insurance</h2>
      <input
        type="text"
        placeholder="Enter location (e.g., London)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button onClick={handleBuyPolicy} disabled={loading}>
        {loading ? 'Processing...' : 'Buy Policy'}
      </button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default BuyPolicyForm;
