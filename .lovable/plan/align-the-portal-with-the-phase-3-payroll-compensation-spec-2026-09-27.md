# Align the portal with the Phase 3 Payroll & Compensation spec

The portal already covers: Dashboard, Payroll Run, Review & Approval, Final Dues, Reports, Settings, Leave, Attendance, Calendar and the Employee Portal. This plan fills the gaps in the spec and adds standard payroll / attendance / leave features. All data stays as realistic sample data (no live backend yet).

## 1. New screens from the spec

- **Employee Payroll Profile** — per-employee page: pay basis (monthly, weekly, daily, hourly, casual, temporary), pay group, effective-dated compensation history, recurring earnings/deductions, masked bank/M-Pesa details, KRA PIN / NSSF / SHA numbers, missing-data warnings.
- **Payroll Inputs** — one-off, recurring and balance-based items (bonus, commission, allowances, reimbursements, recoveries); loans & salary advances with running balance and instalment schedule; "Bulk import CSV" with preview and row-level errors; time-derived items pulled from approved attendance.
- **Audit Trail** — filterable log of every calculation, edit, approval, return, close, reopen and export, with user, time and before/after values.

## 2. Refinements to existing screens

- **Payroll lifecycle** — a status stepper on the Payroll Run following the 10 spec stages: Draft → Inputs → Calculated → Validated → In Review → Approved → Payslips Published → Exported → Closed, with "Reopen with reason" (approver only).
- **Validation engine** — exception panel listing: missing statutory IDs, missing rate, missing payment details, duplicate bank/mobile numbers, rate change since prior period, net pay variance above threshold, negative net pay, unapproved attendance/overtime.
- **Role switcher** in the header (Payroll Officer, Reviewer, Finance Approver, Line Manager, Employee, Auditor) — buttons and screens show or hide according to the spec's access table; Employee sees only their own payslips.
- **Dashboard** — open periods, pending approvals, variance vs last month, worker counts per pay basis, exceptions, recent runs.
- **Settings** — effective-dated statutory rule versions (PAYE bands, NSSF tiers, SHIF, Housing Levy), overtime multipliers, proration method, approval chain, CSV column layout, payslip field toggles.
- **Reports** — add Payroll Variance, Casual/Temporary Worker, Loans & Advances and Audit reports alongside existing statutory schedules.
- **Payslips** — unique reference, generation date, optional YTD and employer contributions.

## 3. Standard HR features added

Attendance:
- Shift schedules and rosters, with late/early/absent flags.
- Overtime requests and approval (line manager) before payroll cut-off.
- Timesheet approval for hourly/daily/casual workers.

Leave:
- Leave balances with monthly accrual, carry-forward and expiry.
- Kenya public holidays list feeding calendar and proration.
- Leave encashment on exit (feeds Final Dues) and half-day / partial leave.

## Technical details

- New components in `src/velora/components/`: `EmployeeProfileView`, `PayrollInputsView`, `AuditTrailView`, `ShiftRosterView`, `RoleSwitcher`; new sidebar entries and `ScreenId`s.
- Extend `types/hr.ts` and `data/mockData.ts` (pay basis, loans, rule versions, audit events, shifts, accruals).
- Role state held in `App.tsx` and passed down; a small `can(role, action)` permission helper.
- Calculator reuses `kenyaPayrollCalculator.ts`, adding daily/hourly/weekly pay basis and stored rule version on each line.
- Verify with build log and Playwright screenshots of each new screen.
