import React, { useState } from 'react';
import { PayrollRun, CurrentUser } from '../types/hr';
import { formatKES } from '../utils/kenyaPayrollCalculator';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  MessageSquare, 
  Lock, 
  Unlock, 
  TrendingUp, 
  UserCheck 
} from 'lucide-react';

interface ReviewApprovalViewProps {
  currentRun: PayrollRun;
  priorRun: PayrollRun;
  currentUser: CurrentUser;
  onApproveRun: (approverName: string) => void;
  onReturnForCorrection: (reason: string) => void;
  onCloseRun: () => void;
  onReopenRun: (reason: string) => void;
}

export const ReviewApprovalView: React.FC<ReviewApprovalViewProps> = ({
  currentRun,
  priorRun,
  currentUser,
  onApproveRun,
  onReturnForCorrection,
  onCloseRun,
  onReopenRun,
}) => {
  const [reviewComment, setReviewComment] = useState('');
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [reopenDialogOpen, setReopenDialogOpen] = useState(false);
  const [actionReason, setActionReason] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const grossDelta = currentRun.totalGross - priorRun.totalGross;
  const netDelta = currentRun.totalNet - priorRun.totalNet;

  const handleRecommendOrApprove = () => {
    onApproveRun(currentUser.name);
    setStatusMessage(`Payroll run marked as Approved by ${currentUser.name}. Outputs finalized.`);
  };

  const handleReturn = () => {
    if (!actionReason) return;
    onReturnForCorrection(actionReason);
    setReturnDialogOpen(false);
    setActionReason('');
    setStatusMessage('Payroll returned to Draft for correction.');
  };

  const handleReopen = () => {
    if (!actionReason) return;
    onReopenRun(actionReason);
    setReopenDialogOpen(false);
    setActionReason('');
    setStatusMessage('Payroll unlocked into Reopened state with audit logging.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider bg-[#C6B8D9]/25 text-[#3B1E54]">
              Stage: {currentRun.status.toUpperCase()}
            </span>
            <span className="text-[#DDD6CE]">·</span>
            <span className="text-xs text-[#666] font-medium">
              Period: {currentRun.periodName}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-[#2B2B2B]">Maker-Checker Review & Authorization Portal</h1>
          <p className="text-xs text-[#666]">
            Segregation of duties: Prepared by Payroll Lead, verified by Finance Checker, authorized for bank disbursement.
          </p>
        </div>

        {/* Action Controls for Current User Role */}
        <div className="flex flex-wrap items-center gap-2">
          {currentRun.status === 'review' && (
            <>
              <button
                onClick={() => setReturnDialogOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Return for Correction</span>
              </button>
              <button
                onClick={handleRecommendOrApprove}
                className="px-4 py-2 text-xs font-bold text-white bg-[#3B1E54] hover:bg-[#4E286F] rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Authorize & Approve Run</span>
              </button>
            </>
          )}

          {currentRun.status === 'approved' && (
            <>
              <button
                onClick={onCloseRun}
                className="px-4 py-2 text-xs font-bold text-white bg-[#3B1E54] hover:bg-[#4E286F] rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Close Period & Lock Records</span>
              </button>
              <button
                onClick={() => setReopenDialogOpen(true)}
                className="px-3 py-2 text-xs font-semibold text-[#3B1E54] bg-[#C9A227]/20 hover:bg-[#C9A227]/30 border border-[#C9A227]/40 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Unlock className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Reopen with Audit Log</span>
              </button>
            </>
          )}

          {currentRun.status === 'closed' && (
            <button
              onClick={() => setReopenDialogOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-[#3B1E54] bg-[#C9A227]/20 hover:bg-[#C9A227]/30 border border-[#C9A227]/40 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Unlock className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Controlled Reopen (Elevated Role)</span>
            </button>
          )}
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-[#FFFDF8] border border-[#C9A227] rounded-xl text-xs text-[#3B1E54] flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Variance Analysis Comparison Table */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-[#2B2B2B] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#C9A227]" />
              Payroll Period Variance Comparison (September vs October 2026)
            </h2>
            <p className="text-xs text-[#666]">
              Identifying causes of movement between prior closed run and current calculation
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#C6B8D9]/25 text-[#3B1E54]">
            +{((grossDelta / priorRun.totalGross) * 100).toFixed(1)}% Gross Movement
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F2F9] border-b border-[#DDD6CE] text-[#3B1E54] font-bold text-[11px]">
                <th className="py-2.5 px-3">Payroll Line Item</th>
                <th className="py-2.5 px-3 text-right">Prior (Sep 2026)</th>
                <th className="py-2.5 px-3 text-right">Current (Oct 2026)</th>
                <th className="py-2.5 px-3 text-right">Variance (KES)</th>
                <th className="py-2.5 px-3">Primary Movement Driver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD6CE]/40">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#2B2B2B]">Enrolled Workers</td>
                <td className="py-2.5 px-3 text-right font-mono">6</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-[#3B1E54]">7</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-bold">+1</td>
                <td className="py-2.5 px-3 text-[#666]">Onboarding of Victor Ochieng (Mombasa Branch)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#2B2B2B]">Gross Payroll Earnings</td>
                <td className="py-2.5 px-3 text-right font-mono">{formatKES(priorRun.totalGross)}</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-[#3B1E54]">{formatKES(currentRun.totalGross)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-bold">+{formatKES(grossDelta)}</td>
                <td className="py-2.5 px-3 text-[#666]">New hire + 14 hrs approved OT + KES 15k quarterly bonus</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#2B2B2B]">Kenya Statutory Withholdings</td>
                <td className="py-2.5 px-3 text-right font-mono">{formatKES(priorRun.totalStatutoryEmployee)}</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-[#3B1E54]">{formatKES(currentRun.totalStatutoryEmployee)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-rose-700 font-bold">+{formatKES(currentRun.totalStatutoryEmployee - priorRun.totalStatutoryEmployee)}</td>
                <td className="py-2.5 px-3 text-[#666]">KRA PAYE progressive band brackets</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#2B2B2B]">Net Employee Disbursements</td>
                <td className="py-2.5 px-3 text-right font-mono">{formatKES(priorRun.totalNet)}</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-[#3B1E54]">{formatKES(currentRun.totalNet)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-bold">+{formatKES(netDelta)}</td>
                <td className="py-2.5 px-3 text-[#666]">Reconciled after staff loan clearance and unpaid leave</td>
              </tr>
              <tr className="bg-[#FFFDF8] font-medium">
                <td className="py-2.5 px-3 text-[#2B2B2B]">Employer Non-Wage Cost</td>
                <td className="py-2.5 px-3 text-right font-mono">{formatKES(priorRun.totalStatutoryEmployer)}</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-[#3B1E54]">{formatKES(currentRun.totalStatutoryEmployer)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-[#3B1E54] font-bold">+{formatKES(currentRun.totalStatutoryEmployer - priorRun.totalStatutoryEmployer)}</td>
                <td className="py-2.5 px-3 text-[#666]">NSSF match + 1.5% Affordable Housing match</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dual Column: Sign-off Chain + Audit Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-[#2B2B2B] flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#3B1E54]" />
            Maker-Checker Authorization Progression
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl border border-[#DDD6CE] bg-[#FFFDF8] flex items-start justify-between">
              <div>
                <p className="font-bold text-[#2B2B2B]">Step 1: Preparation (Maker)</p>
                <p className="text-[#666] mt-0.5">Stephen Nyaga · Payroll & HR Lead</p>
                <p className="text-[11px] text-[#8C827A] mt-1">Calculated and validated against biometric punch data.</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                Verified
              </span>
            </div>

            <div className="p-3 rounded-xl border border-[#C6B8D9] bg-[#F5F2F9] flex items-start justify-between">
              <div>
                <p className="font-bold text-[#3B1E54]">Step 2: Financial Review (Checker)</p>
                <p className="text-[#3B1E54] mt-0.5">Alice Wambui · Finance Director</p>
                <p className="text-[11px] text-[#666] mt-1">Verified variance reconciliation and statutory caps.</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#3B1E54] text-white">
                In Review
              </span>
            </div>

            <div className="p-3 rounded-xl border border-[#DDD6CE] bg-[#FFFDF8] flex items-start justify-between">
              <div>
                <p className="font-bold text-[#2B2B2B]">Step 3: Final Authorization & Release</p>
                <p className="text-[#666] mt-0.5">Rosemary Mwanza · Chief Executive Officer</p>
                <p className="text-[11px] text-[#8C827A] mt-1">Final authorization for bank batch and payslip release.</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#DDD6CE]/40 text-[#666]">
                {currentRun.status === 'approved' || currentRun.status === 'closed' ? 'Authorized' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#2B2B2B] flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-[#3B1E54]" />
              Reviewer Audit Notes & Compliance Remarks
            </h3>
            <p className="text-xs text-[#666] mb-3">
              Remarks entered here are recorded in the permanent audit trail attached to this payroll snapshot.
            </p>

            <textarea
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="e.g. October payroll variances reconciled. Verified that 2 days unpaid leave for Victor Ochieng correctly deducted. Approved for CEO final sign-off."
              className="w-full text-xs p-3 rounded-xl border border-[#DDD6CE] bg-[#FFFDF8] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3B1E54] text-[#2B2B2B]"
            />
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-[#666]">Acting as: <strong className="text-[#3B1E54]">{currentUser.name}</strong></span>
            <button
              onClick={() => {
                if (!reviewComment) return;
                setStatusMessage(`Note added to audit trail: "${reviewComment}"`);
                setReviewComment('');
              }}
              className="px-3.5 py-1.5 font-bold text-[#3B1E54] bg-[#C6B8D9]/25 hover:bg-[#C6B8D9]/40 rounded-xl transition-colors"
            >
              Post Audit Note
            </button>
          </div>
        </div>
      </div>

      {/* Return Dialog Modal */}
      {returnDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#DDD6CE] space-y-4">
            <div className="flex items-center gap-2.5 text-rose-700 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Return Payroll to Draft for Correction</span>
            </div>
            <p className="text-xs text-[#666]">
              Please specify the reason for returning the payroll. The Payroll Officer will be required to rectify the inputs and recalculate.
            </p>
            <textarea
              rows={3}
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder="e.g., Missing KRA PIN for Grace Wanjiku must be captured before approval."
              className="w-full text-xs p-2.5 rounded-xl border border-[#DDD6CE] focus:ring-1 focus:ring-rose-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setReturnDialogOpen(false)}
                className="px-3 py-1.5 text-[#666] hover:bg-black/5 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleReturn}
                className="px-4 py-1.5 bg-rose-700 text-white font-bold rounded-xl hover:bg-rose-800"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reopen Dialog Modal */}
      {reopenDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#DDD6CE] space-y-4">
            <div className="flex items-center gap-2.5 text-[#3B1E54] font-bold text-sm">
              <Unlock className="w-5 h-5 text-[#C9A227]" />
              <span>Controlled Reopen Authorization (Elevated Role)</span>
            </div>
            <p className="text-xs text-[#666]">
              Reopening a locked period creates an immutable audit record and increments the calculation version.
            </p>
            <textarea
              rows={3}
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder="e.g., Authorized retroactive attendance correction for Mombasa branch overtime."
              className="w-full text-xs p-2.5 rounded-xl border border-[#DDD6CE] focus:ring-1 focus:ring-[#3B1E54] focus:outline-none"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setReopenDialogOpen(false)}
                className="px-3 py-1.5 text-[#666] hover:bg-black/5 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleReopen}
                className="px-4 py-1.5 bg-[#3B1E54] text-white font-bold rounded-xl hover:bg-[#4E286F]"
              >
                Reopen Payroll Run
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
