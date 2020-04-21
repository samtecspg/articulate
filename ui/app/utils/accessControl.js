const internals = {};
const defaults = {};

defaults.options = {};

internals.validate = ({ userPolicies = {}, requiredPolicies = [] }, cb = null) => {
  const isAllowedReducer = (accumulator, policy) => {
    const currentValue = userPolicies[policy];
    if (accumulator === undefined) {
      return currentValue === undefined ? undefined : currentValue;
    }
    return accumulator || currentValue;
  };
  const isAllowed = requiredPolicies.reduce(isAllowedReducer, undefined);
  if (isAllowed) {
    return cb ? cb() : isAllowed;
  }
  return isAllowed;
};

module.exports = internals;
