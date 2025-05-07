import { useState, useEffect, useRef } from 'react';
import { CopyNotification } from './ColorPaletteGenerator';

interface ConversionOption {
  id: string;
  name: string;
  description: string;
  convert: (text: string) => string;
}

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
}

type ToolCategory = 'case' | 'transform' | 'encode' | 'clean' | 'stats';

const TextCaseConverter = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [selectedTool, setSelectedTool] = useState<string>('uppercase');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('case');
  const [textStats, setTextStats] = useState<TextStats>({ characters: 0, charactersNoSpaces: 0, words: 0, lines: 0, paragraphs: 0 });
  const [notification, setNotification] = useState<{ message: string; content: string; isVisible: boolean }>({
    message: '',
    content: '',
    isVisible: false
  });
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const calculateStats = (text: string): TextStats => {
    if (!text) {
      return { characters: 0, charactersNoSpaces: 0, words: 0, lines: 0, paragraphs: 0 };
    }

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    const paragraphs = text ? text.split(/\r\n\r\n|\r\r|\n\n/).filter(p => p.trim().length > 0).length : 0;

    return { characters, charactersNoSpaces, words, lines, paragraphs };
  };

  const caseConversionOptions: ConversionOption[] = [
    {
      id: 'uppercase',
      name: 'UPPERCASE',
      description: 'Convert all characters to uppercase',
      convert: (text) => text.toUpperCase()
    },
    {
      id: 'lowercase',
      name: 'lowercase',
      description: 'Convert all characters to lowercase',
      convert: (text) => text.toLowerCase()
    },
    {
      id: 'titlecase',
      name: 'Title Case',
      description: 'Capitalize the first letter of each word',
      convert: (text) => {
        return text.replace(/\w\S*/g, (word) => {
          return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
        });
      }
    },
    {
      id: 'sentencecase',
      name: 'Sentence case',
      description: 'Capitalize the first letter of each sentence',
      convert: (text) => {
        return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (match) => {
          return match.toUpperCase();
        });
      }
    },
    {
      id: 'camelcase',
      name: 'camelCase',
      description: 'Remove spaces and capitalize the first letter of each word except the first',
      convert: (text) => {
        return text.toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
          .replace(/^[A-Z]/, (char) => char.toLowerCase());
      }
    },
    {
      id: 'pascalcase',
      name: 'PascalCase',
      description: 'Remove spaces and capitalize the first letter of each word',
      convert: (text) => {
        return text.toLowerCase()
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
          .replace(/[^a-zA-Z0-9]/g, '');
      }
    },
    {
      id: 'snakecase',
      name: 'snake_case',
      description: 'Replace spaces with underscores and convert to lowercase',
      convert: (text) => {
        return text.toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-zA-Z0-9_]/g, '');
      }
    },
    {
      id: 'kebabcase',
      name: 'kebab-case',
      description: 'Replace spaces with hyphens and convert to lowercase',
      convert: (text) => {
        return text.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9-]/g, '');
      }
    },
    {
      id: 'alternatingcase',
      name: 'aLtErNaTiNg CaSe',
      description: 'Alternate between uppercase and lowercase letters',
      convert: (text) => {
        return text.split('').map((char, index) => {
          return index % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
        }).join('');
      }
    },
    {
      id: 'invertcase',
      name: 'InVeRt CaSe',
      description: 'Invert the case of each character',
      convert: (text) => {
        return text.split('').map((char) => {
          return char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase();
        }).join('');
      }
    }
  ];

  const transformOptions: ConversionOption[] = [
    {
      id: 'reverse',
      name: 'Reverse Text',
      description: 'Reverse the order of characters',
      convert: (text) => text.split('').reverse().join('')
    },
    {
      id: 'removeDuplicateLines',
      name: 'Remove Duplicate Lines',
      description: 'Remove duplicate lines, keeping only the first occurrence',
      convert: (text) => {
        const lines = text.split(/\r\n|\r|\n/);
        const uniqueLines = [...new Set(lines)];
        return uniqueLines.join('\n');
      }
    },
    {
      id: 'sortLines',
      name: 'Sort Lines (A-Z)',
      description: 'Sort lines alphabetically',
      convert: (text) => {
        const lines = text.split(/\r\n|\r|\n/);
        return lines.sort().join('\n');
      }
    },
    {
      id: 'sortLinesReverse',
      name: 'Sort Lines (Z-A)',
      description: 'Sort lines in reverse alphabetical order',
      convert: (text) => {
        const lines = text.split(/\r\n|\r|\n/);
        return lines.sort().reverse().join('\n');
      }
    },
    {
      id: 'randomizeLines',
      name: 'Randomize Lines',
      description: 'Randomly shuffle the order of lines',
      convert: (text) => {
        const lines = text.split(/\r\n|\r|\n/);

        for (let i = lines.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [lines[i], lines[j]] = [lines[j], lines[i]];
        }
        return lines.join('\n');
      }
    },
    {
      id: 'countWords',
      name: 'Word Frequency',
      description: 'Count frequency of each word',
      convert: (text) => {
        if (!text.trim()) return '';

        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const wordCount: Record<string, number> = {};

        words.forEach(word => {
          wordCount[word] = (wordCount[word] || 0) + 1;
        });

        return Object.entries(wordCount)
          .sort((a, b) => b[1] - a[1])
          .map(([word, count]) => `${word}: ${count}`)
          .join('\n');
      }
    }
  ];

  const encodeOptions: ConversionOption[] = [
    {
      id: 'urlEncode',
      name: 'URL Encode',
      description: 'Encode text for use in URLs',
      convert: (text) => encodeURIComponent(text)
    },
    {
      id: 'urlDecode',
      name: 'URL Decode',
      description: 'Decode URL-encoded text',
      convert: (text) => {
        try {
          return decodeURIComponent(text);
        } catch (e) {
          return 'Error: Invalid URL-encoded string';
        }
      }
    },
    {
      id: 'base64Encode',
      name: 'Base64 Encode',
      description: 'Encode text to Base64',
      convert: (text) => {

        const utf8Bytes = new TextEncoder().encode(text);
        const base64 = btoa(
          Array.from(utf8Bytes)
            .map(byte => String.fromCharCode(byte))
            .join('')
        );
        return base64;
      }
    },
    {
      id: 'base64Decode',
      name: 'Base64 Decode',
      description: 'Decode Base64-encoded text',
      convert: (text) => {
        try {

          const binary = atob(text);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          return new TextDecoder().decode(bytes);
        } catch (e) {
          return 'Error: Invalid Base64 string';
        }
      }
    },
    {
      id: 'htmlEncode',
      name: 'HTML Encode',
      description: 'Convert characters to HTML entities',
      convert: (text) => {
        const el = document.createElement('div');
        el.textContent = text;
        return el.innerHTML;
      }
    },
    {
      id: 'htmlDecode',
      name: 'HTML Decode',
      description: 'Convert HTML entities to characters',
      convert: (text) => {
        const el = document.createElement('div');
        el.innerHTML = text;
        return el.textContent || '';
      }
    }
  ];

  const cleanOptions: ConversionOption[] = [
    {
      id: 'removeExtraSpaces',
      name: 'Remove Extra Spaces',
      description: 'Replace multiple spaces with a single space',
      convert: (text) => text.replace(/\s+/g, ' ')
    },
    {
      id: 'removeLineBreaks',
      name: 'Remove Line Breaks',
      description: 'Remove all line breaks and join text into a single line',
      convert: (text) => text.replace(/(\r\n|\n|\r)/gm, ' ')
    },
    {
      id: 'trimWhitespace',
      name: 'Trim Whitespace',
      description: 'Remove whitespace from the beginning and end of each line',
      convert: (text) => text.split(/\r\n|\r|\n/).map(line => line.trim()).join('\n')
    },
    {
      id: 'removeEmptyLines',
      name: 'Remove Empty Lines',
      description: 'Remove all empty lines',
      convert: (text) => text.split(/\r\n|\r|\n/).filter(line => line.trim().length > 0).join('\n')
    },
    {
      id: 'removeSpecialChars',
      name: 'Remove Special Characters',
      description: 'Remove all non-alphanumeric characters except spaces',
      convert: (text) => text.replace(/[^a-zA-Z0-9\s]/g, '')
    },
    {
      id: 'removeNumbers',
      name: 'Remove Numbers',
      description: 'Remove all numeric characters',
      convert: (text) => text.replace(/[0-9]/g, '')
    }
  ];

  const getOptionsForCategory = (category: ToolCategory): ConversionOption[] => {
    switch (category) {
      case 'case':
        return caseConversionOptions;
      case 'transform':
        return transformOptions;
      case 'encode':
        return encodeOptions;
      case 'clean':
        return cleanOptions;
      case 'stats':
        return [];
      default:
        return caseConversionOptions;
    }
  };

  useEffect(() => {
    setTextStats(calculateStats(inputText));


    if (selectedCategory === 'stats') {
      setOutputText('');
      return;
    }


    const options = getOptionsForCategory(selectedCategory);
    const selectedOption = options.find(option => option.id === selectedTool);

    if (selectedOption && inputText) {
      setOutputText(selectedOption.convert(inputText));
    } else {
      setOutputText('');
    }
  }, [inputText, selectedTool, selectedCategory]);

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
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      showNotification('Text copied to clipboard!', outputText);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleToolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTool(e.target.value);
  };

  const handleCategoryChange = (category: ToolCategory) => {
    setSelectedCategory(category);
    const options = getOptionsForCategory(category);
    if (options.length > 0) {
      setSelectedTool(options[0].id);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
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

      <CopyNotification
        message={notification.message}
        content={notification.content}
        isVisible={notification.isVisible}
      />


      <div className="w-full max-w-3xl bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-8 border border-theme-border/30 mb-8 dark:bg-black/80 dark:border-white/20">
        <h1 className="text-5xl md:text-6xl font-extrabold font-saira text-theme-primary drop-shadow-lg mb-4 text-center">
          Text Tools
        </h1>
        <section className="text-center">
          <p className="text-xl max-w-3xl mx-auto text-gray-100 font-medium shadow-sm mb-4">
            A comprehensive collection of text manipulation tools. Convert case, transform text, encode/decode, clean up text, and analyze statistics.
          </p>
        </section>
      </div>


      <div className="w-full max-w-6xl mb-10">
        <div className="bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-6 border border-theme-border/30 dark:bg-black/80 dark:border-white/20">
          {/* Tool Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => handleCategoryChange('case')}
              className={`px-4 py-2 rounded-md font-medium ${selectedCategory === 'case' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
            >
              Case Conversion
            </button>
            <button
              onClick={() => handleCategoryChange('transform')}
              className={`px-4 py-2 rounded-md font-medium ${selectedCategory === 'transform' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
            >
              Transform
            </button>
            <button
              onClick={() => handleCategoryChange('encode')}
              className={`px-4 py-2 rounded-md font-medium ${selectedCategory === 'encode' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
            >
              Encode/Decode
            </button>
            <button
              onClick={() => handleCategoryChange('clean')}
              className={`px-4 py-2 rounded-md font-medium ${selectedCategory === 'clean' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
            >
              Clean Text
            </button>
            <button
              onClick={() => handleCategoryChange('stats')}
              className={`px-4 py-2 rounded-md font-medium ${selectedCategory === 'stats' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
            >
              Text Statistics
            </button>
          </div>

          {/* Tool Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {selectedCategory !== 'stats' && (
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Tool</label>
                <select
                  value={selectedTool}
                  onChange={handleToolChange}
                  className="w-full bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600"
                >
                  {getOptionsForCategory(selectedCategory).map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name} - {option.description}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-end">
              <button
                onClick={handleClear}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 w-full"
              >
                Clear Text
              </button>
            </div>
          </div>

          {/* Input/Output Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Area */}
            <div className="flex flex-col">
              <h2 className="text-xl font-saira text-theme-primary font-semibold mb-2">Input Text</h2>
              <textarea
                value={inputText}
                onChange={handleInputChange}
                className="w-full h-64 bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm resize-none border border-gray-700 focus:border-theme-primary focus:outline-none"
                placeholder="Type or paste your text here..."
              />
            </div>

            {/* Output Area */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-saira text-theme-primary font-semibold">Converted Text</h2>
                {outputText && (
                  <button
                    onClick={copyToClipboard}
                    className="text-sm bg-theme-primary hover:bg-theme-primary/80 text-white py-1 px-3 rounded-md transition-all duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                )}
              </div>
              {selectedCategory === 'stats' ? (
                <div className="w-full h-64 bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm overflow-auto border border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-3 rounded-md">
                      <h4 className="text-theme-primary font-medium mb-2">Character Statistics</h4>
                      <p>Characters: {textStats.characters}</p>
                      <p>Characters (no spaces): {textStats.charactersNoSpaces}</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-md">
                      <h4 className="text-theme-primary font-medium mb-2">Word Statistics</h4>
                      <p>Words: {textStats.words}</p>
                      <p>Lines: {textStats.lines}</p>
                      <p>Paragraphs: {textStats.paragraphs}</p>
                    </div>
                    {inputText && (
                      <div className="bg-gray-800 p-3 rounded-md md:col-span-2">
                        <h4 className="text-theme-primary font-medium mb-2">Reading Time</h4>
                        <p>Average reading time: {Math.ceil(textStats.words / 200)} minute(s)</p>
                        <p className="text-xs text-gray-400 mt-1">(Based on average reading speed of 200 words per minute)</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm overflow-auto border border-gray-700">
                  {outputText}
                </div>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-saira text-theme-primary font-semibold mb-3">
              {selectedCategory === 'case' && 'About Text Case Conversion'}
              {selectedCategory === 'transform' && 'About Text Transformation'}
              {selectedCategory === 'encode' && 'About Encoding & Decoding'}
              {selectedCategory === 'clean' && 'About Text Cleaning'}
              {selectedCategory === 'stats' && 'About Text Statistics'}
            </h3>

            {selectedCategory === 'case' && (
              <>
                <p className="text-gray-300 mb-4">
                  Text case conversion is useful for formatting text for different purposes:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li><span className="font-bold">UPPERCASE</span> - Used for headings, emphasis, or acronyms</li>
                  <li><span className="font-bold">lowercase</span> - Common in casual writing or specific stylistic choices</li>
                  <li><span className="font-bold">Title Case</span> - Used for titles, headings, and article names</li>
                  <li><span className="font-bold">camelCase</span> - Common in JavaScript variable naming</li>
                  <li><span className="font-bold">PascalCase</span> - Used for class names in many programming languages</li>
                  <li><span className="font-bold">snake_case</span> - Common in Python and Ruby variable naming</li>
                  <li><span className="font-bold">kebab-case</span> - Often used in URLs and CSS class names</li>
                </ul>
              </>
            )}

            {selectedCategory === 'transform' && (
              <>
                <p className="text-gray-300 mb-4">
                  Text transformation tools help you manipulate and analyze your text in various ways:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li><span className="font-bold">Reverse Text</span> - Reverses the order of characters in your text</li>
                  <li><span className="font-bold">Remove Duplicate Lines</span> - Eliminates repeated lines, keeping only the first occurrence</li>
                  <li><span className="font-bold">Sort Lines</span> - Arranges lines alphabetically or in reverse order</li>
                  <li><span className="font-bold">Randomize Lines</span> - Shuffles the order of lines randomly</li>
                  <li><span className="font-bold">Word Frequency</span> - Counts and displays how often each word appears in your text</li>
                </ul>
              </>
            )}

            {selectedCategory === 'encode' && (
              <>
                <p className="text-gray-300 mb-4">
                  Encoding and decoding tools convert text between different formats:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li><span className="font-bold">URL Encode/Decode</span> - Convert text to and from URL-safe format</li>
                  <li><span className="font-bold">Base64 Encode/Decode</span> - Convert text to and from Base64 format</li>
                  <li><span className="font-bold">HTML Encode/Decode</span> - Convert text to and from HTML entities</li>
                </ul>
              </>
            )}

            {selectedCategory === 'clean' && (
              <>
                <p className="text-gray-300 mb-4">
                  Text cleaning tools help you format and sanitize your text:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li><span className="font-bold">Remove Extra Spaces</span> - Replace multiple spaces with a single space</li>
                  <li><span className="font-bold">Remove Line Breaks</span> - Join all text into a single line</li>
                  <li><span className="font-bold">Trim Whitespace</span> - Remove leading and trailing spaces from each line</li>
                  <li><span className="font-bold">Remove Empty Lines</span> - Delete all blank lines from your text</li>
                  <li><span className="font-bold">Remove Special Characters</span> - Keep only alphanumeric characters and spaces</li>
                  <li><span className="font-bold">Remove Numbers</span> - Delete all numeric characters from your text</li>
                </ul>
              </>
            )}

            {selectedCategory === 'stats' && (
              <>
                <p className="text-gray-300 mb-4">
                  Text statistics provide insights about your text:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li><span className="font-bold">Character Count</span> - Total number of characters in your text</li>
                  <li><span className="font-bold">Character Count (no spaces)</span> - Number of characters excluding spaces</li>
                  <li><span className="font-bold">Word Count</span> - Total number of words in your text</li>
                  <li><span className="font-bold">Line Count</span> - Number of lines in your text</li>
                  <li><span className="font-bold">Paragraph Count</span> - Number of paragraphs in your text</li>
                  <li><span className="font-bold">Reading Time</span> - Estimated time to read the text based on average reading speed</li>
                </ul>
              </>
            )}

            <p className="text-gray-300">
              Simply type or paste your text in the input area, select your desired tool, and the result will appear in the output area.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextCaseConverter;
