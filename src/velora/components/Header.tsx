import React, { useState } from 'react';
import { CurrentUser } from '../types/hr';
import { CURRENT_USERS } from '../data/mockData';
import { VeloraLogo } from './VeloraLogo';
import { 
  ShieldCheck, 
  Bell, 
  ChevronDown, 
  CheckCircle2, 
  UserCheck, 
  Menu, 
  Search, 
  Calendar 
} from 'lucide-react';

interface HeaderProps {
  currentUser: CurrentUser;
  onSelectUser: (user: CurrentUser) => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentUser, 
  onSelectUser, 
  onToggleMobileMenu 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#FFFDF8] border-b border-[#DDD6CE] shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Mobile Menu Button + Search Input */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={onToggleMobileMenu}
              className="p-2 text-[#3B1E54] hover:bg-[#C6B8D9]/20 rounded-xl lg:hidden transition-colors"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Logo display */}
            <div className="lg:hidden">
              <VeloraLogo theme="light" size="sm" showTagline={false} />
            </div>

            {/* Clean Search Input (from Page 1 Screenshot) */}
            <div className="relative w-full max-w-xs hidden sm:block">
              <Search className="w-4 h-4 text-[#8C827A] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search employees, payroll, reports..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#DDD6CE] bg-white text-xs text-[#2B2B2B] placeholder:text-[#8C827A] focus:outline-none focus:ring-1 focus:ring-[#3B1E54] transition-all"
              />
            </div>
          </div>

          {/* Right Zone: Date, Notifications & User Persona */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Date Pill (Page 1 Screenshot) */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DDD6CE] text-xs text-[#2B2B2B] font-medium shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>October 24, 2026</span>
            </div>

            {/* Notification Bell with Champagne Gold badge */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 rounded-xl text-[#2B2B2B] hover:text-[#3B1E54] hover:bg-white border border-transparent hover:border-[#DDD6CE] transition-all"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-[#3B1E54]" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#C9A227] ring-2 ring-[#FFFDF8]"></span>
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#DDD6CE] py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-4 py-2 border-b border-[#DDD6CE] flex items-center justify-between">
                    <span className="font-bold text-xs text-[#3B1E54] uppercase tracking-wider">
                      HR & Payroll Alerts
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#C9A227] text-[#3B1E54]">
                      3 New
                    </span>
                  </div>
                  <div className="divide-y divide-[#DDD6CE]/40 text-xs">
                    <div className="p-3 hover:bg-[#FFFDF8] transition-colors">
                      <p className="font-semibold text-[#2B2B2B]">October Payroll Ready for Review</p>
                      <p className="text-[#666] text-[11px] mt-0.5">Calculated for 7 active employees. Total Gross: KES 816,550.</p>
                      <span className="text-[10px] text-[#C9A227] font-semibold mt-1 block">15 mins ago · Payroll Engine</span>
                    </div>
                    <div className="p-3 hover:bg-[#FFFDF8] transition-colors">
                      <p className="font-semibold text-[#2B2B2B]">Biometric Sync: 1 Pending Correction</p>
                      <p className="text-[#666] text-[11px] mt-0.5">Victor Ochieng submitted missed clock-out request from Mombasa reader.</p>
                      <span className="text-[10px] text-[#8C827A] mt-1 block">1 hour ago · Biometrics</span>
                    </div>
                    <div className="p-3 hover:bg-[#FFFDF8] transition-colors">
                      <p className="font-semibold text-[#2B2B2B]">Exiting Employee Notice</p>
                      <p className="text-[#666] text-[11px] mt-0.5">David Ndung'u last day: 31-Oct-2026. Final Dues tabulation initiated.</p>
                      <span className="text-[10px] text-[#8C827A] mt-1 block">Yesterday · Exit Management</span>
                    </div>
                  </div>
                  <div className="px-3 pt-2 text-center border-t border-[#DDD6CE]/40">
                    <button
                      onClick={() => setNotificationOpen(false)}
                      className="text-xs font-semibold text-[#3B1E54] hover:underline"
                    >
                      Close notification tray
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Persona Switcher (Page 1 Screenshot: Avatar + Name + Role Title) */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl border border-[#DDD6CE] bg-white hover:bg-[#FFFDF8] transition-all text-left shadow-2xs"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-[#3B1E54]"
                />
                <div className="hidden sm:block leading-tight text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#2B2B2B]">{currentUser.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]"></span>
                  </div>
                  <span className="text-[10px] text-[#666] block truncate max-w-[150px]">
                    {currentUser.roleTitle}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#8C827A] ml-1" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#DDD6CE] py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-4 py-2 border-b border-[#DDD6CE]">
                    <p className="text-xs font-bold text-[#3B1E54]">Switch User Role / Persona</p>
                    <p className="text-[11px] text-[#666]">Preview workflows as Approver, Maker or Employee</p>
                  </div>
                  <div className="py-1">
                    {CURRENT_USERS.map((user) => {
                      const isSelected = user.id === currentUser.id;
                      return (
                        <button
                          key={user.id}
                          onClick={() => {
                            onSelectUser(user);
                            setDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors ${
                            isSelected ? 'bg-[#C6B8D9]/20 text-[#3B1E54]' : 'hover:bg-[#FFFDF8] text-[#2B2B2B]'
                          }`}
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#DDD6CE] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate flex items-center gap-1.5 text-[#2B2B2B]">
                              {user.name}
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#3B1E54]" />}
                            </p>
                            <p className="text-[11px] text-[#666] truncate">{user.roleTitle}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="px-4 py-2 border-t border-[#DDD6CE] bg-[#FFFDF8] text-[10px] text-[#8C827A] flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#3B1E54]" />
                    <span>Role-Based Access Control Enabled</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
