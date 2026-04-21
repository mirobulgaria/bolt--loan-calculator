export type Language = 'en' | 'bg';

export const translations = {
  en: {
    // Header
    appTitle: 'Loan Calculator',
    appSubtitle: 'Amortization & payment planner',

    // Input labels
    creditAmount: 'Credit Amount',
    interestRate: 'Interest Rate',
    interestRateHint: 'Annual interest rate',
    periodMonths: 'Period (Months)',
    monthlyExtraPayment: 'Monthly Extra Payment',
    oneTimePayment: 'One-Time Payment',
    yearlyExtraPayment: 'Yearly Extra Payment',
    calculate: 'Calculate',

    // Summary labels
    monthlyPaymentBase: 'Monthly Payment (base)',
    monthlyPaymentWithExtra: 'Monthly Payment (with extra)',
    totalPayment: 'Total Payment',
    totalInterest: 'Total Interest',
    totalPeriod: 'Total Period',
    paymentBreakdown: 'Payment Breakdown',
    principal: 'Principal',
    interest: 'Interest',

    // Table headers
    month: 'Month',
    payment: 'Payment',
    principalColumn: 'Principal',
    interestColumn: 'Interest',
    balance: 'Balance',
    amortizationSchedule: 'Amortization Schedule',
    showingMonths: 'Showing months',
    of: 'of',

    // Errors and placeholders
    enterValidCredit: 'Enter a valid credit amount.',
    enterValidRate: 'Enter a valid interest rate.',
    enterValidPeriod: 'Enter a valid period in months.',
    enterLoanDetails: 'Enter your loan details above',
    fillInDetails: 'Fill in the credit amount, interest rate, and period, then click Calculate.',

    // Placeholders
    creditPlaceholder: 'e.g. 10000',
    ratePlaceholder: 'e.g. 5.5',
    periodPlaceholder: 'e.g. 36',
    extraPlaceholder: 'Optional',
  },
  bg: {
    // Header
    appTitle: 'Калкулатор за кредит',
    appSubtitle: 'План за амортизация и плащания',

    // Input labels
    creditAmount: 'Размер на кредита',
    interestRate: 'Лихвен процент',
    interestRateHint: 'Годишен лихвен процент',
    periodMonths: 'Период (месеци)',
    monthlyExtraPayment: 'Месечно допълнително плащане',
    oneTimePayment: 'Еднократно плащане',
    yearlyExtraPayment: 'Годишно допълнително плащане',
    calculate: 'Изчисли',

    // Summary labels
    monthlyPaymentBase: 'Месечно плащане (базово)',
    monthlyPaymentWithExtra: 'Месечно плащане (с допълнително)',
    totalPayment: 'Общо плащане',
    totalInterest: 'Общо лихви',
    totalPeriod: 'Общ период',
    paymentBreakdown: 'Разпределение на плащането',
    principal: 'Основна сума',
    interest: 'Лихва',

    // Table headers
    month: 'Месец',
    payment: 'Плащане',
    principalColumn: 'Основна сума',
    interestColumn: 'Лихва',
    balance: 'Баланс',
    amortizationSchedule: 'График за амортизация',
    showingMonths: 'Показване на месеци',
    of: 'от',

    // Errors and placeholders
    enterValidCredit: 'Въведете валидна сума на кредита.',
    enterValidRate: 'Въведете валиден лихвен процент.',
    enterValidPeriod: 'Въведете валиден период в месеци.',
    enterLoanDetails: 'Въведете данните за кредита по-горе',
    fillInDetails: 'Попълнете сумата на кредита, лихвения процент и периода, след което натиснете Изчисли.',

    // Placeholders
    creditPlaceholder: 'напр. 10000',
    ratePlaceholder: 'напр. 5.5',
    periodPlaceholder: 'напр. 36',
    extraPlaceholder: 'По избор',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
