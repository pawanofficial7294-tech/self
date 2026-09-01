import React from 'react';
import { SkeletonLoader } from './States';

interface DataTableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (row: T, index: number) => React.ReactNode;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
}

export function DataTable<T>({
  headers,
  data,
  renderRow,
  isLoading = false,
  emptyTitle = 'No records found',
  emptyMessage = 'There are no active records in this list.'
}: DataTableProps<T>) {
  return (
    <div className="w-full border border-gov-border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Scrollable Container */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-sm">
          {/* Table Head */}
          <thead>
            <tr className="bg-gov-bg-alt border-b border-gov-border text-gov-charcoal font-semibold select-none">
              {headers.map((header, idx) => (
                <th key={idx} className="px-5 py-3.5 whitespace-nowrap text-xs uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={headers.length} className="p-0">
                  <SkeletonLoader rows={3} />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-5 py-12 text-center text-gov-muted">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <span className="font-semibold text-gov-charcoal">{emptyTitle}</span>
                    <span className="text-xs max-w-xs">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gov-border last:border-0 hover:bg-gov-bg-alt/30 transition-colors"
                >
                  {renderRow(row, idx)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between py-4 px-1 bg-white select-none">
      <div className="text-xs text-gov-muted">
        Showing Page <span className="font-medium text-gov-charcoal">{currentPage}</span> of{' '}
        <span className="font-medium text-gov-charcoal">{totalPages}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-xs font-semibold rounded border border-gov-border hover:bg-gov-bg-alt disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors text-gov-charcoal"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          const isActive = pageNum === currentPage;
          return (
            <button
              key={idx}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                isActive
                  ? 'bg-gov-navy text-white'
                  : 'border border-gov-border hover:bg-gov-bg-alt text-gov-charcoal'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-xs font-semibold rounded border border-gov-border hover:bg-gov-bg-alt disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors text-gov-charcoal"
        >
          Next
        </button>
      </div>
    </div>
  );
};
