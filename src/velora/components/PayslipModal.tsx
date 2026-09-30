import React from 'react';
import { PayrollEmployeeResult, Employee } from '../types/hr';
import { formatKES } from '../utils/kenyaPayrollCalculator';
import { VeloraLogo } from './VeloraLogo';
import { 
  X, 
  Printer, 
  Download, 
  QrCode 
} from 'lucide-react';

interface PayslipModalProps {
  result: PayrollEmployeeResult | null;
  employee: Employee | undefined;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  result,
  employee,
  onClose,
}) => {
  if (!result || !employee) return null;

  const stat = result.statutory;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const payslipText = `
======================================================
                    VELORAHR
                 PAYSLIP ADVICE
======================================================
Employee: ${result.employeeName} (${result.employeeCode})
Period: October 2026
Department: ${result.department}
National ID: ${employee.nationalId}
KRA PIN: ${employee.kraPin || 'N/A'}
NSSF No: ${employee.nssfNumber}
SHIF ID: ${employee.shifNumber}
Bank: ${employee.bankName} - ${employee.bankAccountNumber}
------------------------------------------------------
EARNINGS:
  Basic Salary / Base Pay:        ${formatKES(result.basePay)}
  Housing Allowance:             ${formatKES(result.housingAllowance)}
  Commuter Allowance:            ${formatKES(result.commuterAllowance)}
  Airtime Allowance:             ${formatKES(result.airtimeAllowance)}
  Overtime Earnings:             ${formatKES(result.overtimePay)}
  Performance Bonus:             ${formatKES(result.bonus)}
  Unpaid Leave Deduction:       -${formatKES(result.unpaidLeaveDeduction)}
TOTAL GROSS PAY:                 ${formatKES(result.grossPay)}
------------------------------------------------------
STATUTORY DEDUCTIONS:
  PAYE Tax:                      ${formatKES(stat.netPaye)}
  NSSF (Tier I & Tier II):       ${formatKES(stat.totalNssfEmployee)}
  SHIF (2.75%):                  ${formatKES(stat.shifEmployee)}
  Affordable Housing Levy (1.5%):${formatKES(stat.ahlEmployee)}
TOTAL STATUTORY:                 ${formatKES(stat.totalStatutoryEmployee)}
------------------------------------------------------
NON-STATUTORY DEDUCTIONS:
  SACCO Contribution:            ${formatKES(result.saccoDeduction)}
  Staff Loan Recovery:           ${formatKES(result.loanDeduction)}
  Voluntary Pension:             ${formatKES(result.pensionVoluntary)}
------------------------------------------------------
TAKE-HOME NET PAY:               ${formatKES(result.netPay)}
EMPLOYER STATUTORY MATCH:        ${formatKES(stat.totalStatutoryEmployer)}
======================================================
Payslip Ref: ${result.payslipRef}
    `.trim();

    const blob = new Blob([payslipText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Payslip_${result.employeeCode}_Oct2026.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-[#FFFDF8] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#DDD6CE] my-8 space-y-6 animate-in zoom-in-95 duration-150 print:p-0 print:shadow-none print:border-none">
        {/* Modal Top Bar (Hidden in print) */}
        <div className="flex items-center justify-between border-b border-[#DDD6CE] pb-4 print:hidden">
          <div className="flex items-center gap-2 text-xs text-[#666]">
            <span className="font-bold text-[#3B1E54]">Payslip Advice</span>
            <span>·</span>
            <span className="font-mono text-[11px]">{result.payslipRef}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-[#2B2B2B] hover:bg-white border border-[#DDD6CE] rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#3B1E54] hover:bg-[#4E286F] rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Download Advice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#8C827A] hover:text-[#2B2B2B] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div className="space-y-6 text-xs text-[#2B2B2B]">
          {/* Company & Period Banner */}
          <div className="flex items-start justify-between border-b-2 border-[#3B1E54] pb-4">
            <div className="flex items-center gap-3">
              <VeloraLogo theme="light" size="lg" showIconOnly />
              <div>
                <div className="flex items-center gap-2">
                   <h1 className="font-extrabold text-lg text-[#3B1E54] leading-tight">VeloraHR</h1>
                </div>
                 <p className="text-[11px] text-[#666]">Sample payslip · Kenya</p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-extrabold text-sm text-[#3B1E54] block font-mono">PAYSLIP ADVICE</span>
              <span className="text-xs font-bold text-[#3B1E54] bg-[#C9A227]/20 px-2 py-0.5 rounded-lg border border-[#C9A227]/30 inline-block mt-1">
                October 2026
              </span>
              <p className="text-[10px] text-[#8C827A] mt-1">Pay Date: 28-Oct-2026</p>
            </div>
          </div>

          {/* Employee & Bank Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 p-4 bg-white rounded-2xl border border-[#DDD6CE] text-xs shadow-2xs">
            <div>
              <span className="text-[10px] text-[#8C827A] block uppercase">Employee Name</span>
              <strong className="text-[#2B2B2B]">{result.employeeName}</strong>
            </div>
            <div>
              <span className="text-[10px] text-[#8C827A] block uppercase">Employee Code</span>
              <strong className="font-mono text-[#3B1E54] font-bold">{result.employeeCode}</strong>
            </div>
            <div>
              <span className="text-[10px] text-[#8C827A] block uppercase">Job Title</span>
              <span className="text-[#2B2B2B]">{employee.jobTitle}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8C827A] block uppercase">Department</span>
              <span className="text-[#2B2B2B]">{result.department}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8C827A] block uppercase">KRA PIN</span>
              <span className="font-mono text-[#2B2B2B]">{employee.kraPin || 'Pending Input'}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8C827A] block uppercase">NSSF / SHIF Number</span>
              <span className="font-mono text-[#2B2B2B] text-[11px]">{employee.nssfNumber} · {employee.shifNumber}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] text-[#8C827A] block uppercase">Disbursement Channel</span>
              <span className="font-mono text-[#3B1E54] font-medium">
                {employee.paymentMethod === 'mpesa' ? `Safaricom M-Pesa (${employee.mpesaNumber})` : `${employee.bankName} - Acc: ${employee.bankAccountNumber}`}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#8C827A] block uppercase">Leave Balance</span>
              <span className="font-mono text-[#3B1E54] font-bold">{employee.leaveBalanceDays} Days</span>
            </div>
          </div>

          {/* Dual Column: Earnings vs Deductions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Earnings Column */}
            <div className="bg-white border border-[#DDD6CE] rounded-2xl overflow-hidden shadow-2xs">
              <div className="bg-[#F5F2F9] p-2.5 font-bold text-[#3B1E54] text-xs flex justify-between border-b border-[#DDD6CE]">
                <span>EARNINGS ITEM</span>
                <span>AMOUNT (KES)</span>
              </div>
              <div className="divide-y divide-[#DDD6CE]/30 p-1">
                <div className="flex justify-between p-1.5">
                  <span>Basic Salary</span>
                  <span className="font-mono font-medium">{formatKES(result.basePay)}</span>
                </div>
                {result.housingAllowance > 0 && (
                  <div className="flex justify-between p-1.5">
                    <span>Housing Allowance</span>
                    <span className="font-mono">{formatKES(result.housingAllowance)}</span>
                  </div>
                )}
                {result.commuterAllowance > 0 && (
                  <div className="flex justify-between p-1.5">
                    <span>Commuter Allowance</span>
                    <span className="font-mono">{formatKES(result.commuterAllowance)}</span>
                  </div>
                )}
                {result.airtimeAllowance > 0 && (
                  <div className="flex justify-between p-1.5">
                    <span>Airtime Allowance</span>
                    <span className="font-mono">{formatKES(result.airtimeAllowance)}</span>
                  </div>
                )}
                {result.overtimePay > 0 && (
                  <div className="flex justify-between p-1.5 text-[#3B1E54]">
                    <span>Overtime ({result.overtimeHours} hrs)</span>
                    <span className="font-mono font-medium">+{formatKES(result.overtimePay)}</span>
                  </div>
                )}
                {result.bonus > 0 && (
                  <div className="flex justify-between p-1.5 text-emerald-700">
                    <span>Performance Incentive</span>
                    <span className="font-mono font-medium">+{formatKES(result.bonus)}</span>
                  </div>
                )}
                {result.unpaidLeaveDeduction > 0 && (
                  <div className="flex justify-between p-1.5 text-rose-700">
                    <span>Unpaid Leave ({result.unpaidLeaveDays} days)</span>
                    <span className="font-mono font-medium">-{formatKES(result.unpaidLeaveDeduction)}</span>
                  </div>
                )}
              </div>
              <div className="bg-[#F5F2F9] p-2.5 font-bold text-[#2B2B2B] border-t border-[#DDD6CE] flex justify-between text-xs">
                <span>TOTAL GROSS EARNINGS</span>
                <span className="font-mono text-[#3B1E54]">{formatKES(result.grossPay)}</span>
              </div>
            </div>

            {/* Deductions Column */}
            <div className="bg-white border border-[#DDD6CE] rounded-2xl overflow-hidden shadow-2xs">
              <div className="bg-[#F5F2F9] p-2.5 font-bold text-[#3B1E54] text-xs flex justify-between border-b border-[#DDD6CE]">
                <span>DEDUCTIONS ITEM</span>
                <span>AMOUNT (KES)</span>
              </div>
              <div className="divide-y divide-[#DDD6CE]/30 p-1">
                <div className="flex justify-between p-1.5 text-rose-700">
                  <span>PAYE Tax</span>
                  <span className="font-mono font-medium">{formatKES(stat.netPaye)}</span>
                </div>
                <div className="flex justify-between p-1.5">
                  <span>NSSF Employee (Tier I & II)</span>
                  <span className="font-mono">{formatKES(stat.totalNssfEmployee)}</span>
                </div>
                <div className="flex justify-between p-1.5">
                  <span>SHIF (Health 2.75%)</span>
                  <span className="font-mono">{formatKES(stat.shifEmployee)}</span>
                </div>
                <div className="flex justify-between p-1.5">
                  <span>Affordable Housing Levy (1.5%)</span>
                  <span className="font-mono">{formatKES(stat.ahlEmployee)}</span>
                </div>
                {result.saccoDeduction > 0 && (
                  <div className="flex justify-between p-1.5">
                    <span>SACCO Savings</span>
                    <span className="font-mono">{formatKES(result.saccoDeduction)}</span>
                  </div>
                )}
                {result.loanDeduction > 0 && (
                  <div className="flex justify-between p-1.5">
                    <span>Staff Loan Recovery</span>
                    <span className="font-mono">{formatKES(result.loanDeduction)}</span>
                  </div>
                )}
                {result.pensionVoluntary > 0 && (
                  <div className="flex justify-between p-1.5">
                    <span>Voluntary Pension</span>
                    <span className="font-mono">{formatKES(result.pensionVoluntary)}</span>
                  </div>
                )}
              </div>
              <div className="bg-[#F5F2F9] p-2.5 font-bold text-[#2B2B2B] border-t border-[#DDD6CE] flex justify-between text-xs">
                <span>TOTAL DEDUCTIONS</span>
                <span className="font-mono text-rose-700">{formatKES(result.totalDeductions)}</span>
              </div>
            </div>
          </div>

          {/* Net Settlement Banner in Dark Plum (#3B1E54) with Champagne Gold (#C9A227) */}
          <div className="p-5 bg-[#3B1E54] rounded-2xl text-[#FFFDF8] flex items-center justify-between shadow-lg">
            <div>
              <span className="text-[10px] text-[#C6B8D9] uppercase tracking-wider block font-bold">NET TAKE-HOME PAY</span>
              <span className="text-3xl font-extrabold font-mono text-[#C9A227]">{formatKES(result.netPay)}</span>
            </div>
            <div className="text-right text-xs">
              <span className="text-[#C6B8D9] block text-[10px]">Employer Match</span>
              <span className="font-mono font-medium text-white">
                NSSF: {formatKES(stat.totalNssfEmployer)} · AHL: {formatKES(stat.ahlEmployer)}
              </span>
            </div>
          </div>

          {/* Footer & QR Stamp */}
          <div className="pt-4 border-t border-[#DDD6CE] flex items-center justify-between text-[10px] text-[#8C827A]">
            <div>
              <p>Generated by Velora HR Engine · Ref: {result.payslipRef}</p>
               <p className="mt-0.5">Sample payroll advice for presentation purposes.</p>
            </div>
            <div className="flex items-center gap-1.5 text-[#3B1E54] font-mono">
              <QrCode className="w-6 h-6 text-[#3B1E54]" />
               <span className="font-bold">REFERENCE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
