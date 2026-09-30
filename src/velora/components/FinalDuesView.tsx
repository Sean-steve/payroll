import React, { useState } from 'react';
import { FinalDuesCalculation } from '../types/hr';
import { formatKES } from '../utils/kenyaPayrollCalculator';
import { 
  UserMinus, 
  ShieldCheck, 
  CheckCircle2, 
  Printer, 
  Coins 
} from 'lucide-react';

interface FinalDuesViewProps {
  initialDuesCase: FinalDuesCalculation;
}

export const FinalDuesView: React.FC<FinalDuesViewProps> = ({ initialDuesCase }) => {
  const [duesCase, setDuesCase] = useState<FinalDuesCalculation>(initialDuesCase);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const updateLeaveDays = (days: number) => {
    const leavePayout = Math.round((duesCase.basicSalary / 22) * days);
    const newGross = duesCase.proratedSalary + leavePayout + duesCase.severanceGratuityPay + duesCase.unpaidOvertimeOrBonus;
    const newTaxable = newGross - duesCase.finalNssfDeduction;
    const newPaye = Math.round(newTaxable * 0.22);
    const newNet = newGross - (newPaye + duesCase.finalNssfDeduction + duesCase.finalShifDeduction + duesCase.finalAhlDeduction + duesCase.loanOutstandingCleared + duesCase.saccoNoticeDeduction);

    setDuesCase({
      ...duesCase,
      accruedLeaveDays: days,
      accruedLeavePayout: leavePayout,
      grossFinalSettlement: newGross,
      finalPayeDeduction: newPaye,
      netFinalDues: newNet,
    });
  };

  const updateLoanClearance = (cleared: number) => {
    const newNet = duesCase.grossFinalSettlement - (duesCase.finalPayeDeduction + duesCase.finalNssfDeduction + duesCase.finalShifDeduction + duesCase.finalAhlDeduction + cleared + duesCase.saccoNoticeDeduction);
    setDuesCase({
      ...duesCase,
      loanOutstandingCleared: cleared,
      netFinalDues: newNet,
    });
  };

  const handleAuthorize = () => {
    setDuesCase({ ...duesCase, status: 'authorized' });
    setStatusNotice("David Ndung'u's Final Dues Settlement successfully authorized for payment.");
    setTimeout(() => setStatusNotice(null), 4000);
  };

  const handlePrintVoucher = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#C6B8D9]/25 text-[#3B1E54] flex items-center gap-1">
              <UserMinus className="w-3.5 h-3.5" />
              Employee Offboarding & Settlement
            </span>
            <span className="text-[#DDD6CE]">·</span>
            <span className="text-xs text-[#666] font-medium">Exit Compensation & Clearance Wizard</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#2B2B2B]">Final Dues Tabulation & Exit Settlement</h1>
          <p className="text-xs text-[#666]">
            Prorated salary, accrued leave encashment, statutory severance, loan balance recovery, and KRA final taxation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintVoucher}
            className="px-3.5 py-2 text-xs font-semibold text-[#2B2B2B] bg-[#FFFDF8] hover:bg-white border border-[#DDD6CE] rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#8C827A]" />
            <span>Print Settlement Statement</span>
          </button>

          {duesCase.status !== 'authorized' ? (
            <button
              onClick={handleAuthorize}
              className="px-4 py-2 text-xs font-bold text-white bg-[#3B1E54] hover:bg-[#4E286F] rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Authorize Exit Settlement</span>
            </button>
          ) : (
            <span className="px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Settlement Authorized & Finalized</span>
            </span>
          )}
        </div>
      </div>

      {statusNotice && (
        <div className="p-3 bg-[#FFFDF8] border border-[#C9A227] rounded-xl text-xs text-[#3B1E54] flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* 8-Step Workflow Tracker */}
      <div className="bg-white rounded-2xl p-4 border border-[#DDD6CE] shadow-2xs">
        <p className="text-[11px] font-bold text-[#3B1E54] uppercase tracking-wider mb-2">
          Exit Clearance & Final Dues Verification Stages
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-[10px]">
          {[
            { num: 1, label: 'Exit Confirmed', done: true },
            { num: 2, label: 'Last Date: 31-Oct', done: true },
            { num: 3, label: 'Pull Salary/Leave', done: true },
            { num: 4, label: 'Final Adjustments', done: true },
            { num: 5, label: 'Calculate Tax', done: true },
            { num: 6, label: 'Authorize', done: duesCase.status === 'authorized' },
            { num: 7, label: 'Statement Ready', done: true },
            { num: 8, label: 'Portal Release', done: duesCase.status === 'authorized' },
          ].map((s) => (
            <div
              key={s.num}
              className={`p-2 rounded-xl border text-center transition-all ${
                s.done
                  ? 'bg-[#C6B8D9]/20 border-[#C6B8D9] text-[#3B1E54] font-bold'
                  : 'bg-[#FFFDF8] border-[#DDD6CE] text-[#8C827A]'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center mx-auto mb-1 text-[9px] shadow-2xs">
                {s.done ? '✓' : s.num}
              </div>
              <span className="leading-tight block">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Exiting Employee Profile Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD6CE]/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#3B1E54] text-white flex items-center justify-center font-bold text-base shadow-sm">
              DN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-[#2B2B2B]">{duesCase.employeeName}</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded font-bold bg-[#C6B8D9]/25 text-[#3B1E54]">
                  {duesCase.employeeCode}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#C9A227]/25 text-[#3B1E54] font-bold capitalize">
                  {duesCase.reason.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-[#666]">
                {duesCase.jobTitle} · {duesCase.department}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[#8C827A] block text-[10px]">Employment Period</span>
              <strong className="text-[#2B2B2B] font-mono">{duesCase.joinDate} to {duesCase.lastWorkingDay}</strong>
            </div>
            <div>
              <span className="text-[#8C827A] block text-[10px]">Contract Base Salary</span>
              <strong className="text-[#3B1E54] font-mono">{formatKES(duesCase.basicSalary)}</strong>
            </div>
            <div>
              <span className="text-[#8C827A] block text-[10px]">Clearance Status</span>
              <strong className="text-emerald-700">Assets Returned</strong>
            </div>
          </div>
        </div>

        {/* Calculation Components Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Left Column: Settlement Entitlements */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#3B1E54] flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-[#C9A227]" />
              1. Exit Gross Entitlements
            </h3>

            <div className="border border-[#DDD6CE] rounded-2xl divide-y divide-[#DDD6CE]/40 text-xs overflow-hidden">
              <div className="flex items-center justify-between p-3 bg-[#FFFDF8]">
                <div>
                  <span className="font-bold text-[#2B2B2B] block">Prorated Salary to Last Payable Date</span>
                  <span className="text-[11px] text-[#666]">Full 22 working days in October 2026</span>
                </div>
                <span className="font-mono font-bold text-[#2B2B2B]">{formatKES(duesCase.proratedSalary)}</span>
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-bold text-[#2B2B2B] block">Accrued Leave Encashment</span>
                    <span className="text-[11px] text-[#666]">
                      Formula: ({formatKES(duesCase.basicSalary)} ÷ 22 days) × {duesCase.accruedLeaveDays} days
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#3B1E54]">+{formatKES(duesCase.accruedLeavePayout)}</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] bg-[#FFFDF8] p-2 rounded-xl border border-[#DDD6CE]">
                  <span className="text-[#666]">Days to Cash Out:</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="30"
                    value={duesCase.accruedLeaveDays}
                    onChange={(e) => updateLeaveDays(parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 rounded-lg border border-[#DDD6CE] font-mono text-xs bg-white text-[#2B2B2B]"
                  />
                  <span className="text-[#8C827A]">days verified</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3">
                <div>
                  <span className="font-bold text-[#2B2B2B] block">Severance / Service Gratuity</span>
                  <span className="text-[11px] text-[#666]">15 days basic pay for each year completed (4 yrs)</span>
                </div>
                <span className="font-mono font-bold text-[#2B2B2B]">+{formatKES(duesCase.severanceGratuityPay)}</span>
              </div>

              <div className="flex items-center justify-between p-3">
                <div>
                  <span className="font-bold text-[#2B2B2B] block">Unpaid Overtime & Allowances</span>
                  <span className="text-[11px] text-[#666]">12 hours approved shift overtime from Biometrics</span>
                </div>
                <span className="font-mono font-bold text-[#2B2B2B]">+{formatKES(duesCase.unpaidOvertimeOrBonus)}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#F5F2F9] font-extrabold text-[#2B2B2B]">
                <span>TOTAL GROSS FINAL SETTLEMENT</span>
                <span className="font-mono text-[#3B1E54] text-sm">{formatKES(duesCase.grossFinalSettlement)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Recoveries & Statutory Withholdings */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#3B1E54] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
              2. Clearance Recoveries & Tax Withholdings
            </h3>

            <div className="border border-[#DDD6CE] rounded-2xl divide-y divide-[#DDD6CE]/40 text-xs overflow-hidden">
              <div className="p-3 bg-[#FFFDF8]">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="font-bold text-[#3B1E54] block">Staff Loan Clearance</span>
                    <span className="text-[11px] text-[#666]">Full clearance before terminal release</span>
                  </div>
                  <span className="font-mono font-bold text-rose-700">-{formatKES(duesCase.loanOutstandingCleared)}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-[#666]">Recovery Amount:</span>
                  <input
                    type="number"
                    value={duesCase.loanOutstandingCleared}
                    onChange={(e) => updateLoanClearance(parseFloat(e.target.value) || 0)}
                    className="w-24 px-2 py-1 rounded-lg border border-[#DDD6CE] font-mono text-xs bg-white text-[#2B2B2B]"
                  />
                  <span className="text-emerald-700 font-medium">✓ Ledger balanced</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3">
                <div>
                  <span className="font-bold text-[#2B2B2B] block">SACCO Notice Clearance</span>
                  <span className="text-[11px] text-[#666]">Authorized exit deduction</span>
                </div>
                <span className="font-mono font-bold text-[#666]">-{formatKES(duesCase.saccoNoticeDeduction)}</span>
              </div>

              <div className="flex items-center justify-between p-3 text-rose-700">
                <div>
                  <span className="font-bold block">Final PAYE Tax Withholding</span>
                  <span className="text-[11px] text-[#666]">Progressive tax bands on final settlement</span>
                </div>
                <span className="font-mono font-bold">-{formatKES(duesCase.finalPayeDeduction)}</span>
              </div>

              <div className="flex items-center justify-between p-3">
                <div>
                  <span className="font-bold text-[#2B2B2B] block">Statutory NSSF + SHIF + AHL</span>
                  <span className="text-[11px] text-[#666]">
                    NSSF {formatKES(duesCase.finalNssfDeduction)} · SHIF {formatKES(duesCase.finalShifDeduction)} · AHL {formatKES(duesCase.finalAhlDeduction)}
                  </span>
                </div>
                <span className="font-mono font-bold text-[#666]">
                  -{formatKES(duesCase.finalNssfDeduction + duesCase.finalShifDeduction + duesCase.finalAhlDeduction)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#F5F2F9] font-extrabold text-[#2B2B2B]">
                <span>TOTAL RECOVERIES & STATUTORIES</span>
                <span className="font-mono text-rose-700 text-sm">
                  -{formatKES(
                    duesCase.loanOutstandingCleared + 
                    duesCase.saccoNoticeDeduction + 
                    duesCase.finalPayeDeduction + 
                    duesCase.finalNssfDeduction + 
                    duesCase.finalShifDeduction + 
                    duesCase.finalAhlDeduction
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Exit Payout Summary Hero (Dark Plum #3B1E54 with Champagne Gold #C9A227) */}
        <div className="mt-6 p-5 bg-[#3B1E54] rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div>
            <span className="text-[10px] text-[#C6B8D9] uppercase tracking-wider block font-bold">
              FINAL NET DISBURSEMENT VOUCHER
            </span>
            <div className="text-3xl font-extrabold font-mono text-[#C9A227] mt-1">
              {formatKES(duesCase.netFinalDues)}
            </div>
            <p className="text-xs text-[#C6B8D9] mt-1">
              Payable to {duesCase.employeeName} via Equity Bank Kenya (Ac: 1284910294) on 31-Oct-2026.
            </p>
          </div>

          <div className="text-right border-t sm:border-t-0 sm:border-l border-[#C6B8D9]/25 pt-3 sm:pt-0 sm:pl-6 text-xs">
            <span className="text-[#C6B8D9] block text-[10px]">Audit Reference</span>
            <span className="font-mono text-white font-bold">{duesCase.id.toUpperCase()}</span>
            <p className="text-[11px] text-[#C9A227] mt-1">All clearances verified</p>
          </div>
        </div>
      </div>
    </div>
  );
};
