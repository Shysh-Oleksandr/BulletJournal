export const getPluralLabel = (
  amount: number,
  singularLabel: string,
  labelOnly = false,
): string => {
  const isSingular = amount === 1;

  const label = `${singularLabel}${isSingular ? "" : "s"}`;

  if (labelOnly) return label;

  return `${amount} ${label}`;
};
