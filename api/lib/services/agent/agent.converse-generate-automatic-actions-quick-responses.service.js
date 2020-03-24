module.exports = async function ({ CSO, response }) {

  if (!response.richResponses.some(richResponse => { return richResponse.type === 'quickResponses' })) {
    var availableKeywordsSlots = await getAvailableKeywordsSlots(CSO);

    const { agentService } = await this.server.services();
    var availableSayings = await getAvailableSayings(CSO, agentService);

    var generatedQuickResponses = await generateQuickResponses(
      CSO,
      availableKeywordsSlots,
      availableSayings
    );
    response.richResponses.push({
      type: 'quickResponses',
      data: {
        quickResponses: generatedQuickResponses
      }
    })
  }
  return response;
};

const getAvailableKeywordsSlots = async CSO => {
  var availableKeywordsSlots = CSO.context.actionQueue.reduce(function (
    result,
    action
  ) {
    if (action.slots && action.fulfilled) {
      Object.keys(action.slots).forEach(function (key) {
        if (
          action.slots[key].value != '' &&
          !Array.isArray(action.slots[key].value)
        ) {
          result.push(action.slots[key]);
        } else if (Array.isArray(action.slots[key].value)) {
          action.slots[key].value.forEach(value => {
            result.push({
              keyword: action.slots[key].keyword,
              value: value
            });
          });
        }
      });
    }
    return result;
  },
    []);

  availableKeywordsSlots = await getUniqueAvailableKeywordsSlots(
    availableKeywordsSlots
  );
  return await shuffleArray(availableKeywordsSlots);
};

const getUniqueAvailableKeywordsSlots = async availableKeywordsSlots => {
  var arrResult = {};
  for (var i = 0; i < availableKeywordsSlots.length; i++) {
    var item = availableKeywordsSlots[i];
    arrResult[item.keyword + ' - ' + item.value] = item;
  }

  var i = 0;
  var nonDuplicatedArray = [];
  for (var item in arrResult) {
    nonDuplicatedArray[i++] = arrResult[item];
  }
  return nonDuplicatedArray;
};

const getAvailableSayings = async (CSO, agentService) => {
  var sayings = await agentService.findAllSayings({
    id: CSO.agent.id,
    loadCategoryId: false,
    skip: 0,
    limit: -1
  });
  sayings = sayings.data.filter(saying => {
    return (
      saying.keywords &&
      saying.keywords.length > 0 &&
      !sayingHasOverlappingKeywords(saying)
    );
  });
  return await shuffleArray(sayings);
};

const sayingHasOverlappingKeywords = saying => {
  var counter = 1;
  var sayingHasOverlappingKeywords = false;
  while (
    counter < Object.keys(saying.keywords).length &&
    !sayingHasOverlappingKeywords
  ) {
    sayingHasOverlappingKeywords =
      saying.keywords[Object.keys(saying.keywords)[counter]].start <=
      saying.keywords[Object.keys(saying.keywords)[counter - 1]].end;
    counter++;
  }
  return sayingHasOverlappingKeywords;
};

const shuffleArray = async array => {
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

const generateQuickResponses = async (
  CSO,
  availableKeywordsSlots,
  availableSayings
) => {
  var quickResponsesGenerated = [];
  var maxQuickResponses = parseInt(
    CSO.agent.settings.generateActionsQuickResponsesMax,
    10
  );
  var counter = 0;

  while (
    counter < availableSayings.length &&
    quickResponsesGenerated.length < maxQuickResponses
  ) {
    var currentPossibleSaying = availableSayings[counter];
    var availableKeywordsSlotsCopy = Array.from(availableKeywordsSlots);
    var usedAvailableKeywordsSlots = [];

    var possibleSayingIsCandidate = true;
    var possibleSayingKeywordLength = currentPossibleSaying.keywords.length;
    var possibleSayingKeywordCounter = 0;
    while (
      possibleSayingIsCandidate &&
      possibleSayingKeywordCounter < possibleSayingKeywordLength
    ) {
      var possibleSayingKeyword =
        currentPossibleSaying.keywords[possibleSayingKeywordCounter];
      var foundIndex = availableKeywordsSlotsCopy.findIndex(
        availableKeywordSlot => {
          return possibleSayingKeyword.keyword === availableKeywordSlot.keyword;
        }
      );
      if (foundIndex != -1) {
        usedAvailableKeywordsSlots.push(availableKeywordsSlotsCopy[foundIndex]);
        availableKeywordsSlotsCopy.splice(foundIndex, 1);
      } else {
        possibleSayingIsCandidate = false;
      }
      possibleSayingKeywordCounter++;
    }

    if (possibleSayingIsCandidate) {
      var quickResponseWithAvailableSlots = await insertSlotsInSaying(
        currentPossibleSaying,
        usedAvailableKeywordsSlots
      );
      quickResponsesGenerated.push(quickResponseWithAvailableSlots);
    }

    counter++;
  }

  quickResponsesGenerated = quickResponsesGenerated.filter(
    (item, i, ar) => ar.indexOf(item) === i
  );
  return quickResponsesGenerated;
};

const insertSlotsInSaying = async (
  currentPossibleSaying,
  usedAvailableKeywordsSlots
) => {
  var finalSaying = currentPossibleSaying.userSays;
  var currentOffset = 0;
  for (var i = 0; i < currentPossibleSaying.keywords.length; i++) {
    var startIndex = currentPossibleSaying.keywords[i].start + currentOffset;
    var endIndex = currentPossibleSaying.keywords[i].end + currentOffset;
    finalSaying =
      finalSaying.slice(0, startIndex) + finalSaying.slice(endIndex);
    finalSaying =
      finalSaying.slice(0, startIndex) +
      usedAvailableKeywordsSlots[i].value +
      finalSaying.slice(startIndex);

    var sizeDifference =
      currentPossibleSaying.keywords[i].value.length -
      usedAvailableKeywordsSlots[i].value.length;
    currentOffset = currentOffset - sizeDifference;
  }
  return finalSaying;
};
