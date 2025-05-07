import { useState, useEffect, useRef } from 'react';
import { CopyNotification } from './ColorPaletteGenerator';


interface CSSProperty {
  name: string;
  value: string;
}

interface CSSGenerator {
  id: string;
  name: string;
  description: string;
  properties: CSSProperty[];
  controls: React.ReactNode;
  generateCSS: () => string;
  previewStyle: React.CSSProperties;
}

const CSSGeneratorTool = () => {
  const [selectedGenerator, setSelectedGenerator] = useState<string>('button');
  const [notification, setNotification] = useState<{ message: string; content: string; isVisible: boolean }>({
    message: '',
    content: '',
    isVisible: false
  });
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

 
  const [buttonText, setButtonText] = useState<string>('Button');
  const [buttonColor, setButtonColor] = useState<string>('#c94baf');
  const [buttonTextColor, setButtonTextColor] = useState<string>('#ffffff');
  const [buttonBorderRadius, setButtonBorderRadius] = useState<number>(4);
  const [buttonPaddingX, setButtonPaddingX] = useState<number>(16);
  const [buttonPaddingY, setButtonPaddingY] = useState<number>(8);
  const [buttonHoverEffect, setButtonHoverEffect] = useState<boolean>(true);
  const [buttonShadow, setButtonShadow] = useState<boolean>(false);

 
  const [shadowColor, setShadowColor] = useState<string>('rgba(0, 0, 0, 0.2)');
  const [shadowOffsetX, setShadowOffsetX] = useState<number>(0);
  const [shadowOffsetY, setShadowOffsetY] = useState<number>(4);
  const [shadowBlur, setShadowBlur] = useState<number>(8);
  const [shadowSpread, setShadowSpread] = useState<number>(0);
  const [shadowInset, setShadowInset] = useState<boolean>(false);

 
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [gradientDirection, setGradientDirection] = useState<string>('to right');
  const [gradientColor1, setGradientColor1] = useState<string>('#c94baf');
  const [gradientColor2, setGradientColor2] = useState<string>('#673ab7');
  const [gradientStop1, setGradientStop1] = useState<number>(0);
  const [gradientStop2, setGradientStop2] = useState<number>(100);

 
  const [borderWidth, setBorderWidth] = useState<number>(1);
  const [borderStyle, setBorderStyle] = useState<string>('solid');
  const [borderColor, setBorderColor] = useState<string>('#c94baf');
  const [borderRadiusTL, setBorderRadiusTL] = useState<number>(4);
  const [borderRadiusTR, setBorderRadiusTR] = useState<number>(4);
  const [borderRadiusBL, setBorderRadiusBL] = useState<number>(4);
  const [borderRadiusBR, setBorderRadiusBR] = useState<number>(4);

 
  const generators: { [key: string]: CSSGenerator } = {
    button: {
      id: 'button',
      name: 'Button Generator',
      description: 'Create CSS for custom buttons with hover effects',
      properties: [
        { name: 'background-color', value: buttonColor },
        { name: 'color', value: buttonTextColor },
        { name: 'border-radius', value: `${buttonBorderRadius}px` },
        { name: 'padding', value: `${buttonPaddingY}px ${buttonPaddingX}px` },
        { name: 'border', value: 'none' },
        { name: 'cursor', value: 'pointer' },
        { name: 'font-weight', value: 'bold' },
        { name: 'transition', value: buttonHoverEffect ? 'all 0.3s ease' : 'none' },
        { name: 'box-shadow', value: buttonShadow ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none' },
      ],
      controls: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Button Text</label>
            <input
              type="text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Button Color</label>
            <div className="flex">
              <input
                type="color"
                value={buttonColor}
                onChange={(e) => setButtonColor(e.target.value)}
                className="h-10 w-10 border-0 p-0 mr-2"
              />
              <input
                type="text"
                value={buttonColor}
                onChange={(e) => setButtonColor(e.target.value)}
                className="flex-1 bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Text Color</label>
            <div className="flex">
              <input
                type="color"
                value={buttonTextColor}
                onChange={(e) => setButtonTextColor(e.target.value)}
                className="h-10 w-10 border-0 p-0 mr-2"
              />
              <input
                type="text"
                value={buttonTextColor}
                onChange={(e) => setButtonTextColor(e.target.value)}
                className="flex-1 bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Border Radius ({buttonBorderRadius}px)</label>
            <input
              type="range"
              min="0"
              max="50"
              value={buttonBorderRadius}
              onChange={(e) => setButtonBorderRadius(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Padding X ({buttonPaddingX}px)</label>
            <input
              type="range"
              min="0"
              max="50"
              value={buttonPaddingX}
              onChange={(e) => setButtonPaddingX(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Padding Y ({buttonPaddingY}px)</label>
            <input
              type="range"
              min="0"
              max="50"
              value={buttonPaddingY}
              onChange={(e) => setButtonPaddingY(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hover-effect"
              checked={buttonHoverEffect}
              onChange={(e) => setButtonHoverEffect(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="hover-effect" className="text-gray-300">Add hover effect</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="shadow-effect"
              checked={buttonShadow}
              onChange={(e) => setButtonShadow(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="shadow-effect" className="text-gray-300">Add shadow</label>
          </div>
        </div>
      ),
      generateCSS: () => {
        let css = '.custom-button {\n';
        generators.button.properties.forEach(prop => {
          css += `  ${prop.name}: ${prop.value};\n`;
        });
        css += '}\n\n';

        if (buttonHoverEffect) {
          css += '.custom-button:hover {\n';
          css += `  background-color: ${adjustColor(buttonColor, -15)};\n`;
          css += `  transform: translateY(-2px);\n`;
          if (buttonShadow) {
            css += `  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);\n`;
          }
          css += '}';
        }

        return css;
      },
      previewStyle: {
        backgroundColor: buttonColor,
        color: buttonTextColor,
        borderRadius: `${buttonBorderRadius}px`,
        padding: `${buttonPaddingY}px ${buttonPaddingX}px`,
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: buttonHoverEffect ? 'all 0.3s ease' : 'none',
        boxShadow: buttonShadow ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
      }
    },
    boxShadow: {
      id: 'boxShadow',
      name: 'Box Shadow Generator',
      description: 'Create CSS box shadows with customizable properties',
      properties: [
        { name: 'box-shadow', value: `${shadowInset ? 'inset ' : ''}${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}` },
      ],
      controls: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Shadow Color</label>
            <div className="flex">
              <input
                type="color"
                value={shadowColor.startsWith('rgba') ? '#000000' : shadowColor}
                onChange={(e) => setShadowColor(e.target.value)}
                className="h-10 w-10 border-0 p-0 mr-2"
              />
              <input
                type="text"
                value={shadowColor}
                onChange={(e) => setShadowColor(e.target.value)}
                className="flex-1 bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Horizontal Offset ({shadowOffsetX}px)</label>
            <input
              type="range"
              min="-50"
              max="50"
              value={shadowOffsetX}
              onChange={(e) => setShadowOffsetX(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Vertical Offset ({shadowOffsetY}px)</label>
            <input
              type="range"
              min="-50"
              max="50"
              value={shadowOffsetY}
              onChange={(e) => setShadowOffsetY(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Blur Radius ({shadowBlur}px)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={shadowBlur}
              onChange={(e) => setShadowBlur(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Spread Radius ({shadowSpread}px)</label>
            <input
              type="range"
              min="-50"
              max="50"
              value={shadowSpread}
              onChange={(e) => setShadowSpread(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="inset-shadow"
              checked={shadowInset}
              onChange={(e) => setShadowInset(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="inset-shadow" className="text-gray-300">Inset shadow</label>
          </div>
        </div>
      ),
      generateCSS: () => {
        let css = '.box-with-shadow {\n';
        css += `  box-shadow: ${shadowInset ? 'inset ' : ''}${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor};\n`;
        css += '}';
        return css;
      },
      previewStyle: {
        backgroundColor: '#ffffff',
        boxShadow: `${shadowInset ? 'inset ' : ''}${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}`,
      }
    },
    gradient: {
      id: 'gradient',
      name: 'Gradient Generator',
      description: 'Create linear or radial gradients with custom colors',
      properties: [
        {
          name: 'background',
          value: gradientType === 'linear'
            ? `linear-gradient(${gradientDirection}, ${gradientColor1} ${gradientStop1}%, ${gradientColor2} ${gradientStop2}%)`
            : `radial-gradient(circle, ${gradientColor1} ${gradientStop1}%, ${gradientColor2} ${gradientStop2}%)`
        },
      ],
      controls: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Gradient Type</label>
            <select
              value={gradientType}
              onChange={(e) => setGradientType(e.target.value as 'linear' | 'radial')}
              className="w-full bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600"
            >
              <option value="linear">Linear Gradient</option>
              <option value="radial">Radial Gradient</option>
            </select>
          </div>
          {gradientType === 'linear' && (
            <div>
              <label className="block text-gray-300 mb-2">Direction</label>
              <select
                value={gradientDirection}
                onChange={(e) => setGradientDirection(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600"
              >
                <option value="to right">Left to Right</option>
                <option value="to left">Right to Left</option>
                <option value="to bottom">Top to Bottom</option>
                <option value="to top">Bottom to Top</option>
                <option value="to bottom right">Top Left to Bottom Right</option>
                <option value="to bottom left">Top Right to Bottom Left</option>
                <option value="to top right">Bottom Left to Top Right</option>
                <option value="to top left">Bottom Right to Top Left</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-gray-300 mb-2">Color 1</label>
            <div className="flex">
              <input
                type="color"
                value={gradientColor1}
                onChange={(e) => setGradientColor1(e.target.value)}
                className="h-10 w-10 border-0 p-0 mr-2"
              />
              <input
                type="text"
                value={gradientColor1}
                onChange={(e) => setGradientColor1(e.target.value)}
                className="flex-1 bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Color 2</label>
            <div className="flex">
              <input
                type="color"
                value={gradientColor2}
                onChange={(e) => setGradientColor2(e.target.value)}
                className="h-10 w-10 border-0 p-0 mr-2"
              />
              <input
                type="text"
                value={gradientColor2}
                onChange={(e) => setGradientColor2(e.target.value)}
                className="flex-1 bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Color 1 Stop ({gradientStop1}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={gradientStop1}
              onChange={(e) => setGradientStop1(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Color 2 Stop ({gradientStop2}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={gradientStop2}
              onChange={(e) => setGradientStop2(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      ),
      generateCSS: () => {
        const gradientValue = gradientType === 'linear'
          ? `linear-gradient(${gradientDirection}, ${gradientColor1} ${gradientStop1}%, ${gradientColor2} ${gradientStop2}%)`
          : `radial-gradient(circle, ${gradientColor1} ${gradientStop1}%, ${gradientColor2} ${gradientStop2}%)`;

        let css = '.gradient-background {\n';
        css += `  background: ${gradientValue};\n`;
        css += '}';
        return css;
      },
      previewStyle: {
        width: '100%',
        height: '100%',
        background: gradientType === 'linear'
          ? `linear-gradient(${gradientDirection}, ${gradientColor1} ${gradientStop1}%, ${gradientColor2} ${gradientStop2}%)`
          : `radial-gradient(circle, ${gradientColor1} ${gradientStop1}%, ${gradientColor2} ${gradientStop2}%)`
      }
    }
  };

 
  const adjustColor = (color: string, amount: number): string => {
   
    color = color.replace('#', '');

   
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

   
    const newR = Math.max(0, Math.min(255, r + amount));
    const newG = Math.max(0, Math.min(255, g + amount));
    const newB = Math.max(0, Math.min(255, b + amount));

   
    return '#' +
      newR.toString(16).padStart(2, '0') +
      newG.toString(16).padStart(2, '0') +
      newB.toString(16).padStart(2, '0');
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

 
  const copyToClipboard = () => {
    const css = generators[selectedGenerator].generateCSS();
    navigator.clipboard.writeText(css);
    showNotification('CSS copied to clipboard!', css);
  };

 
  useEffect(() => {
    return () => {
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
      }
    };
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
          CSS Generator
        </h1>
        <section className="text-center">
          <p className="text-xl max-w-3xl mx-auto text-gray-100 font-medium shadow-sm mb-4">
            Generate CSS code for common UI elements, animations, and layouts. Preview in real-time and copy the code directly into your projects.
          </p>
        </section>
      </div>

      {/* CSS Generator Tool */}
      <div className="w-full max-w-6xl mb-10">
        <div className="bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-6 border border-theme-border/30 dark:bg-black/80 dark:border-white/20">
          {/* Generator Selection */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.values(generators).map((generator) => (
              <button
                key={generator.id}
                onClick={() => setSelectedGenerator(generator.id)}
                className={`px-4 py-2 rounded-md font-medium ${selectedGenerator === generator.id ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
              >
                {generator.name}
              </button>
            ))}
          </div>

          {/* Generator Description */}
          <p className="text-gray-300 mb-6">
            {generators[selectedGenerator].description}
          </p>

          {/* Controls and Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-saira text-theme-primary font-semibold mb-4">Customize</h2>
              {generators[selectedGenerator].controls}
            </div>

            {/* Preview */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-saira text-theme-primary font-semibold mb-4">Preview</h2>
              <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 h-64 flex items-center justify-center overflow-visible ${selectedGenerator === 'boxShadow' ? 'bg-gray-700' : ''}`}>
                {selectedGenerator === 'button' ? (
                  <button style={generators[selectedGenerator].previewStyle}>
                    {buttonText}
                  </button>
                ) : selectedGenerator === 'boxShadow' ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div
                      style={{
                        ...generators[selectedGenerator].previewStyle,
                        width: '60%',
                        height: '60%',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        position: 'relative',
                        margin: '30px'
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                        Shadow Preview
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      ...generators[selectedGenerator].previewStyle,
                      width: '100%',
                      height: '100%',
                      borderRadius: '8px'
                    }}
                  ></div>
                )}
              </div>
            </div>
          </div>

          {/* Generated CSS */}
          <div className="mt-6 bg-gray-900 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-saira text-theme-primary font-semibold">Generated CSS</h2>
              <button
                onClick={copyToClipboard}
                className="bg-theme-primary hover:bg-theme-primary/80 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy CSS
              </button>
            </div>
            <pre className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-gray-300 text-sm font-mono overflow-auto max-h-60 custom-scrollbar">
              {generators[selectedGenerator].generateCSS()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSSGeneratorTool;
