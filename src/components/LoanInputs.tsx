import { Euro, Percent, Calendar } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface Props {
  principal: string;
  annualRate: string;
  periodMonths: string;
  extraPayment: string;
  oneTimePayment: string;
  annualPayment: string;
  onPrincipalChange: (v: string) => void;
  onRateChange: (v: string) => void;
  onPeriodChange: (v: string) => void;
  onExtraPaymentChange: (v: string) => void;
  onOneTimePaymentChange: (v: string) => void;
  onAnnualPaymentChange: (v: string) => void;
  onCalculate: () => void;
}

function InputField({
  label,
  value,
  onChange,
  icon,
  placeholder,
  suffix,
  min,
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  placeholder: string;
  suffix?: string;
  min?: string;
  step?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="absolute left-3.5 text-slate-400">{icon}</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min ?? '0'}
          step={step ?? '1'}
          className="w-full pl-10 pr-14 py-3.5 bg-white border-2 border-slate-200 rounded-xl text-slate-800 text-base font-medium placeholder-slate-300 focus:outline-none focus:border-blue-500 transition-colors duration-200"
        />
        {suffix && (
          <span className="absolute right-4 text-slate-400 font-medium text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export default function LoanInputsPanel({
  principal,
  annualRate,
  periodMonths,
  extraPayment,
  oneTimePayment,
  annualPayment,
  onPrincipalChange,
  onRateChange,
  onPeriodChange,
  onExtraPaymentChange,
  onOneTimePaymentChange,
  onAnnualPaymentChange,
  onCalculate,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-6">
        <InputField
          label={t('creditAmount')}
          value={principal}
          onChange={onPrincipalChange}
          icon={<Euro size={16} />}
          placeholder={t('creditPlaceholder')}
          suffix="EUR"
          min="1"
          step="100"
        />
        <InputField
          label={t('interestRate')}
          value={annualRate}
          onChange={onRateChange}
          icon={<Percent size={16} />}
          placeholder={t('ratePlaceholder')}
          suffix="%"
          min="0"
          step="0.1"
        />
        <InputField
          label={t('periodMonths')}
          value={periodMonths}
          onChange={onPeriodChange}
          icon={<Calendar size={16} />}
          placeholder={t('periodPlaceholder')}
          suffix="mo"
          min="1"
        />
      </div>

      <div className="pt-6 border-t border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <InputField
            label={t('yearlyExtraPayment')}
            value={annualPayment}
            onChange={onAnnualPaymentChange}
            icon={<Euro size={16} />}
            placeholder={t('extraPlaceholder')}
            suffix="EUR"
            min="0"
            step="100"
          />
          <InputField
            label={t('monthlyExtraPayment')}
            value={extraPayment}
            onChange={onExtraPaymentChange}
            icon={<Euro size={16} />}
            placeholder={t('extraPlaceholder')}
            suffix="EUR"
            min="0"
            step="100"
          />
          <InputField
            label={t('oneTimePayment')}
            value={oneTimePayment}
            onChange={onOneTimePaymentChange}
            icon={<Euro size={16} />}
            placeholder={t('extraPlaceholder')}
            suffix="EUR"
            min="0"
            step="100"
          />
        </div>
      </div>

      <button
        onClick={onCalculate}
        className="mt-6 w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-colors duration-200 text-base tracking-wide shadow-sm"
      >
        {t('calculate')}
      </button>
    </div>
  );
}
