import React, { useState } from 'react';
import { PayrollRun, PayrollEmployeeResult, CurrentUser } from '../types/hr';
import { formatKES } from '../utils/kenyaPayrollCalculator';
import { ReviewApprovalView } from './ReviewApprovalView';
import { 
  Search, 
  RefreshCw, 
  Download, 
  AlertCircle, 
  Check, 
  Clock, 
  Calculator, 
  CheckCircle2, 
  ShieldCheck, 
  FileSpreadsheet, 
  CheckCheck 
} from 'lucide-react';

interface PayrollRunViewProps {
  currentRun: PayrollRun;
  priorRun: PayrollRun;
  currentUser: CurrentUser;
  onSelectEmployeeForTrace: (result: PayrollEmployeeResult) => void;
  onOpenPayslip: (employeeId: string) => void;
  onRecalculate: () => void;
  onPullAttendanceAndLeave: () => void;
  onApproveRun: (approverName: string) => void;
  onReturnForCorrection: (reason: string) => void;
  onCloseRun: () => void;
  onReopenRun: (reason: string) => void;
  isRecalculating: boolean;
}

export const PayrollRunView: React.FC<PayrollRunViewProps> = ({
  currentRun,
  priorRun,
  currentUser,
  onSelectEmployeeForTrace,
  onOpenPayslip,
  onRecalculate,
  onPullAttendanceAndLeave,
  onApproveRun,
  onReturnForCorrection,
  onCloseRun,
  onReopenRun,
  isRecalculating,
}) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'sign_off'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPopulation, setSelectedPopulation] = useState<string>('all');
  const [filterExceptionsOnly, setFilterExceptionsOnly] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const handlePullSync = () => {
    onPullAttendanceAndLeave();
    setSyncNotice('Biometric punches & Approved Leave requests synchronized into October Payroll.');
    setTimeout(() => setSyncNotice(null), 4000);
  };

  const filteredResults = currentRun.results.filter((res) => {
    const matchesSearch = 
      res.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPop = selectedPopulation === 'all' || res.population === selectedPopulation;
    const matchesExceptions = !filterExceptionsOnly || res.hasExceptions;

    return matchesSearch && matchesPop && matchesExceptions;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Controls Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#C6B8D9]/25 text-[#3B1E54] font-mono">
              Period: {currentRun.periodName}
            </span>
            <span className="text-xs text-[#666]">
              Cut-off: <strong className="text-[#2B2B2B]">{currentRun.cutOffDate}</strong>
            </span>
            <span className="text-[#DDD6CE]">·</span>
            <span className="text-xs text-[#3B1E54] font-semibold">
              {currentRun.workerCount} Enrolled Workers
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-[#2B2B2B]">Payroll Calculation Engine & Master Grid</h1>
          <p className="text-xs text-[#666]">
            Calculate compensation, inspect statutory formula traces, and complete Maker-Checker authorization.
          </p>
        </div>

        {/* Tab Switcher & Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sub-tab Switcher: Master Grid vs Review & Sign-Off */}
          <div className="flex items-center bg-[#FFFDF8] border border-[#DDD6CE] p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('grid')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'grid'
                  ? 'bg-[#3B1E54] text-white shadow-xs font-bold'
                  : 'text-[#666] hover:text-[#2B2B2B]'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculation Grid</span>
            </button>
            <button
              onClick={() => setActiveTab('sign_off')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'sign_off'
                  ? 'bg-[#3B1E54] text-white shadow-xs font-bold'
                  : 'text-[#666] hover:text-[#2B2B2B]'
              }`}
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Review & Sign-Off</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-[#C9A227] text-[#3B1E54]">
                {currentRun.status.toUpperCase()}
              </span>
            </button>
          </div>

          {activeTab === 'grid' && (
            <>
              <button
                onClick={handlePullSync}
                className="px-3.5 py-2 text-xs font-semibold text-[#3B1E54] bg-[#C6B8D9]/25 hover:bg-[#C6B8D9]/40 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-[#3B1E54]" />
                <span>Pull Time & Leave Data</span>
              </button>

              <button
                onClick={onRecalculate}
                disabled={isRecalculating}
                className="px-4 py-2 text-xs font-bold text-white bg-[#3B1E54] hover:bg-[#4E286F] rounded-xl flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-white ${isRecalculating ? 'animate-spin' : ''}`} />
                <span>{isRecalculating ? 'Calculating...' : 'Recalculate Run'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {syncNotice && (
        <div className="p-3 bg-[#FFFDF8] border border-[#C9A227] rounded-xl text-xs text-[#3B1E54] flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Render Active Sub-View */}
      {activeTab === 'sign_off' ? (
        <ReviewApprovalView
          currentRun={currentRun}
          priorRun={priorRun}
          currentUser={currentUser}
          onApproveRun={onApproveRun}
          onReturnForCorrection={onReturnForCorrection}
          onCloseRun={onCloseRun}
          onReopenRun={onReopenRun}
        />
      ) : (
        <>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#DDD6CE] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C827A] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, employee code (EMP-104), or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DDD6CE] bg-[#FFFDF8] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B1E54] text-xs text-[#2B2B2B]"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-[#FFFDF8] border border-[#DDD6CE] p-1 rounded-xl">
            {[
              { id: 'all', label: 'All Populations' },
              { id: 'monthly_salaried', label: 'Monthly Salaried' },
              { id: 'daily_paid', label: 'Daily Casuals' },
              { id: 'hourly_paid', label: 'Hourly Shifts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedPopulation(tab.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  selectedPopulation === tab.id
                    ? 'bg-[#3B1E54] text-white shadow-2xs'
                    : 'text-[#666] hover:text-[#2B2B2B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setFilterExceptionsOnly(!filterExceptionsOnly)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors text-xs font-semibold ${
              filterExceptionsOnly
                ? 'bg-[#C9A227]/20 border-[#C9A227] text-[#3B1E54]'
                : 'bg-white border-[#DDD6CE] text-[#666] hover:bg-[#FFFDF8]'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Exceptions ({currentRun.exceptionsCount})</span>
          </button>
        </div>
      </div>

      {/* Main Calculation Table with Soft Lilac Headers (#F5F2F9) */}
      <div className="bg-white rounded-2xl border border-[#DDD6CE] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F2F9] border-b border-[#DDD6CE] text-[#3B1E54] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3.5">Employee</th>
                <th className="py-3 px-3">Population</th>
                <th className="py-3 px-3 text-right">Base Pay</th>
                <th className="py-3 px-3 text-right">Time / Additions</th>
                <th className="py-3 px-3 text-right">Gross Pay</th>
                <th className="py-3 px-3 text-right">PAYE</th>
                <th className="py-3 px-3 text-right">NSSF (I+II)</th>
                <th className="py-3 px-3 text-right">SHIF (2.75%)</th>
                <th className="py-3 px-3 text-right">AHL (1.5%)</th>
                <th className="py-3 px-3 text-right">Other Deduct</th>
                <th className="py-3 px-3 text-right">Net Pay</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD6CE]/40">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-8 text-center text-[#8C827A]">
                    No employee records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredResults.map((result) => {
                  const stat = result.statutory;
                  const otherDeduct = result.saccoDeduction + result.loanDeduction + result.pensionVoluntary;

                  return (
                    <tr 
                      key={result.id} 
                      className={`hover:bg-[#FDFBF7] transition-colors ${
                        result.hasExceptions ? 'bg-[#FFFDF8]' : ''
                      }`}
                    >
                      {/* Employee Info */}
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-[#2B2B2B]">{result.employeeName}</div>
                        <div className="text-[11px] text-[#666] flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[#3B1E54] font-semibold">{result.employeeCode}</span>
                          <span>·</span>
                          <span>{result.department}</span>
                        </div>
                      </td>

                      {/* Population */}
                      <td className="py-3 px-3">
                        <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#C6B8D9]/20 text-[#3B1E54]">
                          {result.population === 'monthly_salaried' && 'Salaried'}
                          {result.population === 'daily_paid' && 'Daily Casual'}
                          {result.population === 'hourly_paid' && 'Hourly Tech'}
                        </span>
                      </td>

                      {/* Base Pay */}
                      <td className="py-3 px-3 text-right font-mono font-medium text-[#2B2B2B]">
                        {formatKES(result.basePay)}
                      </td>

                      {/* Time / Additions */}
                      <td className="py-3 px-3 text-right">
                        <span className="font-mono text-emerald-700 font-semibold">
                          +{formatKES(result.totalEarnings)}
                        </span>
                        {result.overtimeHours > 0 && (
                          <span className="block text-[10px] text-[#3B1E54] font-medium">
                            OT: {result.overtimeHours}h
                          </span>
                        )}
                        {result.unpaidLeaveDays > 0 && (
                          <span className="block text-[10px] text-rose-700 font-medium">
                            Unpaid: {result.unpaidLeaveDays}d
                          </span>
                        )}
                      </td>

                      {/* Gross Pay (in Dark Plum #3B1E54) */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#3B1E54]">
                        {formatKES(result.grossPay)}
                      </td>

                      {/* PAYE */}
                      <td className="py-3 px-3 text-right font-mono text-rose-700">
                        {formatKES(stat.netPaye)}
                      </td>

                      {/* NSSF */}
                      <td className="py-3 px-3 text-right font-mono text-[#2B2B2B]">
                        {formatKES(stat.totalNssfEmployee)}
                      </td>

                      {/* SHIF */}
                      <td className="py-3 px-3 text-right font-mono text-[#2B2B2B]">
                        {formatKES(stat.shifEmployee)}
                      </td>

                      {/* Housing Levy */}
                      <td className="py-3 px-3 text-right font-mono text-[#2B2B2B]">
                        {formatKES(stat.ahlEmployee)}
                      </td>

                      {/* Other Deductions */}
                      <td className="py-3 px-3 text-right font-mono text-[#666]">
                        {formatKES(otherDeduct)}
                      </td>

                      {/* Net Pay */}
                      <td className="py-3 px-3 text-right font-mono font-extrabold text-[#3B1E54] text-sm bg-[#C6B8D9]/15">
                        {formatKES(result.netPay)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        {result.hasExceptions ? (
                          <span 
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#3B1E54] bg-[#C9A227]/25 px-2 py-0.5 rounded-lg cursor-help"
                            title={result.exceptionNotes?.join('\n')}
                          >
                            <AlertCircle className="w-3 h-3 text-[#C9A227]" />
                            <span>Flagged</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                            <Check className="w-3 h-3" />
                            <span>Valid</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onSelectEmployeeForTrace(result)}
                            className="px-2 py-1 text-xs font-bold text-[#3B1E54] hover:bg-[#C6B8D9]/25 rounded-lg transition-colors"
                          >
                            Trace
                          </button>
                          <span className="text-[#DDD6CE]">|</span>
                          <button
                            onClick={() => onOpenPayslip(result.employeeId)}
                            className="px-2 py-1 text-xs font-semibold text-[#666] hover:text-[#3B1E54] hover:bg-[#FFFDF8] rounded-lg transition-colors"
                          >
                            Payslip
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Table Summary Footer */}
            <tfoot>
              <tr className="bg-[#F5F2F9] border-t-2 border-[#DDD6CE] font-bold text-[#2B2B2B]">
                <td colSpan={2} className="py-3 px-3.5 text-[#3B1E54]">
                  Batch Totals ({filteredResults.length} Workers)
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {formatKES(filteredResults.reduce((a, b) => a + b.basePay, 0))}
                </td>
                <td className="py-3 px-3 text-right font-mono text-emerald-700">
                  +{formatKES(filteredResults.reduce((a, b) => a + b.totalEarnings, 0))}
                </td>
                <td className="py-3 px-3 text-right font-mono text-[#3B1E54] font-extrabold">
                  {formatKES(filteredResults.reduce((a, b) => a + b.grossPay, 0))}
                </td>
                <td className="py-3 px-3 text-right font-mono text-rose-700">
                  {formatKES(filteredResults.reduce((a, b) => a + b.statutory.netPaye, 0))}
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {formatKES(filteredResults.reduce((a, b) => a + b.statutory.totalNssfEmployee, 0))}
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {formatKES(filteredResults.reduce((a, b) => a + b.statutory.shifEmployee, 0))}
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {formatKES(filteredResults.reduce((a, b) => a + b.statutory.ahlEmployee, 0))}
                </td>
                <td className="py-3 px-3 text-right font-mono text-[#666]">
                  {formatKES(filteredResults.reduce((a, b) => a + (b.saccoDeduction + b.loanDeduction + b.pensionVoluntary), 0))}
                </td>
                <td className="py-3 px-3 text-right font-mono text-[#3B1E54] font-extrabold text-sm bg-[#C6B8D9]/25">
                  {formatKES(filteredResults.reduce((a, b) => a + b.netPay, 0))}
                </td>
                <td colSpan={2} className="py-3 px-3 text-center text-[#8C827A] font-normal text-[11px]">
                  Snapshot Ready
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
