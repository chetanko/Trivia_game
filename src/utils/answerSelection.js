export function evaluateSelectedOption(question, selectedOptionKey) {
  return question?.correctAnswer?.toUpperCase() === String(selectedOptionKey || '').trim().toUpperCase();
}
