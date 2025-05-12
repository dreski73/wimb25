
export const patternTypes = [
  'solid', 'lines', 'thinlines', 'checkerboard', 'grid',
  'triangles'
];

export function createBasicPattern(patternType, svgNS) {
  const pattern = document.createElementNS(svgNS, 'pattern');
  pattern.setAttribute('id', `pattern-${patternType}`);
  pattern.setAttribute('patternUnits', 'userSpaceOnUse');

  switch (patternType) {
    case 'lines':
      pattern.setAttribute('width', '20');
      pattern.setAttribute('height', '20');
      const line = document.createElementNS(svgNS, 'rect');
      line.setAttribute('x', '0');
      line.setAttribute('y', '0');
      line.setAttribute('width', '20');
      line.setAttribute('height', '10');
      line.setAttribute('fill', 'black');
      pattern.appendChild(line);
      break;
    case 'thinlines':
      pattern.setAttribute('width', '20');
      pattern.setAttribute('height', '20');
      for (let i = 0; i < 5; i++) {
        const thin = document.createElementNS(svgNS, 'rect');
        thin.setAttribute('x', '0');
        thin.setAttribute('y', String(i * 4));
        thin.setAttribute('width', '20');
        thin.setAttribute('height', '2');
        thin.setAttribute('fill', 'black');
        pattern.appendChild(thin);
      }
      break;
    case 'checkerboard':
      pattern.setAttribute('width', '20');
      pattern.setAttribute('height', '20');
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          const square = document.createElementNS(svgNS, 'rect');
          square.setAttribute('x', String(i * 10));
          square.setAttribute('y', String(j * 10));
          square.setAttribute('width', '10');
          square.setAttribute('height', '10');
          square.setAttribute('fill', (i + j) % 2 === 0 ? 'black' : 'transparent');
          pattern.appendChild(square);
        }
      }
      break;
    case 'grid':
      pattern.setAttribute('width', '10');
      pattern.setAttribute('height', '10');
      const h = document.createElementNS(svgNS, 'rect');
      h.setAttribute('x', '0');
      h.setAttribute('y', '0');
      h.setAttribute('width', '10');
      h.setAttribute('height', '5');
      h.setAttribute('fill', 'black');
      pattern.appendChild(h);
      const v = document.createElementNS(svgNS, 'rect');
      v.setAttribute('x', '0');
      v.setAttribute('y', '0');
      v.setAttribute('width', '5');
      v.setAttribute('height', '10');
      v.setAttribute('fill', 'black');
      pattern.appendChild(v);
      break;
 
 
 case 'triangles':
  pattern.setAttribute('width', '8');
  pattern.setAttribute('height', '20');

  for (let i = 0; i < 3; i++) {
    const tri = document.createElementNS(svgNS, 'polygon');
    const x = i * 8;
    tri.setAttribute('points', `${x},0 ${x + 8},0 ${x + 4},20`);
    tri.setAttribute('fill', 'black');
    pattern.appendChild(tri);
  }
  break;

  }

  return pattern;
}

export function createCustomPattern(type, rotation, backgroundColor, patternColor, patternId) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const pattern = createBasicPattern(type, svgNS);
  pattern.setAttribute('id', patternId);
  pattern.querySelectorAll('[fill="black"]').forEach(el => el.setAttribute('fill', patternColor));
  pattern.querySelectorAll('[fill="transparent"]').forEach(el => el.setAttribute('fill', backgroundColor));

if (rotation && type !== 'custom') {
  pattern.setAttribute('patternTransform', `rotate(${rotation} 10 10)`);
}

  const bg = document.createElementNS(svgNS, 'rect');
  bg.setAttribute('width', pattern.getAttribute('width') || '20');
  bg.setAttribute('height', pattern.getAttribute('height') || '20');
  bg.setAttribute('fill', backgroundColor);
  pattern.insertBefore(bg, pattern.firstChild);

  return pattern;
}
