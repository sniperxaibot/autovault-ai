'use client';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function AgentCreator() {
  const wallet = useWallet();
  const { publicKey } = wallet;
  const [prompt, setPrompt] = useState('');
  const [risk, setRisk] = useState('balanced');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleExecute = async () => {
    if (!publicKey) {
      alert('Please connect your wallet first!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/agents/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: `av-${Date.now()}`,
          prompt,
          riskProfile: risk,
          owner: publicKey.toString()
        })
      });
      const data = await res.json();
      setResult(data);
      if (data.success) {
        alert(`✅ Agent executed on Solana!\nTx: ${data.signature || 'Portfolio updated'}`);
      }
    } catch (e: any) {
      console.error(e);
      alert('Execution failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-black text-white">
      <h1 className="text-4xl font-bold mb-6">🚀 AutoVault Agent Creator (Phase 1 LIVE)</h1>
      <p className="mb-8 text-zinc-400">Real Jupiter swaps, Drift lend, Raydium LP, portfolio tracking — all onchain now!</p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. Swap 0.5 SOL to USDC on Jupiter, lend USDC on Drift, or create LP"
        className="w-full h-40 p-6 border border-zinc-700 bg-zinc-900 rounded-3xl text-lg resize-none"
      />
      <div className="mt-6">
        <label className="block text-sm mb-2 text-zinc-400">Risk Profile</label>
        <select value={risk} onChange={(e) => setRisk(e.target.value)} className="w-full p-4 border border-zinc-700 bg-zinc-900 rounded-3xl text-white">
          <option value="conservative">Conservative Yield Farmer</option>
          <option value="balanced">Balanced Hedger</option>
          <option value="aggressive">Aggressive Trader</option>
        </select>
      </div>
      <button
        onClick={handleExecute}
        disabled={loading || !publicKey}
        className="mt-10 w-full py-7 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 text-white text-xl font-semibold rounded-3xl transition-all"
      >
        {loading ? '🚀 Executing on Solana Mainnet...' : 'Deploy & Execute Agent Now'}
      </button>
      {result && (
        <pre className="mt-8 p-6 bg-zinc-900 rounded-3xl text-sm overflow-auto border border-zinc-700">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}