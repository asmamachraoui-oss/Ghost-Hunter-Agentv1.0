
import React, { useState, useEffect, useCallback } from 'react';
import { runGhostHunterSimulation } from './src/main';
import { GhostHunterInput, GhostHunterOutput } from './src/types';
import { auditLog } from './src/audit';

const DEFAULT_INPUT: GhostHunterInput = {
  cloud: "Azure",
  account: "1234567890",
  region: "eastus",
  resourceType: "VM",
  resourceId: "ghost-vm-01",
  tags: { env: "prod", owner: "admin@enterprise.com" },
  lastAccessDays: 45,
  monthlyCost: 150.00,
  env: "prod",
  context: {
    activeIncident: false,
    releaseWindow: false,
    freezeWindow: false,
    cabRequired: true
  }
};

const App: React.FC = () => {
  const [inputJson, setInputJson] = useState(JSON.stringify(DEFAULT_INPUT, null, 2));
  const [output, setOutput] = useState<GhostHunterOutput | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [dryRun, setDryRun] = useState(true);
  const [ownerAction, setOwnerAction] = useState<string>("");
  const [simulateFail, setSimulateFail] = useState(false);

  const refreshLogs = useCallback(() => {
    setLogs(auditLog.getLogs());
  }, []);

  const handleRun = async () => {
    try {
      const parsedInput = JSON.parse(inputJson);
      const result = await runGhostHunterSimulation(parsedInput, {
        dryRun,
        ownerAction: ownerAction || undefined,
        simulateSnapshotFail: simulateFail
      });
      setOutput(result);
      refreshLogs();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  useEffect(() => {
    refreshLogs();
  }, [refreshLogs]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="border-b border-slate-700 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-emerald-400">GHOST-HUNTER</h1>
          <p className="text-slate-400">Enterprise Cloud Retirement & Governance Engine</p>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={dryRun} onChange={e => setDryRun(e.target.checked)} className="w-4 h-4" />
            <span>DRY_RUN</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={simulateFail} onChange={e => setSimulateFail(e.target.checked)} className="w-4 h-4" />
            <span>Simulate Fail</span>
          </label>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <section className="bg-slate-800 p-4 rounded-lg shadow-xl border border-slate-700">
          <h2 className="text-lg font-semibold mb-4 text-slate-300">Input Event (JSON)</h2>
          <textarea 
            className="w-full h-80 bg-slate-900 text-emerald-300 font-mono text-sm p-4 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
          />
          <div className="mt-4 grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs uppercase text-slate-500 mb-1">Simulated Owner Action</label>
               <select 
                value={ownerAction} 
                onChange={(e) => setOwnerAction(e.target.value)}
                className="w-full bg-slate-700 p-2 rounded border border-slate-600"
               >
                 <option value="">[Wait for Silence/Default]</option>
                 <option value="PROCEED">PROCEED</option>
                 <option value="DEFER_30">DEFER_30</option>
                 <option value="KEEP">KEEP</option>
               </select>
             </div>
             <button 
                onClick={handleRun}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded transition-colors self-end"
             >
               Execute Agent Flow
             </button>
          </div>
        </section>

        {/* Output Panel */}
        <section className="bg-slate-800 p-4 rounded-lg shadow-xl border border-slate-700 overflow-hidden flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-slate-300">Canonical Output</h2>
          {output ? (
            <div className="flex-1 overflow-auto bg-slate-900 p-4 rounded border border-slate-700 font-mono text-xs">
              <div className="mb-4">
                <span className={`px-2 py-1 rounded font-bold ${
                  output.decision === 'PROCEED' ? 'bg-emerald-900 text-emerald-400' :
                  output.decision === 'DEFER' ? 'bg-amber-900 text-amber-400' :
                  output.decision === 'ESCALATE' ? 'bg-red-900 text-red-400' : 'bg-slate-700'
                }`}>
                  {output.decision}
                </span>
                <span className="ml-4 text-slate-400">{output.reason}</span>
              </div>
              <pre className="text-blue-300">{JSON.stringify(output, null, 2)}</pre>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 italic">
              Run the agent to see results...
            </div>
          )}
        </section>

        {/* Audit Log (Full Width) */}
        <section className="lg:col-span-2 bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h2 className="text-lg font-semibold mb-4 text-slate-300">Append-Only Audit Log (logs/audit.log.jsonl)</h2>
          <div className="bg-black p-4 rounded h-64 overflow-auto font-mono text-[10px] space-y-1">
            {logs.length > 0 ? [...logs].reverse().map((log, i) => (
              <div key={i} className="text-slate-400 border-b border-slate-800 pb-1">
                <span className="text-blue-500">[{log.timestamp}]</span> <span className="text-emerald-500">{log.requestId}</span>: {JSON.stringify(log)}
              </div>
            )) : <p className="text-slate-600">No logs yet.</p>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
