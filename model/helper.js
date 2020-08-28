module.exports.isFunction = function isFunction(functionToCheck) {
  // This is just a helper function that checks if any "callback" functions actually exist

  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
};
