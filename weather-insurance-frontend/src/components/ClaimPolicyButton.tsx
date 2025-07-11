// src/components/ClaimPolicyButton.tsx
import React, { useState } from 'react';
import { contract } from '../utils/contract';

interface Props {
  policyId: number;
  location: string;
}

const ClaimPolicyButton: React.FC<Props> = ({ policyId, location }) => {
  const [status, setStatus] = useState<string>('');

  const handleClaim = async () => {
    try {
      setStatus('Checking weather...');
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );

      const data = await response.json();
      const rainAmount = data?.rain?.['1h'] || 0;
      const didRain = rainAmount > 0;

      setStatus(`Weather: ${didRain ? 'Rain detected' : 'No rain'}. Sending transaction...`);

      const tx = await contract.fulfillPolicy(policyId, didRain);
      await tx.wait();

      setStatus('✅ Payout transaction confirmed!');
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div>
      <button onClick={handleClaim} className="bg-purple-600 text-white p-2 rounded">
        Claim Policy
      </button>
      <p>{status}</p>
    </div>
  );
};
export default ClaimPolicyButton;