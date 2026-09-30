import React, { useState } from 'react';
import { CalendarEvent } from '../types/hr';
import { 
  CalendarDays, 
  Clock 
} from 'lucide-react';

interface SharedCalendarViewProps {
  events: CalendarEvent[];
}

export const SharedCalendarView: React.FC<SharedCalendarViewProps> = ({ events }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-24');

  const filteredEvents = events.filter((e) => {
    if (selectedCategory === 'all') return true;
    return e.category === selectedCategory;
  });

  const daysInOctober = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const dateStr = `2026-10-${day.toString().padStart(2, '0')}`;
    return {
      day,
      dateStr,
      events: events.filter((e) => e.date === dateStr || (e.endDate && e.date <= dateStr && e.endDate >= dateStr)),
    };
  });

  const categoryBadges: Record<string, { label: string; color: string; bg: string }> = {
    holiday: { label: 'Kenya Public Holiday', color: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200' },
    payroll: { label: 'Payroll Cadence & Cut-off', color: 'text-[#3B1E54]', bg: 'bg-[#C9A227]/20 border-[#C9A227]/40' },
    leave: { label: 'Approved Leave', color: 'text-[#3B1E54]', bg: 'bg-[#C6B8D9]/25 border-[#C6B8D9]/40' },
    performance: { label: 'Performance Review', color: 'text-[#4E286F]', bg: 'bg-[#F5F2F9] border-[#DDD6CE]' },
    company: { label: 'Company Event', color: 'text-[#C9A227]', bg: 'bg-[#C9A227]/15 border-[#C9A227]/30' },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#C6B8D9]/25 text-[#3B1E54]">
              Company-Wide Master Schedule
            </span>
            <span className="text-[#DDD6CE]">·</span>
            <span className="text-xs text-[#666]">Statutory Holidays, Payroll Deadlines & Leave Periods</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#2B2B2B]">Shared Velora Calendar</h1>
          <p className="text-xs text-[#666]">
            A single consolidated schedule displaying Leave, Gazetted Public Holidays, Payroll Cut-offs, and Performance deadlines.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 flex-wrap bg-[#FFFDF8] border border-[#DDD6CE] p-1 rounded-xl text-xs">
          {[
            { id: 'all', label: 'All Modules' },
            { id: 'payroll', label: 'Payroll' },
            { id: 'holiday', label: 'Holidays' },
            { id: 'leave', label: 'Leave' },
            { id: 'performance', label: 'Performance' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#3B1E54] font-bold text-white shadow-2xs'
                  : 'text-[#666] hover:text-[#2B2B2B]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar & Agenda Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month View Matrix */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#3B1E54]" />
              <h2 className="font-extrabold text-base text-[#2B2B2B]">October 2026</h2>
            </div>
            <div className="text-xs text-[#8C827A] font-medium">
              EAT Timezone (Nairobi GMT+3)
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-[#3B1E54] py-1.5 border-b border-[#DDD6CE]">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-xs">
            {/* Empty padding cells for Wed 30 Sep */}
            <div className="h-20 p-1 bg-[#FFFDF8]/40 rounded border border-transparent text-[#DDD6CE]">27</div>
            <div className="h-20 p-1 bg-[#FFFDF8]/40 rounded border border-transparent text-[#DDD6CE]">28</div>
            <div className="h-20 p-1 bg-[#FFFDF8]/40 rounded border border-transparent text-[#DDD6CE]">29</div>
            <div className="h-20 p-1 bg-[#FFFDF8]/40 rounded border border-transparent text-[#DDD6CE]">30</div>

            {daysInOctober.map((d) => {
              const isSelected = selectedDate === d.dateStr;
              const hasEvents = d.events.length > 0;

              return (
                <div
                  key={d.day}
                  onClick={() => setSelectedDate(d.dateStr)}
                  className={`h-20 p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#3B1E54] bg-[#C6B8D9]/20 ring-1 ring-[#3B1E54]'
                      : hasEvents
                      ? 'border-[#DDD6CE] bg-white hover:border-[#3B1E54] shadow-2xs'
                      : 'border-[#DDD6CE]/40 bg-[#FFFDF8] hover:bg-white text-[#666]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-xs font-bold ${isSelected ? 'text-[#3B1E54]' : 'text-[#2B2B2B]'}`}>
                      {d.day}
                    </span>
                    {hasEvents && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]"></span>
                    )}
                  </div>

                  <div className="space-y-0.5 overflow-hidden">
                    {d.events.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className={`text-[9px] px-1 py-0.5 rounded truncate font-medium border ${
                          categoryBadges[ev.category]?.bg || 'bg-slate-100'
                        } ${categoryBadges[ev.category]?.color || 'text-slate-800'}`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {d.events.length > 2 && (
                      <span className="text-[8px] text-[#8C827A] pl-0.5">+{d.events.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Agenda List & Event Details */}
        <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#DDD6CE] pb-3 mb-4">
              <h3 className="font-bold text-sm text-[#2B2B2B] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#3B1E54]" />
                <span>Upcoming Milestones</span>
              </h3>
              <span className="text-xs text-[#8C827A]">{filteredEvents.length} events</span>
            </div>

            <div className="space-y-3">
              {filteredEvents.map((event) => {
                const badge = categoryBadges[event.category]!;
                return (
                  <div
                    key={event.id}
                    className="p-3 rounded-xl border border-[#DDD6CE] hover:border-[#3B1E54] transition-all bg-[#FFFDF8]"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${badge.bg} ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-[#3B1E54]">
                        {event.date}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-[#2B2B2B] mt-1">{event.title}</h4>
                    <p className="text-[#666] text-[11px] mt-0.5 leading-relaxed">{event.description}</p>
                    
                    {event.department && (
                      <span className="inline-block mt-2 text-[10px] text-[#3B1E54] bg-white px-2 py-0.5 rounded border border-[#DDD6CE]">
                        Dept: {event.department}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5F2F9] border border-[#C6B8D9]/40 text-[11px] text-[#3B1E54] mt-4">
            <strong className="block font-bold">Shared Velora Bus Active:</strong>
            Approvals in Leave, Attendance, or Payroll automatically broadcast to this central calendar.
          </div>
        </div>
      </div>
    </div>
  );
};
