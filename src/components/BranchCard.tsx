import React from 'react';
import { BranchResult } from '../types/calculator';
import { BlockMath } from 'react-katex';
import { round } from '../utils/formatting';

interface BranchCardProps {
  result: BranchResult;
}

const BranchCard: React.FC<BranchCardProps> = ({ result }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        Branch: <span className="text-blue-600">{result.splitValue}</span>
      </h3>
      
      <div className="space-y-3 text-sm text-slate-600">
        <div>
          <span className="font-medium">Total Samples:</span> {result.total}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(result.probabilities).map(([cls, p]) => (
            <div key={cls}>
              <span className="font-medium">p({cls}):</span> {result.classCounts ? `${result.classCounts[cls]}/${result.total} = ` : ''}{round(p)}
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-md border border-slate-100 overflow-x-auto">
          <p className="text-xs text-slate-500 mb-1 font-mono uppercase tracking-wider">Entropy Calculation</p>
          <div className="py-2">
            <BlockMath math={`H(S_{${result.splitValue}}) = ${result.formulaText}`} />
          </div>
          <div className="text-right mt-1 font-semibold text-slate-700">
            Result: {round(result.entropy)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchCard;
