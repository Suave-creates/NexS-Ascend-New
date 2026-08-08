export function isOmtNddOrder(
  priority: unknown,
  orderMode?: unknown,
  priorityClassification?: unknown,
) {
  const normalizedPriority = String(priority ?? '').trim().toUpperCase();
  const normalizedMode = String(orderMode ?? '').trim().toUpperCase();
  const normalizedClassification = String(priorityClassification ?? '').trim().toUpperCase();
  return normalizedPriority === '1'
    || normalizedPriority === 'NDD'
    || normalizedMode === 'NDD'
    || normalizedClassification.startsWith('NDD');
}

export function omtPriorityLabel(priority: unknown, orderMode?: unknown, priorityClassification?: unknown) {
  if (isOmtNddOrder(priority, orderMode, priorityClassification)) return '1';
  const value = String(priority ?? '').trim();
  return value || null;
}

export function omtOrderModeLabel(priority: unknown, orderMode?: unknown, priorityClassification?: unknown) {
  if (isOmtNddOrder(priority, orderMode, priorityClassification)) return 'NDD';
  const value = String(orderMode ?? '').trim();
  return value || null;
}
