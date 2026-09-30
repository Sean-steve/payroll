import React from 'react';
import { CurrentUser, PayrollEmployeeResult, Employee } from '../types/hr';
import { formatKES } from '../utils/kenyaPayrollCalculator';
import { 
  FileText, 
  Eye, 
  CheckCircle2 
} from 'lucide-react';

interface EmployeePortalViewProps {
  currentUser: CurrentUser;
  employeeResult: PayrollEmployeeResult | undefined;
  employeeRecord: Employee | undefined;
  onOpenPayslip: (employeeId: string) => void;
}

export const EmployeePortalView: React.FC<EmployeePortalViewProps> = ({
  currentUser,
  employeeResult,
  employeeRecord,
  onOpenPayslip,
}) => {
  const payslipHistory = [
    {
      period: 'October 2026',
      date: '28-Oct-2026',
      gross: employeeResult?.grossPay || 186000,
      net: employeeResult?.netPay || 135400,
      deductions: employeeResult?.totalDeductions || 50600,
      status: 'Approved & Published',
      ref: employeeResult?.payslipRef || 'VEL-2026-10-00104',
      isCurrent: true,
    },
    {
      period: 'September 2026',
      date: '28-Sep-2026',
      gross: 181500,
      net: 132100,
      deductions: 49400,
      status: 'Archived',
      ref: 'VEL-2026-09-00104',
      isCurrent: false,
    },
    {
      period: 'August 2026',
      date: '28-Aug-2026',
      gross: 181500,
      net: 132100,
      deductions: 49400,
      status: 'Archived',
      ref: 'VEL-2026-08-00104',
      isCurrent: false,
    },
  ];

  const ytdGross = payslipHistory.reduce((a, b) => a + b.gross, 0);
  const ytdNet = payslipHistory.reduce((a, b) => a + b.net, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#3B1E54]"
          />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-xl font-extrabold text-[#2B2B2B]">{currentUser.name}</h1>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-[#C6B8D9]/25 text-[#3B1E54]">
                {employeeRecord?.employeeCode || 'EMP-104'}
              </span>
            </div>
            <p className="text-xs text-[#666]">
              {employeeRecord?.jobTitle || 'Senior Software Engineer'} · {employeeRecord?.department || 'Engineering'}
            </p>
            <p className="text-[11px] text-[#8C827A] mt-0.5">
              Disbursement: {employeeRecord?.paymentMethod === 'mpesa' ? 'Safaricom M-Pesa' : `${employeeRecord?.bankName} (Ending ...${employeeRecord?.bankAccountNumber.slice(-4)})`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {employeeResult && (
            <button
              onClick={() => onOpenPayslip(employeeResult.employeeId)}
              className="px-4 py-2 text-xs font-bold text-white bg-[#3B1E54] hover:bg-[#4E286F] rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4 text-[#C9A227]" />
              <span>View Latest October Payslip</span>
            </button>
          )}
        </div>
      </div>

      {/* YTD & Leave Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white rounded-2xl p-4 border border-[#DDD6CE] shadow-2xs">
          <span className="text-[#666] block mb-1 text-[11px]">Latest Month Net Pay (Oct 2026)</span>
          <p className="text-2xl font-extrabold font-mono text-[#3B1E54]">
            {formatKES(employeeResult?.netPay || 135400)}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 mt-2 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ready for transfer on 28-Oct-2026</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#DDD6CE] shadow-2xs">
          <span className="text-[#666] block mb-1 text-[11px]">Year-to-Date Gross Earnings</span>
          <p className="text-2xl font-extrabold font-mono text-[#2B2B2B]">
            {formatKES(ytdGross)}
          </p>
          <p className="text-[11px] text-[#666] mt-2">Total Net Received: {formatKES(ytdNet)}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#DDD6CE] shadow-2xs">
          <span className="text-[#666] block mb-1 text-[11px]">Annual Leave Balance Remaining</span>
          <p className="text-2xl font-extrabold font-mono text-[#3B1E54]">
            {employeeRecord?.leaveBalanceDays || 14} Days
          </p>
          <p className="text-[11px] text-[#666] mt-2">Statutory 21 days annual entitlement</p>
        </div>
      </div>

      {/* Payslip Archive Table */}
      <div className="bg-white rounded-2xl border border-[#DDD6CE] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#DDD6CE] flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-[#2B2B2B]">Approved Payslip History & Self-Service</h2>
            <p className="text-xs text-[#666]">Only your own approved payslips are accessible under role permissions.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F2F9] border-b border-[#DDD6CE] text-[#3B1E54] font-bold text-[11px]">
                <th className="py-3 px-3.5">Payroll Period</th>
                <th className="py-3 px-3">Payment Date</th>
                <th className="py-3 px-3 text-right">Gross Earnings</th>
                <th className="py-3 px-3 text-right">Deductions</th>
                <th className="py-3 px-3 text-right">Take-Home Pay</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right font-mono">Reference</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD6CE]/40">
              {payslipHistory.map((slip, idx) => (
                <tr key={idx} className="hover:bg-[#FFFDF8]">
                  <td className="py-3 px-3.5 font-bold text-[#2B2B2B]">
                    {slip.period}
                    {slip.isCurrent && (
                      <span className="ml-2 text-[10px] bg-[#C9A227]/25 text-[#3B1E54] px-1.5 py-0.5 rounded font-bold">
                        Current
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-[#666] font-mono">{slip.date}</td>
                  <td className="py-3 px-3 text-right font-mono text-[#2B2B2B]">{formatKES(slip.gross)}</td>
                  <td className="py-3 px-3 text-right font-mono text-rose-700">-{formatKES(slip.deductions)}</td>
                  <td className="py-3 px-3 text-right font-mono font-extrabold text-[#3B1E54] text-sm">{formatKES(slip.net)}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      {slip.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[#8C827A] text-[11px]">{slip.ref}</td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onOpenPayslip(employeeRecord?.id || 'emp_amina')}
                      className="px-2.5 py-1 text-xs font-bold text-[#3B1E54] hover:bg-[#C6B8D9]/25 rounded-lg flex items-center gap-1 mx-auto transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
