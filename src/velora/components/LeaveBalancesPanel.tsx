import React from 'react';
import { Employee } from '../types/hr';
import { Badge, Card, Table, Td } from './ui';

export const KENYA_HOLIDAYS_2026 = [
  ['2026-01-01', "New Year's Day"], ['2026-03-20', 'Idd-ul-Fitr'], ['2026-04-03', 'Good Friday'], ['2026-04-06', 'Easter Monday'],
  ['2026-05-01', 'Labour Day'], ['2026-06-01', 'Madaraka Day'], ['2026-10-10', 'Mazingira Day'], ['2026-10-20', 'Mashujaa Day'],
  ['2026-12-12', 'Jamhuri Day'], ['2026-12-25', 'Christmas Day'], ['2026-12-26', 'Boxing Day'],
];

export const LeaveBalancesPanel: React.FC<{ employees: Employee[] }> = ({ employees }) => (
  <div className="grid lg:grid-cols-[1fr_320px] gap-5 mt-6">
    <Card title="Leave balances & accruals" subtitle="Annual leave accrues 1.75 days/month (21 days/year). Up to 5 days carry forward, expiring 31 March.">
      <Table head={['Employee', 'Carried fwd', 'Accrued YTD', 'Taken', 'Balance', 'Sick left', 'Encashable on exit']}>
        {employees.map((e, i) => {
          const carried = [3, 5, 0, 2, 4][i % 5]!;
          const accrued = 17.5;
          const taken = Math.max(0, carried + accrued - e.leaveBalanceDays);
          return (
            <tr key={e.id}>
              <Td className="font-semibold">{e.fullName}</Td>
              <Td mono>{carried}</Td><Td mono>{accrued}</Td><Td mono>{taken.toFixed(1)}</Td>
              <Td mono className="font-bold text-[#3B1E54]">{e.leaveBalanceDays}</Td>
              <Td mono>{[14, 11, 14, 9, 13][i % 5]}</Td>
              <Td>{e.status === 'notice_period' ? <Badge tone="gold">{e.leaveBalanceDays} days → Final Dues</Badge> : <span className="text-[#999]">—</span>}</Td>
            </tr>
          );
        })}
      </Table>
      <p className="text-[11px] text-[#666] mt-3">Half-day and partial leave are supported; approved unpaid leave prorates pay, paid leave does not reduce pay.</p>
    </Card>
    <Card title="Kenya public holidays 2026" subtitle="Excluded from leave days; worked holidays pay 2.0x">
      <ul className="text-xs space-y-1.5">
        {KENYA_HOLIDAYS_2026.map(([d, n]) => (<li key={d} className="flex justify-between"><span>{n}</span><span className="font-mono text-[#666]">{d}</span></li>))}
      </ul>
    </Card>
  </div>
);
