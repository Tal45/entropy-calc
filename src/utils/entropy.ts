import { BranchResult, CalculationResult, CalculatorInput } from '../types/calculator';

const log2 = (x: number) => Math.log2(x);

export const calculateEntropyValue = (counts: number[]): number => {
  const total = counts.reduce((sum, count) => sum + count, 0);
  if (total === 0) return 0;

  return counts.reduce((entropy, count) => {
    const p = count / total;
    if (p === 0) return entropy;
    return entropy - p * log2(p);
  }, 0);
};

export const formatFormula = (counts: number[]): string => {
  const total = counts.reduce((sum, count) => sum + count, 0);
  if (total === 0) return '0';

  const terms = counts
    .map((count) => {
      if (count === 0) return null;
      return `\\frac{${count}}{${total}} \\log_2 \\left( \\frac{${count}}{${total}} \\right)`;
    })
    .filter(Boolean);

  if (terms.length === 0) return '0';
  return `-\\left( ${terms.join(' + ')} \\right)`;
};

export const calculateFull = (input: CalculatorInput): CalculationResult => {
  const { branches, targetClasses } = input;
  const totalSamples = branches.reduce(
    (sum, branch) => sum + Object.values(branch.classCounts).reduce((s, c) => s + c, 0),
    0
  );

  const branchResults: BranchResult[] = branches.map((branch) => {
    const counts = targetClasses.map((cls) => branch.classCounts[cls] || 0);
    const total = counts.reduce((s, c) => s + c, 0);
    const entropy = calculateEntropyValue(counts);
    const formulaText = formatFormula(counts);

    const probabilities: Record<string, number> = {};
    targetClasses.forEach((cls) => {
      probabilities[cls] = total === 0 ? 0 : (branch.classCounts[cls] || 0) / total;
    });

    return {
      splitValue: branch.splitValue,
      total,
      classCounts: branch.classCounts,
      probabilities,
      entropy,
      formulaText,
    };
  });

  const weightedEntropy = branchResults.reduce((sum, res) => {
    if (totalSamples === 0) return 0;
    return sum + (res.total / totalSamples) * res.entropy;
  }, 0);

  const weightedEntropyTerms = branchResults
    .map((res) => {
      const weight = `\\frac{${res.total}}{${totalSamples}}`;
      return `${weight} \\times ${res.entropy.toFixed(4)}`;
    })
    .join(' + ');
  
  const weightedEntropyFormula = weightedEntropyTerms ? `\\sum \\frac{|S_v|}{|S|} H(S_v) = ${weightedEntropyTerms}` : '0';

  // Dataset entropy calculation
  const totalClassCounts: Record<string, number> = {};
  targetClasses.forEach((cls) => {
    totalClassCounts[cls] = branches.reduce((sum, b) => sum + (b.classCounts[cls] || 0), 0);
  });
  const datasetCounts = targetClasses.map((cls) => totalClassCounts[cls]);
  const datasetEntropy = calculateEntropyValue(datasetCounts);
  const datasetFormula = formatFormula(datasetCounts);

  const informationGain = datasetEntropy - weightedEntropy;
  const infoGainFormula = `H(S) - H_{split}(S) = ${datasetEntropy.toFixed(4)} - ${weightedEntropy.toFixed(4)}`;

  return {
    totalSamples,
    branchResults,
    weightedEntropy,
    datasetEntropy,
    informationGain,
    datasetFormula,
    weightedEntropyFormula,
    infoGainFormula,
  };
};
