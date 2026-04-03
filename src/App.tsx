import { useState } from 'react';
import { CalculatorInput, CalculationResult } from './types/calculator';
import { calculateFull } from './utils/entropy';
import { smokerExample } from './data/exampleScenario';
import CalculatorForm from './components/CalculatorForm';
import CountsTable from './components/CountsTable';
import ResultsPanel from './components/ResultsPanel';
import { Calculator, Terminal, HelpCircle, RotateCcw } from 'lucide-react';
import 'katex/dist/katex.min.css';

const INITIAL_INPUT: CalculatorInput = {
  splitColumn: '',
  targetColumn: '',
  targetClasses: ['Class 1', 'Class 2'],
  branches: [
    { splitValue: 'Value 1', classCounts: { 'Class 1': 0, 'Class 2': 0 } },
    { splitValue: 'Value 2', classCounts: { 'Class 1': 0, 'Class 2': 0 } },
  ],
};

function App() {
  const [input, setInput] = useState<CalculatorInput>(INITIAL_INPUT);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateInput = (updates: Partial<CalculatorInput>) => {
    setInput(prev => ({ ...prev, ...updates }));
    setResult(null); // Clear result when input changes
    setError(null);
  };

  const handleUpdateCount = (branchIdx: number, cls: string, count: number) => {
    const newBranches = [...input.branches];
    newBranches[branchIdx].classCounts = {
      ...newBranches[branchIdx].classCounts,
      [cls]: count
    };
    handleUpdateInput({ branches: newBranches });
  };

  const calculate = () => {
    // Validation
    if (!input.splitColumn || !input.targetColumn) {
      setError("Please provide both split and target column names.");
      return;
    }
    
    const totalSamples = input.branches.reduce(
      (sum, b) => sum + Object.values(b.classCounts).reduce((s, c) => s + c, 0), 0
    );

    if (totalSamples === 0) {
      setError("Total sample count must be greater than 0.");
      return;
    }

    try {
      const res = calculateFull(input);
      setResult(res);
      setError(null);
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError("An error occurred during calculation. Please check your inputs.");
    }
  };

  const reset = () => {
    setInput(INITIAL_INPUT);
    setResult(null);
    setError(null);
  };

  const loadExample = () => {
    setInput(smokerExample);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-md">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">EntropyCalc</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold leading-none">Decision Tree Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/Tal45/entropy-calc" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Terminal className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Introduction */}
          <section className="text-center space-y-4">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Master the Math of <span className="text-blue-600">Decision Trees</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Enter your dataset counts to calculate entropy, weighted entropy, and information gain with full step-by-step breakdowns.
            </p>
          </section>

          {/* Input Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center space-x-2 mb-1">
                <HelpCircle className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step 1</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Define Your Split</h3>
            </div>
            <div className="p-8">
              <CalculatorForm 
                input={input}
                onUpdateInput={handleUpdateInput}
              />
            </div>
          </section>

          {/* Data Entry Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center space-x-2 mb-1">
                <HelpCircle className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step 2</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Enter Counts</h3>
              <p className="text-sm text-slate-500 mt-1">Fill in the frequency of each target class for every split value.</p>
            </div>
            <div className="p-8">
              <CountsTable 
                branches={input.branches}
                targetClasses={input.targetClasses}
                targetColumn={input.targetColumn || 'Target'}
                splitColumn={input.splitColumn || 'Split'}
                onUpdateCount={handleUpdateCount}
              />
              
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm flex items-center animate-pulse">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  {error}
                </div>
              )}
            </div>
          </section>

          {/* Action Buttons Section */}
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start pt-4">
            <button
              onClick={calculate}
              className="flex items-center px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl active:transform active:scale-95 transition-all"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Entropy
            </button>
            <button
              onClick={loadExample}
              className="flex items-center px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-all border border-slate-200"
            >
              Load Example
            </button>
            <button
              onClick={reset}
              className="flex items-center px-6 py-3 text-slate-500 hover:text-slate-800 transition-all"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </button>
          </div>

          {/* Results Section */}
          {result && (
            <section id="results" className="pt-8">
              <ResultsPanel 
                result={result} 
                splitColumn={input.splitColumn} 
                targetColumn={input.targetColumn} 
              />
            </section>
          )}

        </div>
      </main>

      <footer className="bg-slate-900 text-slate-500 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center items-center space-x-2">
            <Calculator className="w-5 h-5 text-slate-700" />
            <span className="font-bold text-slate-700 uppercase tracking-widest text-xs">EntropyCalc v1.0</span>
          </div>
          <p className="text-sm">Built for educational purposes. Learn decision trees effectively.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
