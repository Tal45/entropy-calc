import React from 'react';
import { BranchCount } from '../types/calculator';

interface CountsTableProps {
  branches: BranchCount[];
  targetClasses: string[];
  targetColumn: string;
  splitColumn: string;
  onUpdateCount: (branchIdx: number, cls: string, count: number) => void;
}

const CountsTable: React.FC<CountsTableProps> = ({ 
  branches, 
  targetClasses, 
  targetColumn, 
  splitColumn,
  onUpdateCount 
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-r border-slate-200">
              {splitColumn} Value
            </th>
            {targetClasses.map((cls) => (
              <th key={cls} scope="col" className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {targetColumn} = {cls}
              </th>
            ))}
            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider bg-blue-50">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {branches.map((branch, bIdx) => {
            const rowTotal = targetClasses.reduce((sum, cls) => sum + (branch.classCounts[cls] || 0), 0);
            return (
              <tr key={bIdx} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800 border-r border-slate-200 bg-slate-50/50">
                  {branch.splitValue}
                </td>
                {targetClasses.map((cls) => (
                  <td key={cls} className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="number"
                      min="0"
                      className="w-20 text-center border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white"
                      value={branch.classCounts[cls] || 0}
                      onChange={(e) => onUpdateCount(bIdx, cls, parseInt(e.target.value) || 0)}
                    />
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-blue-800 bg-blue-50/50">
                  {rowTotal}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CountsTable;
