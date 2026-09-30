import React, { useState } from 'react';
import { Employee } from '../types/hr';
import { Badge, Btn, Card, PageTitle, Stat, Table, Tabs, Td } from './ui';

const DAYS = ['Mon 20', 'Tue 21', 'Wed 22', 'Thu 23', 'Fri 24', 'Sat 25', 'Sun 26'];
const SHIFTS = { D: 'Day 08:00–17:00', N: 'Night 20:00–05:00', E: 'Early 06:00–14:00', O: 'Off' } as const;
type Code = keyof typeof SHIFTS;
const PATTERNS: Code[][] = [
  ['D', 'D', 'D', 'D', 'D', 'O', 'O'], ['E', 'E', 'E', 'O', 'E', 'E', 'O'], ['N', 'N', 'O', 'N', 'N', 'N', 'O'], ['D', 'D', 'D', 'D', 'D', 'D', 'O'], ['O', 'D', 'D', 'D', 'D', 'D', 'O'],
];
const FLAGS: Record<string, string> = { '0-1': 'Late 18m', '2-3': 'Absent', '3-4': 'Left early' };

export const ShiftRosterView: React.FC<{ employees: Employee[]; canApprove: boolean }> = ({ employees, canApprove }) => {
  const [tab, setTab] = useState('Shift roster');
  const n = (i: number) => employees[i % employees.length]?.fullName ?? '—';
  const [ot, setOt] = useState([
    { id: 'o1', emp: n(2), date: '2026-10-21', hours: 4, rate: '1.5x', reason: 'Month-end stock take', status: 'pending' },
    { id: 'o2', emp: n(3), date: '2026-10-25', hours: 8, rate: '2.0x', reason: 'Sunday dispatch', status: 'pending' },
    { id: 'o3', emp: n(0), date: '2026-10-17', hours: 3, rate: '1.5x', reason: 'Client audit', status: 'approved' },
  ]);
  const [ts, setTs] = useState([
    { id: 't1', emp: n(3), basis: 'Daily', week: '14–20 Oct', qty: '6 days', status: 'pending' },
    { id: 't2', emp: n(4), basis: 'Hourly', week: '14–20 Oct', qty: '42.5 hrs', status: 'pending' },
    { id: 't3', emp: n(2), basis: 'Casual', week: '14–20 Oct', qty: '5 days', status: 'approved' },
  ]);
  const act = <T extends { id: string; status: string }>(set: React.Dispatch<React.SetStateAction<T[]>>, id: string, status: string) => set((p) => p.map((x) => (x.id === id ? { ...x, status } : x)));
  const tone = (s: string) => (s === 'approved' ? 'green' : s === 'rejected' ? 'red' : 'gold') as 'green' | 'red' | 'gold';

  return (
    <div>
      <PageTitle title="Shifts, Overtime & Timesheets" subtitle="Line-manager approvals must be completed before the 24 Oct payroll cut-off. Unapproved items stay out of pay." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Scheduled shifts" value={PATTERNS.flat().filter((c) => c !== 'O').length} hint="This week" />
        <Stat label="Attendance flags" value={Object.keys(FLAGS).length} hint="Late / absent / early exit" />
        <Stat label="Overtime pending" value={ot.filter((o) => o.status === 'pending').length} />
        <Stat label="Timesheets pending" value={ts.filter((t) => t.status === 'pending').length} />
      </div>
      <Tabs tabs={['Shift roster', 'Overtime requests', 'Timesheets']} active={tab} onChange={setTab} />

      {tab === 'Shift roster' && (
        <Card title="Week of 20 – 26 October 2026" subtitle={Object.entries(SHIFTS).map(([k, v]) => `${k} = ${v}`).join('  ·  ')}>
          <Table head={['Employee', ...DAYS]}>
            {employees.slice(0, 5).map((e, r) => (
              <tr key={e.id}>
                <Td className="font-semibold">{e.fullName}</Td>
                {PATTERNS[r]!.map((c, d) => (
                  <Td key={d}>
                    <div className={`inline-block w-8 text-center py-1 rounded-md font-bold ${c === 'O' ? 'bg-[#DDD6CE]/40 text-[#999]' : c === 'N' ? 'bg-[#3B1E54] text-[#FFFDF8]' : 'bg-[#C6B8D9]/40 text-[#3B1E54]'}`}>{c}</div>
                    {FLAGS[`${r}-${d}`] && <div className="text-[10px] text-rose-600 font-bold mt-1">{FLAGS[`${r}-${d}`]}</div>}
                  </Td>
                ))}
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {tab === 'Overtime requests' && (
        <Card title="Overtime requests" subtitle="Weekday 1.5x, rest day / public holiday 2.0x (configurable in Settings)">
          <Table head={['Employee', 'Date', 'Hours', 'Multiplier', 'Reason', 'Status', '']}>
            {ot.map((o) => (
              <tr key={o.id}>
                <Td className="font-semibold">{o.emp}</Td><Td mono>{o.date}</Td><Td mono>{o.hours}</Td><Td>{o.rate}</Td><Td>{o.reason}</Td>
                <Td><Badge tone={tone(o.status)}>{o.status}</Badge></Td>
                <Td>{o.status === 'pending' && canApprove && (<div className="flex gap-1"><Btn onClick={() => act(setOt, o.id, 'approved')}>Approve</Btn><Btn variant="ghost" onClick={() => act(setOt, o.id, 'rejected')}>Reject</Btn></div>)}</Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {tab === 'Timesheets' && (
        <Card title="Timesheets for daily, hourly and casual workers">
          <Table head={['Worker', 'Pay basis', 'Week', 'Payable', 'Status', '']}>
            {ts.map((t) => (
              <tr key={t.id}>
                <Td className="font-semibold">{t.emp}</Td><Td>{t.basis}</Td><Td>{t.week}</Td><Td mono>{t.qty}</Td>
                <Td><Badge tone={tone(t.status)}>{t.status}</Badge></Td>
                <Td>{t.status === 'pending' && canApprove && (<div className="flex gap-1"><Btn onClick={() => act(setTs, t.id, 'approved')}>Approve</Btn><Btn variant="ghost" onClick={() => act(setTs, t.id, 'rejected')}>Return</Btn></div>)}</Td>
              </tr>
            ))}
          </Table>
          {!canApprove && <p className="text-xs text-[#888] mt-3">Switch to a Line Manager or Payroll role to approve.</p>}
        </Card>
      )}
    </div>
  );
};
