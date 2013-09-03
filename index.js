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
  e.preventDefault();
  var touches = e.touches;
  if (!touches.length) return this;

  var changed = e.changedTouches;
  for (var i = 0, len = changed.length; i < len; i++) {
    this.fingers[changed[i].identifier] = {
      x: changed[i].pageX,
      y: changed[i].pageY
    };
  }

  if (touches.length == 2) {
    var coords = [];

    for(var id in this.fingers) {
      var finger = this.fingers[id];
      coords.push(finger.x);
      coords.push(finger.y);
    }

    this.distance = distance.apply(null, coords);
    this.midpoint = midpoint.apply(null, coords);
  }
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
  if (touches.length != 2) return this;
  var changed = e.changedTouches;

  for (var i = 0, len = changed.length; i < len; i++) {
    var finger = this.fingers[changed[i].identifier];
    if (undefined === finger) continue;
    this.fingers[changed[i].identifier] = {
      x: changed[i].pageX,
      y: changed[i].pageY
    };
  }

  var coords = [];
  for(var id in this.fingers) {
    var finger = this.fingers[id];
    coords.push(finger.x);
    coords.push(finger.y);
  }

  var dist = distance.apply(null, coords);
  var mid = midpoint.apply(null, coords);

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
  var changed = e.changedTouches;
  for (var i = 0, len = changed.length; i < len; i++) {
    delete this.fingers[changed[i].identifier];
  }

  this.scale = this.lastScale;
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
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @return {Number}
 * @api private
 */

function distance(x1, y1, x2, y2) {
  var x = Math.pow(x1 - x2, 2);
  var y = Math.pow(y1 - y2, 2);
  return Math.sqrt(x + y);
}

/**
 * Get the midpoint
 *
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @return {Object} coords
 * @api private
 */

function midpoint(x1, y1, x2, y2) {
  var coords = {};
  coords.x = (x1 + x2) / 2;
  coords.y = (y1 + y2) / 2;
  return coords;
}
