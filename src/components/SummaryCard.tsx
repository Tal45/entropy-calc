import React from 'react';
import { CalculationResult } from '../types/calculator';
import { round } from '../utils/formatting';

interface SummaryCardProps {
  result: CalculationResult;
  splitColumn: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ result, splitColumn }) => {
  return (
    <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg border border-slate-700">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className="bg-blue-500 w-2 h-6 rounded-full mr-3"></span>
        Calculation Summary
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-700 pb-2">
            <span className="text-slate-400">Split Column:</span>
            <span className="font-semibold text-blue-300">{splitColumn}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-700 pb-2">
            <span className="text-slate-400">Total Samples:</span>
            <span className="font-semibold">{result.totalSamples}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-700 pb-2">
            <span className="text-slate-400">Number of Branches:</span>
            <span className="font-semibold">{result.branchResults.length}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col bg-slate-700 p-3 rounded-lg border border-slate-600">
            <span className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-mono">Weighted Entropy</span>
            <span className="text-3xl font-bold text-green-400">{round(result.weightedEntropy)}</span>
          </div>
          
          {result.datasetEntropy !== undefined && (
            <div className="flex flex-col bg-slate-700 p-3 rounded-lg border border-slate-600">
              <span className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-mono">Information Gain</span>
              <span className="text-3xl font-bold text-yellow-400">{round(result.informationGain || 0)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
