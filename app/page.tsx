'use client';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-7xl font-bold mb-6">AutoVault AI</h1>
        <p className="text-3xl mb-12 text-purple-200">Autonomous DeFi Agents</p>
        <div className="flex gap-6 justify-center">
          <Link href="/agents/new" className="bg-white text-black px-10 py-5 rounded-3xl text-xl font-semibold">Create Your Agent</Link>
          <Link href="/dashboard" className="border-2 border-white px-10 py-5 rounded-3xl text-xl font-semibold">Dashboard</Link>
        </div>
        <div className="mt-16">
          <WalletMultiButton />
        </div>
      </div>
    </div>
  );
}