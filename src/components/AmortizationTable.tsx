import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';
import { MonthlyEntry, formatCurrency } from '../utils/loanCalculator';
import { useLanguage } from '../LanguageContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PAGE_SIZE = 12;

interface Props {
  schedule: MonthlyEntry[];
  principal: number;
  annualRate?: number;
  periodMonths?: number;
  extraPayment?: number;
  oneTimePayment?: number;
  annualPayment?: number;
  totalPayment?: number;
  totalInterest?: number;
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function generateCSV(schedule: MonthlyEntry[], headers: string[]): string {
  const rows = [headers];
  schedule.forEach((entry) => {
    rows.push([
      entry.month.toString(),
      entry.payment.toFixed(2),
      entry.principal.toFixed(2),
      entry.interest.toFixed(2),
      entry.balance.toFixed(2),
    ]);
  });
  return rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function downloadPDF(
  schedule: MonthlyEntry[],
  loanDetails: {
    principal: number;
    annualRate?: number;
    periodMonths?: number;
    extraPayment?: number;
    oneTimePayment?: number;
    annualPayment?: number;
    totalPayment?: number;
    totalInterest?: number;
  },
  tableHeaders: string[],
  t: any
) {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    const contentWidth = pageWidth - 2 * margin;
    let currentY = margin;

    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text('Amortization Schedule', margin, currentY);
    currentY += 8;

    pdf.setFontSize(9);
    pdf.setFont(undefined, 'normal');

    const details = [
      [`${t('creditAmount')}: ${formatCurrency(loanDetails.principal)}`, `${t('totalPayment')}: ${formatCurrency(loanDetails.totalPayment || 0)}`],
      [`${t('interestRate')}: ${loanDetails.annualRate?.toFixed(2) || 'N/A'}%`, `${t('totalInterest')}: ${formatCurrency(loanDetails.totalInterest || 0)}`],
      [`${t('periodMonths')}: ${loanDetails.periodMonths || 'N/A'}`, ''],
    ];

    details.forEach((detail) => {
      pdf.text(`${detail[0]}`, margin, currentY);
      if (detail[1]) {
        pdf.text(`${detail[1]}`, margin + contentWidth / 2, currentY);
      }
      currentY += 5;
    });

    currentY += 3;
    pdf.setFont(undefined, 'bold');
    pdf.text(t('amortizationSchedule'), margin, currentY);
    currentY += 6;

    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(8);

    const colWidths = [12, 18, 18, 18, 18];
    const cellHeight = 5;

    const drawTableHeader = (y: number) => {
      pdf.setFillColor(240, 240, 240);
      pdf.setFont(undefined, 'bold');
      let x = margin;
      tableHeaders.forEach((header, i) => {
        pdf.rect(x, y, colWidths[i], cellHeight, 'F');
        pdf.text(header, x + 1, y + 3.5, { maxWidth: colWidths[i] - 2 });
        x += colWidths[i];
      });
      pdf.setFont(undefined, 'normal');
      return y + cellHeight;
    };

    const drawTableRow = (y: number, values: string[]) => {
      let x = margin;
      values.forEach((value, i) => {
        pdf.rect(x, y, colWidths[i], cellHeight);
        pdf.text(value, x + 1, y + 3.5, { maxWidth: colWidths[i] - 2 });
        x += colWidths[i];
      });
      return y + cellHeight;
    };

    currentY = drawTableHeader(currentY);

    schedule.forEach((entry) => {
      if (currentY + cellHeight > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
        currentY = drawTableHeader(currentY);
      }

      const values = [
        entry.month.toString(),
        formatCurrency(entry.payment),
        formatCurrency(entry.interest),
        formatCurrency(entry.principal),
        formatCurrency(entry.balance),
      ];

      currentY = drawTableRow(currentY, values);
    });

    pdf.save('amortization-schedule.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

export default function AmortizationTable({
  schedule,
  principal,
  annualRate,
  periodMonths,
  extraPayment,
  oneTimePayment,
  annualPayment,
  totalPayment,
  totalInterest,
}: Props) {
  const { t } = useLanguage();
  const [page, setPage] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);
  const fullTableRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.ceil(schedule.length / PAGE_SIZE);
  const slice = schedule.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const maxPayment = schedule[0]?.payment ?? 1;

  const tableHeaders = [t('month'), t('payment'), t('principalColumn'), t('interestColumn'), t('balance')];

  const handleExportCSV = () => {
    const csv = generateCSV(schedule, tableHeaders);
    downloadCSV(csv, 'amortization-schedule.csv');
  };

  const handleExportPDF = () => {
    downloadPDF(schedule, {
      principal,
      annualRate,
      periodMonths,
      extraPayment,
      oneTimePayment,
      annualPayment,
      totalPayment,
      totalInterest,
    }, tableHeaders, t);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t('amortizationSchedule')}</h2>
          <p className="text-sm text-slate-400 mt-0.5">{schedule.length} {t('month').toLowerCase()}s</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Download size={16} />
            CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <FileText size={16} />
            PDF
          </button>
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
      </div>

      <div className="overflow-x-auto" ref={tableRef}>
        <div ref={fullTableRef} className="w-full">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              {tableHeaders.map((h) => (
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
