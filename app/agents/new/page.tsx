'use client';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function AgentCreator() {
  const { publicKey, connected } = useWallet();
  const [prompt, setPrompt] = useState('');
  const [risk, setRisk] = useState('balanced');
  const [loading, setLoading] = useState(false);

  const createAgent = async () => {
    if (!connected) return alert('Connect wallet first');
    setLoading(true);
    const res = await fetch('/api/agents/create', {
      method: 'POST',
      body: JSON.stringify({ prompt, riskProfile: risk, owner: publicKey?.toString() }),
    });
    const data = await res.json();
    alert(`Agent ${data.agentId} deployed!`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold mb-8">Create AutoVault Agent</h1>
        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Maximize USDC yield..." className="w-full h-48 p-6 bg-zinc-900 border border-zinc-700 rounded-3xl" />
        <select value={risk} onChange={e => setRisk(e.target.value)} className="mt-6 w-full p-6 bg-zinc-900 border border-zinc-700 rounded-3xl">
          <option value="conservative">Conservative</option>
          <option value="balanced">Balanced</option>
          <option value="aggressive">Aggressive</option>
        </select>
        <button onClick={createAgent} disabled={loading} className="mt-10 w-full py-6 bg-purple-600 rounded-3xl text-xl font-bold">Deploy Agent</button>
      </div>
    </div>
  );
}