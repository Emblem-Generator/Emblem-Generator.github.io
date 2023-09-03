function fileTrunc(fileName) {
  if (fileName.length > 20)
    return fileName.substr(0, 10) + '[..]' + fileName.substr(-10);
  return fileName;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}

function floatRound(value, decimals = 5) {
  var _n = parseFloat(value).toFixed(decimals);
  return Number(_n);
}

function componentToHex(c) {
  var _hex = c.toString(16);
  return _hex.length == 1 ? '0' + _hex : _hex;
}

function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function base_convert(number, frombase, tobase) {
  return parseInt(number + '', frombase | 0).toString(tobase | 0);
}

function hexToShort(hex) {
  if (hex[0] == '#')
    hex = hex.substr(1, 6);

  if (hex.length == 3)
    return hex;

  if (hex.length != 6)
    return '#FFF';

  var _final = '';

  var _segments = [];
  _segments[0] = hex.substr(0, 2);
  _segments[1] = hex.substr(2, 2);
  _segments[2] = hex.substr(4, 2);

  for (const s of _segments) {
    _dec = base_convert(s, 16, 10);
    _remainder = _dec % 17;
    _newa = (_dec % 17 > 7) ? 17 + (_dec - _remainder) : _dec - _remainder;
    hex = base_convert(_newa, 10, 16);
    _final += hex[0];
  }
  return '#' + _final;
}

function arraysEqual(a, b) {
  return JSON.stringify(a) == JSON.stringify(b);
}

function copyToClipboard(textArea, alert = false) {
  var _copyText = document.getElementById(textArea);
  var _textLength = _copyText.value.length;
  _copyText.select();
  _copyText.setSelectionRange(0, _textLength);
  navigator.clipboard.writeText(_copyText.value);
  if (alert)
    alert('Copied!');
}

function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return {
    width: srcWidth * ratio,
    height: srcHeight * ratio,
    offsetX: (maxWidth - srcWidth * ratio) / 2,
    offsetY: (maxHeight - srcHeight * ratio) / 2
  };
}

function setClass(element, cssClass) {
  document.getElementById(element).className = cssClass;
}

function enableElement(element) {
  document.getElementById(element).disabled = false;
}

function disableElement(element) {
  document.getElementById(element).disabled = true;
}
