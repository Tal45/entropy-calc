export const round = (value: number, decimals: number = 4): string => {
  return value.toFixed(decimals);
};

export const formatFraction = (numerator: number, denominator: number): string => {
  if (denominator === 0) return '0';
  return `${numerator}/${denominator}`;
};
