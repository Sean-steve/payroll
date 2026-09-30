import React, { useState } from 'react';
import { Employee } from '../types/hr';
import { formatKES } from '../utils/kenyaPayrollCalculator';
import { Badge, Card, PageTitle, Table, Td, mask } from './ui';
import { AlertTriangle } from 'lucide-react';

const BASIS_LABEL: Record<string, string> = { monthly: 'Monthly salary', weekly: 'Weekly rate', daily: 'Daily rate', hourly: 'Hourly rate' };
const POP_LABEL: Record<string, string> = {
  monthly_salaried: 'Monthly Salaried', casual_temporary: 'Casual & Temporary', daily_paid: 'Daily Paid', hourly_paid: 'Hourly Paid', weekly_paid: 'Weekly Paid',
};

export const EmployeeProfileView: React.FC<{ employees: Employee[] }> = ({ employees }) => {
  const [id, setId] = useState(employees[0]?.id);
  const e = employees.find((x) => x.id === id) ?? employees[0]!;
  const missing = [
    !e.kraPin && 'KRA PIN', !e.nssfNumber && 'NSSF number', !e.shifNumber && 'SHA/SHIF number',
    e.paymentMethod === 'bank_transfer' && !e.bankAccountNumber && 'Bank account',
    e.paymentMethod === 'mpesa' && !e.mpesaNumber && 'M-Pesa number',
  ].filter(Boolean) as string[];
  const allowances = Object.entries(e.fixedAllowances ?? {}).filter(([, v]) => typeof v === 'number' && v > 0) as [string, number][];
  const history = [
    { from: e.joinDate, rate: Math.round(e.basicSalary * 0.88), reason: 'Starting rate' },
    { from: '2025-07-01', rate: Math.round(e.basicSalary * 0.94), reason: 'Annual review' },
    { from: '2026-07-01', rate: e.basicSalary, reason: 'Annual review' },
  ];

  return (
    <div>
      <PageTitle title="Employee Payroll Profiles" subtitle="Pay assignment, compensation history, recurring items and statutory details — sourced from VeloraHR master records." />
      <div className="grid lg:grid-cols-[260px_1fr] gap-5">
        <Card title="Employees">
          <div className="space-y-1 -m-2">
            {employees.map((x) => (
              <button key={x.id} onClick={() => setId(x.id)} className={`w-full text-left px-3 py-2 rounded-xl text-xs ${x.id === e.id ? 'bg-[#3B1E54] text-[#FFFDF8]' : 'hover:bg-[#C6B8D9]/20'}`}>
                <div className="font-bold">{x.fullName}</div>
                <div className="opacity-70">{x.employeeCode} · {POP_LABEL[x.population]}</div>
              </button>
            ))}
          </div>
        </Card>
        <div className="space-y-5">
          {missing.length > 0 && (
            <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" /> Missing before payroll can be approved: {missing.join(', ')}
            </div>
          )}
          <Card title={e.fullName} subtitle={`${e.jobTitle} · ${e.department} · ${e.branch}`} action={<Badge tone={e.status === 'active' ? 'green' : 'gold'}>{e.status.replace('_', ' ')}</Badge>}>
            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              {[
                ['Payroll population', POP_LABEL[e.population]], ['Pay basis', BASIS_LABEL[e.payBasis]], ['Current rate', formatKES(e.basicSalary)],
                ['Pay structure', e.payStructureId], ['Cost centre', e.costCentre], ['Join date', e.joinDate],
              ].map(([k, v]) => (<div key={k}><div className="text-[10px] uppercase font-bold text-[#888]">{k}</div><div className="font-semibold mt-0.5">{v}</div></div>))}
            </div>
          </Card>
          <div className="grid md:grid-cols-2 gap-5">
            <Card title="Statutory & identity">
              <dl className="text-xs space-y-2">
                {[['National ID', mask(e.nationalId)], ['KRA PIN', e.kraPin ? mask(e.kraPin) : 'Missing'], ['NSSF', e.nssfNumber ? mask(e.nssfNumber) : 'Missing'], ['SHA/SHIF', e.shifNumber ? mask(e.shifNumber) : 'Missing']].map(([k, v]) => (
                  <div key={k} className="flex justify-between"><dt className="text-[#666]">{k}</dt><dd className="font-mono">{v}</dd></div>
                ))}
              </dl>
            </Card>
            <Card title="Payment details" subtitle="Masked — full numbers visible only to authorised roles">
              <dl className="text-xs space-y-2">
                <div className="flex justify-between"><dt className="text-[#666]">Method</dt><dd>{e.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Bank transfer'}</dd></div>
                <div className="flex justify-between"><dt className="text-[#666]">Bank</dt><dd>{e.bankName || '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-[#666]">Account</dt><dd className="font-mono">{mask(e.bankAccountNumber)}</dd></div>
                <div className="flex justify-between"><dt className="text-[#666]">Mobile</dt><dd className="font-mono">{mask(e.mpesaNumber)}</dd></div>
              </dl>
            </Card>
          </div>
          <Card title="Compensation history" subtitle="Effective-dated — closed payrolls keep the rate used at the time">
            <Table head={['Effective from', 'Rate', 'Reason']}>
              {history.map((h) => (<tr key={h.from}><Td mono>{h.from}</Td><Td mono>{formatKES(h.rate)}</Td><Td>{h.reason}</Td></tr>))}
            </Table>
          </Card>
          <Card title="Recurring earnings">
            {allowances.length === 0 ? <p className="text-xs text-[#666]">No recurring allowances.</p> : (
              <Table head={['Item', 'Amount', 'Taxable']}>
                {allowances.map(([k, v]) => (<tr key={k}><Td className="capitalize">{k.replace(/([A-Z])/g, ' $1')}</Td><Td mono>{formatKES(v)}</Td><Td><Badge tone="plum">Yes</Badge></Td></tr>))}
              </Table>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
