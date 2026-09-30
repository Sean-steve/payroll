import React, { useState } from 'react';
import { PayrollRun } from '../types/hr';
import { formatKES } from '../utils/kenyaPayrollCalculator';
import { 
  FileSpreadsheet, 
  Download, 
  CheckCircle2 
} from 'lucide-react';

interface ReportsExportViewProps {
  currentRun: PayrollRun;
}

export const ReportsExportView: React.FC<ReportsExportViewProps> = ({ currentRun }) => {
  const [selectedReport, setSelectedReport] = useState<string>('master_register');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const generateAndDownloadCSV = (reportType: string) => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = `Velora_${reportType}_Oct2026.csv`;

    if (reportType === 'master_register') {
      headers = [
        'Company',
        'Payroll Period',
        'Employee ID',
        'Employee Name',
        'Department',
        'Population',
        'Base Pay (KES)',
        'Earnings & Allowances (KES)',
        'Gross Pay (KES)',
        'PAYE Tax (KES)',
        'NSSF Employee (KES)',
        'SHIF 2.75% (KES)',
        'AHL 1.5% (KES)',
        'Other Deductions (KES)',
        'Net Pay (KES)',
        'Employer Statutory Match (KES)',
        'Total Employer Cost (KES)',
        'Payslip Ref',
      ];

      rows = currentRun.results.map((r) => [
        'Sample organization',
        currentRun.periodName,
        r.employeeCode,
        `"${r.employeeName}"`,
        r.department,
        r.population,
        r.basePay.toString(),
        r.totalEarnings.toString(),
        r.grossPay.toString(),
        r.statutory.netPaye.toString(),
        r.statutory.totalNssfEmployee.toString(),
        r.statutory.shifEmployee.toString(),
        r.statutory.ahlEmployee.toString(),
        (r.saccoDeduction + r.loanDeduction + r.pensionVoluntary).toString(),
        r.netPay.toString(),
        r.statutory.totalStatutoryEmployer.toString(),
        r.totalEmployerCost.toString(),
        r.payslipRef,
      ]);
    } else if (reportType === 'kra_p10') {
      headers = [
        'PIN of Employee',
        'Name of Employee',
        'Residential Status',
        'Type of Employee',
        'Basic Salary',
        'Housing Allowance',
        'Transport Allowance',
        'Other Allowances',
        'Gross Pay',
        'Allowable NSSF Deduction',
        'Taxable Pay',
        'Tax Charged (PAYE)',
        'Personal Relief',
        'Tax Deducted (Net PAYE)',
      ];

      rows = currentRun.results.map((r) => [
        r.employeeId === 'emp_grace' ? 'MISSING_PIN' : 'A009845123K',
        `"${r.employeeName}"`,
        'Resident',
        'Primary Employee',
        r.basePay.toString(),
        r.housingAllowance.toString(),
        r.commuterAllowance.toString(),
        (r.airtimeAllowance + r.overtimePay + r.bonus).toString(),
        r.grossPay.toString(),
        r.statutory.totalNssfEmployee.toString(),
        r.statutory.taxablePay.toString(),
        r.statutory.grossTax.toString(),
        r.statutory.personalRelief.toString(),
        r.statutory.netPaye.toString(),
      ]);
    } else if (reportType === 'nssf') {
      headers = [
        'Payroll Number',
        'Surname & Other Names',
        'ID Number',
        'KRA PIN',
        'NSSF Number',
        'Gross Pay',
        'Voluntary Amount',
        'Tier 1 (Emp + Empr)',
        'Tier 2 (Emp + Empr)',
        'Total NSSF Remittance',
      ];

      rows = currentRun.results.map((r) => [
        r.employeeCode,
        `"${r.employeeName}"`,
        '31298451',
        'A009845123K',
        'NSSF-8492019',
        r.grossPay.toString(),
        '0',
        (r.statutory.nssfTier1 * 2).toString(),
        (r.statutory.nssfTier2 * 2).toString(),
        (r.statutory.totalNssfEmployee + r.statutory.totalNssfEmployer).toString(),
      ]);
    } else {
      headers = [
        'Employee ID',
        'Beneficiary Name',
        'Payment Channel',
        'Bank Name',
        'Account Number / Mobile',
        'Net Pay Amount (KES)',
        'Narration',
      ];

      rows = currentRun.results.map((r) => [
        r.employeeCode,
        `"${r.employeeName}"`,
        r.population === 'daily_paid' ? 'Safaricom M-Pesa' : 'EFT / Real-time Bank',
        r.population === 'daily_paid' ? 'M-Pesa B2C' : 'Equity Bank',
        r.population === 'daily_paid' ? '254701239845' : '0180293849102',
        r.netPay.toString(),
        `Salary Oct 2026 ${r.employeeCode}`,
      ]);
    }

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(`Generated and downloaded ${filename}`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const reportsList = [
    {
      id: 'master_register',
      title: 'Master Payroll Register',
      desc: 'Complete employee-level ledger: Base, variable earnings, gross, statutory withholdings, loan deductions, and net take-home.',
      badge: 'Audited Snapshot',
    },
    {
      id: 'kra_p10',
      title: 'KRA PAYE Tax Return (P10 Schedule)',
      desc: 'Kenya Revenue Authority monthly statutory tax file with taxable incomes, personal relief credits, and net tax withholdings.',
      badge: 'Statutory P10',
    },
    {
      id: 'nssf',
      title: 'NSSF Monthly Return',
      desc: 'National Social Security Fund return with Tier I (up to KES 8,000) and Tier II (up to KES 72,000) matching contributions.',
      badge: 'NSSF Act 2013',
    },
    {
      id: 'shif_ahl',
      title: 'SHIF & Housing Levy Return',
      desc: 'Social Health Insurance Fund (2.75% gross) and Affordable Housing Levy (1.5% employee + 1.5% employer matching) schedule.',
      badge: 'Healthcare & AHL',
    },
    {
      id: 'disbursement',
      title: 'Bank & M-Pesa Disbursement Schedule',
      desc: 'Bulk payment file formatted for Kenyan commercial bank bulk EFTs and Safaricom M-Pesa B2C payroll channels.',
      badge: 'Disbursement Ready',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDD6CE] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Kenya Statutory & Banking Schedules
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-[#2B2B2B]">Reports, CSV Export & Statutory Returns</h1>
          <p className="text-xs text-[#666]">
             Download sample spreadsheets: Master Payroll Register, KRA PAYE P10, NSSF, SHIF, AHL, and Bank disbursement files.
          </p>
        </div>

        <button
          onClick={() => generateAndDownloadCSV(selectedReport)}
          className="px-4 py-2 text-xs font-bold text-white bg-[#3B1E54] hover:bg-[#4E286F] rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>Download Selected CSV</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-[#FFFDF8] border border-[#C9A227] rounded-xl text-xs text-[#3B1E54] flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Reports Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {reportsList.map((rep) => {
          const isSelected = selectedReport === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => setSelectedReport(rep.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#3B1E54] ring-2 ring-[#3B1E54]/20 text-[#2B2B2B] shadow-md'
                  : 'bg-white border-[#DDD6CE] hover:border-[#8C827A] text-[#666] hover:bg-[#FFFDF8]'
              }`}
            >
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border inline-block mb-2 ${
                  isSelected ? 'bg-[#3B1E54] border-[#3B1E54] text-[#FFFDF8]' : 'bg-[#FFFDF8] border-[#DDD6CE] text-[#666]'
                }`}>
                  {rep.badge}
                </span>
                <h3 className="font-bold text-xs text-[#2B2B2B]">{rep.title}</h3>
              </div>
              <p className="text-[11px] text-[#666] mt-2 line-clamp-2 leading-relaxed">
                {rep.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Report Preview Table */}
      <div className="bg-white rounded-2xl border border-[#DDD6CE] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#DDD6CE] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#2B2B2B] capitalize">
               {selectedReport.replace('_', ' ')} Preview (October 2026)
            </h3>
            <p className="text-xs text-[#666]">
               Payroll Run #{currentRun.id}
            </p>
          </div>

          <button
            onClick={() => generateAndDownloadCSV(selectedReport)}
            className="px-3 py-1.5 text-xs font-bold text-[#3B1E54] bg-[#C6B8D9]/25 hover:bg-[#C6B8D9]/40 border border-[#C6B8D9]/40 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F2F9] border-b border-[#DDD6CE] text-[#3B1E54] font-bold text-[11px]">
                <th className="py-2.5 px-3">Employee</th>
                <th className="py-2.5 px-3 font-mono">Code</th>
                <th className="py-2.5 px-3 text-right">Gross Pay</th>
                <th className="py-2.5 px-3 text-right">Taxable Pay</th>
                <th className="py-2.5 px-3 text-right">PAYE</th>
                <th className="py-2.5 px-3 text-right">NSSF (I+II)</th>
                <th className="py-2.5 px-3 text-right">SHIF (2.75%)</th>
                <th className="py-2.5 px-3 text-right">AHL (1.5%)</th>
                <th className="py-2.5 px-3 text-right">Net Payable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD6CE]/40">
              {currentRun.results.map((r) => (
                <tr key={r.id} className="hover:bg-[#FFFDF8]">
                  <td className="py-2.5 px-3 font-bold text-[#2B2B2B]">{r.employeeName}</td>
                  <td className="py-2.5 px-3 font-mono text-[#3B1E54] font-medium">{r.employeeCode}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#2B2B2B]">{formatKES(r.grossPay)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#666]">{formatKES(r.statutory.taxablePay)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-700 font-medium">{formatKES(r.statutory.netPaye)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#2B2B2B]">{formatKES(r.statutory.totalNssfEmployee)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#2B2B2B]">{formatKES(r.statutory.shifEmployee)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#2B2B2B]">{formatKES(r.statutory.ahlEmployee)}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-extrabold text-[#3B1E54]">{formatKES(r.netPay)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#F5F2F9] font-bold border-t-2 border-[#DDD6CE] text-[#2B2B2B]">
                <td colSpan={2} className="py-2.5 px-3 text-[#3B1E54]">Batch Totals</td>
                <td className="py-2.5 px-3 text-right font-mono text-[#3B1E54] font-extrabold">{formatKES(currentRun.totalGross)}</td>
                <td className="py-2.5 px-3 text-right font-mono">
                  {formatKES(currentRun.results.reduce((a, b) => a + b.statutory.taxablePay, 0))}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-rose-700">
                  {formatKES(currentRun.results.reduce((a, b) => a + b.statutory.netPaye, 0))}
                </td>
                <td className="py-2.5 px-3 text-right font-mono">
                  {formatKES(currentRun.results.reduce((a, b) => a + b.statutory.totalNssfEmployee, 0))}
                </td>
                <td className="py-2.5 px-3 text-right font-mono">
                  {formatKES(currentRun.results.reduce((a, b) => a + b.statutory.shifEmployee, 0))}
                </td>
                <td className="py-2.5 px-3 text-right font-mono">
                  {formatKES(currentRun.results.reduce((a, b) => a + b.statutory.ahlEmployee, 0))}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-[#3B1E54] font-extrabold text-sm">
                  {formatKES(currentRun.totalNet)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
