import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MonthlyEntry, formatCurrency } from '../utils/loanCalculator';

const PAGE_SIZE = 12;

interface Props {
  schedule: MonthlyEntry[];
  principal: number;
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function AmortizationTable({ schedule, principal }: Props) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(schedule.length / PAGE_SIZE);
  const slice = schedule.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const maxPayment = schedule[0]?.payment ?? 1;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Amortization Schedule</h2>
          <p className="text-sm text-slate-400 mt-0.5">{schedule.length} monthly payments</p>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-medium">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              {['Month', 'Payment', 'Principal', 'Interest', 'Balance'].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((row, idx) => (
              <tr
                key={row.month}
                className={`border-t border-slate-50 hover:bg-blue-50/40 transition-colors ${
                  idx % 2 === 0 ? '' : 'bg-slate-50/50'
                }`}
              >
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs">
                    {row.month}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-800">
                  {formatCurrency(row.payment)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-blue-700">{formatCurrency(row.principal)}</span>
                    <ProgressBar value={row.principal} max={maxPayment} color="bg-blue-500" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-orange-500">{formatCurrency(row.interest)}</span>
                    <ProgressBar value={row.interest} max={maxPayment} color="bg-orange-400" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-slate-600">{formatCurrency(row.balance)}</span>
                    <ProgressBar value={row.balance} max={principal} color="bg-slate-300" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-8 py-4 border-t border-slate-100 flex justify-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === page ? 'bg-blue-600 w-5' : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
