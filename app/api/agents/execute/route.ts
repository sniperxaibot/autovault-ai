import { NextResponse } from 'next/server';

import { executeStrategy } from '@/lib/solana';
import { runAutonomousLoop } from '@/lib/agentBrain';
import { checkSafety } from '@/lib/safety';

// Autonomous execution endpoint - Production ready (fixed syntax + full integration)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { agentId, prompt, riskProfile, owner } = body;

    if (!prompt || !riskProfile || !owner) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Safety & Security layer (Phase 3)
    const safetyCheck = await checkSafety(prompt, riskProfile);
    if (!safetyCheck.safe) {
      return NextResponse.json({ error: safetyCheck.message, riskScore: safetyCheck.score }, { status: 403 });
    }

    // 2. AI Brain generates strategy (Phase 2 - pay.sh powered)
    const strategy = await runAutonomousLoop(prompt, riskProfile);

    // 3. Real onchain execution (Phase 1)
    const executionResult = await executeStrategy(prompt, riskProfile, null, owner);

    return NextResponse.json({
      success: true,
      agentId,
      strategy,
      executionResult,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Agent execution error:', error);
    return NextResponse.json({ error: error.message || 'Execution failed' }, { status: 500 });
  }
}

export async function GET() {
  // Background loop health check (for Railway cron)
  return NextResponse.json({ status: 'healthy', message: 'Autonomous brain ready' });
}
