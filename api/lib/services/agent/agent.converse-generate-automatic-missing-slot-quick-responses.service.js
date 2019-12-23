module.exports = function({ CSO, missingSlot }) {
  const missingSlotKeywordId = missingSlot.keywordId.toString();
  const keywordToFillSlot = CSO.agent.keywords.find(keyword => {
    return keyword.id === missingSlotKeywordId;
  });
  const quickResponsesGenerated = keywordToFillSlot.examples
    .slice(0, CSO.agent.settings.generateSlotsQuickResponsesMax)
    .map(example => {
      return example.value;
    });
  return quickResponsesGenerated;
};
