import React from 'react';
import { CalculatorInput } from '../types/calculator';
import { Plus, Trash2 } from 'lucide-react';

interface CalculatorFormProps {
  input: CalculatorInput;
  onUpdateInput: (updates: Partial<CalculatorInput>) => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ 
  input, 
  onUpdateInput
}) => {
  const addSplitValue = () => {
    const newVal = `Value ${input.branches.length + 1}`;
    const newBranch = {
      splitValue: newVal,
      classCounts: Object.fromEntries(input.targetClasses.map(cls => [cls, 0]))
    };
    onUpdateInput({ branches: [...input.branches, newBranch] });
  };

  const removeSplitValue = (index: number) => {
    const newBranches = [...input.branches];
    newBranches.splice(index, 1);
    onUpdateInput({ branches: newBranches });
  };

  const addTargetClass = () => {
    const newCls = `Class ${input.targetClasses.length + 1}`;
    const newBranches = input.branches.map(b => ({
      ...b,
      classCounts: { ...b.classCounts, [newCls]: 0 }
    }));
    onUpdateInput({ 
      targetClasses: [...input.targetClasses, newCls],
      branches: newBranches
    });
  };

  const removeTargetClass = (index: number) => {
    const clsToRemove = input.targetClasses[index];
    const newClasses = [...input.targetClasses];
    newClasses.splice(index, 1);
    
    const newBranches = input.branches.map(b => {
      const { [clsToRemove]: _, ...rest } = b.classCounts;
      return { ...b, classCounts: rest };
    });

    onUpdateInput({ 
      targetClasses: newClasses,
      branches: newBranches
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 uppercase tracking-tight">Split Column Name</label>
          <input
            type="text"
            className="w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={input.splitColumn}
            onChange={(e) => onUpdateInput({ splitColumn: e.target.value })}
            placeholder="e.g. Smoker"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 uppercase tracking-tight">Target Column Name</label>
          <input
            type="text"
            className="w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={input.targetColumn}
            onChange={(e) => onUpdateInput({ targetColumn: e.target.value })}
            placeholder="e.g. Stroke"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* Split Values Editor */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Split Values</h3>
            <button 
              onClick={addSplitValue}
              className="flex items-center text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-2 py-1 rounded"
            >
              <Plus className="w-3 h-3 mr-1" /> Add Value
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {input.branches.map((branch, idx) => (
              <div key={idx} className="flex items-center space-x-2 group">
                <input
                  type="text"
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:bg-white focus:border-blue-400 transition-all"
                  value={branch.splitValue}
                  onChange={(e) => {
                    const newBranches = [...input.branches];
                    newBranches[idx].splitValue = e.target.value;
                    onUpdateInput({ branches: newBranches });
                  }}
                />
                <button 
                  onClick={() => removeSplitValue(idx)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                  title="Remove split value"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Target Classes Editor */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Target Classes</h3>
            <button 
              onClick={addTargetClass}
              className="flex items-center text-xs font-bold text-green-600 hover:text-green-800 transition-colors bg-green-50 px-2 py-1 rounded"
            >
              <Plus className="w-3 h-3 mr-1" /> Add Class
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {input.targetClasses.map((cls, idx) => (
              <div key={idx} className="flex items-center space-x-2 group">
                <input
                  type="text"
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:bg-white focus:border-green-400 transition-all"
                  value={cls}
                  onChange={(e) => {
                    const newClasses = [...input.targetClasses];
                    const oldCls = newClasses[idx];
                    newClasses[idx] = e.target.value;
                    
                    const newBranches = input.branches.map(b => {
                      const counts = { ...b.classCounts };
                      counts[e.target.value] = counts[oldCls];
                      delete counts[oldCls];
                      return { ...b, classCounts: counts };
                    });

                    onUpdateInput({ targetClasses: newClasses, branches: newBranches });
                  }}
                />
                <button 
                  onClick={() => removeTargetClass(idx)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                  title="Remove target class"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorForm;
