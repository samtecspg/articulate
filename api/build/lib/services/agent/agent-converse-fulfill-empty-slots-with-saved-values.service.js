"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function ({
  conversationStateObject
}) {
  Object.keys(conversationStateObject.currentFrame.slots).forEach(currentFrameSlot => {
    const slotValue = conversationStateObject.currentFrame.slots[currentFrameSlot]; //if the recognized action have an slot that is not fulfilled in the current context

    if (!slotValue || Array.isArray(slotValue) && slotValue.length > 0) {
      let aliveSlot = _lodash.default.filter(Object.keys(conversationStateObject.context.savedSlots), savedSlot => {
        return savedSlot === currentFrameSlot && conversationStateObject.context.savedSlots[savedSlot].remainingLife > 0;
      });

      aliveSlot = aliveSlot.length > 0 ? aliveSlot : null;

      if (aliveSlot) {
        conversationStateObject.currentFrame.slots[currentFrameSlot] = conversationStateObject.context.savedSlots[aliveSlot];
      }
    }
  });
};
//# sourceMappingURL=agent-converse-fulfill-empty-slots-with-saved-values.service.js.map