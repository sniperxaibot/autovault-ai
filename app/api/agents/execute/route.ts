import { NextResponse } from 'next/server';
import { executeStrategy } from '@/lib/solana';
import { preExecuteSimulation, checkRateLimit, escrowSafetyRail, EMERGENCY_PAUSE } from '@/lib/safety';

export async function POST(req: Request) {
  if (EMERGENCY_PAUSE) {
    return NextResponse.json({ error: 'Emergency pause active - all agents halted' }, { status: 503 });
  }

  const { agentId, prompt, riskProfile, userPubkey } = await req.json();

  // Safety checks
  if (!checkRateLimit(userPubkey)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  // 1. AI Brain generates strategy (from Phase 2)
  const strategy = await /* call agentBrain */;
  const tx = await /* build tx from strategy */;

  // 2. Pre-execution simulation + approval gate
  const safety = await preExecuteSimulation(tx, /* connection */);
  if (!safety.simulationPassed) {
    return NextResponse.json({ error: safety.reason }, { status: 400 });
  }

  if (safety.requiresApproval) {
    // In UI this triggers modal; here we return for frontend handling
    return NextResponse.json({ requiresApproval: true, safetyCheck: safety, txPreview: 'preview-data' });
  }

  // 3. Escrow safety rail
  const escrowOk = await escrowSafetyRail(100, userPubkey); // example
  if (!escrowOk) {
    return NextResponse.json({ error: 'Escrow safety failed' }, { status: 403 });
  }

  // 4. Execute (real onchain from Phase 1)
  const result = await executeStrategy(prompt, riskProfile /* + wallet */);

  return NextResponse.json({ ...result, safety: safety });
}