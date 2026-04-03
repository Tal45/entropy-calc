import { CalculatorInput } from '../types/calculator';

export const smokerExample: CalculatorInput = {
  splitColumn: 'Smoker',
  targetColumn: 'Stroke',
  targetClasses: ['Yes', 'No'],
  branches: [
    {
      splitValue: 'Yes',
      classCounts: {
        'Yes': 4,
        'No': 1,
      },
    },
    {
      splitValue: 'No',
      classCounts: {
        'Yes': 1,
        'No': 3,
      },
    },
  ],
};
