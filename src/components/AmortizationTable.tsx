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
  tableRef: HTMLDivElement | null,
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
  t: any
) {
  if (!tableRef) return;
  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let currentY = 15;

    pdf.setFontSize(18);
    pdf.text('Amortization Schedule', 15, currentY);
    currentY += 10;

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');

    const details = [
      ['Loan Amount:', `${formatCurrency(loanDetails.principal)}`],
      ['Annual Interest Rate:', `${loanDetails.annualRate?.toFixed(2) || 'N/A'}%`],
      ['Loan Period:', `${loanDetails.periodMonths || 'N/A'} months`],
      ['Monthly Extra Payment:', `${formatCurrency(loanDetails.extraPayment || 0)}`],
      ['Annual Extra Payment:', `${formatCurrency(loanDetails.annualPayment || 0)}`],
      ['One-Time Payment:', `${formatCurrency(loanDetails.oneTimePayment || 0)}`],
      ['Total Amount Paid:', `${formatCurrency(loanDetails.totalPayment || 0)}`],
      ['Total Interest Paid:', `${formatCurrency(loanDetails.totalInterest || 0)}`],
    ];

    details.forEach((detail) => {
      pdf.text(`${detail[0]}`, 15, currentY);
      pdf.text(`${detail[1]}`, 100, currentY);
      currentY += 6;
    });

    currentY += 5;

    const canvas = await html2canvas(tableRef, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pageWidth - 30;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (currentY + imgHeight > pageHeight - 10) {
      pdf.addPage();
      currentY = 15;
    }

    pdf.addImage(imgData, 'PNG', 15, currentY, imgWidth, imgHeight);
    let heightLeft = imgHeight;
    let position = heightLeft;

    while (position > pageHeight - 25) {
      position -= pageHeight - 25;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 15, position - heightLeft + pageHeight - 25, imgWidth, imgHeight);
    }

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
    downloadPDF(fullTableRef.current, {
      principal,
      annualRate,
      periodMonths,
      extraPayment,
      oneTimePayment,
      annualPayment,
      totalPayment,
      totalInterest,
    }, t);
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
