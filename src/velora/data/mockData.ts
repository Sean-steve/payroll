import { 
  Employee, 
  BiometricDevice, 
  AttendanceRecord, 
  AttendanceCorrectionRequest, 
  LeaveRequest, 
  CalendarEvent, 
  PayrollRun, 
  PayrollEmployeeResult, 
  FinalDuesCalculation, 
  AuditEvent,
  CurrentUser 
} from '../types/hr';
import { calculateKenyaStatutory } from '../utils/kenyaPayrollCalculator';

export const CURRENT_USERS: CurrentUser[] = [
  {
    id: 'usr_rosemary',
    name: 'Rosemary Mwanza',
    role: 'finance_approver',
    roleTitle: 'Chief Executive Officer & Final Approver',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 'rosemary.mwanza@orchidhr.co.ke',
    employeeId: 'EMP-001',
  },
  {
    id: 'usr_stephen',
    name: 'Stephen Nyaga',
    role: 'payroll_officer',
    roleTitle: 'HR Operations & Payroll Lead',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'stephen.nyaga@orchidhr.co.ke',
    employeeId: 'EMP-002',
  },
  {
    id: 'usr_alice',
    name: 'Alice Wambui',
    role: 'hr_manager',
    roleTitle: 'Finance Director & Payroll Reviewer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    email: 'alice.wambui@orchidhr.co.ke',
    employeeId: 'EMP-003',
  },
  {
    id: 'usr_amina',
    name: 'Amina Otieno',
    role: 'employee',
    roleTitle: 'Senior Software Engineer (Employee Portal)',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    email: 'amina.otieno@orchidhr.co.ke',
    employeeId: 'EMP-104',
  },
  {
    id: 'usr_david',
    name: "David Ndung'u",
    role: 'employee',
    roleTitle: 'Operations Supervisor (Exiting Employee)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'david.ndungu@orchidhr.co.ke',
    employeeId: 'EMP-109',
  }
];

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'emp_amina',
    employeeCode: 'EMP-104',
    fullName: 'Amina Otieno',
    jobTitle: 'Senior Software Engineer',
    department: 'Engineering',
    branch: 'Nairobi HQ - Upper Hill',
    costCentre: 'CC-ENG-01',
    population: 'monthly_salaried',
    payStructureId: 'ps_monthly_exec',
    basicSalary: 145000,
    payBasis: 'monthly',
    kraPin: 'A009845123K',
    nssfNumber: 'NSSF-8492019',
    shifNumber: 'SHIF-992014',
    nationalId: '31298451',
    bankName: 'Equity Bank Kenya',
    bankAccountNumber: '0180293849102',
    mpesaNumber: '+254712345678',
    paymentMethod: 'bank_transfer',
    email: 'amina.otieno@orchidhr.co.ke',
    joinDate: '2023-04-15',
    status: 'active',
    leaveBalanceDays: 14,
    fixedAllowances: {
      housing: 25000,
      commuter: 12000,
      airtime: 4000,
    },
    recurringDeductions: {
      sacco: 10000,
      pensionVoluntary: 5000,
      loanRecovery: 0,
    },
  },
  {
    id: 'emp_david',
    employeeCode: 'EMP-109',
    fullName: "David Ndung'u",
    jobTitle: 'Operations Supervisor',
    department: 'Operations & Logistics',
    branch: 'Nairobi HQ - Industrial Area',
    costCentre: 'CC-OPS-02',
    population: 'monthly_salaried',
    payStructureId: 'ps_monthly_ops',
    basicSalary: 85000,
    payBasis: 'monthly',
    kraPin: 'A007412890P',
    nssfNumber: 'NSSF-5829104',
    shifNumber: 'SHIF-472091',
    nationalId: '28491029',
    bankName: 'KCB Bank Kenya',
    bankAccountNumber: '1284910294',
    mpesaNumber: '+254722889900',
    paymentMethod: 'bank_transfer',
    email: 'david.ndungu@orchidhr.co.ke',
    joinDate: '2022-02-01',
    status: 'notice_period',
    terminationDate: '2026-10-31',
    leaveBalanceDays: 14.5,
    fixedAllowances: {
      housing: 15000,
      commuter: 8000,
      airtime: 2000,
    },
    recurringDeductions: {
      sacco: 6000,
      pensionVoluntary: 2000,
      loanRecovery: 8000,
    },
    loanBalance: 16000,
  },
  {
    id: 'emp_faith',
    employeeCode: 'EMP-112',
    fullName: 'Faith Muthoni',
    jobTitle: 'Talent Acquisition Partner',
    department: 'Human Resources',
    branch: 'Nairobi HQ - Upper Hill',
    costCentre: 'CC-HR-01',
    population: 'monthly_salaried',
    payStructureId: 'ps_monthly_admin',
    basicSalary: 95000,
    payBasis: 'monthly',
    kraPin: 'A006321908M',
    nssfNumber: 'NSSF-6729104',
    shifNumber: 'SHIF-338910',
    nationalId: '29841022',
    bankName: 'Standard Chartered Kenya',
    bankAccountNumber: '01029384756',
    mpesaNumber: '+254733445566',
    paymentMethod: 'bank_transfer',
    email: 'faith.muthoni@orchidhr.co.ke',
    joinDate: '2024-01-10',
    status: 'active',
    leaveBalanceDays: 9,
    fixedAllowances: {
      housing: 18000,
      commuter: 9000,
      airtime: 3000,
    },
    recurringDeductions: {
      sacco: 5000,
      pensionVoluntary: 3000,
      loanRecovery: 0,
    },
  },
  {
    id: 'emp_brian',
    employeeCode: 'EMP-CAS-201',
    fullName: 'Brian Kipchoge',
    jobTitle: 'Logistics Handler (Daily Casual)',
    department: 'Warehouse & Fulfillment',
    branch: 'Mombasa Road Depot',
    costCentre: 'CC-LOG-03',
    population: 'daily_paid',
    payStructureId: 'ps_daily_casual',
    basicSalary: 2200, // KES 2,200 per day worked
    payBasis: 'daily',
    kraPin: 'A010892471Z',
    nssfNumber: 'NSSF-9081245',
    shifNumber: 'SHIF-120491',
    nationalId: '34591028',
    bankName: 'Safaricom M-Pesa',
    bankAccountNumber: '254701239845',
    mpesaNumber: '+254701239845',
    paymentMethod: 'mpesa',
    email: 'brian.kipchoge@orchidhr.co.ke',
    joinDate: '2025-06-01',
    status: 'active',
    leaveBalanceDays: 0,
    fixedAllowances: {
      housing: 0,
      commuter: 3500,
      airtime: 0,
    },
    recurringDeductions: {
      sacco: 1500,
      pensionVoluntary: 0,
      loanRecovery: 0,
    },
  },
  {
    id: 'emp_victor',
    employeeCode: 'EMP-HR-305',
    fullName: 'Victor Ochieng',
    jobTitle: 'Field Equipment Technician (Hourly)',
    department: 'Technical Services',
    branch: 'Mombasa Branch',
    costCentre: 'CC-TECH-04',
    population: 'hourly_paid',
    payStructureId: 'ps_hourly_field',
    basicSalary: 650, // KES 650 per hour
    payBasis: 'hourly',
    kraPin: 'A004198273T',
    nssfNumber: 'NSSF-7729184',
    shifNumber: 'SHIF-883921',
    nationalId: '27481920',
    bankName: 'NCBA Bank Kenya',
    bankAccountNumber: '4491029485',
    mpesaNumber: '+254711998877',
    paymentMethod: 'bank_transfer',
    email: 'victor.ochieng@orchidhr.co.ke',
    joinDate: '2024-08-15',
    status: 'active',
    leaveBalanceDays: 6,
    fixedAllowances: {
      housing: 0,
      commuter: 4500,
      airtime: 1500,
    },
    recurringDeductions: {
      sacco: 2500,
      pensionVoluntary: 1500,
      loanRecovery: 3000,
    },
    loanBalance: 9000,
  },
  {
    id: 'emp_grace',
    employeeCode: 'EMP-118',
    fullName: 'Grace Wanjiku',
    jobTitle: 'Lead QA Automation Engineer',
    department: 'Engineering',
    branch: 'Nairobi HQ - Upper Hill',
    costCentre: 'CC-ENG-01',
    population: 'monthly_salaried',
    payStructureId: 'ps_monthly_exec',
    basicSalary: 130000,
    payBasis: 'monthly',
    kraPin: '', // Intentional missing KRA PIN for validation exception engine demonstration!
    nssfNumber: 'NSSF-8829104',
    shifNumber: 'SHIF-552910',
    nationalId: '32481029',
    bankName: 'Co-operative Bank of Kenya',
    bankAccountNumber: '01129384756100',
    mpesaNumber: '+254720112233',
    paymentMethod: 'bank_transfer',
    email: 'grace.wanjiku@orchidhr.co.ke',
    joinDate: '2024-03-01',
    status: 'active',
    leaveBalanceDays: 12,
    fixedAllowances: {
      housing: 22000,
      commuter: 10000,
      airtime: 3000,
    },
    recurringDeductions: {
      sacco: 8000,
      pensionVoluntary: 4000,
      loanRecovery: 0,
    },
  },
  {
    id: 'emp_samuel',
    employeeCode: 'EMP-120',
    fullName: 'Samuel Mwangi',
    jobTitle: 'Client Success Manager',
    department: 'Customer Operations',
    branch: 'Nairobi HQ - Upper Hill',
    costCentre: 'CC-CS-02',
    population: 'monthly_salaried',
    payStructureId: 'ps_monthly_admin',
    basicSalary: 110000,
    payBasis: 'monthly',
    kraPin: 'A008821943L',
    nssfNumber: 'NSSF-9948210',
    shifNumber: 'SHIF-772910',
    nationalId: '30192847',
    bankName: 'Absa Bank Kenya',
    bankAccountNumber: '0491029384',
    mpesaNumber: '+254799001122',
    paymentMethod: 'bank_transfer',
    email: 'samuel.mwangi@orchidhr.co.ke',
    joinDate: '2023-11-01',
    status: 'active',
    leaveBalanceDays: 18,
    fixedAllowances: {
      housing: 20000,
      commuter: 9000,
      airtime: 3500,
    },
    recurringDeductions: {
      sacco: 7000,
      pensionVoluntary: 3500,
      loanRecovery: 0,
    },
  }
];

export const MOCK_BIOMETRIC_DEVICES: BiometricDevice[] = [
  {
    id: 'bio_01',
    name: 'ZKTeco SpeedFace-V5L',
    model: 'ZKTeco Visible Light Facial Recognition & Palm',
    location: 'Nairobi HQ - Main Entrance Gate A',
    ipAddress: '192.168.10.45:4370',
    status: 'online',
    lastSyncTime: '2 mins ago (Real-time Push)',
    activeUsersCount: 48,
    todayPunches: 94,
  },
  {
    id: 'bio_02',
    name: 'Suprema BioStation A2',
    model: 'Suprema Fingerprint & RFID Terminal',
    location: 'Industrial Area Depot - Staff Turnstile',
    ipAddress: '192.168.20.12:1471',
    status: 'online',
    lastSyncTime: '5 mins ago',
    activeUsersCount: 22,
    todayPunches: 41,
  },
  {
    id: 'bio_03',
    name: 'ZKTeco SilkBio-101TC',
    model: 'Hybrid Biometric Fingerprint & Time Clock',
    location: 'Mombasa Regional Office',
    ipAddress: '192.168.30.8:4370',
    status: 'syncing',
    lastSyncTime: 'Syncing batch (14 punches pending)',
    activeUsersCount: 16,
    todayPunches: 28,
  }
];

export const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'att_01',
    employeeId: 'emp_amina',
    date: '2026-10-23',
    clockIn: '08:04 AM',
    clockOut: '17:15 PM',
    hoursWorked: 8.5,
    overtimeHours: 0.5,
    overtimeMultiplier: 1.5,
    status: 'present',
    isApproved: true,
    biometricDeviceId: 'bio_01',
  },
  {
    id: 'att_02',
    employeeId: 'emp_david',
    date: '2026-10-23',
    clockIn: '07:55 AM',
    clockOut: '18:45 PM',
    hoursWorked: 9.8,
    overtimeHours: 2.0,
    overtimeMultiplier: 1.5,
    status: 'present',
    isApproved: true,
    biometricDeviceId: 'bio_02',
  },
  {
    id: 'att_03',
    employeeId: 'emp_brian',
    date: '2026-10-23',
    clockIn: '07:45 AM',
    clockOut: '16:30 PM',
    hoursWorked: 8.0,
    overtimeHours: 0,
    overtimeMultiplier: 1.5,
    status: 'present',
    isApproved: true,
    biometricDeviceId: 'bio_02',
  },
  {
    id: 'att_04',
    employeeId: 'emp_victor',
    date: '2026-10-23',
    clockIn: '08:30 AM',
    clockOut: '19:30 PM',
    hoursWorked: 10.0,
    overtimeHours: 3.0,
    overtimeMultiplier: 1.5,
    status: 'present',
    exception: 'unapproved_overtime',
    isApproved: false,
    biometricDeviceId: 'bio_03',
  },
  {
    id: 'att_05',
    employeeId: 'emp_grace',
    date: '2026-10-23',
    clockIn: '09:22 AM',
    clockOut: '17:30 PM',
    hoursWorked: 7.2,
    overtimeHours: 0,
    overtimeMultiplier: 1.5,
    status: 'late',
    exception: 'late_arrival',
    isApproved: true,
    biometricDeviceId: 'bio_01',
  }
];

export const MOCK_CORRECTIONS: AttendanceCorrectionRequest[] = [
  {
    id: 'corr_01',
    employeeId: 'emp_victor',
    employeeName: 'Victor Ochieng',
    date: '2026-10-21',
    originalIn: '08:30 AM',
    originalOut: '--:--',
    requestedIn: '08:30 AM',
    requestedOut: '17:35 PM',
    reason: 'Power outage at Mombasa port reader during evening clock-out. Supervisor verified departure.',
    status: 'pending',
    requestedAt: '2026-10-22 09:15 AM',
  },
  {
    id: 'corr_02',
    employeeId: 'emp_samuel',
    employeeName: 'Samuel Mwangi',
    date: '2026-10-18',
    originalIn: '10:15 AM',
    originalOut: '18:00 PM',
    requestedIn: '08:15 AM',
    requestedOut: '18:00 PM',
    reason: 'Attended client breakfast presentation at Radisson Blu before arriving at office.',
    status: 'approved',
    requestedAt: '2026-10-19 08:30 AM',
    approvedBy: 'Alice Wambui',
  }
];

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lv_01',
    employeeId: 'emp_amina',
    employeeName: 'Amina Otieno',
    leaveType: 'annual',
    startDate: '2026-11-02',
    endDate: '2026-11-06',
    days: 5,
    reason: 'Annual family holiday break.',
    status: 'approved',
    hasAttachment: false,
    affectsPayroll: false,
    submittedAt: '2026-10-15',
    approvedBy: 'Rosemary Mwanza',
  },
  {
    id: 'lv_02',
    employeeId: 'emp_faith',
    employeeName: 'Faith Muthoni',
    leaveType: 'sick',
    startDate: '2026-10-12',
    endDate: '2026-10-14',
    days: 3,
    reason: 'Acute bronchitis, doctor advised 3 days bed rest.',
    status: 'approved',
    hasAttachment: true,
    attachmentName: 'Aga_Khan_Medical_Note_Dr_Kariuki.pdf',
    affectsPayroll: false,
    submittedAt: '2026-10-12',
    approvedBy: 'Alice Wambui',
  },
  {
    id: 'lv_03',
    employeeId: 'emp_victor',
    employeeName: 'Victor Ochieng',
    leaveType: 'unpaid',
    startDate: '2026-10-05',
    endDate: '2026-10-06',
    days: 2,
    reason: 'Personal family emergency travel beyond annual leave allocation.',
    status: 'approved',
    hasAttachment: false,
    affectsPayroll: true,
    deductionAmount: 7800, // 2 days unpaid salary prorated deduction
    submittedAt: '2026-10-02',
    approvedBy: 'Stephen Nyaga',
  },
  {
    id: 'lv_04',
    employeeId: 'emp_samuel',
    employeeName: 'Samuel Mwangi',
    leaveType: 'compassionate',
    startDate: '2026-10-27',
    endDate: '2026-10-29',
    days: 3,
    reason: 'Bereavement leave for immediate family funeral.',
    status: 'pending',
    hasAttachment: true,
    attachmentName: 'Official_Notice.pdf',
    affectsPayroll: false,
    submittedAt: '2026-10-24',
  }
];

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt_01',
    title: 'Mashujaa Day (National Public Holiday)',
    date: '2026-10-20',
    category: 'holiday',
    description: 'Gazetted Kenya Public Holiday. Standard office closed; security and shift overtime paid at 2.0x rate.',
  },
  {
    id: 'evt_02',
    title: 'October Payroll Cut-Off Date',
    date: '2026-10-24',
    category: 'payroll',
    description: 'Final submission cut-off for timesheets, overtime pre-approvals, and unpaid leave records.',
  },
  {
    id: 'evt_03',
    title: 'Payroll Review & Maker-Checker Audit',
    date: '2026-10-26',
    category: 'payroll',
    description: 'Variance analysis, exception reconciliation, and Finance Director review window.',
  },
  {
    id: 'evt_04',
    title: 'Final Disbursement & Payslip Publication',
    date: '2026-10-28',
    category: 'payroll',
    description: 'Executive authorization, bank batch release, and payslip availability in Employee Portal.',
  },
  {
    id: 'evt_05',
    title: 'Amina Otieno - Approved Annual Leave',
    date: '2026-11-02',
    endDate: '2026-11-06',
    category: 'leave',
    department: 'Engineering',
    description: '5 working days off approved by CEO.',
  },
  {
    id: 'evt_06',
    title: 'Q4 Performance Review Cycle Kicks Off',
    date: '2026-11-10',
    category: 'performance',
    description: 'Cross-module integration: KPI objective assessments and mid-cycle employee reviews.',
  },
  {
    id: 'evt_07',
    title: 'Jamhuri Day (Kenya Independence Day)',
    date: '2026-12-12',
    category: 'holiday',
    description: 'Gazetted National Holiday celebrating Republic Day.',
  }
];

// Helper to construct employee payroll results
export function generatePayrollEmployeeResults(): PayrollEmployeeResult[] {
  return [
    // Amina Otieno
    (() => {
      const basePay = 145000;
      const housing = 25000;
      const commuter = 12000;
      const airtime = 4000;
      const overtimePay = 4500; // 0.5hr * 1.5x regular
      const bonus = 0;
      const unpaidLeaveDeduction = 0;
      const totalEarnings = housing + commuter + airtime + overtimePay + bonus;
      const grossPay = basePay + totalEarnings;
      const sacco = 10000;
      const pensionVoluntary = 5000;
      const loan = 0;
      const stat = calculateKenyaStatutory(grossPay, pensionVoluntary);
      const totalDeductions = stat.totalStatutoryEmployee + sacco + loan + pensionVoluntary + unpaidLeaveDeduction;
      const netPay = grossPay - totalDeductions;
      const totalEmployerCost = grossPay + stat.totalStatutoryEmployer;

      return {
        id: 'res_amina',
        employeeId: 'emp_amina',
        employeeName: 'Amina Otieno',
        employeeCode: 'EMP-104',
        department: 'Engineering',
        population: 'monthly_salaried',
        payBasis: 'monthly',
        rate: 145000,
        payableDaysOrHours: 22,
        overtimeHours: 2.5,
        overtimePay,
        unpaidLeaveDays: 0,
        unpaidLeaveDeduction: 0,
        basePay,
        housingAllowance: housing,
        commuterAllowance: commuter,
        airtimeAllowance: airtime,
        bonus,
        commission: 0,
        arrears: 0,
        totalEarnings,
        grossPay,
        statutory: stat,
        saccoDeduction: sacco,
        loanDeduction: loan,
        pensionVoluntary,
        otherDeductions: 0,
        totalDeductions,
        netPay,
        totalEmployerCost,
        hasExceptions: false,
        status: 'verified',
        payslipRef: 'VEL-2026-10-00104',
      };
    })(),

    // David Ndung'u (Operations Supervisor, Exiting)
    (() => {
      const basePay = 85000;
      const housing = 15000;
      const commuter = 8000;
      const airtime = 2000;
      const overtimePay = 7500; // 12 hours approved overtime
      const bonus = 0;
      const totalEarnings = housing + commuter + airtime + overtimePay + bonus;
      const grossPay = basePay + totalEarnings;
      const sacco = 6000;
      const pensionVoluntary = 2000;
      const loan = 8000;
      const stat = calculateKenyaStatutory(grossPay, pensionVoluntary);
      const totalDeductions = stat.totalStatutoryEmployee + sacco + loan + pensionVoluntary;
      const netPay = grossPay - totalDeductions;
      const totalEmployerCost = grossPay + stat.totalStatutoryEmployer;

      return {
        id: 'res_david',
        employeeId: 'emp_david',
        employeeName: "David Ndung'u",
        employeeCode: 'EMP-109',
        department: 'Operations & Logistics',
        population: 'monthly_salaried',
        payBasis: 'monthly',
        rate: 85000,
        payableDaysOrHours: 22,
        overtimeHours: 12.0,
        overtimePay,
        unpaidLeaveDays: 0,
        unpaidLeaveDeduction: 0,
        basePay,
        housingAllowance: housing,
        commuterAllowance: commuter,
        airtimeAllowance: airtime,
        bonus,
        commission: 0,
        arrears: 0,
        totalEarnings,
        grossPay,
        statutory: stat,
        saccoDeduction: sacco,
        loanDeduction: loan,
        pensionVoluntary,
        otherDeductions: 0,
        totalDeductions,
        netPay,
        totalEmployerCost,
        hasExceptions: true,
        exceptionNotes: ['Notice period active: Final working date 31 Oct 2026. Final Dues tabulation required.'],
        status: 'verified',
        payslipRef: 'VEL-2026-10-00109',
      };
    })(),

    // Faith Muthoni
    (() => {
      const basePay = 95000;
      const housing = 18000;
      const commuter = 9000;
      const airtime = 3000;
      const overtimePay = 0;
      const bonus = 15000; // Quarterly hiring performance bonus
      const totalEarnings = housing + commuter + airtime + overtimePay + bonus;
      const grossPay = basePay + totalEarnings;
      const sacco = 5000;
      const pensionVoluntary = 3000;
      const loan = 0;
      const stat = calculateKenyaStatutory(grossPay, pensionVoluntary);
      const totalDeductions = stat.totalStatutoryEmployee + sacco + loan + pensionVoluntary;
      const netPay = grossPay - totalDeductions;
      const totalEmployerCost = grossPay + stat.totalStatutoryEmployer;

      return {
        id: 'res_faith',
        employeeId: 'emp_faith',
        employeeName: 'Faith Muthoni',
        employeeCode: 'EMP-112',
        department: 'Human Resources',
        population: 'monthly_salaried',
        payBasis: 'monthly',
        rate: 95000,
        payableDaysOrHours: 22,
        overtimeHours: 0,
        overtimePay,
        unpaidLeaveDays: 0,
        unpaidLeaveDeduction: 0,
        basePay,
        housingAllowance: housing,
        commuterAllowance: commuter,
        airtimeAllowance: airtime,
        bonus,
        commission: 0,
        arrears: 0,
        totalEarnings,
        grossPay,
        statutory: stat,
        saccoDeduction: sacco,
        loanDeduction: loan,
        pensionVoluntary,
        otherDeductions: 0,
        totalDeductions,
        netPay,
        totalEmployerCost,
        hasExceptions: false,
        status: 'verified',
        payslipRef: 'VEL-2026-10-00112',
      };
    })(),

    // Brian Kipchoge (Daily Casual Worker)
    (() => {
      const dailyRate = 2200;
      const daysWorked = 24; // Approved attendance from biometric turns
      const basePay = dailyRate * daysWorked; // KES 52,800
      const commuter = 3500;
      const totalEarnings = commuter;
      const grossPay = basePay + totalEarnings; // KES 56,300
      const sacco = 1500;
      const pensionVoluntary = 0;
      const loan = 0;
      const stat = calculateKenyaStatutory(grossPay, pensionVoluntary);
      const totalDeductions = stat.totalStatutoryEmployee + sacco + loan;
      const netPay = grossPay - totalDeductions;
      const totalEmployerCost = grossPay + stat.totalStatutoryEmployer;

      return {
        id: 'res_brian',
        employeeId: 'emp_brian',
        employeeName: 'Brian Kipchoge',
        employeeCode: 'EMP-CAS-201',
        department: 'Warehouse & Fulfillment',
        population: 'daily_paid',
        payBasis: 'daily',
        rate: 2200,
        payableDaysOrHours: 24,
        overtimeHours: 0,
        overtimePay: 0,
        unpaidLeaveDays: 0,
        unpaidLeaveDeduction: 0,
        basePay,
        housingAllowance: 0,
        commuterAllowance: commuter,
        airtimeAllowance: 0,
        bonus: 0,
        commission: 0,
        arrears: 0,
        totalEarnings,
        grossPay,
        statutory: stat,
        saccoDeduction: sacco,
        loanDeduction: loan,
        pensionVoluntary,
        otherDeductions: 0,
        totalDeductions,
        netPay,
        totalEmployerCost,
        hasExceptions: false,
        status: 'verified',
        payslipRef: 'VEL-2026-10-00201',
      };
    })(),

    // Victor Ochieng (Hourly Technician with 2 Days Unpaid Leave sync)
    (() => {
      const hourlyRate = 650;
      const standardHours = 160; // 20 working days * 8h
      const overtimeHours = 14; // Overtime
      const overtimePay = Math.round(14 * (650 * 1.5)); // KES 13,650
      const basePay = standardHours * hourlyRate; // KES 104,000
      const commuter = 4500;
      const airtime = 1500;
      const unpaidLeaveDays = 2; // 16 hours
      const unpaidLeaveDeduction = 16 * hourlyRate; // KES 10,400 deduction
      const totalEarnings = commuter + airtime + overtimePay;
      const grossPay = basePay + totalEarnings - unpaidLeaveDeduction;
      const sacco = 2500;
      const pensionVoluntary = 1500;
      const loan = 3000;
      const stat = calculateKenyaStatutory(grossPay, pensionVoluntary);
      const totalDeductions = stat.totalStatutoryEmployee + sacco + loan + pensionVoluntary;
      const netPay = grossPay - totalDeductions;
      const totalEmployerCost = grossPay + stat.totalStatutoryEmployer;

      return {
        id: 'res_victor',
        employeeId: 'emp_victor',
        employeeName: 'Victor Ochieng',
        employeeCode: 'EMP-HR-305',
        department: 'Technical Services',
        population: 'hourly_paid',
        payBasis: 'hourly',
        rate: 650,
        payableDaysOrHours: 174, // 160 std + 14 OT
        overtimeHours,
        overtimePay,
        unpaidLeaveDays,
        unpaidLeaveDeduction,
        basePay,
        housingAllowance: 0,
        commuterAllowance: commuter,
        airtimeAllowance: airtime,
        bonus: 0,
        commission: 0,
        arrears: 0,
        totalEarnings,
        grossPay,
        statutory: stat,
        saccoDeduction: sacco,
        loanDeduction: loan,
        pensionVoluntary,
        otherDeductions: 0,
        totalDeductions,
        netPay,
        totalEmployerCost,
        hasExceptions: true,
        exceptionNotes: [
          'Leave Integration: 2 days approved unpaid leave deducted (-KES 10,400)',
          'Overtime Integration: 14 approved overtime hours added (+KES 13,650)'
        ],
        status: 'flagged',
        payslipRef: 'VEL-2026-10-00305',
      };
    })(),

    // Grace Wanjiku (Missing KRA PIN exception)
    (() => {
      const basePay = 130000;
      const housing = 22000;
      const commuter = 10000;
      const airtime = 3000;
      const totalEarnings = housing + commuter + airtime;
      const grossPay = basePay + totalEarnings;
      const sacco = 8000;
      const pensionVoluntary = 4000;
      const loan = 0;
      const stat = calculateKenyaStatutory(grossPay, pensionVoluntary);
      const totalDeductions = stat.totalStatutoryEmployee + sacco + loan + pensionVoluntary;
      const netPay = grossPay - totalDeductions;
      const totalEmployerCost = grossPay + stat.totalStatutoryEmployer;

      return {
        id: 'res_grace',
        employeeId: 'emp_grace',
        employeeName: 'Grace Wanjiku',
        employeeCode: 'EMP-118',
        department: 'Engineering',
        population: 'monthly_salaried',
        payBasis: 'monthly',
        rate: 130000,
        payableDaysOrHours: 22,
        overtimeHours: 0,
        overtimePay: 0,
        unpaidLeaveDays: 0,
        unpaidLeaveDeduction: 0,
        basePay,
        housingAllowance: housing,
        commuterAllowance: commuter,
        airtimeAllowance: airtime,
        bonus: 0,
        commission: 0,
        arrears: 0,
        totalEarnings,
        grossPay,
        statutory: stat,
        saccoDeduction: sacco,
        loanDeduction: loan,
        pensionVoluntary,
        otherDeductions: 0,
        totalDeductions,
        netPay,
        totalEmployerCost,
        hasExceptions: true,
        exceptionNotes: ['Validation Failure: Missing mandatory KRA Tax PIN. P10 statutory return will fail if uncorrected.'],
        status: 'flagged',
        payslipRef: 'VEL-2026-10-00118',
      };
    })(),

    // Samuel Mwangi
    (() => {
      const basePay = 110000;
      const housing = 20000;
      const commuter = 9000;
      const airtime = 3500;
      const totalEarnings = housing + commuter + airtime;
      const grossPay = basePay + totalEarnings;
      const sacco = 7000;
      const pensionVoluntary = 3500;
      const loan = 0;
      const stat = calculateKenyaStatutory(grossPay, pensionVoluntary);
      const totalDeductions = stat.totalStatutoryEmployee + sacco + loan + pensionVoluntary;
      const netPay = grossPay - totalDeductions;
      const totalEmployerCost = grossPay + stat.totalStatutoryEmployer;

      return {
        id: 'res_samuel',
        employeeId: 'emp_samuel',
        employeeName: 'Samuel Mwangi',
        employeeCode: 'EMP-120',
        department: 'Customer Operations',
        population: 'monthly_salaried',
        payBasis: 'monthly',
        rate: 110000,
        payableDaysOrHours: 22,
        overtimeHours: 0,
        overtimePay: 0,
        unpaidLeaveDays: 0,
        unpaidLeaveDeduction: 0,
        basePay,
        housingAllowance: housing,
        commuterAllowance: commuter,
        airtimeAllowance: airtime,
        bonus: 0,
        commission: 0,
        arrears: 0,
        totalEarnings,
        grossPay,
        statutory: stat,
        saccoDeduction: sacco,
        loanDeduction: loan,
        pensionVoluntary,
        otherDeductions: 0,
        totalDeductions,
        netPay,
        totalEmployerCost,
        hasExceptions: false,
        status: 'verified',
        payslipRef: 'VEL-2026-10-00120',
      };
    })()
  ];
}

const initialResults = generatePayrollEmployeeResults();

export const INITIAL_OCTOBER_RUN: PayrollRun = {
  id: 'run_2026_10',
  periodName: 'October 2026',
  periodMonth: 10,
  periodYear: 2026,
  startDate: '2026-10-01',
  endDate: '2026-10-31',
  cutOffDate: '2026-10-24',
  status: 'review',
  totalGross: initialResults.reduce((acc, r) => acc + r.grossPay, 0),
  totalNet: initialResults.reduce((acc, r) => acc + r.netPay, 0),
  totalStatutoryEmployee: initialResults.reduce((acc, r) => acc + r.statutory.totalStatutoryEmployee, 0),
  totalStatutoryEmployer: initialResults.reduce((acc, r) => acc + r.statutory.totalStatutoryEmployer, 0),
  totalDeductions: initialResults.reduce((acc, r) => acc + r.totalDeductions, 0),
  totalEmployerCost: initialResults.reduce((acc, r) => acc + r.totalEmployerCost, 0),
  workerCount: initialResults.length,
  exceptionsCount: initialResults.filter(r => r.hasExceptions).length,
  calculatedAt: '2026-10-24 16:45 EAT',
  reviewedBy: 'Stephen Nyaga (Payroll Lead)',
  reviewedAt: '2026-10-25 11:20 EAT',
  results: initialResults,
};

export const MOCK_SEPTEMBER_CLOSED_RUN: PayrollRun = {
  id: 'run_2026_09',
  periodName: 'September 2026',
  periodMonth: 9,
  periodYear: 2026,
  startDate: '2026-09-01',
  endDate: '2026-09-30',
  cutOffDate: '2026-09-24',
  status: 'closed',
  totalGross: 688500,
  totalNet: 494200,
  totalStatutoryEmployee: 128900,
  totalStatutoryEmployer: 28400,
  totalDeductions: 194300,
  totalEmployerCost: 716900,
  workerCount: 6,
  exceptionsCount: 0,
  calculatedAt: '2026-09-24 14:00 EAT',
  approvedBy: 'Rosemary Mwanza (CEO)',
  approvedAt: '2026-09-27 10:15 EAT',
  closedAt: '2026-09-28 17:00 EAT',
  results: [],
};

export const MOCK_FINAL_DUES_CASE: FinalDuesCalculation = {
  id: 'fd_emp_david',
  employeeId: 'emp_david',
  employeeName: "David Ndung'u",
  employeeCode: 'EMP-109',
  department: 'Operations & Logistics',
  jobTitle: 'Operations Supervisor',
  joinDate: '2022-02-01',
  lastWorkingDay: '2026-10-31',
  reason: 'resignation',
  basicSalary: 85000,
  
  proratedDaysWorked: 22,
  proratedSalary: 85000,
  accruedLeaveDays: 14.5,
  accruedLeavePayout: Math.round((85000 / 22) * 14.5), // KES 56,023
  noticeInLieuPay: 0,
  noticeRecoveryDeduction: 0,
  severanceGratuityPay: 42500, // 0.5 month service gratuity
  unpaidOvertimeOrBonus: 7500,
  
  loanOutstandingCleared: 16000, // Clearing company staff loan
  saccoNoticeDeduction: 6000,
  otherClearances: 0,
  
  grossFinalSettlement: 85000 + 56023 + 42500 + 7500, // KES 191,023
  taxableFinalAmount: 186703, // after statutory NSSF relief
  finalPayeDeduction: 41250,
  finalNssfDeduction: 4320,
  finalShifDeduction: 5253,
  finalAhlDeduction: 2865,
  
  netFinalDues: 191023 - (41250 + 4320 + 5253 + 2865 + 16000 + 6000), // KES 115,335
  status: 'reviewed',
  notes: 'Clearance completed: Company laptop returned, asset sign-off verified, SACCO notified.',
};

export const MOCK_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud_1',
    timestamp: '2026-10-25 11:20:14 EAT',
    userName: 'Stephen Nyaga',
    userRole: 'Payroll Officer',
    action: 'PAYROLL_CALCULATE',
    entity: 'PayrollRun #run_2026_10',
    details: 'Recalculated October 2026 run for 7 employees. Synchronized 2 biometric overtime records and 1 unpaid leave deduction.',
    severity: 'info',
  },
  {
    id: 'aud_2',
    timestamp: '2026-10-24 17:05:40 EAT',
    userName: 'Stephen Nyaga',
    userRole: 'Payroll Officer',
    action: 'LEAVE_PULL_SYNC',
    entity: 'LeaveAdapter',
    details: 'Pulled 2 approved unpaid leave days for Victor Ochieng. Auto-generated KES 10,400 proration deduction.',
    severity: 'info',
  },
  {
    id: 'aud_3',
    timestamp: '2026-10-24 16:30:12 EAT',
    userName: 'Alice Wambui',
    userRole: 'HR Manager',
    action: 'ATTENDANCE_CORRECTION_APPROVE',
    entity: 'AttendanceCorrection #corr_02',
    details: 'Approved attendance adjustment for Samuel Mwangi on 18 Oct 2026 (Client breakfast meeting).',
    severity: 'info',
  },
  {
    id: 'aud_4',
    timestamp: '2026-10-23 09:40:00 EAT',
    userName: 'Rosemary Mwanza',
    userRole: 'CEO',
    action: 'PAYROLL_SETTINGS_UPDATE',
    entity: 'StatutoryRuleSet Kenya 2026',
    details: 'Verified SHIF statutory rate configured at 2.75% and Affordable Housing Levy at 1.5% with effective date 01-Jul-2026.',
    severity: 'info',
  },
  {
    id: 'aud_5',
    timestamp: '2026-09-27 10:15:30 EAT',
    userName: 'Rosemary Mwanza',
    userRole: 'CEO',
    action: 'PAYROLL_APPROVE_AND_LOCK',
    entity: 'PayrollRun #run_2026_09',
    details: 'Final approval and immutable closure for September 2026 payroll. 6 employee payslips published to portal.',
    severity: 'security',
  }
];

