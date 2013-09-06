/*
 * Module dependencies
 */

var events = require('events');
var E = require('./e');

/**
 * Export `Pinch`
 */

module.exports = Pinch;

/**
 * Initialize `Pinch`
 *
 * @param {Element} el
 * @param {Function} fn
 * @return {Pinch}
 * @api public
 */

function Pinch(el, fn) {
  if (!(this instanceof Pinch)) return new Pinch(el, fn);
  this.el = el;
  this.parent = el.parentNode;
  this.fn = fn || function(){};
  this.midpoint = null;
  this.scale = 1;
  this.lastScale = 1;
  this.pinching = false;
  this.events = events(el, this);
  this.events.bind('touchstart');
  this.events.bind('touchmove');
  this.events.bind('touchend');
  this.fingers = {};
}

/**
 * Touch start
 *
 * @param {Event} e
 * @return {Pinch}
 * @api private
 */

Pinch.prototype.ontouchstart = function(e) {
  var touches = e.touches;
  if (!touches || 2 != touches.length) return this;
  e.preventDefault();

  var coords = [];
  for(var i = 0, finger; finger = touches[i]; i++) {
    coords.push(finger.pageX, finger.pageY);
  }

  this.pinching = true;
  this.distance = distance(coords);
  this.midpoint = midpoint(coords);
  return this;
};

/**
 * Touch move
 *
 * @param {Event} e
 * @return {Pinch}
 * @api private
 */

Pinch.prototype.ontouchmove = function(e) {
  var touches = e.touches;
  if (!touches || touches.length != 2 || !this.pinching) return this;

  var coords = [];
  for(var i = 0, finger; finger = touches[i]; i++) {
    coords.push(finger.pageX, finger.pageY);
  }

  var changed = e.changedTouches;

  var dist = distance(coords);
  var mid = midpoint(coords);

  // make event properties mutable
  e = E(e);

  // iphone does scale natively, just use that
  e.scale = dist / this.distance * this.scale;
  e.x = mid.x;
  e.y = mid.y;

  this.fn(e);

  this.lastScale = e.scale;
  return this;
};

/**
 * Touchend
 *
 * @param {Event} e
 * @return {Pinch}
 * @api private
 */

Pinch.prototype.ontouchend = function(e) {
  var touches = e.touches;
  if (!touches || touches.length == 2 || !this.pinching) return this;
  this.scale = this.lastScale;
  this.pinching = false;
  return this;
};

/**
 * Unbind
 *
 * @return {Pinch}
 * @api public
 */

Pinch.prototype.unbind = function() {
  this.events.unbind();
  return this;
};


/**
 * Get the distance between two points
 *
 * @param {Array} arr
 * @return {Number}
 * @api private
 */

function distance(arr) {
  var x = Math.pow(arr[0] - arr[2], 2);
  var y = Math.pow(arr[1] - arr[3], 2);
  return Math.sqrt(x + y);
}

/**
 * Get the midpoint
 *
 * @param {Array} arr
 * @return {Object} coords
 * @api private
 */

function midpoint(arr) {
  var coords = {};
  coords.x = (arr[0] + arr[2]) / 2;
  coords.y = (arr[1] + arr[3]) / 2;
  return coords;
}
