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
  const mediumGrey = '#999999';
  const darkGrey = '#555555';
  const darkerGrey = '#333333';

  addShape('0,0 20,0 0,20', lightGrey);
  addShape('20,0 100,0 60,40', mediumGrey);
  addShape('100,0 180,0 140,40', lightGrey);
  addShape('180,0 200,0 200,20', mediumGrey);
  addShape('0,20 20,0 60,40 20,80 0,60', darkGrey);
  addShape('60,40 100,0 140,40 100,80', darkerGrey);
  addShape('140,40 180,0 200,20 200,60 180,80', darkGrey);
  addShape('0,60 20,80 0,80', mediumGrey);
  addShape('20,80 60,40 100,80', lightGrey);
  addShape('100,80 140,40 180,80', mediumGrey);
  addShape('180,80 200,60 200,80', lightGrey);
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
  document.getElementById('canvas').addEventListener('click', e => {
    if (!e.target.classList.contains('shape')) return;
    if (state.selectedShape) state.selectedShape.classList.remove('selected');
    state.selectedShape = e.target;
    e.target.classList.add('selected');
  });

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
      applyToSelectedShape();
    });
  }

  document.getElementById('reset-btn').addEventListener('click', () => {
    state.selectedShape = null;
    state.shapes = [];
    createShapes();
  });

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
    });
  });
}

init();
