class svgObject {
  constructor(shapePath, canvasWidth = 512, canvasHeight = 512) {
    this.xmlns = 'http://www.w3.org/2000/svg';
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.svgElement = document.createElementNS(this.xmlns, 'svg');
    this.svgElement.setAttribute('xmlns', this.xmlns);
    this.svgElement.setAttribute('width', canvasHeight);
    this.svgElement.setAttribute('height', canvasHeight);
    this.svgElement.setAttribute('version', '1.1');
    this.svgDefs = document.createElementNS(this.xmlns, 'defs');
    this.paths = [];
    this.shapePath = shapePath;
  }

  addBackground() {
    var _rect = document.createElementNS(this.xmlns, 'rect');
    _rect.setAttribute('x', 0);
    _rect.setAttribute('y', 0);
    _rect.setAttribute('width', this.canvasWidth);
    _rect.setAttribute('height', this.canvasHeight);
    _rect.setAttribute('rx', 0);
    _rect.setAttribute('ry', 0);
    _rect.setAttribute('fill', 'none');
    _rect.setAttribute('stroke', '#a1a1a1');
    _rect.setAttribute('fill-opacity', 1);
    _rect.setAttribute('stroke-opacity', 0);
    _rect.setAttribute('stroke-width', 0);
    _rect.setAttribute('stroke-miterlimit', 10);
    this.svgElement.appendChild(_rect);
  }

  addSolidPath(x, y, scaleX, scaleY, fill, opacity) {
    var _path = document.createElementNS(this.xmlns, 'path');
    _path.setAttribute('fill', fill);
    var _alpha = floatRound((1 / 255) * opacity, 3);
    if (_alpha < 1)
      _path.setAttribute('fill-opacity', _alpha);
    _path.setAttribute('d', this.shapePath);
    _path.setAttribute('transform', `matrix(${scaleX},0,0,${scaleY},${x},${y})`);
    this.paths.push(_path);
  }

  addGradientPath(x, y, scaleX, scaleY, fill) {
    var _path = document.createElementNS(this.xmlns, 'path');
    _path.setAttribute('fill', fill);
    _path.setAttribute('d', this.shapePath);
    _path.setAttribute('transform', `matrix(${scaleX},0,0,${scaleY},${x},${y})`);
    this.paths.push(_path);
  }

  addGradient(id, stops, isRows) {
    var _gradient = document.createElementNS(this.xmlns, 'linearGradient');
    _gradient.setAttribute('id', id);
    if (!isRows) {
      _gradient.setAttribute('x2', 0);
      _gradient.setAttribute('y2', 1);
    }
    for (const _stop of stops) {
      var _s = document.createElementNS(this.xmlns, 'stop');
      _s.setAttribute('offset', _stop[0]);
      _s.setAttribute('stop-color', _stop[1]);
      var _alpha = floatRound((1 / 255) * _stop[2], 3);
      if (_alpha < 1)
        _s.setAttribute('stop-opacity', _alpha);
      _gradient.appendChild(_s);
    }
    this.svgDefs.appendChild(_gradient);
  }

  finalise() {
    this.svgElement.appendChild(this.svgDefs);
    this.addBackground();
    for (const _path of this.paths) {
      this.svgElement.appendChild(_path);
    }
  }

  getSVG() {
    return this.svgElement;
  }
}
