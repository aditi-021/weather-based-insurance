// src/App.tsx
import BuyPolicyForm from './components/BuyPolicyForm';
import ClaimPolicyButton from './components/ClaimPolicyButton';

function App() {
  return (
    <div className="app-container">
      <h1>🌦️ Weather Insurance DApp</h1>
      <BuyPolicyForm />
      <ClaimPolicyButton policyId={0} location={''} />
    </div>
  );
}

export default App;
