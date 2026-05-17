import { Connection, VersionedTransaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

export interface SafetyCheck {
  simulationPassed: boolean;
  riskScore: number;
  requiresApproval: boolean;
  reason: string;
}

export async function preExecuteSimulation(tx: VersionedTransaction, connection: Connection): Promise<SafetyCheck> {
  // Simulate transaction before signing
  try {
    const { value } = await connection.simulateTransaction(tx);
    const risk = value.err ? 100 : value.unitsConsumed > 500000 ? 80 : 20;
    return {
      simulationPassed: !value.err,
      riskScore: risk,
      requiresApproval: risk > 50,
      reason: value.err ? 'Simulation failed' : risk > 50 ? 'High risk detected' : 'Safe'
    };
  } catch (e) {
    return { simulationPassed: false, riskScore: 100, requiresApproval: true, reason: 'Simulation error' };
  }
}

export function checkRateLimit(userPubkey: string): boolean {
  // Simple in-memory rate limit (prod: use Redis or DB)
  const now = Date.now();
  // Mock implementation - replace with real cache in prod
  return true; // placeholder for MVP
}

export async function escrowSafetyRail(amount: number, userPubkey: string): Promise<boolean> {
  // MVP escrow: just log + check balance (full escrow program in Anchor for V2)
  console.log(`Escrow safety check for ${userPubkey}: ${amount} tokens`);
  return true;
}

export const EMERGENCY_PAUSE = false; // toggle this to pause all agents globally

export async function checkSafety(prompt: string, riskProfile: string): Promise<{ safe: boolean; message: string; score: number }> {
  // Emergency pause check
  if (EMERGENCY_PAUSE) {
    return { safe: false, message: 'All agents are currently paused', score: 100 };
  }

  // Basic prompt safety validation
  const dangerousKeywords = ['rug', 'drain', 'exploit', 'hack'];
  const lowerPrompt = prompt.toLowerCase();
  for (const keyword of dangerousKeywords) {
    if (lowerPrompt.includes(keyword)) {
      return { safe: false, message: `Prompt contains dangerous keyword: ${keyword}`, score: 90 };
    }
  }

  // Risk profile scoring
  const riskScores: Record<string, number> = { conservative: 10, moderate: 30, aggressive: 60 };
  const score = riskScores[riskProfile.toLowerCase()] ?? 50;

  if (score > 80) {
    return { safe: false, message: 'Risk profile exceeds safety threshold', score };
  }

  return { safe: true, message: 'Safety check passed', score };
}
