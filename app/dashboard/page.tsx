'use client';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Dashboard() {
  const { publicKey } = useWallet();
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold">AutoVault Dashboard</h1>
      <p className="text-zinc-400">Connected: {publicKey?.toString().slice(0,8)}...</p>
      <div className="mt-12 grid grid-cols-3 gap-6">
        <div className="bg-zinc-900 p-8 rounded-3xl">Total Value: $12,480</div>
        <div className="bg-zinc-900 p-8 rounded-3xl">P&L: +18%</div>
      </div>
    </div>
  );
}