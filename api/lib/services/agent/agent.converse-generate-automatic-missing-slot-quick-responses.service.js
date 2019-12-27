module.exports = function({ CSO, missingSlot }) {
  const missingSlotKeywordName = missingSlot.keyword;
  const keywordToFillSlot = shuffleArray(
    CSO.agent.keywords.find(keyword => {
      return keyword.keywordName === missingSlotKeywordName;
    })
  );
  var quickResponsesGenerated = shuffleArray(keywordToFillSlot.examples);
  quickResponsesGenerated = quickResponsesGenerated
    .slice(0, CSO.agent.settings.generateSlotsQuickResponsesMax)
    .map(example => {
      return example.value;
    });
  return quickResponsesGenerated;
};

const shuffleArray = array => {
  if (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  } else {
    return [];
  }
};
