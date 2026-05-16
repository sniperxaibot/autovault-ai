import { NextResponse } from 'next/server';
import { generateAutonomousStrategy, runAutonomousLoop, payForLLMCall } from '@/lib/agentBrain';
import { executeStrategy } from '@/lib/solana';

export async function POST(req: Request) {
  try {
    const { agentId, prompt, riskProfile, ownerPubkey, mode = 'one-time' } = await req.json();

    if (mode === 'autonomous') {
      // Background autonomous execution
      const result = await runAutonomousLoop(agentId, ownerPubkey);
      return NextResponse.json({ success: true, mode: 'autonomous', result });
    }

    // One-time execution with AI brain
    const strategy = await generateAutonomousStrategy(prompt, riskProfile || 'balanced', ownerPubkey);

    // Pay for LLM inference via pay.sh + x402 (autonomous billing)
    await payForLLMCall(0.01, 'grok'); // real pay.sh call in prod

    // Execute the AI-generated strategy onchain
    const executionResult = await executeStrategy(strategy, ownerPubkey);

    return NextResponse.json({
      success: true,
      agentId,
      strategy,
      execution: executionResult,
      message: '✅ Autonomous AI strategy executed on Solana via pay.sh-powered brain!'
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
