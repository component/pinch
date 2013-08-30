
# pinch

  pinch in and out on elements on handheld devices.

## Installation

  Install with [component(1)](http://component.io):

    $ component install component/pinch

## Example

```js
pinch(img, function(e) {
  dot.style.left = e.x + 'px';
  dot.style.top = e.y + 'px';
  dot.style['-webkit-transform'] = 'scale(' + e.scale + ')';
});
```

## API

### Pinch(el, fn)

  Initialize `Pinch` with the element `el` and callback function `fn`.

```js
pinch(img, function(e) {
  var midpoint = { x: e.x, y: e.y };
  var scale = e.scale;
});
```

The event object `e` is augmented with following keys:

- `x`: the x coordinate of the midpoint between your two fingers
- `y`: the y coordinate of the midpoint between your two fingers
- `scale`: the relative distance between your two fingers starting at 1.

### Pinch.unbind()

  Unbind

## License

  MIT
