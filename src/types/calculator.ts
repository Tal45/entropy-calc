export type BranchCount = {
  splitValue: string;
  classCounts: Record<string, number>;
};

export type CalculatorInput = {
  splitColumn: string;
  targetColumn: string;
  targetClasses: string[];
  branches: BranchCount[];
};

export type BranchResult = {
  splitValue: string;
  total: number;
  classCounts: Record<string, number>;
  probabilities: Record<string, number>;
  entropy: number;
  formulaText: string;
  fractionFormula?: string;
};

export type CalculationResult = {
  totalSamples: number;
  branchResults: BranchResult[];
  weightedEntropy: number;
  datasetEntropy?: number;
  informationGain?: number;
  datasetFormula?: string;
  weightedEntropyFormula?: string;
  infoGainFormula?: string;
};
