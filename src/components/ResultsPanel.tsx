import React from 'react';
import { CalculationResult } from '../types/calculator';
import SummaryCard from './SummaryCard';
import BranchCard from './BranchCard';
import { BlockMath } from 'react-katex';

interface ResultsPanelProps {
  result: CalculationResult;
  splitColumn: string;
  targetColumn: string;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ result, splitColumn, targetColumn }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SummaryCard result={result} splitColumn={splitColumn} />

      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Branch Calculations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.branchResults.map((branch, idx) => (
            <BranchCard key={idx} result={branch} />
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Final Calculations</h2>
        
        <div className="space-y-6">
          {result.datasetFormula && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-800 uppercase mb-2">1. Total Dataset Entropy H(S)</h3>
              <BlockMath math={`H(S) = ${result.datasetFormula} = ${result.datasetEntropy?.toFixed(4)}`} />
            </div>
          )}

          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <h3 className="text-sm font-semibold text-green-800 uppercase mb-2">2. Weighted Entropy</h3>
            <div className="overflow-x-auto">
              <BlockMath math={result.weightedEntropyFormula || ''} />
            </div>
            <div className="text-right mt-2 font-bold text-green-900 text-lg">
              Weighted Entropy ≈ {result.weightedEntropy.toFixed(4)}
            </div>
          </div>

          {result.informationGain !== undefined && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <h3 className="text-sm font-semibold text-yellow-800 uppercase mb-2">3. Information Gain</h3>
              <BlockMath math={result.infoGainFormula || ''} />
              <div className="text-right mt-2 font-bold text-yellow-900 text-lg">
                Info Gain ≈ {result.informationGain.toFixed(4)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-slate-700 leading-relaxed italic text-sm">
        <p>
          The split column <strong>{splitColumn}</strong> creates {result.branchResults.length} branches. 
          Each branch entropy is calculated from the distribution of <strong>{targetColumn}</strong>. 
          The final weighted entropy is the sum of each branch entropy multiplied by its branch weight.
        </p>
      </div>
    </div>
  );
};

export default ResultsPanel;
