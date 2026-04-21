import { useState } from 'react';
import { Calculator } from 'lucide-react';
import LoanInputsPanel from './components/LoanInputs';
import LoanSummary from './components/LoanSummary';
import AmortizationTable from './components/AmortizationTable';
import { calculateLoan, LoanResult } from './utils/loanCalculator';

export default function App() {
  const [principal, setPrincipal] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [periodMonths, setPeriodMonths] = useState('');
  const [extraPayment, setExtraPayment] = useState('');
  const [oneTimePayment, setOneTimePayment] = useState('');
  const [annualPayment, setAnnualPayment] = useState('');
  const [result, setResult] = useState<LoanResult | null>(null);
  const [error, setError] = useState('');

  function handleCalculate() {
    setError('');
    const p = parseFloat(principal);
    const r = parseFloat(annualRate);
    const n = parseInt(periodMonths, 10);
    const e = parseFloat(extraPayment) || 0;
    const o = parseFloat(oneTimePayment) || 0;
    const a = parseFloat(annualPayment) || 0;

    if (!p || p <= 0) return setError('Enter a valid credit amount.');
    if (isNaN(r) || r < 0) return setError('Enter a valid interest rate.');
    if (!n || n <= 0) return setError('Enter a valid period in months.');

    const res = calculateLoan({ principal: p, annualRate: r, periodMonths: n, extraPayment: e, oneTimePayment: o, annualPayment: a });
    setResult(res);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <Calculator size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">Loan Calculator</h1>
            <p className="text-xs text-slate-400 leading-tight">Amortization & payment planner</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-6">
        <LoanInputsPanel
          principal={principal}
          annualRate={annualRate}
          periodMonths={periodMonths}
          extraPayment={extraPayment}
          oneTimePayment={oneTimePayment}
          annualPayment={annualPayment}
          onPrincipalChange={setPrincipal}
          onRateChange={setAnnualRate}
          onPeriodChange={setPeriodMonths}
          onExtraPaymentChange={setExtraPayment}
          onOneTimePaymentChange={setOneTimePayment}
          onAnnualPaymentChange={setAnnualPayment}
          onCalculate={handleCalculate}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3.5 text-sm font-medium">
            {error}
          </div>
        )}

        {result && (
          <>
            <LoanSummary result={result} principal={parseFloat(principal)} extraPayment={parseFloat(extraPayment) || 0} />
            <AmortizationTable schedule={result.schedule} principal={parseFloat(principal)} />
          </>
        )}

        {!result && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <Calculator size={28} className="text-blue-500" />
            </div>
            <p className="text-slate-600 font-medium text-lg">Enter your loan details above</p>
            <p className="text-slate-400 text-sm mt-1">
              Fill in the credit amount, interest rate, and period, then click Calculate.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
