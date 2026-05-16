// New UI component for safety approval gate (add to agent creator flow)
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SafetyApprovalGate({ safetyCheck, onApprove, onCancel }: any) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-3xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Safety Gate Activated</h2>
        <p className="text-amber-400 mb-6">Risk detected: {safetyCheck.reason}</p>
        <p className="text-sm text-zinc-400 mb-8">Simulation passed: {safetyCheck.simulationPassed ? '✅' : '❌'}</p>
        <div className="flex gap-4">
          <Button variant="destructive" onClick={onCancel}>Cancel Transaction</Button>
          <Button onClick={() => { setLoading(true); onApprove(); }} disabled={loading}>
            {loading ? 'Approving...' : 'Approve & Execute'}
          </Button>
        </div>
      </div>
    </div>
  );
}