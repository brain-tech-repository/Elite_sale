export const formatNumber = (value: number | string | null | undefined) => {
  const num = Number(value ?? 0);

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(num);
};
