import React from 'react';
import { PayrollRun } from '../types/hr';
import { Btn, Card } from './ui';

export const ExtraReportsPanel: React.FC<{ run: PayrollRun; prior: PayrollRun }> = ({ run, prior }) => {
  const download = (name: string, rows: (string | number)[][]) => {
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `velorahr-${name}-${run.id}.csv`;
    a.click();
  };
  const reports = [
    { name: 'Payroll Variance', desc: `${run.periodName} vs ${prior.periodName}, by employee`, run: () => download('variance', [['Employee', 'Prior net', 'Current net', 'Change'], ...run.results.map((r) => { const p = prior.results.find((x) => x.employeeId === r.employeeId)?.netPay ?? 0; return [r.employeeName ?? r.employeeId, p, r.netPay, r.netPay - p]; })]) },
    { name: 'Casual & Temporary Workers', desc: 'Days/hours, rates and net pay', run: () => download('casuals', [['Employee', 'Gross', 'Net'], ...run.results.map((r) => [r.employeeName ?? r.employeeId, r.grossPay, r.netPay])]) },
    { name: 'Loans & Advances', desc: 'Balances, instalments and recoveries', run: () => download('loans', [['Type', 'Principal', 'Repaid', 'Balance'], ['Salary advance', 30000, 10000, 20000], ['Staff loan', 240000, 80000, 160000], ['Emergency loan', 50000, 37500, 12500]]) },
    { name: 'Audit Report', desc: 'Approvals, reopens and exports for the period', run: () => download('audit', [['Event', 'By', 'When'], ['Calculated', 'Payroll Officer', run.calculatedAt ?? ''], ['Reviewed', run.reviewedBy ?? '', run.reviewedAt ?? '']]) },
  ];
  return (
    <Card title="Management reports" subtitle="Additional Phase 3 reports" className="mt-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {reports.map((r) => (
          <div key={r.name} className="border border-[#DDD6CE] rounded-xl p-4 flex flex-col">
            <div className="text-xs font-bold text-[#3B1E54]">{r.name}</div>
            <div className="text-[11px] text-[#666] mt-1 flex-1">{r.desc}</div>
            <Btn variant="ghost" className="mt-3" onClick={r.run}>Download CSV</Btn>
          </div>
        ))}
      </div>
    </Card>
  );
};
