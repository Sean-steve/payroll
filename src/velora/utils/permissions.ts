import { UserRole } from '../types/hr';
import { ScreenId } from '../components/Navigation';

export type Action = 'prepare' | 'review' | 'approve' | 'reopen' | 'export' | 'approve_time' | 'configure';

const ACTIONS: Record<UserRole, Action[]> = {
  super_admin: ['configure', 'export'],
  payroll_officer: ['prepare', 'export'],
  hr_manager: ['review', 'export'],
  finance_approver: ['approve', 'reopen', 'export'],
  line_manager: ['approve_time'],
  employee: [],
  auditor: ['export'],
};

export const can = (role: UserRole, action: Action) => ACTIONS[role].includes(action);

const HIDDEN: Partial<Record<UserRole, ScreenId[]>> = {
  employee: ['dashboard', 'payroll_run', 'review_approval', 'payroll_inputs', 'employee_profiles', 'final_dues', 'reports', 'settings', 'audit_trail', 'shifts'],
  line_manager: ['payroll_run', 'review_approval', 'payroll_inputs', 'employee_profiles', 'final_dues', 'reports', 'settings', 'audit_trail'],
  auditor: ['payroll_inputs', 'shifts'],
};

export const canSee = (role: UserRole, screen: ScreenId) => !(HIDDEN[role] ?? []).includes(screen);
