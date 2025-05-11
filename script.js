document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const config = {
        canvasWidth: 200,     // Representing 200cm (2m)
        canvasHeight: 80,     // Representing 80cm
        gridDivisions: {
            x: 8,             // Number of vertical divisions
            y: 4              // Number of horizontal divisions
        },
        colors: [
            '#FF5252', // Red
            '#FF9800', // Orange
            '#FFEB3B', // Yellow
            '#8BC34A', // Light Green
            '#4CAF50', // Green
            '#03A9F4', // Light Blue
            '#2196F3', // Blue
            '#9C27B0', // Purple
            '#E91E63', // Pink
            '#795548'  // Brown
        ],
        patternTypes: [
            'solid',
            'dots',
            'stripes-horizontal',
            'stripes-vertical',
            'stripes-diagonal',
            'crosshatch',
            'zigzag',
            'waves',
            'triangles',
            'grid'
        ]
    };

    // State variables
    let state = {
        selectedShape: null,
        selectedColor: config.colors[0],
        selectedPattern: 'solid',
        shapes: []
    };

    // References to DOM elements
    const canvas = document.getElementById('canvas');
    const colorPalette = document.getElementById('color-palette');
    const patternPalette = document.getElementById('pattern-palette');
    const resetBtn = document.getElementById('reset-btn');
    const saveBtn = document.getElementById('save-btn');
    const patternsDefs = document.querySelector('#patterns-defs defs');

    // Initialize the application
    function init() {
        createShapes();
        createColorPalette();
        createPatterns();
        createPatternPalette();
        setupEventListeners();
    }

    // Create shapes on the canvas
    function createShapes() {
        const cellWidth = config.canvasWidth / config.gridDivisions.x;
        const cellHeight = config.canvasHeight / config.gridDivisions.y;
        
        // Clear existing shapes
        canvas.innerHTML = '';
        state.shapes = [];
        
        // Create a grid of squares and triangles
        for (let y = 0; y < config.gridDivisions.y; y++) {
            for (let x = 0; x < config.gridDivisions.x; x++) {
                const xPos = x * cellWidth;
                const yPos = y * cellHeight;
                
                // Alternating pattern of squares and triangles
                if ((x + y) % 2 === 0) {
                    // Create square
                    const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    square.setAttribute('x', xPos);
                    square.setAttribute('y', yPos);
                    square.setAttribute('width', cellWidth);
                    square.setAttribute('height', cellHeight);
                    square.setAttribute('fill', 'white');
                    square.classList.add('shape');
                    square.dataset.index = state.shapes.length;
                    
                    canvas.appendChild(square);
                    state.shapes.push({
                        element: square,
                        type: 'square',
                        color: 'white',
                        pattern: 'solid'
                    });
                } else {
                    // Create triangle
                    const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                    triangle.setAttribute('points', 
                        `${xPos},${yPos} ${xPos + cellWidth},${yPos} ${xPos},${yPos + cellHeight}`
                    );
                    triangle.setAttribute('fill', 'white');
                    triangle.classList.add('shape');
                    triangle.dataset.index = state.shapes.length;
                    
                    canvas.appendChild(triangle);
                    state.shapes.push({
                        element: triangle,
                        type: 'triangle',
                        color: 'white',
                        pattern: 'solid'
                    });
                    
                    // Add a second triangle to fill the cell
                    const triangle2 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                    triangle2.setAttribute('points', 
                        `${xPos + cellWidth},${yPos} ${xPos + cellWidth},${yPos + cellHeight} ${xPos},${yPos + cellHeight}`
                    );
                    triangle2.setAttribute('fill', 'white');
                    triangle2.classList.add('shape');
                    triangle2.dataset.index = state.shapes.length;
                    
                    canvas.appendChild(triangle2);
                    state.shapes.push({
                        element: triangle2,
                        type: 'triangle',
                        color: 'white',
                        pattern: 'solid'
                    });
                }
            }
        }
    }

    // Create color palette
    function createColorPalette() {
        colorPalette.innerHTML = '';
        
        config.colors.forEach((color, index) => {
            const swatch = document.createElement('div');
            swatch.classList.add('color-swatch');
            swatch.style.backgroundColor = color;
            swatch.dataset.color = color;
            
            if (color === state.selectedColor) {
                swatch.classList.add('selected');
            }
            
            colorPalette.appendChild(swatch);
        });
    }

    // Create SVG patterns
    function createPatterns() {
        patternsDefs.innerHTML = '';
        
        config.patternTypes.forEach((patternType, index) => {
            if (patternType === 'solid') return; // No pattern needed for solid
            
            const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
            pattern.setAttribute('id', `pattern-${patternType}`);
            pattern.setAttribute('patternUnits', 'userSpaceOnUse');
            pattern.setAttribute('width', '10');
            pattern.setAttribute('height', '10');
            
            // Different pattern elements based on type
            switch (patternType) {
                case 'dots':
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', '5');
                    circle.setAttribute('cy', '5');
                    circle.setAttribute('r', '2');
                    circle.setAttribute('fill', 'currentColor');
                    pattern.appendChild(circle);
                    break;
                    
                case 'stripes-horizontal':
                    const hRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    hRect.setAttribute('x', '0');
                    hRect.setAttribute('y', '0');
                    hRect.setAttribute('width', '10');
                    hRect.setAttribute('height', '5');
                    hRect.setAttribute('fill', 'currentColor');
                    pattern.appendChild(hRect);
                    break;
                    
                case 'stripes-vertical':
                    const vRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    vRect.setAttribute('x', '0');
                    vRect.setAttribute('y', '0');
                    vRect.setAttribute('width', '5');
                    vRect.setAttribute('height', '10');
                    vRect.setAttribute('fill', 'currentColor');
                    pattern.appendChild(vRect);
                    break;
                    
                case 'stripes-diagonal':
                    const dPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    dPath.setAttribute('d', 'M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2');
                    dPath.setAttribute('stroke', 'currentColor');
                    dPath.setAttribute('stroke-width', '2');
                    pattern.appendChild(dPath);
                    break;
                    
                case 'crosshatch':
                    const chPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    chPath.setAttribute('d', 'M0,0 l10,10 M0,10 l10,-10');
                    chPath.setAttribute('stroke', 'currentColor');
                    chPath.setAttribute('stroke-width', '1');
                    pattern.appendChild(chPath);
                    break;
                    
                case 'zigzag':
                    const zPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    zPath.setAttribute('d', 'M0,0 l5,10 l5,-10');
                    zPath.setAttribute('stroke', 'currentColor');
                    zPath.setAttribute('stroke-width', '1');
                    zPath.setAttribute('fill', 'none');
                    pattern.appendChild(zPath);
                    break;
                    
                case 'waves':
                    const wPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    wPath.setAttribute('d', 'M0,5 c2.5,-5 7.5,-5 10,0');
                    wPath.setAttribute('stroke', 'currentColor');
                    wPath.setAttribute('stroke-width', '1');
                    wPath.setAttribute('fill', 'none');
                    pattern.appendChild(wPath);
                    break;
                    
                case 'triangles':
                    const tPath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                    tPath.setAttribute('points', '0,0 10,0 5,10');
                    tPath.setAttribute('fill', 'currentColor');
                    tPath.setAttribute('opacity', '0.5');
                    pattern.appendChild(tPath);
                    break;
                    
                case 'grid':
                    const gPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    gPath.setAttribute('d', 'M0,0 l0,10 M0,0 l10,0 M10,0 l0,10 M0,10 l10,0');
                    gPath.setAttribute('stroke', 'currentColor');
                    gPath.setAttribute('stroke-width', '1');
                    pattern.appendChild(gPath);
                    break;
            }
            
            patternsDefs.appendChild(pattern);
        });
    }

    // Create pattern palette
    function createPatternPalette() {
        patternPalette.innerHTML = '';
        
        config.patternTypes.forEach((patternType, index) => {
            const swatch = document.createElement('div');
            swatch.classList.add('pattern-swatch');
            swatch.dataset.pattern = patternType;
            
            if (patternType === 'solid') {
                swatch.style.backgroundColor = state.selectedColor;
            } else {
                // Create mini SVG to show the pattern with current color
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');
                
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('width', '100%');
                rect.setAttribute('height', '100%');
                rect.setAttribute('fill', `url(#pattern-${patternType})`);
                rect.style.color = state.selectedColor;
                
                svg.appendChild(rect);
                swatch.appendChild(svg);
            }
            
            if (patternType === state.selectedPattern) {
                swatch.classList.add('selected');
            }
            
            patternPalette.appendChild(swatch);
        });
    }

    // Apply color/pattern to selected shape
    function applyToSelectedShape() {
        if (!state.selectedShape) return;
        
        const shapeIndex = parseInt(state.selectedShape.dataset.index);
        const shapeData = state.shapes[shapeIndex];
        
        if (state.selectedPattern === 'solid') {
            state.selectedShape.setAttribute('fill', state.selectedColor);
        } else {
            state.selectedShape.setAttribute('fill', `url(#pattern-${state.selectedPattern})`);
            state.selectedShape.style.color = state.selectedColor;
        }
        
        shapeData.color = state.selectedColor;
        shapeData.pattern = state.selectedPattern;
    }

    // Set up event listeners
    function setupEventListeners() {
        // Shape selection
        canvas.addEventListener('click', function(e) {
            if (e.target.classList.contains('shape')) {
                // Deselect previous shape
                if (state.selectedShape) {
                    state.selectedShape.classList.remove('selected');
                }
                
                // Select new shape
                state.selectedShape = e.target;
                state.selectedShape.classList.add('selected');
            }
        });
        
        // Color selection
        colorPalette.addEventListener('click', function(e) {
            if (e.target.classList.contains('color-swatch')) {
                // Update selected color
                document.querySelectorAll('.color-swatch.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                
                e.target.classList.add('selected');
                state.selectedColor = e.target.dataset.color;
                
                // Update pattern swatches with new color
                createPatternPalette();
                
                // Apply to selected shape if any
                applyToSelectedShape();
            }
        });
        
        // Pattern selection
        patternPalette.addEventListener('click', function(e) {
            let target = e.target;
            
            // If clicked on the SVG or rect inside the swatch, find the parent swatch
            while (target && !target.classList.contains('pattern-swatch')) {
                target = target.parentElement;
            }
            
            if (target && target.classList.contains('pattern-swatch')) {
                // Update selected pattern
                document.querySelectorAll('.pattern-swatch.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                
                target.classList.add('selected');
                state.selectedPattern = target.dataset.pattern;
                
                // Apply to selected shape if any
                applyToSelectedShape();
            }
        });
        
        // Reset button
        resetBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset your design?')) {
                createShapes();
                
                // Reset selected shape
                state.selectedShape = null;
            }
        });
        
        // Save button
        saveBtn.addEventListener('click', function() {
            // Clone the SVG
            const clonedSvg = canvas.cloneNode(true);
            
            // Add the pattern definitions
            const patternDefsClone = patternsDefs.cloneNode(true);
            clonedSvg.appendChild(patternDefsClone);
            
            // Convert to a data URL
            const svgData = new XMLSerializer().serializeToString(clonedSvg);
            const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
            const svgUrl = URL.createObjectURL(svgBlob);
            
            // Create a download link
            const downloadLink = document.createElement('a');
            downloadLink.href = svgUrl;
            downloadLink.download = 'tabletop-design.svg';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    }

    // Initialize the application
    init();
});
