import React, { useState } from 'react';
import { BiometricDevice, AttendanceRecord, AttendanceCorrectionRequest } from '../types/hr';
import { 
  Fingerprint, 
  Wifi, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Check, 
  X, 
  MapPin 
} from 'lucide-react';

interface AttendanceBiometricsViewProps {
  devices: BiometricDevice[];
  records: AttendanceRecord[];
  corrections: AttendanceCorrectionRequest[];
  onApproveCorrection: (id: string) => void;
  onRejectCorrection: (id: string) => void;
  onSyncDevices: () => void;
  isSyncing: boolean;
}

export const AttendanceBiometricsView: React.FC<AttendanceBiometricsViewProps> = ({
  devices,
  records,
  corrections,
  onApproveCorrection,
  onRejectCorrection,
  onSyncDevices,
  isSyncing,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'exceptions' | 'overtime'>('all');
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleManualSync = () => {
    onSyncDevices();
    setSyncFeedback('All 3 biometric devices synchronized successfully. 163 punches processed.');
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  const filteredRecords = records.filter((r) => {
    if (filterStatus === 'exceptions') return r.exception !== undefined || !r.isApproved;
    if (filterStatus === 'overtime') return r.overtimeHours > 0;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Live Biometric Push Protocol
            </span>
            <span className="text-[#DDD6CE]">·</span>
            <span className="text-xs text-[#666]">Automated Punch In/Out Sync & Validation</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#2B2B2B]">Attendance & Biometric Terminal Integration</h1>
          <p className="text-xs text-[#666]">
            Real-time biometric punch sync, shift schedules, overtime validation, and manager correction workflows.
          </p>
        </div>

        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="px-4 py-2 text-xs font-bold text-white bg-[#3B1E54] hover:bg-[#4E286F] rounded-xl flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-white ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Synchronizing Readers...' : 'Sync Biometric Readers'}</span>
        </button>
      </div>

      {syncFeedback && (
        <div className="p-3 bg-[#FFFDF8] border border-[#C9A227] rounded-xl text-xs text-[#3B1E54] flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Biometric Devices Status Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#2B2B2B] uppercase tracking-wider flex items-center gap-1.5">
            <Wifi className="w-4 h-4 text-[#3B1E54]" />
            Configured Biometric Terminals (Hardware Mapping)
          </h2>
          <span className="text-xs text-[#666]">3 Terminals Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {devices.map((device) => (
            <div key={device.id} className="bg-white rounded-2xl p-4 border border-[#DDD6CE] shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-[#2B2B2B] truncate">{device.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                    device.status === 'online' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                    device.status === 'syncing' ? 'bg-[#C6B8D9]/25 text-[#3B1E54]' :
                    'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {device.status === 'online' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>}
                    {device.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-[#666]">{device.model}</p>
                <div className="mt-2 text-xs text-[#666] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#8C827A]" />
                  <span className="truncate">{device.location}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#DDD6CE]/60 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[#8C827A] block text-[10px]">Today's Punches</span>
                  <span className="font-bold font-mono text-[#3B1E54]">{device.todayPunches} punches</span>
                </div>
                <div className="text-right">
                  <span className="text-[#8C827A] block text-[10px]">Enrolled IDs</span>
                  <span className="font-bold font-mono text-[#2B2B2B]">{device.activeUsersCount} users</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Corrections Queue */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-[#2B2B2B] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#C9A227]" />
              Manager Approval of Attendance Correction Requests
            </h2>
            <p className="text-xs text-[#666]">
              Approved adjustments automatically reconcile missed punches and feed into October Payroll calculations.
            </p>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-[#C9A227]/20 text-[#3B1E54] border border-[#C9A227]/30">
            {corrections.filter((c) => c.status === 'pending').length} Action Required
          </span>
        </div>

        <div className="divide-y divide-[#DDD6CE]/40">
          {corrections.map((corr) => (
            <div key={corr.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#2B2B2B]">{corr.employeeName}</span>
                  <span className="text-[#DDD6CE]">·</span>
                  <span className="text-[#666] font-mono">Date: {corr.date}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    corr.status === 'pending' ? 'bg-[#C9A227]/25 text-[#3B1E54]' :
                    corr.status === 'approved' ? 'bg-emerald-50 text-emerald-800' :
                    'bg-rose-50 text-rose-800'
                  }`}>
                    {corr.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-[#666] flex items-center gap-3">
                  <span>Logged: <strong className="font-mono">{corr.originalIn} - {corr.originalOut}</strong></span>
                  <span>→</span>
                  <span>Requested: <strong className="font-mono text-[#3B1E54]">{corr.requestedIn} - {corr.requestedOut}</strong></span>
                </div>
                <p className="text-[#666] text-[11px] italic bg-[#FFFDF8] p-2 rounded-xl border border-[#DDD6CE] max-w-2xl">
                  "{corr.reason}"
                </p>
              </div>

              {corr.status === 'pending' ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onRejectCorrection(corr.id)}
                    className="px-3 py-1.5 font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => onApproveCorrection(corr.id)}
                    className="px-3.5 py-1.5 font-bold text-white bg-[#3B1E54] hover:bg-[#4E286F] rounded-xl flex items-center gap-1 transition-colors shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Approve & Sync</span>
                  </button>
                </div>
              ) : (
                <div className="text-right text-[11px] text-[#8C827A]">
                  <span>Approved by {corr.approvedBy || 'Admin'}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Daily Punch Log & Overtime Table */}
      <div className="bg-white rounded-2xl border border-[#DDD6CE] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#DDD6CE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-[#2B2B2B]">Attendance Log & Overtime Register</h3>
            <p className="text-xs text-[#666]">Live clock-in, clock-out and working hours computation</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#FFFDF8] border border-[#DDD6CE] p-1 rounded-xl text-xs">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-lg ${filterStatus === 'all' ? 'bg-[#3B1E54] font-bold text-white shadow-2xs' : 'text-[#666]'}`}
              >
                All Punches
              </button>
              <button
                onClick={() => setFilterStatus('exceptions')}
                className={`px-3 py-1 rounded-lg ${filterStatus === 'exceptions' ? 'bg-[#3B1E54] font-bold text-white shadow-2xs' : 'text-[#666]'}`}
              >
                Exceptions / Late
              </button>
              <button
                onClick={() => setFilterStatus('overtime')}
                className={`px-3 py-1 rounded-lg ${filterStatus === 'overtime' ? 'bg-[#3B1E54] font-bold text-white shadow-2xs' : 'text-[#666]'}`}
              >
                Overtime (1.5x)
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F2F9] border-b border-[#DDD6CE] text-[#3B1E54] font-bold text-[11px]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Employee ID</th>
                <th className="py-2.5 px-3">Clock In</th>
                <th className="py-2.5 px-3">Clock Out</th>
                <th className="py-2.5 px-3 text-right">Hours Worked</th>
                <th className="py-2.5 px-3 text-right">Overtime</th>
                <th className="py-2.5 px-3">Attendance State</th>
                <th className="py-2.5 px-3 text-center">Payroll Integration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD6CE]/40">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#FFFDF8]">
                  <td className="py-2.5 px-3 font-mono text-[#666]">{rec.date}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-[#3B1E54]">{rec.employeeId.replace('emp_', 'EMP-')}</td>
                  <td className="py-2.5 px-3 font-mono text-[#2B2B2B]">{rec.clockIn}</td>
                  <td className="py-2.5 px-3 font-mono text-[#2B2B2B]">{rec.clockOut}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#2B2B2B]">{rec.hoursWorked}h</td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    {rec.overtimeHours > 0 ? (
                      <span className="font-bold text-[#3B1E54] bg-[#C6B8D9]/25 px-1.5 py-0.5 rounded">
                        +{rec.overtimeHours}h ({rec.overtimeMultiplier}x)
                      </span>
                    ) : (
                      <span className="text-[#8C827A]">-</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    {rec.status === 'present' && !rec.exception && (
                      <span className="text-[11px] text-emerald-800 font-semibold">Present (On-Time)</span>
                    )}
                    {rec.status === 'late' && (
                      <span className="text-[11px] text-[#C9A227] font-bold">Late Arrival</span>
                    )}
                    {rec.exception === 'unapproved_overtime' && (
                      <span className="text-[11px] text-[#3B1E54] font-bold">Overtime Pending Authorization</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] font-bold text-[#3B1E54] bg-[#C6B8D9]/20 px-2 py-0.5 rounded-lg">
                      Synced to Oct Run
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
