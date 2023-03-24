const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

registerFont(path.join(__dirname, 'fonts', 'Helvetica_Bold.ttf'), { family: 'Helvetica', weight: 'bold' });

function putLabel(image, label) {
  // downsample the original by half
  const IMAGE_WIDTH = 1728;
  const IMAGE_HEIGHT = 2160;
  // picked from testing
  const TEXT_X = 920;
  const TEXT_Y = 1500;
  const labelWidth = 480;
  const labelHeight = 225;

  const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  const formatText = (label, fontSize) => {
    ctx.font = `bold ${fontSize}px helvetica`;
    let allLines = [];
    let words = label.split(/\s+/);
    let curLine = words[0];
    words.forEach((word, index) => {
      if (index > 0) {
        let newWidth = ctx.measureText(curLine + ' ' + word).width;
        if (newWidth < labelWidth) {
          curLine += ' ' + word;
        } else {
          allLines.push(curLine);
          curLine = word;
        }
      }
    });
    allLines.push(curLine);
    return allLines;
  };

  let lines;
  let textHeight = labelHeight + 1;
  let textWidth = 0;
  let fontSize = 43;
  while (textHeight > labelHeight) {
    fontSize -= 1;
    // break up lines according to fontSize
    lines = formatText(label, fontSize);
    // calculate textHeight for this fontSize
    textHeight = 0;
    lines.forEach((line) => {
      let textMeasure = ctx.measureText(line);
      textHeight += textMeasure.emHeightDescent;
      textWidth = Math.max(textWidth, textMeasure.width);
    });
    // set transformation with a deltaY fudge factor from testing
    let deltaY = 95 - textHeight / 2;
    ctx.setTransform(1.2, -0.215, -0.02, 1.5, TEXT_X, TEXT_Y + deltaY);
  }
  console.log(`fontSize=${fontSize} textWidth=${textWidth} textHeight=${textHeight}`);

  let y = 0; // current y-coordinate of the text baseline
  lines.forEach((line) => {
    let height = ctx.measureText(line).emHeightDescent / 2.2;
    ctx.fillText(line, 0, y);
    y += height; // increment y by a fraction of the height of the current line
    ctx.translate(0, height);
  });

  return canvas.toDataURL('image/jpeg', 1.0);
}

module.exports = { putLabel };


