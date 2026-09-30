import React from 'react';
import { PayrollEmployeeResult } from '../types/hr';
import { formatKES } from '../utils/kenyaPayrollCalculator';
import { 
  X, 
  Calculator, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  FileText, 
  CheckCircle2 
} from 'lucide-react';

interface CalculationTraceDrawerProps {
  result: PayrollEmployeeResult | null;
  onClose: () => void;
  onOpenPayslip: (employeeId: string) => void;
}

export const CalculationTraceDrawer: React.FC<CalculationTraceDrawerProps> = ({
  result,
  onClose,
  onOpenPayslip,
}) => {
  if (!result) return null;

  const stat = result.statutory;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#FFFDF8] h-full shadow-2xl overflow-y-auto flex flex-col border-l border-[#DDD6CE] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#DDD6CE] bg-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B1E54] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Calculator className="w-5 h-5 text-[#C9A227]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base text-[#2B2B2B]">{result.employeeName}</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#C6B8D9]/25 text-[#3B1E54] font-bold">
                  {result.employeeCode}
                </span>
              </div>
              <p className="text-xs text-[#666]">
                {result.department} · {result.population.replace('_', ' ').toUpperCase()} · Ref: {result.payslipRef}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPayslip(result.employeeId)}
              className="px-3 py-1.5 text-xs font-bold text-[#3B1E54] bg-[#C6B8D9]/25 hover:bg-[#C6B8D9]/40 border border-[#C6B8D9]/40 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Payslip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#8C827A] hover:text-[#2B2B2B] rounded-lg hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-xs text-[#2B2B2B]">
          {/* Exceptions & Alerts */}
          {result.hasExceptions && result.exceptionNotes && (
            <div className="p-4 bg-white border border-[#C9A227] rounded-2xl space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-[#3B1E54]">
                <AlertCircle className="w-4 h-4 text-[#C9A227]" />
                <span>Audit & Validation Flags Detected</span>
              </div>
              {result.exceptionNotes.map((note, idx) => (
                <p key={idx} className="text-[#666] text-[11px] pl-5">• {note}</p>
              ))}
            </div>
          )}

          {/* Section 1: Time, Attendance & Proration Inputs */}
          <div className="bg-white rounded-2xl p-4 border border-[#DDD6CE] space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#DDD6CE]/60 pb-2">
              <span className="font-bold text-[#3B1E54] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C9A227]" />
                1. Time & Attendance Snapshot (Payroll Inputs)
              </span>
              <span className="text-[11px] text-[#8C827A]">Biometric & Leave Adapter</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[#8C827A] block text-[10px]">Payable Time</span>
                <span className="font-bold text-[#2B2B2B] font-mono">
                  {result.payableDaysOrHours} {result.payBasis === 'hourly' ? 'Hours' : 'Days'}
                </span>
              </div>
              <div>
                <span className="text-[#8C827A] block text-[10px]">Overtime Hours</span>
                <span className="font-bold text-[#3B1E54] font-mono">
                  {result.overtimeHours > 0 ? `${result.overtimeHours} hrs (1.5x)` : '0 hrs'}
                </span>
              </div>
              <div>
                <span className="text-[#8C827A] block text-[10px]">Unpaid Leave</span>
                <span className={`font-bold font-mono ${result.unpaidLeaveDays > 0 ? 'text-rose-700' : 'text-[#2B2B2B]'}`}>
                  {result.unpaidLeaveDays} days
                </span>
              </div>
              <div>
                <span className="text-[#8C827A] block text-[10px]">Proration Divisor</span>
                <span className="font-bold text-[#2B2B2B]">22.0 Working Days</span>
              </div>
            </div>
          </div>

          {/* Section 2: Earnings & Gross Pay */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#3B1E54] uppercase tracking-wider text-[11px]">
              2. Earnings & Allowances Breakdown
            </h3>
            <div className="bg-white border border-[#DDD6CE] rounded-2xl divide-y divide-[#DDD6CE]/40 overflow-hidden shadow-2xs">
              <div className="flex items-center justify-between p-3 bg-[#F5F2F9] font-semibold text-[#2B2B2B]">
                <span>Base Salary / Calculated Base</span>
                <span className="font-mono text-[#3B1E54] font-bold">{formatKES(result.basePay)}</span>
              </div>
              {result.housingAllowance > 0 && (
                <div className="flex items-center justify-between p-2.5">
                  <span className="text-[#666]">Housing Allowance</span>
                  <span className="font-mono text-[#2B2B2B]">{formatKES(result.housingAllowance)}</span>
                </div>
              )}
              {result.commuterAllowance > 0 && (
                <div className="flex items-center justify-between p-2.5">
                  <span className="text-[#666]">Commuter Allowance</span>
                  <span className="font-mono text-[#2B2B2B]">{formatKES(result.commuterAllowance)}</span>
                </div>
              )}
              {result.airtimeAllowance > 0 && (
                <div className="flex items-center justify-between p-2.5">
                  <span className="text-[#666]">Airtime & Data Allowance</span>
                  <span className="font-mono text-[#2B2B2B]">{formatKES(result.airtimeAllowance)}</span>
                </div>
              )}
              {result.overtimePay > 0 && (
                <div className="flex items-center justify-between p-2.5 text-[#3B1E54] bg-[#C6B8D9]/15">
                  <span>Overtime Pay ({result.overtimeHours} hrs @ 1.5x)</span>
                  <span className="font-mono font-bold">+{formatKES(result.overtimePay)}</span>
                </div>
              )}
              {result.bonus > 0 && (
                <div className="flex items-center justify-between p-2.5 text-emerald-700 bg-emerald-50">
                  <span>Performance Incentive / Bonus</span>
                  <span className="font-mono font-bold">+{formatKES(result.bonus)}</span>
                </div>
              )}
              {result.unpaidLeaveDeduction > 0 && (
                <div className="flex items-center justify-between p-2.5 text-rose-700 bg-rose-50">
                  <span>Unpaid Leave Proration ({result.unpaidLeaveDays} days)</span>
                  <span className="font-mono font-bold">-{formatKES(result.unpaidLeaveDeduction)}</span>
                </div>
              )}
              <div className="flex items-center justify-between p-3 bg-[#F5F2F9] font-extrabold text-[#2B2B2B] text-sm">
                <span>Calculated Gross Pay</span>
                <span className="font-mono text-[#3B1E54]">{formatKES(result.grossPay)}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Kenya Statutory Engine Calculation Trace */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#3B1E54] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                3. Kenya Statutory Rules Engine (Finance Act 2026)
              </h3>
              <span className="text-[10px] text-[#8C827A] font-mono">Pack: KE-2026-v2</span>
            </div>

            <div className="bg-white border border-[#DDD6CE] rounded-2xl divide-y divide-[#DDD6CE]/40 overflow-hidden shadow-2xs">
              {/* NSSF */}
              <div className="p-3">
                <div className="flex items-center justify-between font-semibold text-[#2B2B2B]">
                  <span>NSSF Contribution (Kenya NSSF Act 2013)</span>
                  <span className="font-mono text-[#3B1E54] font-bold">{formatKES(stat.totalNssfEmployee)}</span>
                </div>
                <div className="mt-1 text-[11px] text-[#666] space-y-0.5">
                  <p>• Tier I (6% up to KES 8,000): {formatKES(stat.nssfTier1)} (Employer Match: {formatKES(stat.nssfTier1)})</p>
                  <p>• Tier II (6% of KES 8,001 to 72,000): {formatKES(stat.nssfTier2)} (Employer Match: {formatKES(stat.nssfTier2)})</p>
                </div>
              </div>

              {/* SHIF */}
              <div className="p-3">
                <div className="flex items-center justify-between font-semibold text-[#2B2B2B]">
                  <span>Social Health Insurance Fund (SHIF 2.75%)</span>
                  <span className="font-mono text-[#3B1E54] font-bold">{formatKES(stat.shifEmployee)}</span>
                </div>
                <p className="text-[11px] text-[#666] mt-0.5">
                  • 2.75% of Gross Earnings ({formatKES(result.grossPay)} × 0.0275) · Floor KES 300
                </p>
              </div>

              {/* AHL */}
              <div className="p-3">
                <div className="flex items-center justify-between font-semibold text-[#2B2B2B]">
                  <span>Affordable Housing Levy (AHL 1.5%)</span>
                  <span className="font-mono text-[#3B1E54] font-bold">{formatKES(stat.ahlEmployee)}</span>
                </div>
                <p className="text-[11px] text-[#666] mt-0.5">
                  • Employee: 1.5% ({formatKES(stat.ahlEmployee)}) · Employer Match: 1.5% ({formatKES(stat.ahlEmployer)})
                </p>
              </div>

              {/* PAYE */}
              <div className="p-3">
                <div className="flex items-center justify-between font-semibold text-[#2B2B2B]">
                  <span>PAYE Tax Calculation</span>
                  <span className="font-mono text-rose-700 font-bold">{formatKES(stat.netPaye)}</span>
                </div>
                <div className="mt-1.5 p-2.5 rounded-xl bg-[#FFFDF8] border border-[#DDD6CE] text-[11px] space-y-1 font-mono">
                  <div className="flex justify-between text-[#666]">
                    <span>Gross Earnings:</span>
                    <span>{formatKES(result.grossPay)}</span>
                  </div>
                  <div className="flex justify-between text-[#666]">
                    <span>Less Allowable NSSF:</span>
                    <span>-{formatKES(stat.totalNssfEmployee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#2B2B2B] border-t border-[#DDD6CE] pt-1">
                    <span>Taxable Pay Base:</span>
                    <span>{formatKES(stat.taxablePay)}</span>
                  </div>
                  <div className="flex justify-between text-[#666]">
                    <span>Gross Tax (Bands 10%-32.5%):</span>
                    <span>{formatKES(stat.grossTax)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Less Personal Relief:</span>
                    <span>-{formatKES(stat.personalRelief)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#2B2B2B] border-t border-[#DDD6CE] pt-1">
                    <span>Net PAYE:</span>
                    <span className="text-rose-700">{formatKES(stat.netPaye)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F5F2F9] font-bold text-[#2B2B2B]">
                <span>Total Statutory Deductions (Employee)</span>
                <span className="font-mono text-rose-700 font-extrabold">{formatKES(stat.totalStatutoryEmployee)}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Net Pay Take-Home */}
          <div className="p-5 rounded-2xl bg-[#3B1E54] text-[#FFFDF8] flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[11px] text-[#C6B8D9] uppercase tracking-wider">Net Employee Take-Home Pay</p>
              <p className="text-3xl font-extrabold font-mono text-[#C9A227] tracking-tight mt-1">
                {formatKES(result.netPay)}
              </p>
              <p className="text-[10px] text-[#C6B8D9] mt-1">
                Disbursement via {result.population === 'daily_paid' ? 'Safaricom M-Pesa' : 'Bank Transfer'}
              </p>
            </div>
            <div className="text-right border-l border-[#C6B8D9]/25 pl-4">
              <p className="text-[10px] text-[#C6B8D9]">Total Employer Cost</p>
              <p className="text-base font-bold font-mono text-white">
                {formatKES(result.totalEmployerCost)}
              </p>
              <p className="text-[10px] text-[#C6B8D9] mt-0.5">
                Match: {formatKES(stat.totalStatutoryEmployer)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#DDD6CE] bg-white flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#666]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Calculation snapshot recorded in audit trail</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#3B1E54] bg-[#C6B8D9]/25 hover:bg-[#C6B8D9]/40 rounded-xl transition-colors"
          >
            Close Trace
          </button>
        </div>
      </div>
    </div>
  );
};
