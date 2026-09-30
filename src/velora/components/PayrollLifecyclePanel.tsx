import React from 'react';
import { Employee, PayrollRun, PayrollRun as Run } from '../types/hr';
import { formatKES } from '../utils/kenyaPayrollCalculator';
import { Badge, Card } from './ui';
import { Check } from 'lucide-react';

const STAGES = ['Setup', 'Open period', 'Pull time & leave', 'Inputs', 'Calculate', 'Validate', 'Review', 'Approve', 'Payslips & export', 'Close'];
const stageIndex = (s: Run['status']) => ({ draft: 3, calculated: 5, review: 6, approved: 8, closed: 10, reopened: 4 }[s]);

export const PayrollLifecyclePanel: React.FC<{ run: PayrollRun; prior: PayrollRun; employees: Employee[] }> = ({ run, prior, employees }) => {
  const current = stageIndex(run.status);
  const checks: { label: string; tone: 'red' | 'gold' | 'green'; detail: string }[] = [];
  const missingIds = employees.filter((e) => !e.kraPin || !e.nssfNumber || !e.shifNumber);
  checks.push(missingIds.length ? { label: 'Missing statutory IDs', tone: 'red', detail: missingIds.map((e) => e.fullName).join(', ') } : { label: 'Statutory IDs complete', tone: 'green', detail: 'KRA PIN, NSSF and SHA/SHIF present' });
  const noPay = employees.filter((e) => (e.paymentMethod === 'mpesa' ? !e.mpesaNumber : !e.bankAccountNumber));
  checks.push(noPay.length ? { label: 'Missing payment details', tone: 'red', detail: noPay.map((e) => e.fullName).join(', ') } : { label: 'Payment details complete', tone: 'green', detail: 'All workers payable' });
  const accts = employees.map((e) => e.bankAccountNumber || e.mpesaNumber).filter(Boolean);
  checks.push(new Set(accts).size < accts.length ? { label: 'Duplicate payment accounts', tone: 'gold', detail: 'Two workers share an account' } : { label: 'No duplicate accounts', tone: 'green', detail: 'Checked bank and mobile numbers' });
  const variances = run.results.map((r) => {
    const p = prior.results.find((x) => x.employeeId === r.employeeId);
    return { r, pct: p && p.netPay ? ((r.netPay - p.netPay) / p.netPay) * 100 : 0 };
  }).filter((v) => Math.abs(v.pct) > 10);
  checks.push(variances.length ? { label: `Net pay variance > 10% (${variances.length})`, tone: 'gold', detail: variances.map((v) => `${v.r.employeeName ?? v.r.employeeId} ${v.pct > 0 ? '+' : ''}${v.pct.toFixed(0)}%`).join(', ') } : { label: 'Variance within threshold', tone: 'green', detail: '±10% vs prior period' });
  const neg = run.results.filter((r) => r.netPay < 0);
  checks.push(neg.length ? { label: 'Negative net pay', tone: 'red', detail: `${neg.length} worker(s)` } : { label: 'No negative net pay', tone: 'green', detail: 'All net pay above zero' });
  checks.push({ label: 'Unapproved overtime / timesheets', tone: 'gold', detail: '2 overtime requests and 2 timesheets awaiting line manager' });

  const delta = run.totalNet - prior.totalNet;
  return (
    <div className="space-y-5 mb-6">
      <Card title={`${run.periodName} payroll workflow`} subtitle={`Cut-off ${run.cutOffDate} · Net ${formatKES(run.totalNet)} (${delta >= 0 ? '+' : ''}${formatKES(delta)} vs ${prior.periodName})`} action={<Badge tone="plum">{run.status}</Badge>}>
        <ol className="flex flex-wrap gap-y-3">
          {STAGES.map((s, i) => {
            const done = i < current; const active = i === current;
            return (
              <li key={s} className="flex items-center text-[11px] font-semibold">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-1.5 text-[10px] ${done ? 'bg-[#3B1E54] text-[#FFFDF8]' : active ? 'bg-[#C9A227] text-[#3B1E54]' : 'bg-[#DDD6CE]/60 text-[#888]'}`}>{done ? <Check className="w-3 h-3" /> : i + 1}</span>
                <span className={done || active ? 'text-[#3B1E54]' : 'text-[#999]'}>{s}</span>
                {i < STAGES.length - 1 && <span className="w-5 h-px bg-[#DDD6CE] mx-2" />}
              </li>
            );
          })}
        </ol>
      </Card>
      <Card title="Validation checks" subtitle="Blocking issues (red) must be resolved before approval.">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {checks.map((c) => (
            <div key={c.label} className="border border-[#DDD6CE] rounded-xl p-3">
              <Badge tone={c.tone}>{c.tone === 'red' ? 'Blocking' : c.tone === 'gold' ? 'Warning' : 'Passed'}</Badge>
              <div className="text-xs font-bold mt-1.5">{c.label}</div>
              <div className="text-[11px] text-[#666] mt-0.5">{c.detail}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
