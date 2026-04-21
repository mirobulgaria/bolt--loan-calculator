import { TrendingUp, CreditCard, BarChart2, Clock } from 'lucide-react';
import { LoanResult, formatCurrency } from '../utils/loanCalculator';

interface Props {
  result: LoanResult;
  principal: number;
  extraPayment?: number;
}

function StatCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-6 flex flex-col gap-3 ${
        highlight
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
          : 'bg-white border border-slate-100 shadow-sm'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          highlight ? 'bg-blue-500' : 'bg-slate-100'
        }`}
      >
        <span className={highlight ? 'text-white' : 'text-slate-500'}>{icon}</span>
      </div>
      <div>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${highlight ? 'text-blue-100' : 'text-slate-500'}`}>
          {label}
        </p>
        <p className={`text-2xl font-bold ${highlight ? 'text-white' : 'text-slate-800'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function DonutChart({ principal, totalInterest }: { principal: number; totalInterest: number }) {
  const total = principal + totalInterest;
  const principalPct = (principal / total) * 100;
  const interestPct = (totalInterest / total) * 100;

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const principalDash = (principalPct / 100) * circumference;
  const interestDash = (interestPct / 100) * circumference;

  return (
    <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 flex flex-col gap-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Payment Breakdown</p>
      <div className="flex items-center gap-6">
        <svg width="128" height="128" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="16" />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="#2563eb"
            strokeWidth="16"
            strokeDasharray={`${principalDash} ${circumference}`}
            strokeLinecap="butt"
            transform="rotate(-90 64 64)"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="#f97316"
            strokeWidth="16"
            strokeDasharray={`${interestDash} ${circumference}`}
            strokeDashoffset={-principalDash}
            strokeLinecap="butt"
            transform="rotate(-90 64 64)"
          />
        </svg>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
            <div>
              <p className="text-xs text-slate-500">Principal</p>
              <p className="text-sm font-bold text-slate-800">{principalPct.toFixed(1)}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-400 inline-block" />
            <div>
              <p className="text-xs text-slate-500">Interest</p>
              <p className="text-sm font-bold text-slate-800">{interestPct.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoanSummary({ result, principal, extraPayment = 0 }: Props) {
  const monthlyPaymentWithExtra = result.monthlyPayment + extraPayment;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
      <StatCard
        icon={<CreditCard size={20} />}
        label="Monthly Payment (base)"
        value={formatCurrency(result.monthlyPayment)}
        highlight
      />
      <StatCard
        icon={<CreditCard size={20} />}
        label="Monthly Payment (with extra)"
        value={formatCurrency(monthlyPaymentWithExtra)}
      />
      <StatCard
        icon={<BarChart2 size={20} />}
        label="Total Payment"
        value={formatCurrency(result.totalPayment)}
      />
      <StatCard
        icon={<TrendingUp size={20} />}
        label="Total Interest"
        value={formatCurrency(result.totalInterest)}
      />
      <StatCard
        icon={<Clock size={20} />}
        label="Total Period"
        value={`${result.schedule.length} mo`}
      />
      <DonutChart principal={principal} totalInterest={result.totalInterest} />
    </div>
  );
}
