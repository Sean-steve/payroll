export type PayrollPopulation = 'monthly_salaried' | 'casual_temporary' | 'daily_paid' | 'hourly_paid' | 'weekly_paid';

export type PayrollStatus = 'draft' | 'calculated' | 'review' | 'approved' | 'closed' | 'reopened';

export type UserRole = 
  | 'super_admin'
  | 'payroll_officer'
  | 'hr_manager'
  | 'finance_approver'
  | 'line_manager'
  | 'employee'
  | 'auditor';

export interface CurrentUser {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
  email: string;
  employeeId?: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  fullName: string;
  jobTitle: string;
  department: string;
  branch: string;
  costCentre: string;
  population: PayrollPopulation;
  payStructureId: string;
  basicSalary: number; // monthly or hourly/daily rate
  payBasis: 'monthly' | 'daily' | 'hourly' | 'weekly';
  kraPin: string;
  nssfNumber: string;
  shifNumber: string;
  nationalId: string;
  bankName: string;
  bankAccountNumber: string;
  mpesaNumber?: string;
  paymentMethod: 'bank_transfer' | 'mpesa';
  email: string;
  joinDate: string;
  status: 'active' | 'on_leave' | 'notice_period' | 'exited';
  terminationDate?: string;
  leaveBalanceDays: number;
  fixedAllowances: {
    housing: number;
    commuter: number;
    airtime: number;
  };
  recurringDeductions: {
    sacco: number;
    pensionVoluntary: number;
    loanRecovery: number;
  };
  loanBalance?: number;
}

export interface BiometricDevice {
  id: string;
  name: string;
  model: string;
  location: string;
  ipAddress: string;
  status: 'online' | 'offline' | 'syncing';
  lastSyncTime: string;
  activeUsersCount: number;
  todayPunches: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut: string;
  hoursWorked: number;
  overtimeHours: number;
  overtimeMultiplier: 1.5 | 2.0;
  status: 'present' | 'late' | 'early_departure' | 'absent' | 'on_leave' | 'holiday';
  exception?: 'missing_clock_out' | 'unapproved_overtime' | 'late_arrival' | 'unexcused_absence';
  isApproved: boolean;
  biometricDeviceId: string;
}

export interface AttendanceCorrectionRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  originalIn: string;
  originalOut: string;
  requestedIn: string;
  requestedOut: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  approvedBy?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'annual' | 'sick' | 'maternity' | 'paternity' | 'compassionate' | 'unpaid' | 'study';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  hasAttachment?: boolean | undefined;
  attachmentName?: string | undefined;
  affectsPayroll: boolean;
  deductionAmount?: number | undefined;
  submittedAt: string;
  approvedBy?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  category: 'leave' | 'holiday' | 'payroll' | 'performance' | 'company';
  department?: string;
  description: string;
  status?: string;
}

export interface KenyaStatutoryBreakdown {
  nssfTier1: number;
  nssfTier2: number;
  totalNssfEmployee: number;
  totalNssfEmployer: number;
  shifEmployee: number;
  ahlEmployee: number; // 1.5%
  ahlEmployer: number; // 1.5%
  taxablePay: number;
  grossTax: number;
  personalRelief: number; // KES 2,400
  insuranceRelief: number;
  housingRelief: number;
  netPaye: number;
  totalStatutoryEmployee: number;
  totalStatutoryEmployer: number;
}

export interface PayrollEmployeeResult {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  population: PayrollPopulation;
  payBasis: 'monthly' | 'daily' | 'hourly' | 'weekly';
  rate: number;
  
  // Time & Attendance Inputs
  payableDaysOrHours: number;
  overtimeHours: number;
  overtimePay: number;
  unpaidLeaveDays: number;
  unpaidLeaveDeduction: number;
  
  // Earnings
  basePay: number;
  housingAllowance: number;
  commuterAllowance: number;
  airtimeAllowance: number;
  bonus: number;
  commission: number;
  arrears: number;
  totalEarnings: number;
  grossPay: number;
  
  // Statutory
  statutory: KenyaStatutoryBreakdown;
  
  // Non-statutory deductions
  saccoDeduction: number;
  loanDeduction: number;
  pensionVoluntary: number;
  otherDeductions: number;
  totalDeductions: number;
  
  // Final outputs
  netPay: number;
  totalEmployerCost: number;
  
  // Flags & exceptions
  hasExceptions: boolean;
  exceptionNotes?: string[];
  status: 'calculated' | 'verified' | 'flagged';
  payslipRef: string;
}

export interface PayrollRun {
  id: string;
  periodName: string; // e.g. "October 2026"
  periodMonth: number; // 10
  periodYear: number; // 2026
  startDate: string;
  endDate: string;
  cutOffDate: string;
  status: PayrollStatus;
  totalGross: number;
  totalNet: number;
  totalStatutoryEmployee: number;
  totalStatutoryEmployer: number;
  totalDeductions: number;
  totalEmployerCost: number;
  workerCount: number;
  exceptionsCount: number;
  calculatedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  closedAt?: string;
  results: PayrollEmployeeResult[];
}

export interface FinalDuesCalculation {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  jobTitle: string;
  joinDate: string;
  lastWorkingDay: string;
  reason: 'resignation' | 'end_of_contract' | 'retirement' | 'redundancy';
  basicSalary: number;
  
  // Components
  proratedDaysWorked: number;
  proratedSalary: number;
  accruedLeaveDays: number;
  accruedLeavePayout: number;
  noticeInLieuPay: number;
  noticeRecoveryDeduction: number;
  severanceGratuityPay: number;
  unpaidOvertimeOrBonus: number;
  
  // Deductions
  loanOutstandingCleared: number;
  saccoNoticeDeduction: number;
  otherClearances: number;
  
  // Gross final settlement
  grossFinalSettlement: number;
  
  // Tax
  taxableFinalAmount: number;
  finalPayeDeduction: number;
  finalNssfDeduction: number;
  finalShifDeduction: number;
  finalAhlDeduction: number;
  
  // Net final payout
  netFinalDues: number;
  status: 'draft' | 'reviewed' | 'authorized' | 'paid';
  notes: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  entity: string;
  details: string;
  severity: 'info' | 'warning' | 'security';
}
