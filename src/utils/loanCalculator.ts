export interface LoanInputs {
  principal: number;
  annualRate: number;
  periodMonths: number;
  extraPayment?: number;
  oneTimePayment?: number;
  annualPayment?: number;
}

export interface MonthlyEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: MonthlyEntry[];
}

export function calculateLoan(inputs: LoanInputs): LoanResult | null {
  const { principal, annualRate, periodMonths, extraPayment = 0, oneTimePayment = 0, annualPayment = 0 } = inputs;

  if (principal <= 0 || annualRate < 0 || periodMonths <= 0) return null;

  const monthlyRate = annualRate / 100 / 12;
  let balanceAfterOneTime = Math.max(0, principal - oneTimePayment);

  if (balanceAfterOneTime === 0) return null;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = balanceAfterOneTime / periodMonths;
  } else {
    monthlyPayment =
      (balanceAfterOneTime * (monthlyRate * Math.pow(1 + monthlyRate, periodMonths))) /
      (Math.pow(1 + monthlyRate, periodMonths) - 1);
  }

  const schedule: MonthlyEntry[] = [];
  let balance = balanceAfterOneTime;
  const totalPaymentWithExtra = monthlyPayment + extraPayment;

  while (balance > 0) {
    const month = schedule.length + 1;
    const interestPayment = balance * monthlyRate;
    const actualPayment = Math.min(balance + interestPayment, totalPaymentWithExtra);
    const principalPayment = actualPayment - interestPayment;

    balance = Math.max(0, balance - principalPayment);

    let totalMonthPayment = actualPayment;

    if (annualPayment > 0 && month % 12 === 0 && balance > 0) {
      balance = Math.max(0, balance - annualPayment);
      totalMonthPayment += annualPayment;
    }

    schedule.push({
      month,
      payment: totalMonthPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance,
    });

    if (balance <= 0) break;
  }

  const totalPayment = schedule.reduce((sum, entry) => sum + entry.payment, 0);
  const totalInterest = totalPayment - balanceAfterOneTime;

  return { monthlyPayment, totalPayment, totalInterest, schedule };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
