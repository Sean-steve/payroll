import React from 'react';
import { ScreenId } from './Navigation';
import { VeloraLogo } from './VeloraLogo';
import { 
  LayoutDashboard, 
  Users, 
  Fingerprint, 
  Calculator, 
  CalendarClock, 
  CalendarDays, 
  UserMinus, 
  BarChart3, 
  Settings,
  IdCard,
  ListPlus,
  History,
  Clock
} from 'lucide-react';
import { UserRole } from '../types/hr';
import { canSee } from '../utils/permissions';

interface SidebarProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  exceptionsCount: number;
  pendingCorrectionsCount: number;
  pendingLeaveCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  role: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  onNavigate,
  exceptionsCount,
  pendingCorrectionsCount,
  pendingLeaveCount,
  isMobileOpen,
  onCloseMobile,
  role,
}) => {
  const menuGroups = [
    {
      title: 'CORE MODULES',
      items: [
        {
          id: 'dashboard' as ScreenId,
          label: 'Dashboard',
          icon: LayoutDashboard,
        },
        {
          id: 'my_pay' as ScreenId,
          label: 'Employees & Portal',
          icon: Users,
        },
        { id: 'employee_profiles' as ScreenId, label: 'Payroll Profiles', icon: IdCard },
        {
          id: 'attendance' as ScreenId,
          label: 'Attendance & Biometrics',
          icon: Fingerprint,
          badge: pendingCorrectionsCount > 0 ? `${pendingCorrectionsCount}` : undefined,
        },
        { id: 'shifts' as ScreenId, label: 'Shifts & Overtime', icon: Clock, badge: '4' },
        { id: 'payroll_inputs' as ScreenId, label: 'Payroll Inputs', icon: ListPlus },
        {
          id: 'payroll_run' as ScreenId,
          label: 'Payroll Engine',
          icon: Calculator,
          badge: exceptionsCount > 0 ? `${exceptionsCount}` : undefined,
        },
        {
          id: 'leave' as ScreenId,
          label: 'Leave Management',
          icon: CalendarClock,
          badge: pendingLeaveCount > 0 ? `${pendingLeaveCount}` : undefined,
        },
        {
          id: 'calendar' as ScreenId,
          label: 'Shared Calendar',
          icon: CalendarDays,
        },
        {
          id: 'final_dues' as ScreenId,
          label: 'Final Dues (Exit)',
          icon: UserMinus,
          badge: '1 Exiting',
        },
        {
          id: 'reports' as ScreenId,
          label: 'Reports & Analytics',
          icon: BarChart3,
        },
        {
          id: 'settings' as ScreenId,
          label: 'Settings & Rules',
          icon: Settings,
        },
        { id: 'audit_trail' as ScreenId, label: 'Audit Trail', icon: History },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Dark Plum Sidebar (#3B1E54) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#3B1E54] text-[#FFFDF8] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-xl`}
      >
        {/* Top: Logo & Branding */}
        <div>
          <div className="px-5 py-3 border-b border-[#C6B8D9]/20">
            <div className="bg-background rounded-md flex justify-center"><VeloraLogo size="md" /></div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)]">
            {menuGroups[0]!.items.filter((i) => canSee(role, i.id)).map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-[#FFFDF8] text-[#3B1E54] font-bold shadow-md'
                      : 'text-[#FFFDF8]/85 hover:bg-[#C6B8D9]/20 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#3B1E54]' : 'text-[#C6B8D9] group-hover:text-white'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        isActive
                          ? 'bg-[#3B1E54] text-[#FFFDF8]'
                          : 'bg-[#C9A227] text-[#3B1E54]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-[#C6B8D9]/15 p-4 text-[10px] text-[#C6B8D9] text-center">© 2026 VeloraHR</div>
      </aside>
    </>
  );
};
