import React from 'react';
import { 
  LayoutDashboard, 
  Calculator, 
  Fingerprint, 
  CalendarClock, 
  CalendarDays, 
  DollarSign, 
  UserMinus, 
  BarChart3, 
  Settings 
} from 'lucide-react';

export type ScreenId = 
  | 'dashboard'
  | 'payroll_run'
  | 'review_approval'
  | 'attendance'
  | 'leave'
  | 'calendar'
  | 'my_pay'
  | 'final_dues'
  | 'reports'
  | 'settings'
  | 'employee_profiles'
  | 'payroll_inputs'
  | 'audit_trail'
  | 'shifts';

interface NavigationProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  exceptionsCount: number;
  pendingCorrectionsCount: number;
  pendingLeaveCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeScreen,
  onNavigate,
  exceptionsCount,
  pendingCorrectionsCount,
  pendingLeaveCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ScreenId,
      label: 'Payroll Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'payroll_run' as ScreenId,
      label: 'Payroll Run & Engine',
      icon: Calculator,
      badge: exceptionsCount > 0 ? `${exceptionsCount} alerts` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'attendance' as ScreenId,
      label: 'Attendance & Biometrics',
      icon: Fingerprint,
      badge: pendingCorrectionsCount > 0 ? `${pendingCorrectionsCount} pending` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'leave' as ScreenId,
      label: 'Leave Management',
      icon: CalendarClock,
      badge: pendingLeaveCount > 0 ? `${pendingLeaveCount} request` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'calendar' as ScreenId,
      label: 'Shared Calendar',
      icon: CalendarDays,
    },
    {
      id: 'my_pay' as ScreenId,
      label: 'Employee Portal (My Pay)',
      icon: DollarSign,
    },
    {
      id: 'final_dues' as ScreenId,
      label: 'Final Dues (Exit)',
      icon: UserMinus,
      badge: '1 Exiting',
      badgeColor: 'bg-purple-100 text-purple-700',
    },
    {
      id: 'reports' as ScreenId,
      label: 'Reports & CSV Export',
      icon: BarChart3,
    },
    {
      id: 'settings' as ScreenId,
      label: 'Kenya Statutory & Rules',
      icon: Settings,
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-300' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      isActive ? 'bg-slate-800 text-indigo-200' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
