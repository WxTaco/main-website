
import { useState, useEffect, useRef } from 'react';

interface Color {
  hex: string;
  rgb: string;
  hsl: string;
}

interface Palette {
  name: string;
  colors: Color[];
}

interface NotificationProps {
  message: string;
  content: string;
  isVisible: boolean;
}

const hexToRgb = (hex: string): string => {
  hex = hex.replace('#', '');

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgb(${r}, ${g}, ${b})`;
};

const hexToHsl = (hex: string): string => {
  hex = hex.replace('#', '');

  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `hsl(${h}, ${s}%, ${l}%)`;
};

const randomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const createColorObject = (hex: string): Color => {
  return {
    hex,
    rgb: hexToRgb(hex),
    hsl: hexToHsl(hex)
  };
};

const generateRandomPalette = (): Palette => {
  const colors: Color[] = [];
  for (let i = 0; i < 5; i++) {
    const hex = randomColor();
    colors.push(createColorObject(hex));
  }
  return {
    name: 'Random Palette',
    colors
  };
};

const generateMonochromaticPalette = (baseHex: string): Palette => { 
  baseHex = baseHex.replace('#', '');

  let r = parseInt(baseHex.substring(0, 2), 16);
  let g = parseInt(baseHex.substring(2, 4), 16);
  let b = parseInt(baseHex.substring(4, 6), 16);

  const colors: Color[] = [];
 
  for (let i = 0; i < 5; i++) {   
    const factor = 0.5 + (i * 0.25);

    const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
    const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
    const newB = Math.min(255, Math.max(0, Math.round(b * factor)));   
    const hex = '#' +
      newR.toString(16).padStart(2, '0') +
      newG.toString(16).padStart(2, '0') +
      newB.toString(16).padStart(2, '0');

    colors.push(createColorObject(hex));
  }

  return {
    name: 'Monochromatic Palette',
    colors
  };
};

const generateComplementaryPalette = (baseHex: string): Palette => {
  baseHex = baseHex.replace('#', '');

  let r = parseInt(baseHex.substring(0, 2), 16);
  let g = parseInt(baseHex.substring(2, 4), 16);
  let b = parseInt(baseHex.substring(4, 6), 16);

  const compR = 255 - r;
  const compG = 255 - g;
  const compB = 255 - b;

  const colors: Color[] = [];

  colors.push(createColorObject('#' + baseHex));

  for (let i = 1; i < 4; i++) {
    const ratio = i / 4;
    const newR = Math.round(r * (1 - ratio) + compR * ratio);
    const newG = Math.round(g * (1 - ratio) + compG * ratio);
    const newB = Math.round(b * (1 - ratio) + compB * ratio);

    const hex = '#' +
      newR.toString(16).padStart(2, '0') +
      newG.toString(16).padStart(2, '0') +
      newB.toString(16).padStart(2, '0');

    colors.push(createColorObject(hex));
  }

  colors.push(createColorObject('#' +
    compR.toString(16).padStart(2, '0') +
    compG.toString(16).padStart(2, '0') +
    compB.toString(16).padStart(2, '0')
  ));

  return {
    name: 'Complementary Palette',
    colors
  };
};

const generateAnalogousPalette = (baseHex: string): Palette => {
  const hsl = hexToHsl(baseHex);
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);

  if (!match) return generateRandomPalette();

  const h = parseInt(match[1]);
  const s = parseInt(match[2]);
  const l = parseInt(match[3]);

  const colors: Color[] = [];

  for (let i = 0; i < 5; i++) {
    const newH = (h + (i - 2) * 30 + 360) % 360;

    const hslString = `hsl(${newH}, ${s}%, ${l}%)`;

    const tempEl = document.createElement('div');
    tempEl.style.color = hslString;
    document.body.appendChild(tempEl);
    const rgbString = window.getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);

    const rgbMatch = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!rgbMatch) continue;

    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);

    const hex = '#' +
      r.toString(16).padStart(2, '0') +
      g.toString(16).padStart(2, '0') +
      b.toString(16).padStart(2, '0');

    colors.push(createColorObject(hex));
  }

  return {
    name: 'Analogous Palette',
    colors
  };
};

export const CopyNotification: React.FC<NotificationProps> = ({ message, content, isVisible }) => {
  return (
    <div
      className={`fixed bottom-8 right-8 bg-gray-800 text-white p-4 rounded-lg shadow-lg border border-theme-primary transition-all duration-300 z-50 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      <div className="flex items-start">
        <div className="bg-green-500 rounded-full p-1 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-medium">{message}</p>
          <p className="text-sm text-gray-300 mt-1 font-mono bg-gray-900 p-2 rounded">{content}</p>
        </div>
      </div>
    </div>
  );
};

const ColorPaletteGenerator = () => {
  const [palette, setPalette] = useState<Palette>(generateRandomPalette());
  const [baseColor, setBaseColor] = useState<string>('#c94baf');
  const [paletteType, setPaletteType] = useState<string>('random');
  const [copied, setCopied] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'hex' | 'rgb' | 'hsl' | 'css'>('hex');
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(-1);
  const [notification, setNotification] = useState<{ message: string; content: string; isVisible: boolean }>({
    message: '',
    content: '',
    isVisible: false
  });
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const generatePalette = () => {
    switch (paletteType) {
      case 'monochromatic':
        setPalette(generateMonochromaticPalette(baseColor));
        break;
      case 'complementary':
        setPalette(generateComplementaryPalette(baseColor));
        break;
      case 'analogous':
        setPalette(generateAnalogousPalette(baseColor));
        break;
      case 'random':
      default:
        setPalette(generateRandomPalette());
        break;
    }
  };

  const showNotification = (message: string, content: string) => {
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }

    setNotification({
      message,
      content,
      isVisible: true
    });

    notificationTimerRef.current = setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const copyToClipboard = (value: string, index: number) => {
    navigator.clipboard.writeText(value);
    setCopied(`${index}-${value}`);
    setTimeout(() => setCopied(null), 2000);

    showNotification('Color copied to clipboard!', value);
  };

  const exportPalette = () => {
    let content = '';
    let formatName = '';

    switch (exportFormat) {
      case 'hex':
        content = palette.colors.map(color => color.hex).join('\n');
        formatName = 'HEX Values';
        break;
      case 'rgb':
        content = palette.colors.map(color => color.rgb).join('\n');
        formatName = 'RGB Values';
        break;
      case 'hsl':
        content = palette.colors.map(color => color.hsl).join('\n');
        formatName = 'HSL Values';
        break;
      case 'css':
        content = `:root {\n${palette.colors.map((color, index) => `  --color-${index + 1}: ${color.hex};`).join('\n')}\n}`;
        formatName = 'CSS Variables';
        break;
    }

    navigator.clipboard.writeText(content);
    showNotification(`Palette copied as ${formatName}!`, content);
  };

  useEffect(() => {
    return () => {
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    generatePalette();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-theme-gradient-start via-theme-gradient-middle to-theme-gradient-end flex flex-col items-center justify-start py-12 px-4 transition-colors duration-300">
      {/* Copy Notification */}
      <CopyNotification
        message={notification.message}
        content={notification.content}
        isVisible={notification.isVisible}
      />

      {/* Main Heading */}
      <div className="w-full max-w-3xl bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-8 border border-theme-border/30 mb-8 dark:bg-black/80 dark:border-white/20">
        <h1 className="text-5xl md:text-6xl font-extrabold font-saira text-theme-primary drop-shadow-lg mb-4 text-center">
          Color Palette Generator
        </h1>
        <section className="text-center">
          <p className="text-xl max-w-3xl mx-auto text-gray-100 font-medium shadow-sm mb-4">
            Generate beautiful color palettes for your projects. Choose from different palette types, customize colors, and export in various formats.
          </p>
        </section>
      </div>

      {/* Color Palette Generator Tool */}
      <div className="w-full max-w-6xl mb-10">
        <div className="bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-6 border border-theme-border/30 dark:bg-black/80 dark:border-white/20">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-300 mb-2">Palette Type</label>
              <select
                value={paletteType}
                onChange={(e) => setPaletteType(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600"
              >
                <option value="random">Random</option>
                <option value="monochromatic">Monochromatic</option>
                <option value="complementary">Complementary</option>
                <option value="analogous">Analogous</option>
              </select>
            </div>

            {paletteType !== 'random' && (
              <div>
                <label className="block text-gray-300 mb-2">Base Color</label>
                <div className="flex">
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="h-10 w-10 border-0 p-0 mr-2"
                  />
                  <input
                    type="text"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="flex-1 bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600"
                  />
                </div>
              </div>
            )}

            <div className="flex items-end">
              <button
                onClick={generatePalette}
                className="bg-theme-primary hover:bg-theme-primary/80 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 w-full"
              >
                Generate Palette
              </button>
            </div>
          </div>

          {/* Color Palette Display */}
          <div className="mb-8">
            <h2 className="text-2xl font-saira text-theme-primary font-semibold mb-4">{palette.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {palette.colors.map((color, index) => (
                <div key={index} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                  <div
                    className="h-32 w-full"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <div className="p-4">
                    <div className="mb-2">
                      <button
                        onClick={() => copyToClipboard(color.hex, index)}
                        className="w-full text-left bg-gray-800 hover:bg-gray-700 text-white py-1 px-2 rounded mb-1 text-sm flex justify-between items-center"
                      >
                        <span>HEX: {color.hex}</span>
                        {copied === `${index}-${color.hex}` ? (
                          <span className="text-green-400 text-xs">Copied!</span>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>

                      <button
                        onClick={() => copyToClipboard(color.rgb, index)}
                        className="w-full text-left bg-gray-800 hover:bg-gray-700 text-white py-1 px-2 rounded mb-1 text-sm flex justify-between items-center"
                      >
                        <span>RGB: {color.rgb}</span>
                        {copied === `${index}-${color.rgb}` ? (
                          <span className="text-green-400 text-xs">Copied!</span>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>

                      <button
                        onClick={() => copyToClipboard(color.hsl, index)}
                        className="w-full text-left bg-gray-800 hover:bg-gray-700 text-white py-1 px-2 rounded text-sm flex justify-between items-center"
                      >
                        <span>HSL: {color.hsl}</span>
                        {copied === `${index}-${color.hsl}` ? (
                          <span className="text-green-400 text-xs">Copied!</span>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-saira text-theme-primary font-semibold mb-4">Export Palette</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col h-full">
                <p className="text-gray-300 mb-3">Export your palette in different formats for use in your projects. Choose a format and copy the values to your clipboard.</p>

                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex-grow flex flex-col justify-between">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Format</label>
                    <select
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value as 'hex' | 'rgb' | 'hsl' | 'css')}
                      className="w-full bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600 mb-4"
                    >
                      <option value="hex">HEX Values</option>
                      <option value="rgb">RGB Values</option>
                      <option value="hsl">HSL Values</option>
                      <option value="css">CSS Variables</option>
                    </select>

                    <div className="text-gray-300 mb-4">
                      <h4 className="font-medium mb-1">Format Description:</h4>
                      {exportFormat === 'hex' && (
                        <p className="text-sm">HEX color codes like #FF5733, commonly used in CSS and design tools.</p>
                      )}
                      {exportFormat === 'rgb' && (
                        <p className="text-sm">RGB values like rgb(255, 87, 51), useful for CSS with opacity/alpha values.</p>
                      )}
                      {exportFormat === 'hsl' && (
                        <p className="text-sm">HSL values like hsl(12, 100%, 60%), great for creating color variations.</p>
                      )}
                      {exportFormat === 'css' && (
                        <p className="text-sm">CSS variables that can be pasted directly into your stylesheet.</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={exportPalette}
                    className="w-full bg-theme-primary hover:bg-theme-primary/80 text-white font-bold py-3 px-4 rounded-md transition-all duration-200 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                    Copy to Clipboard
                  </button>
                </div>
              </div>

              <div className="flex flex-col h-full">
                <p className="text-gray-300 mb-3">Preview of the export format:</p>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex-grow">
                  <pre
                    className="text-gray-300 text-sm font-mono overflow-auto h-[180px] custom-scrollbar w-full"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'var(--theme-primary, #c94baf) #2d3748',
                    }}
                  >
                    {exportFormat === 'hex' && palette.colors.map(color => color.hex).join('\n')}
                    {exportFormat === 'rgb' && palette.colors.map(color => color.rgb).join('\n')}
                    {exportFormat === 'hsl' && palette.colors.map(color => color.hsl).join('\n')}
                    {exportFormat === 'css' && `:root {\n${palette.colors.map((color, index) => `  --color-${index + 1}: ${color.hex};`).join('\n')}\n}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPaletteGenerator;
