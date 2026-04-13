export const formatCurrency = (val: any) =>
  `₹${Number(val || 0).toLocaleString()}`;
