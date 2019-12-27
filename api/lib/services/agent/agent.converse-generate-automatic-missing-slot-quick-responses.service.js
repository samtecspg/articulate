module.exports = function({ CSO, missingSlot }) {
  const missingSlotKeywordName = missingSlot.keyword;
  const keywordToFillSlot = CSO.agent.keywords.find(keyword => {
    return keyword.keywordName === missingSlotKeywordName;
  });
  const quickResponsesGenerated = keywordToFillSlot.examples
    .slice(0, CSO.agent.settings.generateSlotsQuickResponsesMax)
    .map(example => {
      return example.value;
    });
  return quickResponsesGenerated;
};
