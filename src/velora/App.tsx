import React, { useState } from 'react';
import { 
  CurrentUser, 
  PayrollRun, 
  PayrollEmployeeResult, 
  LeaveRequest, 
  AttendanceCorrectionRequest, 
  AuditEvent, 
  CalendarEvent,
  Employee
} from './types/hr';
import { 
  CURRENT_USERS, 
  MOCK_EMPLOYEES, 
  INITIAL_OCTOBER_RUN, 
  MOCK_SEPTEMBER_CLOSED_RUN, 
  MOCK_BIOMETRIC_DEVICES, 
  MOCK_ATTENDANCE_RECORDS, 
  MOCK_CORRECTIONS, 
  MOCK_LEAVE_REQUESTS, 
  MOCK_CALENDAR_EVENTS, 
  MOCK_FINAL_DUES_CASE, 
  MOCK_AUDIT_LOGS,
  generatePayrollEmployeeResults
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { VeloraLogo } from './components/VeloraLogo';
import { ScreenId } from './components/Navigation';
import { PayrollDashboard } from './components/PayrollDashboard';
import { PayrollRunView } from './components/PayrollRunView';
import { CalculationTraceDrawer } from './components/CalculationTraceDrawer';
import { ReviewApprovalView } from './components/ReviewApprovalView';
import { AttendanceBiometricsView } from './components/AttendanceBiometricsView';
import { LeaveManagementView } from './components/LeaveManagementView';
import { SharedCalendarView } from './components/SharedCalendarView';
import { EmployeePortalView } from './components/EmployeePortalView';
import { FinalDuesView } from './components/FinalDuesView';
import { ReportsExportView } from './components/ReportsExportView';
import { PayrollSettingsView } from './components/PayrollSettingsView';
import { PayslipModal } from './components/PayslipModal';
import { EmployeeProfileView } from './components/EmployeeProfileView';
import { PayrollInputsView } from './components/PayrollInputsView';
import { AuditTrailView } from './components/AuditTrailView';
import { ShiftRosterView } from './components/ShiftRosterView';
import { LeaveBalancesPanel } from './components/LeaveBalancesPanel';
import { PayrollLifecyclePanel } from './components/PayrollLifecyclePanel';
import { StatutoryRulesPanel } from './components/StatutoryRulesPanel';
import { ExtraReportsPanel } from './components/ExtraReportsPanel';
import { can, canSee } from './utils/permissions';

export default function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(CURRENT_USERS[0]!); // Rosemary Mwanza (CEO)
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Application Data States
  const [currentRun, setCurrentRun] = useState<PayrollRun>(INITIAL_OCTOBER_RUN);
  const [priorRun] = useState<PayrollRun>(MOCK_SEPTEMBER_CLOSED_RUN);
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [biometricDevices, setBiometricDevices] = useState(MOCK_BIOMETRIC_DEVICES);
  const [attendanceRecords, setAttendanceRecords] = useState(MOCK_ATTENDANCE_RECORDS);
  const [corrections, setCorrections] = useState<AttendanceCorrectionRequest[]>(MOCK_CORRECTIONS);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(MOCK_CALENDAR_EVENTS);
  const [finalDuesCase] = useState(MOCK_FINAL_DUES_CASE);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(MOCK_AUDIT_LOGS);

  // Modal / Drawer States
  const [selectedTraceResult, setSelectedTraceResult] = useState<PayrollEmployeeResult | null>(null);
  const [payslipModalEmpId, setPayslipModalEmpId] = useState<string | null>(null);

  // Loading indicator states
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isSyncingDevices, setIsSyncingDevices] = useState(false);

  // Recalculate Payroll Engine Action
  const handleRecalculatePayroll = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      const refreshedResults = generatePayrollEmployeeResults();
      const updatedRun: PayrollRun = {
        ...currentRun,
        totalGross: refreshedResults.reduce((acc, r) => acc + r.grossPay, 0),
        totalNet: refreshedResults.reduce((acc, r) => acc + r.netPay, 0),
        totalStatutoryEmployee: refreshedResults.reduce((acc, r) => acc + r.statutory.totalStatutoryEmployee, 0),
        totalStatutoryEmployer: refreshedResults.reduce((acc, r) => acc + r.statutory.totalStatutoryEmployer, 0),
        totalDeductions: refreshedResults.reduce((acc, r) => acc + r.totalDeductions, 0),
        totalEmployerCost: refreshedResults.reduce((acc, r) => acc + r.totalEmployerCost, 0),
        calculatedAt: 'Just now (Live Calculation)',
        results: refreshedResults,
      };

      setCurrentRun(updatedRun);
      setIsRecalculating(false);

      const newAudit: AuditEvent = {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' EAT',
        userName: currentUser.name,
        userRole: currentUser.roleTitle,
        action: 'PAYROLL_RECALCULATE',
        entity: `PayrollRun #${currentRun.id}`,
        details: 'Evaluated Kenya statutory rules, employee attendance snapshots, and earnings structures for all enrolled workers.',
        severity: 'info',
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
    }, 700);
  };

  const handlePullAttendanceAndLeave = () => {
    handleRecalculatePayroll();
  };

  const handleSyncDevices = () => {
    setIsSyncingDevices(true);
    setTimeout(() => {
      setBiometricDevices((prev) =>
        prev.map((d) => ({
          ...d,
          status: 'online',
          lastSyncTime: 'Just now (Push protocol)',
          todayPunches: d.todayPunches + 14,
        }))
      );
      setIsSyncingDevices(false);
    }, 800);
  };

  // Maker-Checker Approvals
  const handleApproveRun = (approverName: string) => {
    setCurrentRun((prev) => ({
      ...prev,
      status: 'approved',
      approvedBy: approverName,
      approvedAt: new Date().toLocaleString(),
    }));

    const audit: AuditEvent = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' EAT',
      userName: approverName,
      userRole: currentUser.roleTitle,
      action: 'PAYROLL_APPROVE',
      entity: `PayrollRun #${currentRun.id}`,
      details: `Authorized October 2026 payroll disbursement. Published employee payslips to portal.`,
      severity: 'security',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const handleReturnForCorrection = (reason: string) => {
    setCurrentRun((prev) => ({
      ...prev,
      status: 'draft',
    }));

    const audit: AuditEvent = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' EAT',
      userName: currentUser.name,
      userRole: currentUser.roleTitle,
      action: 'PAYROLL_RETURN',
      entity: `PayrollRun #${currentRun.id}`,
      details: `Returned to Draft: "${reason}"`,
      severity: 'warning',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const handleCloseRun = () => {
    setCurrentRun((prev) => ({
      ...prev,
      status: 'closed',
      closedAt: new Date().toLocaleString(),
    }));

    const audit: AuditEvent = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' EAT',
      userName: currentUser.name,
      userRole: currentUser.roleTitle,
      action: 'PAYROLL_CLOSE_LOCK',
      entity: `PayrollRun #${currentRun.id}`,
      details: 'Period permanently locked into historical archive. Requires elevated permission to reopen.',
      severity: 'security',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const handleReopenRun = (reason: string) => {
    setCurrentRun((prev) => ({
      ...prev,
      status: 'reopened',
    }));

    const audit: AuditEvent = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' EAT',
      userName: currentUser.name,
      userRole: currentUser.roleTitle,
      action: 'PAYROLL_CONTROLLED_REOPEN',
      entity: `PayrollRun #${currentRun.id}`,
      details: `Controlled Reopen authorized: "${reason}". New version incremented.`,
      severity: 'security',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const handleApproveCorrection = (id: string) => {
    setCorrections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'approved', approvedBy: currentUser.name } : c))
    );
  };

  const handleRejectCorrection = (id: string) => {
    setCorrections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'rejected' } : c))
    );
  };

  const handleApproveLeave = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'approved', approvedBy: currentUser.name } : l))
    );
  };

  const handleRejectLeave = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'rejected' } : l))
    );
  };

  const handleAddLeaveRequest = (req: Partial<LeaveRequest>) => {
    const newLeave: LeaveRequest = {
      id: `lv_${Date.now()}`,
      employeeId: req.employeeId || 'emp_amina',
      employeeName: req.employeeName || 'Amina Otieno',
      leaveType: req.leaveType || 'annual',
      startDate: req.startDate || '2026-11-09',
      endDate: req.endDate || '2026-11-13',
      days: req.days || 5,
      reason: req.reason || 'Leave request',
      status: 'pending',
      affectsPayroll: req.affectsPayroll || false,
      deductionAmount: req.deductionAmount,
      hasAttachment: req.hasAttachment,
      attachmentName: req.attachmentName,
      submittedAt: new Date().toISOString().split('T')[0]!,
    };

    setLeaveRequests((prev) => [newLeave, ...prev]);

    const calendarEv: CalendarEvent = {
      id: `evt_lv_${Date.now()}`,
      title: `${newLeave.employeeName} - ${newLeave.leaveType.toUpperCase()} Leave (${newLeave.days}d)`,
      date: newLeave.startDate,
      endDate: newLeave.endDate,
      category: 'leave',
      description: `Submitted by ${newLeave.employeeName}: ${newLeave.reason}`,
    };
    setCalendarEvents((prev) => [calendarEv, ...prev]);
  };

  const selectedPayslipResult = payslipModalEmpId
    ? currentRun.results.find((r) => r.employeeId === payslipModalEmpId) || null
    : null;
  const selectedPayslipEmployee = payslipModalEmpId
    ? employees.find((e) => e.id === payslipModalEmpId)
    : undefined;

  const portalEmployeeRecord = employees.find((e) => e.id === (currentUser.employeeId ? currentUser.employeeId.toLowerCase().replace('emp-', 'emp_') : 'emp_amina')) || employees[0]!;
  const portalEmployeeResult = currentRun.results.find((r) => r.employeeId === portalEmployeeRecord.id);

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#2B2B2B] flex">
      {/* Dark Plum Sidebar Navigation (#3B1E54) */}
      <Sidebar
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        exceptionsCount={currentRun.exceptionsCount}
        pendingCorrectionsCount={corrections.filter((c) => c.status === 'pending').length}
        pendingLeaveCount={leaveRequests.filter((l) => l.status === 'pending').length}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        role={currentUser.role}
      />

      {/* Main Content Area offset by 64 (256px) on Desktop */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <Header
          currentUser={currentUser}
          onSelectUser={setCurrentUser}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Viewport Canvas (Ivory White #FFFDF8) */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {!canSee(currentUser.role, activeScreen) && (
            <div className="bg-white border border-[#DDD6CE] rounded-2xl p-10 text-center text-sm text-[#666]">
              Your role ({currentUser.roleTitle}) does not have access to this area.
            </div>
          )}
          {canSee(currentUser.role, activeScreen) && <>
          {activeScreen === 'employee_profiles' && <EmployeeProfileView employees={employees} />}
          {activeScreen === 'payroll_inputs' && <PayrollInputsView employees={employees} canEdit={can(currentUser.role, 'prepare')} />}
          {activeScreen === 'audit_trail' && <AuditTrailView auditLogs={auditLogs} />}
          {activeScreen === 'shifts' && <ShiftRosterView employees={employees} canApprove={can(currentUser.role, 'approve_time') || can(currentUser.role, 'prepare')} />}
          {activeScreen === 'payroll_run' && <PayrollLifecyclePanel run={currentRun} prior={priorRun} employees={employees} />}
          {activeScreen === 'dashboard' && (
            <PayrollDashboard
              currentRun={currentRun}
              priorRun={priorRun}
              currentUser={currentUser}
              onNavigate={setActiveScreen}
              onRecalculate={handleRecalculatePayroll}
            />
          )}

          {activeScreen === 'payroll_run' && (
            <PayrollRunView
              currentRun={currentRun}
              priorRun={priorRun}
              currentUser={currentUser}
              onSelectEmployeeForTrace={setSelectedTraceResult}
              onOpenPayslip={setPayslipModalEmpId}
              onRecalculate={handleRecalculatePayroll}
              onPullAttendanceAndLeave={handlePullAttendanceAndLeave}
              onApproveRun={handleApproveRun}
              onReturnForCorrection={handleReturnForCorrection}
              onCloseRun={handleCloseRun}
              onReopenRun={handleReopenRun}
              isRecalculating={isRecalculating}
            />
          )}

          {activeScreen === 'review_approval' && (
            <ReviewApprovalView
              currentRun={currentRun}
              priorRun={priorRun}
              currentUser={currentUser}
              onApproveRun={handleApproveRun}
              onReturnForCorrection={handleReturnForCorrection}
              onCloseRun={handleCloseRun}
              onReopenRun={handleReopenRun}
            />
          )}

          {activeScreen === 'attendance' && (
            <AttendanceBiometricsView
              devices={biometricDevices}
              records={attendanceRecords}
              corrections={corrections}
              onApproveCorrection={handleApproveCorrection}
              onRejectCorrection={handleRejectCorrection}
              onSyncDevices={handleSyncDevices}
              isSyncing={isSyncingDevices}
            />
          )}

          {activeScreen === 'leave' && (
            <LeaveManagementView
              leaveRequests={leaveRequests}
              employees={employees}
              onApproveLeave={handleApproveLeave}
              onRejectLeave={handleRejectLeave}
              onAddLeaveRequest={handleAddLeaveRequest}
            />
          )}
          {activeScreen === 'leave' && <LeaveBalancesPanel employees={employees} />}

          {activeScreen === 'calendar' && (
            <SharedCalendarView events={calendarEvents} />
          )}

          {activeScreen === 'my_pay' && (
            <EmployeePortalView
              currentUser={currentUser}
              employeeResult={portalEmployeeResult}
              employeeRecord={portalEmployeeRecord}
              onOpenPayslip={setPayslipModalEmpId}
            />
          )}

          {activeScreen === 'final_dues' && (
            <FinalDuesView initialDuesCase={finalDuesCase} />
          )}

          {activeScreen === 'reports' && (
            <><ReportsExportView currentRun={currentRun} /><ExtraReportsPanel run={currentRun} prior={priorRun} /></>
          )}

          {activeScreen === 'settings' && (
            <><PayrollSettingsView auditLogs={auditLogs} /><StatutoryRulesPanel /></>
          )}
          </>}
        </main>

        {/* Calculation Trace Drawer */}
        {selectedTraceResult && (
          <CalculationTraceDrawer
            result={selectedTraceResult}
            onClose={() => setSelectedTraceResult(null)}
            onOpenPayslip={(empId) => {
              setSelectedTraceResult(null);
              setPayslipModalEmpId(empId);
            }}
          />
        )}

        {/* Official Payslip Modal */}
        {payslipModalEmpId && selectedPayslipResult && (
          <PayslipModal
            result={selectedPayslipResult}
            employee={selectedPayslipEmployee}
            onClose={() => setPayslipModalEmpId(null)}
          />
        )}

        {/* Subdued Footer */}
        <footer className="bg-white border-t border-[#DDD6CE] py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-[#666]">
            <div className="flex items-center gap-2">
              <VeloraLogo theme="light" size="sm" showIconOnly />
              <span className="font-bold text-[#3B1E54]">VeloraHR</span>
              <span>·</span>
              <span>HR & Payroll</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
