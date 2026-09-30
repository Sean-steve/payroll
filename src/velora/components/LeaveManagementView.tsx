import React, { useState } from 'react';
import { LeaveRequest, Employee } from '../types/hr';
import { formatKES } from '../utils/kenyaPayrollCalculator';
import { 
  CalendarClock, 
  Plus, 
  Check, 
  X, 
  Paperclip, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

interface LeaveManagementViewProps {
  leaveRequests: LeaveRequest[];
  employees: Employee[];
  onApproveLeave: (id: string) => void;
  onRejectLeave: (id: string) => void;
  onAddLeaveRequest: (request: Partial<LeaveRequest>) => void;
}

export const LeaveManagementView: React.FC<LeaveManagementViewProps> = ({
  leaveRequests,
  employees,
  onApproveLeave,
  onRejectLeave,
  onAddLeaveRequest,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(employees[0]?.id || '');
  const [leaveType, setLeaveType] = useState<LeaveRequest['leaveType']>('annual');
  const [startDate, setStartDate] = useState('2026-11-09');
  const [endDate, setEndDate] = useState('2026-11-13');
  const [reason, setReason] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const selectedEmp = employees.find((e) => e.id === selectedEmployeeId);

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    onAddLeaveRequest({
      employeeId: selectedEmp.id,
      employeeName: selectedEmp.fullName,
      leaveType,
      startDate,
      endDate,
      days: 5,
      reason: reason || `${leaveType.toUpperCase()} leave request submitted by employee.`,
      status: 'pending',
      affectsPayroll: leaveType === 'unpaid',
      deductionAmount: leaveType === 'unpaid' ? Math.round((selectedEmp.basicSalary / 22) * 5) : 0,
      hasAttachment: leaveType === 'sick',
      attachmentName: leaveType === 'sick' ? 'Medical_Certification_Dr_Ouma.pdf' : undefined,
    });

    setModalOpen(false);
    setReason('');
    setStatusMessage(`Leave application submitted for ${selectedEmp.fullName}. Awaiting Manager authorization.`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#C6B8D9]/25 text-[#3B1E54]">
              Leave Operations & Balances
            </span>
            <span className="text-[#DDD6CE]">·</span>
            <span className="text-xs text-[#666]">Integrated Workflow: Applications → Manager Approvals → Payroll Proration</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#2B2B2B]">Leave Management & Balance Entitlement</h1>
          <p className="text-xs text-[#666]">
            Self-service applications, manager approvals, document attachments, and automatic unpaid leave payroll deductions.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-[#3B1E54] hover:bg-[#4E286F] rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 bg-[#FFFDF8] border border-[#C9A227] rounded-xl text-xs text-[#3B1E54] flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Integration Callout */}
      <div className="p-4 bg-white border border-[#DDD6CE] rounded-2xl text-xs text-[#2B2B2B] flex items-start gap-3 shadow-2xs">
        <div className="p-2 rounded-xl bg-[#C6B8D9]/25 text-[#3B1E54] shrink-0 mt-0.5">
          <CalendarClock className="w-4 h-4 text-[#3B1E54]" />
        </div>
        <div>
          <p className="font-bold text-xs text-[#3B1E54]">Automated Leave-to-Payroll Proration Rule</p>
          <p className="text-[#666] text-[11px] mt-0.5 leading-relaxed">
            Approved paid leave (Annual, Sick, Compassionate) incurs no wage deduction. Approved unpaid leave automatically creates a proration salary deduction in the active Payroll Run based on the configured company working-day divisor (22.0 days).
          </p>
        </div>
      </div>

      {/* Leave Requests Queue */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-[#2B2B2B] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C9A227]" />
            Leave Requests Approval Workflow
          </h2>
          <span className="text-xs text-[#666]">
            {leaveRequests.filter((r) => r.status === 'pending').length} Pending Manager Approval
          </span>
        </div>

        <div className="divide-y divide-[#DDD6CE]/40">
          {leaveRequests.map((req) => (
            <div key={req.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#2B2B2B]">{req.employeeName}</span>
                  <span className="text-[#DDD6CE]">·</span>
                  <span className="capitalize font-bold text-[#3B1E54] bg-[#C6B8D9]/20 px-2 py-0.5 rounded-lg">
                    {req.leaveType} Leave ({req.days} days)
                  </span>
                  <span className="text-[#666] font-mono">
                    {req.startDate} to {req.endDate}
                  </span>
                </div>

                <p className="text-[#666] text-[11px]">{req.reason}</p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#666] pt-0.5">
                  {req.hasAttachment && (
                    <span className="flex items-center gap-1 text-[#3B1E54] font-semibold bg-[#FFFDF8] px-2 py-0.5 rounded-lg border border-[#DDD6CE]">
                      <Paperclip className="w-3 h-3 text-[#C9A227]" />
                      <span>{req.attachmentName}</span>
                    </span>
                  )}

                  {req.affectsPayroll && (
                    <span className="text-rose-700 font-bold">
                      ⚠️ Deducts from Payroll: -{formatKES(req.deductionAmount || 0)}
                    </span>
                  )}

                  {req.status === 'approved' && req.approvedBy && (
                    <span className="text-emerald-700 font-medium">✓ Approved by {req.approvedBy}</span>
                  )}
                </div>
              </div>

              {req.status === 'pending' ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onRejectLeave(req.id)}
                    className="px-3 py-1.5 font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => onApproveLeave(req.id)}
                    className="px-3.5 py-1.5 font-bold text-white bg-[#3B1E54] hover:bg-[#4E286F] rounded-xl flex items-center gap-1 transition-colors shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Approve & Sync</span>
                  </button>
                </div>
              ) : (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                  req.status === 'approved' ? 'bg-emerald-50 text-emerald-800' :
                  'bg-rose-50 text-rose-800'
                }`}>
                  {req.status.toUpperCase()}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Employee Leave Balances Table */}
      <div className="bg-white rounded-2xl border border-[#DDD6CE] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#DDD6CE] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#2B2B2B]">Configured Leave Entitlements & Balances</h3>
            <p className="text-xs text-[#666]">Statutory Kenya Annual Leave entitlement (21 days minimum per year)</p>
          </div>
          <span className="text-xs text-[#666] font-mono">Cycle: 2026/2027</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F2F9] border-b border-[#DDD6CE] text-[#3B1E54] font-bold text-[11px]">
                <th className="py-2.5 px-3">Employee</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3 text-right">Annual Leave Balance</th>
                <th className="py-2.5 px-3 text-right">Days Taken YTD</th>
                <th className="py-2.5 px-3 text-right">Sick Leave Available</th>
                <th className="py-2.5 px-3 text-right">Encashment Value</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD6CE]/40">
              {employees.map((emp) => {
                const encashmentValue = Math.round((emp.basicSalary / 22) * emp.leaveBalanceDays);
                return (
                  <tr key={emp.id} className="hover:bg-[#FFFDF8]">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-[#2B2B2B]">{emp.fullName}</div>
                      <div className="text-[11px] font-mono text-[#3B1E54] font-medium">{emp.employeeCode}</div>
                    </td>
                    <td className="py-2.5 px-3 text-[#666]">{emp.department}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-extrabold text-[#3B1E54]">
                      {emp.leaveBalanceDays} Days
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#666]">
                      {21 - Math.min(21, emp.leaveBalanceDays)} Days
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#666]">
                      30 Days
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#2B2B2B]">
                      {formatKES(encashmentValue)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[10px] px-2 py-0.5 rounded-lg font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-[#FFFDF8] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DDD6CE] space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDD6CE] pb-3">
              <h3 className="font-extrabold text-base text-[#2B2B2B] flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-[#3B1E54]" />
                <span>Submit Leave Application</span>
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#8C827A] hover:text-[#2B2B2B]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitLeave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2B2B2B] mb-1">Select Employee</label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DDD6CE] bg-white text-[#2B2B2B] focus:ring-1 focus:ring-[#3B1E54] focus:outline-none"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.employeeCode}) - {emp.department} [Balance: {emp.leaveBalanceDays} days]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2B2B2B] mb-1">Leave Category</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as LeaveRequest['leaveType'])}
                    className="w-full p-2.5 rounded-xl border border-[#DDD6CE] bg-white text-[#2B2B2B] capitalize focus:ring-1 focus:ring-[#3B1E54] focus:outline-none"
                  >
                    <option value="annual">Annual Leave (Paid)</option>
                    <option value="sick">Sick Leave (Medical cert required)</option>
                    <option value="maternity">Maternity Leave (90 Days)</option>
                    <option value="paternity">Paternity Leave (14 Days)</option>
                    <option value="compassionate">Compassionate Leave</option>
                    <option value="unpaid">Unpaid Leave (Prorated in Payroll)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#2B2B2B] mb-1">Current Balance</label>
                  <div className="p-2.5 rounded-xl bg-white border border-[#DDD6CE] font-mono font-extrabold text-[#3B1E54]">
                    {selectedEmp?.leaveBalanceDays || 0} Days Available
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2B2B2B] mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DDD6CE] bg-white text-[#2B2B2B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2B2B2B] mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DDD6CE] bg-white text-[#2B2B2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2B2B2B] mb-1">Reason / Justification</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Detail the purpose for leave..."
                  className="w-full p-2.5 rounded-xl border border-[#DDD6CE] bg-white text-[#2B2B2B] focus:outline-none focus:ring-1 focus:ring-[#3B1E54]"
                />
              </div>

              {leaveType === 'unpaid' && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px]">
                  <strong>Payroll Impact:</strong> Unpaid leave will trigger an automatic proration deduction in the payroll run.
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-[#DDD6CE]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-2 text-[#666] hover:bg-black/5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#3B1E54] hover:bg-[#4E286F] rounded-xl shadow-xs"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
