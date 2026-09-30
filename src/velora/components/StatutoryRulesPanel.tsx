import React from 'react';
import { Badge, Card, Table, Td } from './ui';

const RULES = [
  { rule: 'PAYE tax bands', version: 'v2026.1', from: '2023-07-01', to: '—', detail: '10% to 24,000 · 25% to 32,333 · 30% to 500,000 · 32.5% to 800,000 · 35% above; personal relief 2,400', status: 'active' },
  { rule: 'NSSF (Tier I & II)', version: 'v2026.2', from: '2026-02-01', to: '—', detail: '6% employee + 6% employer; LEL 9,000, UEL 108,000', status: 'active' },
  { rule: 'NSSF (Tier I & II)', version: 'v2025.2', from: '2025-02-01', to: '2026-01-31', detail: '6% + 6%; LEL 8,000, UEL 72,000', status: 'superseded' },
  { rule: 'SHA / SHIF', version: 'v2025.1', from: '2024-10-01', to: '—', detail: '2.75% of gross, minimum 300; deductible from taxable pay', status: 'active' },
  { rule: 'Affordable Housing Levy', version: 'v2025.1', from: '2024-03-19', to: '—', detail: '1.5% employee + 1.5% employer; deductible from taxable pay', status: 'active' },
];

export const StatutoryRulesPanel: React.FC = () => (
  <div className="space-y-5 mt-6">
    <Card title="Statutory rule versions" subtitle="Effective-dated. Each payroll line stores the version used, so closed payrolls are never recalculated.">
      <Table head={['Rule', 'Version', 'Effective from', 'Effective to', 'Parameters', 'Status']}>
        {RULES.map((r) => (
          <tr key={r.rule + r.version}>
            <Td className="font-semibold">{r.rule}</Td><Td mono>{r.version}</Td><Td mono>{r.from}</Td><Td mono>{r.to}</Td>
            <td className="py-2.5 pr-4 text-[#555] min-w-[260px]">{r.detail}</td>
            <Td><Badge tone={r.status === 'active' ? 'green' : 'gray'}>{r.status}</Badge></Td>
          </tr>
        ))}
      </Table>
    </Card>
    <div className="grid md:grid-cols-3 gap-5">
      <Card title="Overtime & proration">
        <dl className="text-xs space-y-2">
          {[['Weekday overtime', '1.5x'], ['Rest day / holiday', '2.0x'], ['Proration method', 'Working days (22)'], ['Standard hours / day', '8'], ['Lateness deduction', 'Off']].map(([k, v]) => (
            <div key={k} className="flex justify-between"><dt className="text-[#666]">{k}</dt><dd className="font-semibold">{v}</dd></div>
          ))}
        </dl>
      </Card>
      <Card title="Approval chain">
        <ol className="text-xs space-y-2 list-decimal list-inside">
          <li>Payroll Officer prepares & calculates</li><li>HR Manager reviews variances</li><li>Finance Approver approves</li><li>Finance Approver closes period</li>
        </ol>
        <p className="text-[11px] text-[#888] mt-3">Preparer cannot approve their own payroll.</p>
      </Card>
      <Card title="CSV & payslip layout">
        <div className="flex flex-wrap gap-1.5">
          {['Employee code', 'Name', 'KRA PIN', 'Gross', 'PAYE', 'NSSF', 'SHIF', 'AHL', 'Net', 'Bank', 'YTD', 'Employer cost'].map((c) => <Badge key={c} tone="plum">{c}</Badge>)}
        </div>
      </Card>
    </div>
  </div>
);
