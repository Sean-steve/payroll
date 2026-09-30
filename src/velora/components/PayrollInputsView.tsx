import React, { useState } from 'react';
import { Employee } from '../types/hr';
import { formatKES } from '../utils/kenyaPayrollCalculator';
import { Badge, Btn, Card, PageTitle, Stat, Table, Tabs, Td } from './ui';
import { Upload } from 'lucide-react';

type Input = { id: string; emp: string; item: string; kind: 'Earning' | 'Deduction'; recurrence: 'One-off' | 'Recurring' | 'Balance'; amount: number; source: string };
type Loan = { id: string; emp: string; type: string; principal: number; instalment: number; paid: number; start: string };

const SAMPLE_CSV = `employee_code,item,type,amount
VEL-001,Sales Commission,earning,45000
VEL-003,Airtime Allowance,earning,3000
VEL-099,Performance Bonus,earning,20000
VEL-004,Canteen Recovery,deduction,-500`;

export const PayrollInputsView: React.FC<{ employees: Employee[]; canEdit: boolean }> = ({ employees, canEdit }) => {
  const name = (i: number) => employees[i % employees.length]?.fullName ?? '—';
  const [tab, setTab] = useState('Earnings & deductions');
  const [inputs, setInputs] = useState<Input[]>([
    { id: 'i1', emp: name(0), item: 'Q3 Performance Bonus', kind: 'Earning', recurrence: 'One-off', amount: 60000, source: 'Manual' },
    { id: 'i2', emp: name(1), item: 'Sales Commission', kind: 'Earning', recurrence: 'One-off', amount: 38500, source: 'CSV import' },
    { id: 'i3', emp: name(2), item: 'Overtime 1.5x (12 hrs)', kind: 'Earning', recurrence: 'One-off', amount: 9450, source: 'Approved attendance' },
    { id: 'i4', emp: name(3), item: 'Mileage Reimbursement', kind: 'Earning', recurrence: 'One-off', amount: 7200, source: 'Manual' },
    { id: 'i5', emp: name(0), item: 'SACCO Contribution', kind: 'Deduction', recurrence: 'Recurring', amount: 5000, source: 'Profile' },
    { id: 'i6', emp: name(4), item: 'Unpaid leave (2 days)', kind: 'Deduction', recurrence: 'One-off', amount: 6800, source: 'Approved leave' },
    { id: 'i7', emp: name(2), item: 'Salary Advance Recovery', kind: 'Deduction', recurrence: 'Balance', amount: 10000, source: 'Loan ledger' },
  ]);
  const loans: Loan[] = [
    { id: 'l1', emp: name(2), type: 'Salary advance', principal: 30000, instalment: 10000, paid: 10000, start: '2026-09' },
    { id: 'l2', emp: name(1), type: 'Staff loan', principal: 240000, instalment: 20000, paid: 80000, start: '2026-03' },
    { id: 'l3', emp: name(4), type: 'Emergency loan', principal: 50000, instalment: 12500, paid: 37500, start: '2026-07' },
  ];
  const [csv, setCsv] = useState(SAMPLE_CSV);
  const [preview, setPreview] = useState<{ row: string[]; error: string | undefined }[] | null>(null);
  const codes = new Set(employees.map((e) => e.employeeCode));

  const validate = () => {
    const rows = csv.trim().split('\n').slice(1).map((l) => l.split(',').map((s) => s.trim()));
    setPreview(rows.map((r) => {
      const [code, , type, amt] = r;
      let error: string | undefined;
      if (!codes.has(code ?? '')) error = 'Unknown employee code';
      else if (!['earning', 'deduction'].includes(type ?? '')) error = 'Type must be earning or deduction';
      else if (!(Number(amt) > 0)) error = 'Amount must be a positive number';
      return { row: r, error };
    }));
  };
  const commit = () => {
    if (!preview) return;
    const ok = preview.filter((p) => !p.error);
    setInputs((prev) => [...prev, ...ok.map((p, i) => ({
      id: `csv${Date.now()}${i}`, emp: employees.find((e) => e.employeeCode === p.row[0])?.fullName ?? '', item: p.row[1] ?? '',
      kind: (p.row[2] === 'earning' ? 'Earning' : 'Deduction') as Input['kind'], recurrence: 'One-off' as const, amount: Number(p.row[3]), source: 'CSV import',
    }))]);
    setPreview(null);
    setTab('Earnings & deductions');
  };

  const earn = inputs.filter((i) => i.kind === 'Earning').reduce((a, b) => a + b.amount, 0);
  const ded = inputs.filter((i) => i.kind === 'Deduction').reduce((a, b) => a + b.amount, 0);

  return (
    <div>
      <PageTitle title="Payroll Inputs" subtitle="Variable earnings, deductions, loans and time-derived items for the October 2026 period." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Variable earnings" value={formatKES(earn)} />
        <Stat label="Variable deductions" value={formatKES(ded)} />
        <Stat label="Active loans" value={loans.length} hint={`${formatKES(loans.reduce((a, l) => a + l.principal - l.paid, 0))} outstanding`} />
        <Stat label="From attendance & leave" value={inputs.filter((i) => i.source.startsWith('Approved')).length} hint="Only approved records flow in" />
      </div>
      <Tabs tabs={['Earnings & deductions', 'Loans & advances', 'Bulk import']} active={tab} onChange={setTab} />

      {tab === 'Earnings & deductions' && (
        <Card title="Period inputs" subtitle="Recurring and balance items are generated once per run — recalculation never duplicates them.">
          <Table head={['Employee', 'Item', 'Type', 'Recurrence', 'Source', 'Amount', '']}>
            {inputs.map((i) => (
              <tr key={i.id}>
                <Td className="font-semibold">{i.emp}</Td><Td>{i.item}</Td>
                <Td><Badge tone={i.kind === 'Earning' ? 'green' : 'red'}>{i.kind}</Badge></Td>
                <Td>{i.recurrence}</Td><Td className="text-[#666]">{i.source}</Td>
                <Td mono>{formatKES(i.amount)}</Td>
                <Td>{canEdit && i.source !== 'Profile' && <button onClick={() => setInputs(inputs.filter((x) => x.id !== i.id))} className="text-rose-600 font-bold">Remove</button>}</Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {tab === 'Loans & advances' && (
        <Card title="Loan & advance ledger" subtitle="Instalments are deducted automatically until the balance is cleared; remaining balance feeds Final Dues on exit.">
          <Table head={['Employee', 'Type', 'Principal', 'Instalment', 'Repaid', 'Balance', 'Progress', 'Next deduction']}>
            {loans.map((l) => {
              const pct = Math.round((l.paid / l.principal) * 100);
              return (
                <tr key={l.id}>
                  <Td className="font-semibold">{l.emp}</Td><Td>{l.type}</Td>
                  <Td mono>{formatKES(l.principal)}</Td><Td mono>{formatKES(l.instalment)}</Td><Td mono>{formatKES(l.paid)}</Td>
                  <Td mono className="font-bold">{formatKES(l.principal - l.paid)}</Td>
                  <Td><div className="w-24 h-1.5 bg-[#DDD6CE] rounded-full"><div className="h-full bg-[#C9A227] rounded-full" style={{ width: `${pct}%` }} /></div></Td>
                  <Td>Oct 2026</Td>
                </tr>
              );
            })}
          </Table>
        </Card>
      )}

      {tab === 'Bulk import' && (
        <Card title="Import from CSV" subtitle="Columns: employee_code, item, type, amount. Rows with errors are skipped.">
          <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={6} className="w-full font-mono text-xs border border-[#DDD6CE] rounded-xl p-3 bg-[#FFFDF8]" />
          <div className="flex gap-2 mt-3">
            <Btn variant="ghost" onClick={validate}><Upload className="w-3.5 h-3.5 inline mr-1" />Validate</Btn>
            <Btn onClick={commit} disabled={!preview || !canEdit}>Import valid rows</Btn>
          </div>
          {preview && (
            <div className="mt-4">
              <Table head={['Code', 'Item', 'Type', 'Amount', 'Result']}>
                {preview.map((p, i) => (
                  <tr key={i}>{p.row.map((c, j) => <Td key={j} mono={j === 3}>{c}</Td>)}<Td>{p.error ? <Badge tone="red">{p.error}</Badge> : <Badge tone="green">OK</Badge>}</Td></tr>
                ))}
              </Table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
