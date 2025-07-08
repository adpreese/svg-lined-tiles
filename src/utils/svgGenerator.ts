
interface SVGParameters {
  height: number;
  width: number;
  verticalLines: number;
  horizontalLines: number;
  avgStrokeWidth: number;
  avgOpacity: number;
  backgroundColor: string;
  lineColors: string[];
}

// Utility function for triangular distribution
const randomTriangular = (min: number, max: number, mode: number): number => {
  const u = Math.random();
  const c = (mode - min) / (max - min);
  
  if (u < c) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  } else {
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  }
};

// Utility function for normal distribution using Box-Muller transform
const randomNormal = (mean: number, stddev: number): number => {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return z * stddev + mean;
};

const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateSVG = (params: SVGParameters): string => {
  console.log('Generating SVG with parameters:', params);
  
  const svgTemplate = `
<svg xmlns="http://www.w3.org/2000/svg" width="${params.width}" height="${params.height}" viewBox="0 0 ${params.width} ${params.height}" style="background-color: ${params.backgroundColor}; ">
<style type="text/css">
<![CDATA[

  {style}
  @keyframes moveHorizontal {
    0% {
        transform: translateX(-${params.width}px);
    }
    100% {
        transform: translateX(${params.width}px);
    }
  }
    @keyframes moveVertical {
      0% {
          transform: translateY(-${params.height}px);
      }
      100% {
          transform: translateY(${params.height}px);
      }
    }
]]>
</style>
  
  {lines}
</svg>`;

  const linesTemplate = `<g xmlns="http://www.w3.org/2000/svg" stroke="#{color}" stroke-width="{width}" stroke-linecap="butt" opacity="{opacity}">
      <path d="{the_lines}" class="{classname}"/>
  </g>`;

  const singleLineTemplateH = `M{xstart} {y} H{xend} `;
  const singleLineTemplateV = `M{ystart} {x} V{yend} `;

  const lineGroups: string[] = [];
  const styles: string[] = [];

  // Calculate normal distribution parameters for stroke width
  const strokeMean = params.avgStrokeWidth;
  const strokeStddev = Math.sqrt(params.avgStrokeWidth / 2);

  // Generate horizontal lines (first set)
  for (let i = 0; i < params.horizontalLines; i++) {
    const lines: string[] = [];
    const opacity = randomTriangular(0.05, 0.95, params.avgOpacity);
    const lineCount = Math.max(1, Math.floor(1 / opacity));
    
    for (let j = 0; j < lineCount; j++) {
      const x1 = randomInt(0, params.width);
      const x2 = randomInt(0, params.width);
      const xstart = Math.min(x1, x2);
      const xend = Math.max(x1, x2);
      const y = randomInt(1, params.height);
      
      lines.push(singleLineTemplateH
        .replace('{xstart}', xstart.toString())
        .replace('{y}', y.toString())
        .replace('{xend}', xend.toString())
      );
      
    }
    
    const strokeWidth = Math.max(0.1, randomNormal(strokeMean, strokeStddev));
    const color = randomChoice(params.lineColors).replace('#', '');
    const styleName = `horizontal_line_${i}`
    const style = `.${styleName} {
      animation: moveHorizontal ${randomTriangular(3,6,25)}s linear infinite;
      animation-delay: ${randomTriangular(0,0.8,1.2)}s
    }`  
    styles.push(style)
    lineGroups.push(linesTemplate
      .replace('{opacity}', opacity.toString())
      .replace('{width}', strokeWidth.toString())
      .replace('{color}', color)
      .replace('{classname}', styleName)
      .replace('{the_lines}', lines.join(' '))

    );

    
  }

  // Generate vertical lines from edges
  for (let i = 0; i < Math.floor(params.verticalLines / 3); i++) {
    const lines: string[] = [];
    const opacity = randomTriangular(0.05, 0.95, params.avgOpacity);
    const lineCount = Math.max(1, Math.floor(1 / opacity));
    
    for (let j = 0; j < lineCount; j++) {
      const y = randomInt(1, params.height);
      
      // Left edge lines
      const x1 = randomInt(0, Math.floor(params.width * 0.25));
      lines.push(singleLineTemplateV
        .replace('{ystart}', '0')
        .replace('{x}', y.toString())
        .replace('{yend}', x1.toString())
      );
      
      // Right edge lines
      const x2 = params.width - randomInt(0, Math.floor(params.width * 0.25));
      lines.push(singleLineTemplateV
        .replace('{ystart}', x2.toString())
        .replace('{x}', y.toString())
        .replace('{yend}', "200")
      );
    }
    
    const strokeWidth = Math.max(0.1, randomNormal(strokeMean * 0.63, strokeStddev * 0.63));
    const color = randomChoice(params.lineColors).replace('#', '');
    const styleName = `vertical_line_${i}`
    const style = `.${styleName} {
      animation: moveVertical ${randomTriangular(3,6,25)}s linear infinite;
      animation-delay: ${randomTriangular(0,0.8,1.2)}s
    }`  
    styles.push(style)
    lineGroups.push(linesTemplate
      .replace('{opacity}', opacity.toString())
      .replace('{width}', strokeWidth.toString())
      .replace('{color}', color)
      .replace('{classname}', styleName)
      .replace('{the_lines}', lines.join(' '))
    );
  }

  // Generate full vertical lines
  const remainingVerticalLines = params.verticalLines - Math.floor(params.verticalLines / 3);
  for (let i = 0; i < remainingVerticalLines; i++) {
    const lines: string[] = [];
    const opacity = randomTriangular(0.05, 0.95, params.avgOpacity);
    const lineCount = Math.max(1, Math.floor(1 / opacity));
    
    for (let j = 0; j < lineCount; j++) {
      const y1 = randomInt(0, params.height);
      const y2 = randomInt(0, params.height);
      const ystart = Math.min(y1, y2);
      const yend = Math.max(y1, y2);
      const x = randomInt(1, params.width);
      
      lines.push(singleLineTemplateV
        .replace('{ystart}', ystart.toString())
        .replace('{x}', x.toString())
        .replace('{yend}', yend.toString())
      );
    }
    
    const strokeWidth = Math.max(0.1, randomNormal(strokeMean * 0.63, strokeStddev * 0.63));
    const color = randomChoice(params.lineColors).replace('#', '');
    const styleName = `vertical_line_${i}`
    const style = `.${styleName} {
      animation: moveVertical ${randomTriangular(3,6,25)}s linear infinite;
      animation-delay: ${randomTriangular(0,0.8,1.2)}s
    }`  
    styles.push(style)
    lineGroups.push(linesTemplate
      .replace('{opacity}', opacity.toString())
      .replace('{width}', strokeWidth.toString())
      .replace('{color}', color)
      .replace('{classname}', styleName)
      .replace('{the_lines}', lines.join(' '))
    );
  }

  console.log('Generated', lineGroups.length, 'line groups');
  
  const finalSvg = svgTemplate.replace('{style}', styles.join('\n')).replace('{lines}', lineGroups.join('\n'));
  return finalSvg;
};
