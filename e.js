/**
 * Expose `E`
 */

module.exports = function(e) {
  // anything property it doesn't find on the object
  // itself, look up prototype for original `e`
  E.prototype = e;
  return new E();
};

/**
 * Initialize `E`
 */

function E() {}
