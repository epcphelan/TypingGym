function calculateTrailingSnapshot(stringMap, currentPosition, spanLength) {
  const subStringMap = stringMap.slice(currentPosition - spanLength, currentPosition);
  const subStringReducer = (accumulator, currentItem) => ({
    correct: accumulator.correct + (currentItem.correct === true ? 1 : 0),
    touched: accumulator.touched + (currentItem.touched === true ? 1 : 0),
    corrected: accumulator.corrected + (currentItem.corrected === true ? 1 : 0),
  });
  const stats = subStringMap.reduce(subStringReducer, { correct: 0, touched: 0, corrected: 0 });
  const subStartDate = subStringMap[0].dateTouched;
  const subEndDate = subStringMap[subStringMap.length - 1].dateTouched;
  const words = (stats.correct - stats.corrected) / 5;
  const elapsedTime = (subEndDate - subStartDate) / (60 * 1000);
  const wpm = words / elapsedTime;
  const accuracy = ((stats.correct - stats.corrected) / stats.touched) * 100;
  return {
    wpm,
    accuracy,
    currentPosition,
  };
}

function calculateTrailingAvgPerformance(stringMap) {
  const spanLength = 10;
  const spanTick = Math.max(Math.floor(stringMap.length / 60), 1);
  const performanceHistory = [];
  for (let i = spanLength; i < stringMap.length; i += spanTick) {
    performanceHistory.push(calculateTrailingSnapshot(stringMap, i, spanLength));
  }
  return performanceHistory;
}

export { calculateTrailingAvgPerformance };
