class emblemSlice {
  constructor(id, isVisible, stops, span = 1, isSpanned = false, spannedBy = null) {
    this.id = id;
    this.isVisible = isVisible;
    this.stops = stops;
    this.span = span;
    this.isSpanned = isSpanned;
    this.spannedBy = spannedBy;
  }
}

class emblemHelper {
  svg;
  layers;
  indexCount;

  slug = 'rectangles/21';
  slugName = '21';
  slugWidth = 66.47;
  slugHeight = 300;
  slugPath = 'M0,0H66.437V300H0V148.125C0,148.125,0.04,147.744,0,147.625C-0.063,147.437,0,147.062,0,147.062V0Z';

  decimalPrecision;
  lowColourMode;
  smoothing;

  sourceImage;
  sourceWidth;
  sourceHeight;

  canvas;
  context;

  emblemWidth = 512;
  emblemHeight = 512;

  sliceWidth;
  sliceHeight;
  gradStopSize;

  scaleX;
  scaleY;

  layerLength;
  svgLength;
  encodedLength;
  maxEncodedLength;

  constructor() {
    this.reset();
    this.decimalPrecision = 5;
    this.lowColourMode = false;
    this.smoothing = false;
    this.maxEncodedLength = 128 * 10000;
  }

  reset() {
    this.svg = new svgObject(this.slugPath);
    this.indexCount = 0;
    this.layers = [];
    this.layers.push({
      id: 'background',
      name: 'Background',
      type: 'square',
      y: 0,
      x: 0,
      scaleY: 100,
      scaleX: 100,
      invertedY: false,
      invertedX: false,
      rotation: 0,
      opacity: 100,
      index: 0,
      color: '#transparent',
      isFilled: true,
      internal: true,
      locked: false,
      tBold: false,
      tItalic: false,
      fontFamily: null,
      borderColor: '#a1a1a1',
      borderSize: 0,
      gradientStyle: 'Fill',
      slug: 'rectangles/square',
      width: 512,
      height: 512,
    });
  }

  setAccuracy(i) {
    this.decimalPrecision = parseInt(i);
  }

  useSmoothing(mode) {
    this.smoothing = mode;
  }

  useLowColour(mode) {
    this.lowColourMode = mode;
  }

  createEmblem(imageSrc, isRows = true, sourceCanvasSize = 256) {
    this.reset();

    var _sizeX = sourceCanvasSize,
      _sizeY = sourceCanvasSize;
    var _offsetX = 0,
      _offsetY = 0;

    this.sourceImage = new Image();
    this.sourceImage.src = imageSrc;

    var _sizes = calculateAspectRatioFit(
      this.sourceImage.width,
      this.sourceImage.height,
      sourceCanvasSize,
      sourceCanvasSize
    );
    _offsetX = _sizes.offsetX;
    _offsetY = _sizes.offsetY;
    _sizeX = _sizes.width;
    _sizeY = _sizes.height;

    this.sourceWidth = sourceCanvasSize;
    this.sourceHeight = sourceCanvasSize;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.sourceWidth;
    this.canvas.height = this.sourceHeight;
    this.context = this.canvas.getContext('2d');

    if (!this.smoothing) {
      this.context.webkitImageSmoothingEnabled = false;
      this.context.mozImageSmoothingEnabled = false;
      this.context.imageSmoothingEnabled = false;
    }

    this.context.drawImage(this.sourceImage, _offsetX, _offsetY, _sizeX, _sizeY);

    if (isRows) {
      this.sliceWidth = this.emblemWidth;
      this.sliceHeight = this.emblemHeight / this.sourceHeight;
      this.gradStopSize = 1 / this.sourceWidth;
      this.scaleX = this.emblemWidth / this.slugWidth;
      this.scaleY = (this.emblemHeight / this.sourceHeight) / this.slugHeight;

      this.createEmblemRows();
    } else {
      this.sliceWidth = this.emblemWidth / this.sourceWidth;
      this.sliceHeight = this.emblemHeight;
      this.gradStopSize = 1 / this.sourceHeight;
      this.scaleX = (this.emblemWidth / this.sourceWidth) / this.slugWidth;
      this.scaleY = this.emblemHeight / this.slugHeight;

      this.createEmblemColumns();
    }

    this.svg.finalise();

    var _svgElement = this.svg.getSVG().outerHTML;
    this.svgLength = _svgElement.length;
    this.layerLength = JSON.stringify(this.layers).length;
    this.encodedLength = Math.ceil((this.svgLength + this.layerLength) / 3) * 4;
  }

  getPixel(x, y) {
    return this.context.getImageData(x, y, 1, 1).data;
  }

  createPathID(i) {
    var _dateTime = new Date().getTime();
    var _id = _dateTime + '' + i;
    return 's' + _id;
  }

  createNewLayer(x, y, index, fill, isRows) {
    if (isRows) {
      var _y = y * this.sliceHeight - (this.slugHeight - this.sliceHeight) / 2;
      var _x = x - (this.slugWidth - this.sliceWidth) / 2;
    } else {
      var _y = y - (this.slugHeight - this.sliceHeight) / 2;
      var _x = x * this.sliceWidth - (this.slugWidth - this.sliceWidth) / 2;
    }

    _y = floatRound(_y, this.decimalPrecision);
    _x = floatRound(_x, this.decimalPrecision);

    var _scaleY = floatRound(this.scaleY * 100, this.decimalPrecision);
    var _scaleX = floatRound(this.scaleX * 100, this.decimalPrecision);

    if (_scaleX < 1) _scaleX = 1;
    if (_scaleY < 1) _scaleY = 1;

    var _id = this.createPathID(index);

    let _layer = {
      id: _id,
      name: this.slugName,
      type: 'path',
      y: _y,
      x: _x,
      scaleY: _scaleY,
      scaleX: _scaleX,
      invertedY: 0,
      invertedX: 0,
      rotation: 0,
      opacity: 100,
      index: index,
      color: fill,
      isFilled: 1,
      internal: 0,
      locked: 0,
      tBold: 0,
      tItalic: 0,
      fontFamily: null,
      borderColor: '#0',
      borderSize: 0,
      gradientStyle: 'Fill',
      slug: this.slug,
      width: this.slugWidth,
      height: this.slugHeight,
    };

    return _layer;
  }

  createEmblemColumns() {
    var _slices = [];

    for (let x = 0; x < this.sourceWidth; x++) {
      var _gradientId = x;
      var _stops = [];

      var _hasVisiblePixels = false;

      for (let y = 0; y < this.sourceHeight; y++) {
        var _color = this.getPixel(x, y);
        var _colorNext = this.getPixel(x, y + 1);
        var _colorPrev = this.getPixel(x, y - 1);

        var _colorHex = rgbToHex(_color[0], _color[1], _color[2]);
        var _colorNextHex = rgbToHex(_colorNext[0], _colorNext[1], _colorNext[2]);
        var _colorPrevHex = rgbToHex(_colorPrev[0], _colorPrev[1], _colorPrev[2]);

        if (this.lowColourMode) {
          _colorHex = hexToShort(_colorHex);
          _colorNextHex = hexToShort(_colorNextHex);
          _colorPrevHex = hexToShort(_colorPrevHex);
        }

        if (_color[3] > 0 && _hasVisiblePixels == false)
          _hasVisiblePixels = true;

        if (
          (_colorHex != _colorPrevHex ||
            (_colorHex == _colorPrevHex && _color[3] != _colorPrev[3])) &&
          y != 0 &&
          y != this.sourceHeight
        ) {
          var _offsetA = floatRound(
            (y - 1) * this.gradStopSize + this.gradStopSize,
            this.decimalPrecision
          );
          if (_offsetA > 1) _offsetA = 1;
          _stops.push([_offsetA, _colorHex, _color[3]]);
        }

        if (
          (_colorHex != _colorNextHex ||
            (_colorHex == _colorNextHex && _color[3] != _colorNext[3]))
        ) {
          var _offsetB = floatRound(
            y * this.gradStopSize + this.gradStopSize,
            this.decimalPrecision
          );
          if (_offsetB > 1) _offsetB = 1;
          _stops.push([_offsetB, _colorHex, _color[3]]);
        }
      }

      if (
        x > 0 &&
        x < this.sourceWidth &&
        arraysEqual(_stops, _slices[x - 1].stops)
      ) {
        if (_slices[x - 1].isSpanned) {
          var _originator = _slices[x - 1].spannedBy;
          _slices[x] = new emblemSlice(
            x,
            _hasVisiblePixels,
            _stops,
            1,
            true,
            _originator
          );
          _slices[_originator].span += 1;
        } else {
          _slices[x] = new emblemSlice(
            x,
            _hasVisiblePixels,
            _stops,
            1,
            true,
            x - 1
          );
          _slices[x - 1].span += 1;
        }
      } else {
        _slices[x] = new emblemSlice(x, _hasVisiblePixels, _stops, 1);
      }
    }

    for (const _slice of _slices) {
      if (_slice.isVisible && !_slice.isSpanned) {
        if (_slice.stops.length == 1) {
          var _hex = _slice.stops[0][1];
          var _alpha = _slice.stops[0][2];
          this.svg.addSolidPath(
            _slice.id * this.sliceWidth,
            0,
            floatRound(this.scaleX * _slice.span, this.decimalPrecision),
            floatRound(this.scaleY, this.decimalPrecision),
            _hex,
            _alpha
          );
        } else {
          this.svg.addGradient(_slice.id, _slice.stops, false);
          var _fill = 'url(#' + _slice.id + ')';
          this.svg.addGradientPath(
            _slice.id * this.sliceWidth,
            0,
            floatRound(this.scaleX * _slice.span, this.decimalPrecision),
            floatRound(this.scaleY, this.decimalPrecision),
            _fill
          );
        }
        this.layers.push(
          this.createNewLayer(_slice.id, 0, this.indexCount++, '#000', false)
        );
      }
    }
  }

  createEmblemRows() {
    var _slices = [];
    for (let y = 0; y < this.sourceHeight; y++) {
      var _gradientId = y;
      var _stops = [];
      var _hasVisiblePixels = false;

      for (let x = 0; x < this.sourceWidth; x++) {
        var _color = this.getPixel(x, y);
        var _colorNext = this.getPixel(x + 1, y);
        var _colorPrev = this.getPixel(x - 1, y);
        var _colorHex = rgbToHex(_color[0], _color[1], _color[2]);
        var _colorNextHex = rgbToHex(_colorNext[0], _colorNext[1], _colorNext[2]);
        var _colorPrevHex = rgbToHex(_colorPrev[0], _colorPrev[1], _colorPrev[2]);

        if (this.lowColourMode) {
          _colorHex = hexToShort(_colorHex);
          _colorNextHex = hexToShort(_colorNextHex);
          _colorPrevHex = hexToShort(_colorPrevHex);
        }

        if (_color[3] > 0 && _hasVisiblePixels == false)
          _hasVisiblePixels = true;

        if (
          (_colorHex != _colorPrevHex ||
            (_colorHex == _colorPrevHex && _color[3] != _colorPrev[3])) &&
          x != 0 &&
          x != this.sourceWidth
        ) {
          var _offsetA = floatRound(
            (x - 1) * this.gradStopSize + this.gradStopSize,
            this.decimalPrecision
          );
          if (_offsetA > 1) _offsetA = 1;
          _stops.push([_offsetA, _colorHex, _color[3]]);
        }

        if (
          (_colorHex != _colorNextHex ||
            (_colorHex == _colorNextHex && _color[3] != _colorNext[3]))
        ) {
          var _offsetB = floatRound(
            x * this.gradStopSize + this.gradStopSize,
            this.decimalPrecision
          );
          if (_offsetB > 1) _offsetB = 1;
          _stops.push([_offsetB, _colorHex, _color[3]]);
        }
      }

      if (
        y > 0 &&
        y < this.sourceHeight &&
        arraysEqual(_stops, _slices[y - 1].stops)
      ) {
        if (_slices[y - 1].isSpanned) {
          var _originator = _slices[y - 1].spannedBy;
          _slices[y] = new emblemSlice(
            y,
            _hasVisiblePixels,
            _stops,
            1,
            true,
            _originator
          );
          _slices[_originator].span += 1;
        } else {
          _slices[y] = new emblemSlice(
            y,
            _hasVisiblePixels,
            _stops,
            1,
            true,
            y - 1
          );
          _slices[y - 1].span += 1;
        }
      } else {
        _slices[y] = new emblemSlice(y, _hasVisiblePixels, _stops, 1);
      }
    }

    for (const _slice of _slices) {
      if (_slice.isVisible && !_slice.isSpanned) {
        if (_slice.stops.length == 1) {
          var _hex = _slice.stops[0][1];
          var _alpha = _slice.stops[0][2];
          this.svg.addSolidPath(
            0,
            _slice.id * this.sliceHeight,
            floatRound(this.scaleX, this.decimalPrecision),
            floatRound(this.scaleY * _slice.span, this.decimalPrecision),
            _hex,
            _alpha
          );
        } else {
          this.svg.addGradient(_slice.id, _slice.stops, true);
          var _fill = 'url(#' + _slice.id + ')';
          this.svg.addGradientPath(
            0,
            _slice.id * this.sliceHeight,
            floatRound(this.scaleX, this.decimalPrecision),
            floatRound(this.scaleY * _slice.span, this.decimalPrecision),
            _fill
          );
        }
        this.layers.push(
          this.createNewLayer(0, _slice.id, this.indexCount++, '#000', true)
        );
      }
    }
  }

  getConsoleCode() {
    var _svgData = btoa(this.svg.getSVG().outerHTML);
    var _layerData = btoa(JSON.stringify(this.layers));
    var _consoleCode =
      'var svgData = "' +
      _svgData +
      '";\n\n' +
      'var layerData = "' +
      _layerData +
      '";\n\n' +
      'var request = new XMLHttpRequest;request.open("POST","/emblems/save",!0),request.onreadystatechange=function(){if(request.readyState==XMLHttpRequest.DONE){var a=JSON.parse(request.responseText);200==a.Status?window.location.href="https://socialclub.rockstargames.com/emblems/edit/"+a.EmblemId:a.Message?alert(a.Message):alert(a.Error.Message)}},request.setRequestHeader("Content-Type","application/json"),request.setRequestHeader("__RequestVerificationToken",document.getElementsByName("__RequestVerificationToken")[0].value),request.setRequestHeader("X-Requested-With","XMLHttpRequest"),request.send(JSON.stringify({"crewId":"0","emblemId":"","parentId":"","svgData":svgData,"layerData": layerData,"hash":document.getElementById("editorField-hash").value}));';

    return _consoleCode;
  }
}
