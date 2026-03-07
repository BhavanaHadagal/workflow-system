export const evaluateCondition = (
  doc: any,
  step: any,
): boolean => {
  const { conditionField, conditionOperator, conditionValue } = step

  if (!conditionField || !conditionOperator || conditionValue === undefined || conditionValue === null || conditionValue === '') {
    return true
  }

  const fieldValue = doc?.[conditionField]

  if (fieldValue === undefined) return false

  const left =
    typeof fieldValue === 'number' ? fieldValue : String(fieldValue)
  const right =
    !isNaN(Number(conditionValue)) ? Number(conditionValue) : String(conditionValue)

  switch (conditionOperator) {
    case '=':
      return left == right
    case '>':
      return Number(left) > Number(right)
    case '<':
      return Number(left) < Number(right)
    case '>=':
      return Number(left) >= Number(right)
    case '<=':
      return Number(left) <= Number(right)
    default:
      return true
  }
}