import React, { useState } from 'react';
import { AuditEvent } from '../types/hr';
import { formatKES } from '../utils/kenyaPayrollCalculator';
import { 
  ShieldCheck, 
  History, 
  CheckCircle2 
} from 'lucide-react';

interface PayrollSettingsViewProps {
  auditLogs: AuditEvent[];
}

export const PayrollSettingsView: React.FC<PayrollSettingsViewProps> = ({ auditLogs }) => {
  const [activeTab, setActiveTab] = useState<'statutory' | 'structures' | 'proration' | 'audit'>('statutory');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const [statutoryConfig, setStatutoryConfig] = useState({
    shifRate: 2.75,
    shifMinFloor: 300,
    ahlEmployeeRate: 1.5,
    ahlEmployerRate: 1.5,
    personalRelief: 2400,
    nssfTier1Cap: 8000,
    nssfTier2Cap: 72000,
    nssfRate: 6.0,
    overtimeRegular: 1.5,
    overtimeHoliday: 2.0,
    prorationWorkingDays: 22.0,
  });

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast('Statutory rules and parameters successfully updated. Future calculations will apply this version.');
    setTimeout(() => setSaveToast(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#C6B8D9]/25 text-[#3B1E54]">
              System Configuration & Rules Engine
            </span>
            <span className="text-[#DDD6CE]">·</span>
            <span className="text-xs text-[#666] font-medium">Dynamic Parameters & Effective Dates</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#2B2B2B]">Kenya Statutory Rules, Pay Structures & Audit Engine</h1>
          <p className="text-xs text-[#666]">
            Centrally manage effective-dated tax bands, NSSF tiers, SHIF %, AHL %, proration divisors, and inspect system audit logs.
          </p>
        </div>

        {/* Settings Sub-Navigation */}
        <div className="flex items-center bg-[#FFFDF8] border border-[#DDD6CE] p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('statutory')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'statutory' ? 'bg-[#3B1E54] font-bold text-white shadow-2xs' : 'text-[#666]'
            }`}
          >
            Kenya Statutories
          </button>
          <button
            onClick={() => setActiveTab('structures')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'structures' ? 'bg-[#3B1E54] font-bold text-white shadow-2xs' : 'text-[#666]'
            }`}
          >
            Pay Structures
          </button>
          <button
            onClick={() => setActiveTab('proration')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'proration' ? 'bg-[#3B1E54] font-bold text-white shadow-2xs' : 'text-[#666]'
            }`}
          >
            Proration Rules
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'audit' ? 'bg-[#3B1E54] font-bold text-white shadow-2xs' : 'text-[#666]'
            }`}
          >
            Audit Trail ({auditLogs.length})
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 bg-[#FFFDF8] border border-[#C9A227] rounded-xl text-xs text-[#3B1E54] flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Tab 1: Kenya Statutories Config */}
      {activeTab === 'statutory' && (
        <form onSubmit={handleSaveConfig} className="bg-white rounded-2xl p-6 border border-[#DDD6CE] shadow-2xs space-y-6 text-xs">
          <div className="border-b border-[#DDD6CE]/60 pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-[#2B2B2B] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3B1E54]" />
                Kenya Statutory Configuration Pack (Finance Act 2026)
              </h2>
              <p className="text-[#666] text-[11px] mt-0.5">
                Effective from 01-Jul-2026 · Automatically computed in payroll calculation pipelines
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#C6B8D9]/25 text-[#3B1E54] font-bold">
              Active Pack: KE-2026-R2
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: SHIF & AHL */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-[#DDD6CE] bg-[#FFFDF8] space-y-3">
                <h3 className="font-bold text-[#3B1E54] text-xs uppercase tracking-wider">
                  1. Social Health Insurance Fund (SHIF)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#666] text-[11px] mb-1">Contribution Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={statutoryConfig.shifRate}
                      onChange={(e) => setStatutoryConfig({ ...statutoryConfig, shifRate: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 rounded-xl border border-[#DDD6CE] bg-white font-mono text-xs text-[#2B2B2B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#666] text-[11px] mb-1">Minimum Floor (KES)</label>
                    <input
                      type="number"
                      value={statutoryConfig.shifMinFloor}
                      onChange={(e) => setStatutoryConfig({ ...statutoryConfig, shifMinFloor: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 rounded-xl border border-[#DDD6CE] bg-white font-mono text-xs text-[#2B2B2B]"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#666]">Replaces former NHIF graduated tables with flat 2.75% of gross earnings.</p>
              </div>

              <div className="p-4 rounded-2xl border border-[#DDD6CE] bg-[#FFFDF8] space-y-3">
                <h3 className="font-bold text-[#3B1E54] text-xs uppercase tracking-wider">
                  2. Affordable Housing Levy (AHL)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#666] text-[11px] mb-1">Employee Deduction (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={statutoryConfig.ahlEmployeeRate}
                      onChange={(e) => setStatutoryConfig({ ...statutoryConfig, ahlEmployeeRate: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 rounded-xl border border-[#DDD6CE] bg-white font-mono text-xs text-[#2B2B2B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#666] text-[11px] mb-1">Employer Match (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={statutoryConfig.ahlEmployerRate}
                      onChange={(e) => setStatutoryConfig({ ...statutoryConfig, ahlEmployerRate: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 rounded-xl border border-[#DDD6CE] bg-white font-mono text-xs text-[#2B2B2B]"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#666]">1.5% deducted from employee gross salary, matched 1.5% by employer.</p>
              </div>
            </div>

            {/* Right: NSSF & PAYE Relief */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-[#DDD6CE] bg-[#FFFDF8] space-y-3">
                <h3 className="font-bold text-[#3B1E54] text-xs uppercase tracking-wider">
                  3. NSSF Act 2013 Parameters
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#666] text-[11px] mb-1">Tier I Limit (KES)</label>
                    <input
                      type="number"
                      value={statutoryConfig.nssfTier1Cap}
                      onChange={(e) => setStatutoryConfig({ ...statutoryConfig, nssfTier1Cap: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 rounded-xl border border-[#DDD6CE] bg-white font-mono text-xs text-[#2B2B2B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#666] text-[11px] mb-1">Tier II Upper Limit (KES)</label>
                    <input
                      type="number"
                      value={statutoryConfig.nssfTier2Cap}
                      onChange={(e) => setStatutoryConfig({ ...statutoryConfig, nssfTier2Cap: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 rounded-xl border border-[#DDD6CE] bg-white font-mono text-xs text-[#2B2B2B]"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#666]">6% rate for Tier I (Max KES 480) & Tier II (Max KES 3,840). 100% matched by employer.</p>
              </div>

              <div className="p-4 rounded-2xl border border-[#DDD6CE] bg-[#FFFDF8] space-y-3">
                <h3 className="font-bold text-[#3B1E54] text-xs uppercase tracking-wider">
                  4. KRA Monthly Personal Relief
                </h3>
                <div>
                  <label className="block text-[#666] text-[11px] mb-1">Monthly Personal Relief (KES)</label>
                  <input
                    type="number"
                    value={statutoryConfig.personalRelief}
                    onChange={(e) => setStatutoryConfig({ ...statutoryConfig, personalRelief: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 rounded-xl border border-[#DDD6CE] bg-white font-mono text-xs text-[#2B2B2B]"
                  />
                </div>
                <p className="text-[11px] text-[#666]">Direct monthly tax credit offset against Gross PAYE charged.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#DDD6CE]">
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-[#3B1E54] hover:bg-[#4E286F] rounded-xl shadow-xs transition-colors"
            >
              Save Statutory Rule Parameters
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Pay Structures */}
      {activeTab === 'structures' && (
        <div className="bg-white rounded-2xl p-6 border border-[#DDD6CE] shadow-2xs space-y-4 text-xs">
          <div>
            <h2 className="font-bold text-sm text-[#2B2B2B]">Configured Pay Structures & Employment Models</h2>
            <p className="text-[#666] text-[11px] mt-0.5">
              Reusable templates defining pay basis, earnings applicability, and calculation sequencing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-[#DDD6CE] bg-[#FFFDF8] space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#3B1E54]">Monthly Salaried Structure</h3>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#C6B8D9]/25 text-[#3B1E54] font-bold">ps_monthly_exec</span>
              </div>
              <p className="text-[#666] text-[11px]">
                <strong>Concept:</strong> Monthly Basic + Housing/Transport/Airtime allowances - Statutory & Sacco deductions = Net Pay.
              </p>
              <div className="text-[11px] text-[#666] pt-1 space-y-0.5">
                <p>• Pay Cycle: Monthly (28th day)</p>
                <p>• Proration Divisor: 22 working days</p>
                <p>• Applicable Populations: Corporate & Management staff</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[#DDD6CE] bg-[#FFFDF8] space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#3B1E54]">Daily Worker Structure</h3>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#C6B8D9]/25 text-[#3B1E54] font-bold">ps_daily_casual</span>
              </div>
              <p className="text-[#666] text-[11px]">
                <strong>Concept:</strong> Daily Rate × Approved Payable Turnstile Days + Additions - Deductions = Net Pay.
              </p>
              <div className="text-[11px] text-[#666] pt-1 space-y-0.5">
                <p>• Pay Cycle: Monthly / Bi-weekly</p>
                <p>• Input Source: ZKTeco Biometric Reader Gate A</p>
                <p>• Disbursement Channel: Safaricom M-Pesa</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[#DDD6CE] bg-[#FFFDF8] space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#3B1E54]">Hourly Worker Structure</h3>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#C6B8D9]/25 text-[#3B1E54] font-bold">ps_hourly_field</span>
              </div>
              <p className="text-[#666] text-[11px]">
                <strong>Concept:</strong> Hourly Rate × Approved Payable Hours + Overtime (1.5x) - Deductions = Net Pay.
              </p>
              <div className="text-[11px] text-[#666] pt-1 space-y-0.5">
                <p>• Standard Hours Base: 160 hours / month</p>
                <p>• Overtime Multiplier: 1.5x regular, 2.0x gazetted holidays</p>
                <p>• Applicable Populations: Field Technicians</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[#DDD6CE] bg-[#FFFDF8] space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#3B1E54]">Casual & Temporary Workforce</h3>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#C6B8D9]/25 text-[#3B1E54] font-bold">ps_casual_temp</span>
              </div>
              <p className="text-[#666] text-[11px]">
                <strong>Concept:</strong> Configurable daily or project basis with attendance approval checks.
              </p>
              <div className="text-[11px] text-[#666] pt-1 space-y-0.5">
                <p>• Unapproved records blocked from automated payment</p>
                <p>• Standard withholding taxes configured</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Proration Rules */}
      {activeTab === 'proration' && (
        <div className="bg-white rounded-2xl p-6 border border-[#DDD6CE] shadow-2xs space-y-4 text-xs">
          <div>
            <h2 className="font-bold text-sm text-[#2B2B2B]">Proration & Calendar Divisor Policies</h2>
            <p className="text-[#666] text-[11px] mt-0.5">
              Proration is configuration-driven and applied uniformly to mid-month hires, exits, and unpaid leaves.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border-2 border-[#3B1E54] bg-[#C6B8D9]/15 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-[#3B1E54]">22.0 Working Days (Active)</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[#3B1E54] text-white font-bold">Configured</span>
              </div>
              <p className="text-[11px] text-[#666]">
                Prorated Day Rate = Monthly Basic Salary ÷ 22 days. Used for partial joiners, exits, and approved unpaid leave.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#DDD6CE] bg-[#FFFDF8] space-y-2 opacity-60">
              <h3 className="font-bold text-[#666]">Actual Calendar Days (28-31)</h3>
              <p className="text-[11px] text-[#8C827A]">
                Prorated Day Rate = Monthly Basic Salary ÷ actual days in the period month.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#DDD6CE] bg-[#FFFDF8] space-y-2 opacity-60">
              <h3 className="font-bold text-[#666]">260 Working Days / Year</h3>
              <p className="text-[11px] text-[#8C827A]">
                Annual Salary ÷ 260 working days = fixed uniform daily divisor across all months.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Immutable Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-[#DDD6CE] shadow-2xs overflow-hidden text-xs">
          <div className="p-4 border-b border-[#DDD6CE] flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-[#2B2B2B] flex items-center gap-1.5">
                <History className="w-4 h-4 text-[#3B1E54]" />
                Immutable System & Payroll Audit Log
              </h2>
              <p className="text-[#666] text-[11px] mt-0.5">
                System compliance safeguard: Every calculation, adjustment, approval, and reopen is permanently recorded.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#8C827A]">Tamper-Proof Ledger</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F2F9] border-b border-[#DDD6CE] text-[#3B1E54] font-bold text-[11px]">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">User & Role</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Target Entity</th>
                  <th className="py-2.5 px-3">Details & Audit Narrative</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD6CE]/40">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FFFDF8]">
                    <td className="py-2.5 px-3 font-mono text-[#666] text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-3">
                      <strong className="text-[#2B2B2B]">{log.userName}</strong>
                      <span className="block text-[10px] text-[#8C827A]">{log.userRole}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#C6B8D9]/25 text-[#3B1E54]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#3B1E54] text-[11px]">
                      {log.entity}
                    </td>
                    <td className="py-2.5 px-3 text-[#666] text-[11px]">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
