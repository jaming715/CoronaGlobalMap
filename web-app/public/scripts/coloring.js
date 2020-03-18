const fills = [];
const fillCount = 100;
const red = 0;
const green = 1;
const blue = 2;

function getHex(colorChannels) {
  let hex = '#';
  colorChannels.forEach((channel, i) => {
    hex += channel.toString(16);
  });
  return hex;
}

function getNextChannel(start, end, curr, step) {
  if (start < end) {
    if (curr > end) return curr;
    return Math.floor(curr + step);
  }
  if (curr < end) return curr;
  return Math.floor(curr - step);
}

function switchColor(color) {
  if (color == 'red') return 'green';
  if (color == 'green') return 'blue';
  if (color == 'blue') return 'green';
}

function popFillsGradient(startChannels, endChannels) {
  const redStart = startChannels[red];
  const redEnd = endChannels[red];

  const greenStart = startChannels[green];
  const greenEnd = endChannels[green];

  const blueStart = startChannels[blue];
  const blueEnd = endChannels[blue];

  const redStep = redEnd / fillCount;
  const greenStep = greenEnd / fillCount;
  const blueStep = blueEnd / fillCount;

  let curr = [];

  curr = startChannels.slice();
  fills.push(getHex(curr));
  for (let i = 0; i < fillCount; i++) {
    const nextColorChannels = [
      getNextChannel(redStart, redEnd, curr[red], redStep),
      getNextChannel(greenStart, greenEnd, curr[green], greenStep),
      getNextChannel(blueStart, blueEnd, curr[blue], blueStep),
    ];
    let nextColor = getHex(nextColorChannels);
    // console.log(nextColor);
    fills.push(nextColor);
    curr = nextColorChannels.slice();
  }
  console.log(fills);
}

function getChannels(hexString) {
  const red = '0x' + hexString.substring(1, 3);
  const green = '0x' + hexString.substring(3, 5);
  const blue = '0x' + hexString.substring(5, 7);
  return [parseInt(red), parseInt(green), parseInt(blue)];
}
let start = getChannels('#F1948A');
let end = getChannels('#E74C3C');

popFillsGradient(start, end);

function getCountryFill(totCases, population) {
  // if (population === '--') return countryFill;
  if (totCases == 0) return countryFill;
  const fraction = totCases / 197719;
  for (let i = 0; i < fills.length; i++) {
    const fill = fills[i];
    const level = (i + 1) / fills.length;
    // console.log(fraction, level);
    if (fraction <= level) return fill;
  }
}
