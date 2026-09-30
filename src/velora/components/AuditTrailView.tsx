import React, { useMemo, useState } from 'react';
import { AuditEvent } from '../types/hr';
import { Badge, Btn, Card, PageTitle, Table, Td } from './ui';

const EXTRA: AuditEvent[] = [
  { id: 'ax1', timestamp: '2026-10-24 16:45 EAT', userName: 'Stephen Nyaga', userRole: 'Payroll Officer', action: 'Calculate', entity: 'Payroll Run Oct 2026', details: 'Calculated 5 workers using PAYE rule v2026.1, NSSF v2026.2, SHIF v2025.1', severity: 'info' },
  { id: 'ax2', timestamp: '2026-10-24 17:02 EAT', userName: 'Stephen Nyaga', userRole: 'Payroll Officer', action: 'Edit', entity: 'Payroll Input', details: 'Sales Commission changed KES 32,000 → KES 38,500', severity: 'warning' },
  { id: 'ax3', timestamp: '2026-10-25 11:20 EAT', userName: 'Alice Wambui', userRole: 'Reviewer', action: 'Recommend', entity: 'Payroll Run Oct 2026', details: 'Variance explained: commission & overtime', severity: 'info' },
  { id: 'ax4', timestamp: '2026-09-30 09:10 EAT', userName: 'Rosemary Mwanza', userRole: 'Finance Approver', action: 'Close', entity: 'Payroll Run Sep 2026', details: 'Period locked; snapshot retained', severity: 'security' },
  { id: 'ax5', timestamp: '2026-09-30 09:14 EAT', userName: 'Rosemary Mwanza', userRole: 'Finance Approver', action: 'Export', entity: 'Master Payroll CSV', details: 'Downloaded Sep 2026 master payroll (5 rows)', severity: 'info' },
];

export const AuditTrailView: React.FC<{ auditLogs: AuditEvent[] }> = ({ auditLogs }) => {
  const all = useMemo(() => [...auditLogs, ...EXTRA].sort((a, b) => b.timestamp.localeCompare(a.timestamp)), [auditLogs]);
  const [q, setQ] = useState('');
  const [sev, setSev] = useState('all');
  const rows = all.filter((a) => (sev === 'all' || a.severity === sev) && `${a.userName} ${a.action} ${a.entity} ${a.details}`.toLowerCase().includes(q.toLowerCase()));

  const exportCsv = () => {
    const csv = ['timestamp,user,role,action,entity,details', ...rows.map((r) => [r.timestamp, r.userName, r.userRole, r.action, r.entity, r.details].map((c) => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'velorahr-audit-trail.csv';
    a.click();
  };

  return (
    <div>
      <PageTitle title="Audit Trail" subtitle="Every calculation, change, approval, close, reopen and export — traceable and read-only." action={<Btn variant="ghost" onClick={exportCsv}>Export CSV</Btn>} />
      <Card>
        <div className="flex flex-wrap gap-2 mb-4">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search user, action or record…" className="flex-1 min-w-[200px] text-xs border border-[#DDD6CE] rounded-xl px-3 py-2" />
          <select value={sev} onChange={(e) => setSev(e.target.value)} className="text-xs border border-[#DDD6CE] rounded-xl px-3 py-2 bg-white">
            <option value="all">All events</option><option value="info">Info</option><option value="warning">Changes</option><option value="security">Security</option>
          </select>
        </div>
        <Table head={['Time', 'User', 'Action', 'Record', 'Details', '']}>
          {rows.map((r) => (
            <tr key={r.id}>
              <Td mono className="text-[#666]">{r.timestamp}</Td>
              <Td><div className="font-semibold">{r.userName}</div><div className="text-[10px] text-[#888]">{r.userRole}</div></Td>
              <Td className="font-semibold">{r.action}</Td><Td>{r.entity}</Td>
              <td className="py-2.5 pr-4 text-[#555] min-w-[260px]">{r.details}</td>
              <Td><Badge tone={r.severity === 'security' ? 'plum' : r.severity === 'warning' ? 'gold' : 'gray'}>{r.severity}</Badge></Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
};
