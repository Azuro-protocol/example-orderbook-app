export const formatOdds = (odds: number | string) => {
  if (odds === 0) return 0;
  return (1 - 1 / (typeof odds === 'number' ? odds : parseFloat(odds))) * 100;
};
export const formatOdds3 = (odds: number | string) => {
  return (1 - 1 / (typeof odds === 'number' ? odds : parseFloat(odds))) * 100;
};
export const formatOdds2 = (odds: number | string) => {
  return (1 / (typeof odds === 'number' ? odds : parseFloat(odds))) * 100;
};
