import { KenyaStatutoryBreakdown } from '../types/hr';

export function calculateKenyaStatutory(grossPay: number, pensionContribution: number = 0): KenyaStatutoryBreakdown {
  const pensionable = Math.max(0, grossPay);

  // 1. NSSF Calculation (Kenya NSSF Act 2013 Tiered Structure)
  // Tier 1: 6% of pensionable earnings up to KES 8,000 (Max KES 480)
  const tier1Limit = 8000;
  const tier2Limit = 72000;

  const nssfTier1 = Math.round(Math.min(pensionable, tier1Limit) * 0.06);

  // Tier 2: 6% of earnings between KES 8,000 and KES 72,000 (Max KES 3,840)
  let nssfTier2 = 0;
  if (pensionable > tier1Limit) {
    const tier2Earnings = Math.min(pensionable, tier2Limit) - tier1Limit;
    nssfTier2 = Math.round(tier2Earnings * 0.06);
  }

  const totalNssfEmployee = nssfTier1 + nssfTier2;
  const totalNssfEmployer = totalNssfEmployee; // 100% matched by employer

  // 2. SHIF (Social Health Insurance Fund)
  // 2.75% of Gross monthly earnings (Minimum KES 300)
  let shifEmployee = Math.round(grossPay * 0.0275);
  if (grossPay > 0 && shifEmployee < 300) {
    shifEmployee = 300;
  }
  if (grossPay === 0) {
    shifEmployee = 0;
  }

  // 3. Affordable Housing Levy (AHL)
  // 1.5% of Gross by Employee, matched 1.5% by Employer
  const ahlEmployee = Math.round(grossPay * 0.015);
  const ahlEmployer = ahlEmployee;

  // 4. Taxable Pay Calculation
  // In Kenya, statutory NSSF contribution is tax-deductible up to KES 4,320 / month
  // Allowable pension deduction is up to KES 20,000 / month
  const allowableNssf = totalNssfEmployee;
  const allowablePension = Math.min(20000, pensionContribution);
  const taxablePay = Math.max(0, grossPay - allowableNssf - allowablePension);

  // 5. PAYE Tax Bands (Monthly KRA Rates)
  // Band 1: Up to KES 24,000 @ 10%
  // Band 2: Next KES 8,333 (24,001 - 32,333) @ 25%
  // Band 3: Next KES 467,667 (32,334 - 500,000) @ 30%
  // Band 4: Next KES 300,000 (500,001 - 800,000) @ 32.5%
  // Band 5: Above KES 800,000 @ 35%
  let remainingTaxable = taxablePay;
  let grossTax = 0;

  // Tier 1: First 24,000 @ 10%
  const band1 = Math.min(remainingTaxable, 24000);
  grossTax += band1 * 0.10;
  remainingTaxable -= band1;

  // Tier 2: Next 8,333 @ 25%
  if (remainingTaxable > 0) {
    const band2 = Math.min(remainingTaxable, 8333.33);
    grossTax += band2 * 0.25;
    remainingTaxable -= band2;
  }

  // Tier 3: Next 467,666.67 (up to 500k) @ 30%
  if (remainingTaxable > 0) {
    const band3 = Math.min(remainingTaxable, 467666.67);
    grossTax += band3 * 0.30;
    remainingTaxable -= band3;
  }

  // Tier 4: Next 300,000 (up to 800k) @ 32.5%
  if (remainingTaxable > 0) {
    const band4 = Math.min(remainingTaxable, 300000);
    grossTax += band4 * 0.325;
    remainingTaxable -= band4;
  }

  // Tier 5: Above 800k @ 35%
  if (remainingTaxable > 0) {
    grossTax += remainingTaxable * 0.35;
  }

  // Personal Relief: KES 2,400 per month
  const personalRelief = taxablePay > 0 ? 2400 : 0;
  const insuranceRelief = 0;
  const housingRelief = 0; // SHIF & AHL non-relief or specific standard

  const netPaye = Math.round(Math.max(0, grossTax - personalRelief - insuranceRelief - housingRelief));

  const totalStatutoryEmployee = totalNssfEmployee + shifEmployee + ahlEmployee + netPaye;
  const totalStatutoryEmployer = totalNssfEmployer + ahlEmployer;

  return {
    nssfTier1,
    nssfTier2,
    totalNssfEmployee,
    totalNssfEmployer,
    shifEmployee,
    ahlEmployee,
    ahlEmployer,
    taxablePay: Math.round(taxablePay),
    grossTax: Math.round(grossTax),
    personalRelief,
    insuranceRelief,
    housingRelief,
    netPaye,
    totalStatutoryEmployee,
    totalStatutoryEmployer,
  };
}

export function formatKES(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('KES', 'KES ');
}
