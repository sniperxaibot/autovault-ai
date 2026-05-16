import { NextResponse } from 'next/server';
import { executeStrategy } from '@/lib/solana';

export async function POST(req: Request) {
  try {
    const { prompt, riskProfile, publicKey } = await req.json();
    // Note: full wallet signing happens in client component for security
    // This API triggers the strategy logic and returns result
    const result = await executeStrategy(prompt, riskProfile, null, publicKey);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}