import React from 'react';
import { PayrollRun, CurrentUser } from '../types/hr';
import { formatKES } from '../utils/kenyaPayrollCalculator';
import { ScreenId } from './Navigation';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  FileSpreadsheet, 
  RefreshCw, 
  ShieldCheck, 
  Clock, 
  UserCheck, 
  Fingerprint, 
  CalendarClock, 
  ChevronRight, 
  Sparkles, 
  Plus 
} from 'lucide-react';

interface PayrollDashboardProps {
  currentRun: PayrollRun;
  priorRun: PayrollRun;
  currentUser: CurrentUser;
  onNavigate: (screen: ScreenId) => void;
  onRecalculate: () => void;
}

export const PayrollDashboard: React.FC<PayrollDashboardProps> = ({
  currentRun,
  priorRun,
  currentUser,
  onNavigate,
  onRecalculate,
}) => {
  const grossVariance = currentRun.totalGross - priorRun.totalGross;
  const grossVariancePercent = ((grossVariance / priorRun.totalGross) * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Greeting Banner (Exact from Page 1 Screenshot) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#DDD6CE] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2B2B2B] tracking-tight">
               Welcome back, {currentUser.name.split(' ')[0]}
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C9A227]/20 text-[#3B1E54] border border-[#C9A227]/30">
              Sample data
            </span>
          </div>
          <p className="text-xs text-[#666] mt-0.5">
            Payroll overview · <strong className="text-[#3B1E54]">{currentRun.periodName}</strong>
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onRecalculate}
            className="px-3 py-2 text-xs font-semibold text-[#3B1E54] bg-[#C6B8D9]/25 hover:bg-[#C6B8D9]/40 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#3B1E54]" />
            <span>Recalculate</span>
          </button>

          <button
            onClick={() => onNavigate('payroll_run')}
            className="px-4 py-2 text-xs font-bold text-white bg-[#3B1E54] hover:bg-[#4E286F] rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <DollarSign className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Run Payroll</span>
          </button>
        </div>
      </div>

      {/* 4 Core KPI Stat Cards (Matching Page 1 Screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Employees */}
        <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#666]">Total Employees</span>
            <div className="w-8 h-8 rounded-xl bg-[#C6B8D9]/25 text-[#3B1E54] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#3B1E54] font-mono tracking-tight">
            {currentRun.workerCount + 41}
          </p>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-700 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>+5.2% from last month</span>
          </div>
        </div>

        {/* KPI 2: On Leave */}
        <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#666]">On Leave Today</span>
            <div className="w-8 h-8 rounded-xl bg-[#C6B8D9]/25 text-[#3B1E54] flex items-center justify-center">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#3B1E54] font-mono tracking-tight">
            4
          </p>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-[#666]">
            <span>3 Annual · 1 Sick Leave</span>
          </div>
        </div>

        {/* KPI 3: Present Today */}
        <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#666]">Present Today</span>
            <div className="w-8 h-8 rounded-xl bg-[#C6B8D9]/25 text-[#3B1E54] flex items-center justify-center">
              <Fingerprint className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#3B1E54] font-mono tracking-tight">
            44
          </p>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-700 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>94 punches recorded</span>
          </div>
        </div>

        {/* KPI 4: Payroll This Month (KES) */}
        <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#666]">Payroll Gross (Oct 2026)</span>
            <div className="w-8 h-8 rounded-xl bg-[#C9A227]/20 text-[#3B1E54] flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#C9A227]" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#3B1E54] font-mono tracking-tight">
            {formatKES(currentRun.totalGross)}
          </p>
          <div className="flex items-center justify-between mt-2 text-[11px] text-[#666]">
            <span>Net: <strong className="text-[#3B1E54] font-mono">{formatKES(currentRun.totalNet)}</strong></span>
            <span className="text-emerald-700 font-medium">+{grossVariancePercent}%</span>
          </div>
        </div>
      </div>

      {/* Validation Alert (Muted Gold & Dark Plum) */}
      {currentRun.exceptionsCount > 0 && (
        <div className="bg-[#FFFDF8] border border-[#C9A227] rounded-2xl p-4 text-xs shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-xl bg-[#C9A227]/20 text-[#3B1E54] shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-[#C9A227]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[#3B1E54] text-xs">
                  {currentRun.exceptionsCount} Validation Exceptions Flagged in October Run
                </h4>
                <button
                  onClick={() => onNavigate('payroll_run')}
                  className="font-bold text-[#3B1E54] hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Resolve in Payroll Run</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C9A227]" />
                </button>
              </div>
              <p className="text-[#666] text-[11px] mt-1 leading-relaxed">
                Rules engine detected 1 missing KRA Tax PIN (Grace Wanjiku), 1 unapproved overtime entry (Victor Ochieng), and 1 exit clearance requiring Final Dues (David Ndung'u).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Visual Analytics Grid (From Page 1 Guidelines) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Workforce Distribution & Attendance Trend */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workforce Populations & Pay Structures Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-sm text-[#2B2B2B]">Workforce Pay Structures & Distribution</h2>
                <p className="text-xs text-[#666]">Multi-population salaried, casual, and hourly payroll breakdown</p>
              </div>
              <span className="text-[11px] font-semibold text-[#3B1E54] bg-[#C6B8D9]/20 px-2.5 py-1 rounded-xl">
                7 Workers in Run
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-xl border border-[#DDD6CE] bg-[#FFFDF8]">
                <div className="flex items-center justify-between text-[#666] mb-1">
                  <span className="font-semibold text-[#2B2B2B]">Monthly Salaried</span>
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-[#C6B8D9]/20 text-[#3B1E54]">5 Staff</span>
                </div>
                <p className="text-lg font-bold font-mono text-[#3B1E54] mt-1">
                  {formatKES(620000)}
                </p>
                <p className="text-[11px] text-[#666] mt-1">Fixed corporate compensation</p>
              </div>

              <div className="p-4 rounded-xl border border-[#DDD6CE] bg-[#FFFDF8]">
                <div className="flex items-center justify-between text-[#666] mb-1">
                  <span className="font-semibold text-[#2B2B2B]">Daily Casuals</span>
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-[#C6B8D9]/20 text-[#3B1E54]">1 Worker</span>
                </div>
                <p className="text-lg font-bold font-mono text-[#3B1E54] mt-1">
                  {formatKES(56300)}
                </p>
                <p className="text-[11px] text-[#666] mt-1">24 approved turnstile days</p>
              </div>

              <div className="p-4 rounded-xl border border-[#DDD6CE] bg-[#FFFDF8]">
                <div className="flex items-center justify-between text-[#666] mb-1">
                  <span className="font-semibold text-[#2B2B2B]">Hourly Technicians</span>
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-[#C6B8D9]/20 text-[#3B1E54]">1 Worker</span>
                </div>
                <p className="text-lg font-bold font-mono text-[#3B1E54] mt-1">
                  {formatKES(113250)}
                </p>
                <p className="text-[11px] text-[#666] mt-1">160h std + 14h OT - 2d unpaid</p>
              </div>
            </div>

            {/* Statutory Split Bar */}
            <div className="mt-5 pt-4 border-t border-[#DDD6CE]/60">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-[#2B2B2B]">Kenya Statutory Withholding Split</span>
                <span className="font-mono font-bold text-[#3B1E54]">{formatKES(currentRun.totalStatutoryEmployee)}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#DDD6CE]/40 overflow-hidden flex">
                <div className="bg-[#3B1E54] h-full" style={{ width: '48%' }} title="PAYE Tax (48%)"></div>
                <div className="bg-[#C6B8D9] h-full" style={{ width: '22%' }} title="NSSF Tier I & II (22%)"></div>
                <div className="bg-[#C9A227] h-full" style={{ width: '18%' }} title="SHIF 2.75% (18%)"></div>
                <div className="bg-[#4E286F] h-full" style={{ width: '12%' }} title="Housing Levy 1.5% (12%)"></div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[10px] text-[#666] mt-2">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#3B1E54]"></span> PAYE Tax</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#C6B8D9]"></span> NSSF Pension</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#C9A227]"></span> SHIF 2.75%</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#4E286F]"></span> Housing Levy 1.5%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar (From Page 1 Screenshot) */}
          <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#666] mb-3">Quick Operational Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <button
                onClick={() => onNavigate('leave')}
                className="p-3 rounded-xl border border-[#DDD6CE] hover:border-[#3B1E54] bg-[#FFFDF8] hover:bg-white text-left transition-all"
              >
                <CalendarClock className="w-4 h-4 text-[#3B1E54] mb-2" />
                <span className="font-bold text-[#2B2B2B] block text-xs">Request Leave</span>
                <span className="text-[10px] text-[#666]">Self-service portal</span>
              </button>

              <button
                onClick={() => onNavigate('attendance')}
                className="p-3 rounded-xl border border-[#DDD6CE] hover:border-[#3B1E54] bg-[#FFFDF8] hover:bg-white text-left transition-all"
              >
                <Fingerprint className="w-4 h-4 text-[#3B1E54] mb-2" />
                <span className="font-bold text-[#2B2B2B] block text-xs">Approve Time</span>
                <span className="text-[10px] text-[#666]">Biometric punches</span>
              </button>

              <button
                onClick={() => onNavigate('payroll_run')}
                className="p-3 rounded-xl border border-[#DDD6CE] hover:border-[#3B1E54] bg-[#FFFDF8] hover:bg-white text-left transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-[#C9A227] mb-2" />
                <span className="font-bold text-[#2B2B2B] block text-xs">Payroll Sign-Off</span>
                <span className="text-[10px] text-[#666]">Maker-Checker flow</span>
              </button>

              <button
                onClick={() => onNavigate('reports')}
                className="p-3 rounded-xl border border-[#DDD6CE] hover:border-[#3B1E54] bg-[#FFFDF8] hover:bg-white text-left transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#3B1E54] mb-2" />
                <span className="font-bold text-[#2B2B2B] block text-xs">View Reports</span>
                <span className="text-[10px] text-[#666]">KRA P10, NSSF, CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Events & Calendar Milestones (Page 1 Screenshot) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDD6CE]/60 pb-3">
              <h3 className="font-bold text-sm text-[#2B2B2B]">Upcoming Events</h3>
              <button
                onClick={() => onNavigate('calendar')}
                className="text-xs font-semibold text-[#3B1E54] hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FFFDF8] border border-transparent hover:border-[#DDD6CE] transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#FFFDF8] border border-[#DDD6CE] flex flex-col items-center justify-center text-center shrink-0">
                  <span className="text-[9px] font-bold text-[#C9A227] uppercase">OCT</span>
                  <span className="text-base font-extrabold text-[#3B1E54] font-mono leading-none">20</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#2B2B2B]">Mashujaa Day</h4>
                  <p className="text-[11px] text-[#666]">National Public Holiday · Shift OT @ 2.0x</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FFFDF8] border border-transparent hover:border-[#DDD6CE] transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#FFFDF8] border border-[#DDD6CE] flex flex-col items-center justify-center text-center shrink-0">
                  <span className="text-[9px] font-bold text-[#C9A227] uppercase">OCT</span>
                  <span className="text-base font-extrabold text-[#3B1E54] font-mono leading-none">24</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#2B2B2B]">Payroll Cut-off Deadline</h4>
                  <p className="text-[11px] text-[#666]">Final attendance inputs & leave approvals</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FFFDF8] border border-transparent hover:border-[#DDD6CE] transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#FFFDF8] border border-[#DDD6CE] flex flex-col items-center justify-center text-center shrink-0">
                  <span className="text-[9px] font-bold text-[#C9A227] uppercase">OCT</span>
                  <span className="text-base font-extrabold text-[#3B1E54] font-mono leading-none">28</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#2B2B2B]">Salary Disbursement & Payslips</h4>
                  <p className="text-[11px] text-[#666]">Bank EFT & Safaricom M-Pesa release</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('calendar')}
              className="w-full py-2 px-3 text-xs font-bold text-[#3B1E54] bg-[#C6B8D9]/20 hover:bg-[#C6B8D9]/30 rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <span>Open Shared Velora Calendar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Maker-Checker Stage Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#666]">
              Maker-Checker Authorization
            </h3>
            <div className="p-3 rounded-xl bg-[#FFFDF8] border border-[#DDD6CE] text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#3B1E54]">Status: Under Review</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C9A227] text-[#3B1E54]">Checker</span>
              </div>
              <p className="text-[11px] text-[#666]">
                Assigned to Alice Wambui (Finance) for variance reconciliation.
              </p>
            </div>
            <button
              onClick={() => onNavigate('payroll_run')}
              className="w-full py-2 text-xs font-bold text-white bg-[#3B1E54] hover:bg-[#4E286F] rounded-xl transition-colors shadow-2xs"
            >
              Proceed to Review & Sign-Off
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
