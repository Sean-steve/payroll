import React from 'react';

export const Card: React.FC<{ title?: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, subtitle, action, children, className = '' }) => (
  <section className={`bg-white border border-[#DDD6CE] rounded-2xl shadow-xs ${className}`}>
    {(title || action) && (
      <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[#DDD6CE]/70">
        <div>
          {title && <h3 className="text-sm font-bold text-[#3B1E54]">{title}</h3>}
          {subtitle && <p className="text-xs text-[#666] mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    <div className="p-5">{children}</div>
  </section>
);

export const PageTitle: React.FC<{ title: string; subtitle: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
    <div>
      <h1 className="text-2xl font-bold text-[#3B1E54]">{title}</h1>
      <p className="text-sm text-[#666] mt-1">{subtitle}</p>
    </div>
    {action}
  </div>
);

const TONES = {
  plum: 'bg-[#3B1E54]/10 text-[#3B1E54]',
  gold: 'bg-[#C9A227]/15 text-[#8a6d10]',
  green: 'bg-emerald-50 text-emerald-700',
  red: 'bg-rose-50 text-rose-700',
  gray: 'bg-[#DDD6CE]/50 text-[#555]',
};
export type Tone = keyof typeof TONES;

export const Badge: React.FC<{ tone?: Tone; children: React.ReactNode }> = ({ tone = 'gray', children }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${TONES[tone]}`}>{children}</span>
);

export const Btn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }> = ({ variant = 'primary', className = '', ...p }) => (
  <button
    {...p}
    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
      variant === 'primary' ? 'bg-[#3B1E54] text-[#FFFDF8] hover:bg-[#3B1E54]/90' : 'border border-[#DDD6CE] text-[#3B1E54] hover:bg-[#C6B8D9]/20'
    } ${className}`}
  />
);

export const Table: React.FC<{ head: string[]; children: React.ReactNode }> = ({ head, children }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-xs">
      <thead>
        <tr className="text-left text-[10px] uppercase tracking-wide text-[#888] border-b border-[#DDD6CE]">
          {head.map((h) => <th key={h} className="py-2 pr-4 font-bold whitespace-nowrap">{h}</th>)}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#DDD6CE]/60">{children}</tbody>
    </table>
  </div>
);

export const Td: React.FC<{ children: React.ReactNode; mono?: boolean; className?: string }> = ({ children, mono, className = '' }) => (
  <td className={`py-2.5 pr-4 whitespace-nowrap ${mono ? 'font-mono tabular-nums' : ''} ${className}`}>{children}</td>
);

export const Stat: React.FC<{ label: string; value: React.ReactNode; hint?: string }> = ({ label, value, hint }) => (
  <div className="bg-white border border-[#DDD6CE] rounded-2xl p-4">
    <div className="text-[10px] uppercase tracking-wide font-bold text-[#888]">{label}</div>
    <div className="text-xl font-bold text-[#3B1E54] mt-1 font-mono tabular-nums">{value}</div>
    {hint && <div className="text-[11px] text-[#666] mt-1">{hint}</div>}
  </div>
);

export const Tabs: React.FC<{ tabs: string[]; active: string; onChange: (t: string) => void }> = ({ tabs, active, onChange }) => (
  <div className="flex flex-wrap gap-1 bg-[#C6B8D9]/20 p-1 rounded-xl w-fit mb-5">
    {tabs.map((t) => (
      <button key={t} onClick={() => onChange(t)} className={`px-3.5 py-1.5 rounded-lg text-xs font-bold ${active === t ? 'bg-white text-[#3B1E54] shadow-xs' : 'text-[#3B1E54]/70'}`}>{t}</button>
    ))}
  </div>
);

export const mask = (v?: string) => (v ? `•••• ${v.slice(-4)}` : '—');
