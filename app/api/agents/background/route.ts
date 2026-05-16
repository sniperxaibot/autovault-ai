import { NextResponse } from 'next/server';
import { runAutonomousLoop } from '@/lib/agentBrain';

export async function GET() {
  // Vercel Cron / background loop endpoint
  // Call this via cron job: https://yourdomain.com/api/agents/background?agentId=av-123&owner=...
  const agentId = 'av-demo-001';
  const ownerPubkey = 'DemoOwnerPubkeyForTesting'; // replace with real from DB

  try {
    const result = await runAutonomousLoop(agentId, ownerPubkey);
    return NextResponse.json({ success: true, result, timestamp: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { agentId, ownerPubkey } = await req.json();
  const result = await runAutonomousLoop(agentId, ownerPubkey);
  return NextResponse.json(result);
}