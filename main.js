import { createBasicPattern, createCustomPattern, patternTypes } from './patterns.js';


const config = {
  colors: ['#C5E8A5', '#B8E1EF', '#F6BED8', '#AAA566', '#F2E6C2', '#925A9E', '#40A159', '#853f47', '#f9d384', '#a59bc6'],
  patternTypes,
};

let state = {
  selectedShape: null,
  selectedBackgroundColor: config.colors[0],
  selectedPatternColor: config.colors[9],
  selectedPattern: 'solid',
  selectedRotation: 0,
  shapes: [],
};

let defsElement;

function init() {
  const defsHost = document.querySelector('#patterns-defs defs');
  defsElement = defsHost;

  createBasicPatterns();
  createShapes();
  createColorPalette();
  createPatternColorPalette();
  requestAnimationFrame(() => createPatternPalette());
  setupEventListeners();
}

function createBasicPatterns() {
  const svgNS = "http://www.w3.org/2000/svg";
  config.patternTypes.forEach(type => {
    if (type === 'solid') return;
    const pattern = createBasicPattern(type, svgNS);
    defsElement.appendChild(pattern);
  });
}

function createShapes() {
  const canvas = document.getElementById('canvas');
  canvas.innerHTML = '';
  state.shapes = [];

  const shapesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  shapesGroup.setAttribute('id', 'shapes-group');
  canvas.appendChild(shapesGroup);

  function addShape(points, fillColor) {
    const shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    shape.setAttribute('points', points);
    shape.setAttribute('fill', fillColor);
    shape.classList.add('shape');
    shape.dataset.index = state.shapes.length;
    shapesGroup.appendChild(shape);

    state.shapes.push({
      element: shape,
      type: 'polygon',
      backgroundColor: fillColor,
      patternColor: state.selectedPatternColor,
      pattern: 'solid',
      rotation: 0
    });
    return shape;
  }

  const lightGrey = '#EEEEEE';
  const lightBlue = '#B8E1EF';
  const Pink = '#F6BED8';
  const Olive = '#AAA566'; 
  const lightGreen = '#C5E8A5';
  const mediumGrey = '#999999';
  const darkGrey = '#555555';
  const darkerGrey = '#333333';

  addShape('0,0 5,0 0,5', lightGreen);
  addShape('5,0,75,0 40,35', lightBlue);
  addShape('75,0 145,0 110,35', lightGreen);
  addShape('145,0 215,0 180,35', lightBlue);
  addShape('215,0 220,0 220,5', lightGreen);
  addShape('0,5 5,0 40,35 5,70 0,65', Pink);
  addShape('40,35, 75,0 110,35 75,70', Olive);
  addShape('110,35 145,0 180,35 145,70', Pink);
  addShape('180,35 215,0 220,5 220,65 215,70', Olive);
  addShape('0,65 5,70 0,70', lightBlue);
  addShape('5,70 40,35 75,70', lightGreen);
  addShape('75,70 110,35 145,70', lightBlue);
  addShape('145,70 180,35 215,70', lightGreen);
  addShape('215,70 220,65 220,70', lightBlue);
}

function applyToSelectedShape() {
  if (!state.selectedShape) return;

  const idx = parseInt(state.selectedShape.dataset.index);
  const data = state.shapes[idx];

  if (state.selectedPattern === 'solid') {
    state.selectedShape.setAttribute('fill', state.selectedBackgroundColor);
  } else {
    const patternId = `${state.selectedPattern}-bg${state.selectedBackgroundColor.replace('#', '')}-fg${state.selectedPatternColor.replace('#', '')}-rot${state.selectedRotation}`;
    if (!document.getElementById(patternId)) {
      const pattern = createCustomPattern(
        state.selectedPattern,
        state.selectedRotation,
        state.selectedBackgroundColor,
        state.selectedPatternColor,
        patternId
      );
      defsElement.appendChild(pattern);
    }
    state.selectedShape.setAttribute('fill', `url(#${patternId})`);
  }

  data.backgroundColor = state.selectedBackgroundColor;
  data.patternColor = state.selectedPatternColor;
  data.pattern = state.selectedPattern;
  data.rotation = state.selectedRotation;
}

function createColorPalette() {
  const palette = document.getElementById('color-palette');
  palette.innerHTML = '';
  config.colors.forEach(color => {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = color;
    swatch.dataset.color = color;
    if (color === state.selectedBackgroundColor) swatch.classList.add('selected');
    palette.appendChild(swatch);
  });
}

function createPatternColorPalette() {
  const palette = document.getElementById('pattern-color-palette');
  palette.innerHTML = '';
  config.colors.forEach(color => {
    const swatch = document.createElement('div');
    swatch.className = 'pattern-color-swatch';
    swatch.style.backgroundColor = color;
    swatch.dataset.color = color;
    if (color === state.selectedPatternColor) swatch.classList.add('selected');
    palette.appendChild(swatch);
  });
}

function createPatternPalette() {
  const container = document.getElementById('pattern-palette');
  container.innerHTML = '';
  config.patternTypes.forEach(type => {
    const swatch = document.createElement('div');
    swatch.className = 'pattern-swatch';
    swatch.dataset.pattern = type;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', '100%');
    bg.setAttribute('height', '100%');
    bg.setAttribute('fill', state.selectedBackgroundColor);
    svg.appendChild(bg);
    const fg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    fg.setAttribute('width', '100%');
    fg.setAttribute('height', '100%');
    fg.setAttribute('fill', `url(#pattern-${type})`);
    svg.appendChild(fg);
    swatch.appendChild(svg);

    const label = document.createElement('div');
    label.className = 'pattern-label';
    label.textContent = type;
    swatch.appendChild(label);

    if (type === state.selectedPattern) swatch.classList.add('selected');
    container.appendChild(swatch);
  });
}

function setupEventListeners() {
const handleShapeSelect = (e) => {
  const target = e.target.closest('.shape');
  if (!target) return;

  if (state.selectedShape) state.selectedShape.classList.remove('selected');
  state.selectedShape = target;
  target.classList.add('selected');

  const index = parseInt(target.dataset.index);
  const data = state.shapes[index];

  state.selectedBackgroundColor = data.backgroundColor;
  state.selectedPatternColor = data.patternColor;
  state.selectedPattern = data.pattern;
  state.selectedRotation = data.rotation;

  updateSwatchSelection?.();
  updateRotationIcon?.();
};

const canvas = document.getElementById('canvas');
canvas.addEventListener('click', handleShapeSelect);
canvas.addEventListener('touchstart', handleShapeSelect);

  document.getElementById('color-palette').addEventListener('click', e => {
    if (!e.target.dataset.color) return;
    document.querySelectorAll('.color-swatch.selected').forEach(el => el.classList.remove('selected'));
    e.target.classList.add('selected');
    state.selectedBackgroundColor = e.target.dataset.color;
    requestAnimationFrame(() => createPatternPalette());
    applyToSelectedShape();
  });

  document.getElementById('pattern-color-palette').addEventListener('click', e => {
    if (!e.target.dataset.color) return;
    document.querySelectorAll('.pattern-color-swatch.selected').forEach(el => el.classList.remove('selected'));
    e.target.classList.add('selected');
    state.selectedPatternColor = e.target.dataset.color;
    applyToSelectedShape();
  });

  document.getElementById('pattern-palette').addEventListener('click', e => {
    const target = e.target.closest('.pattern-swatch');
    if (!target) return;
    document.querySelectorAll('.pattern-swatch.selected').forEach(el => el.classList.remove('selected'));
    target.classList.add('selected');
    state.selectedPattern = target.dataset.pattern;
    applyToSelectedShape();
  });

  const rotateBtn = document.getElementById('rotate-btn');
  if (rotateBtn) {
    rotateBtn.addEventListener('click', () => {
state.selectedRotation = (state.selectedRotation + 45) % 360;
rotateBtn.style.transform = `rotate(${state.selectedRotation}deg)`;
updateShapeRotation();
    });
  }

function updateShapeRotation() {
  if (!state.selectedShape) return;
  const index = parseInt(state.selectedShape.dataset.index);
  const data = state.shapes[index];

  const newRotation = (data.rotation + 45) % 360;
  data.rotation = newRotation;

  const patternId = `${data.pattern}-bg${data.backgroundColor.replace('#', '')}-fg${data.patternColor.replace('#', '')}-rot${newRotation}`;

  if (!document.getElementById(patternId)) {
    const pattern = createCustomPattern(
      data.pattern,
      newRotation,
      data.backgroundColor,
      data.patternColor,
      patternId
    );
    defsElement.appendChild(pattern);
  }

  state.selectedRotation = newRotation; // update UI state as well
  state.selectedShape.setAttribute('fill', `url(#${patternId})`);
}

  document.getElementById('reset-btn').addEventListener('click', () => {
    state.selectedShape = null;
    state.shapes = [];
    createShapes();
  });

const saveBtn = document.getElementById('save-btn');
if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    const svg = document.getElementById('canvas');
    const defs = document.querySelector('#patterns-defs defs');
    if (!svg || !defs) return;

    const clonedSvg = svg.cloneNode(true);
    const defsCopy = defs.cloneNode(true);
    const defsWrapper = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defsWrapper.append(...defsCopy.childNodes);
    clonedSvg.insertBefore(defsWrapper, clonedSvg.firstChild);

    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvasEl = document.createElement('canvas');
      canvasEl.width = svg.viewBox.baseVal.width;
      canvasEl.height = svg.viewBox.baseVal.height;
      const ctx = canvasEl.getContext('2d');
      ctx.drawImage(img, 0, 0);

      canvasEl.toBlob(blob => {
        const pngUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = 'tabletop-design.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pngUrl);
      });

      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
}

  document.getElementById('randomize-btn').addEventListener('click', () => {
  state.shapes.forEach((shapeObj, idx) => {
    const bg = config.colors[Math.floor(Math.random() * config.colors.length)];
    const fg = config.colors[Math.floor(Math.random() * config.colors.length)];
    const pattern = config.patternTypes[Math.floor(Math.random() * config.patternTypes.length)];
    const rot = [0, 45, 90, 135, 180, 225, 270, 315][Math.floor(Math.random() * 8)];
    const id = `${pattern}-bg${bg.replace('#', '')}-fg${fg.replace('#', '')}-rot${rot}`;
    
    if (!document.getElementById(id)) {
      const p = createCustomPattern(pattern, rot, bg, fg, id);
      defsElement.appendChild(p);
    }

    shapeObj.element.setAttribute('fill', pattern === 'solid' ? bg : `url(#${id})`);
    shapeObj.backgroundColor = bg;
    shapeObj.patternColor = fg;
    shapeObj.pattern = pattern;
    shapeObj.rotation = rot;
  });

  // 🔄 Select the first shape after randomizing
  const firstShape = state.shapes[0];
  if (firstShape) {
    if (state.selectedShape) {
      state.selectedShape.classList.remove('selected');
    }

    state.selectedShape = firstShape.element;
    state.selectedShape.classList.add('selected');

    state.selectedBackgroundColor = firstShape.backgroundColor;
    state.selectedPatternColor = firstShape.patternColor;
    state.selectedPattern = firstShape.pattern;
    state.selectedRotation = firstShape.rotation;

    updateSwatchSelection?.();
    updateRotationIcon?.();
  }
});
}

init();
