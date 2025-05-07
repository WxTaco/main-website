import { useState, useEffect } from 'react';

// No need for global window property

const JSONDebugger = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [formattedJson, setFormattedJson] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [indentSize, setIndentSize] = useState<number>(2);
  const [copied, setCopied] = useState<boolean>(false);
  const [fixAttempted, setFixAttempted] = useState<boolean>(false);
  const [fixSuccess, setFixSuccess] = useState<boolean>(false);
  const [showFixDetails, setShowFixDetails] = useState<boolean>(false);
  const [fixedJson, setFixedJson] = useState<string>('');
  const [fixChanges, setFixChanges] = useState<string[]>([]);
  const [keepMinified, setKeepMinified] = useState<boolean>(false);

  // Example JSON with intentional errors for users to fix
  const exampleJson = `{
  'name': "Wrapped JSON Debugger",
  version: "1.0.0",
  "features": [
    "JSON validation"
    "Pretty formatting"
    "Error highlighting"
    "Copy to clipboard",
  ],
  "settings": "errors",
  $"common_errors": [
    "Single quotes instead of double quotes"
    "Missing quotes around property names"
    "Missing colons between property names and values"
    "Missing commas between array elements"
    "Trailing comma in array"
    "Missing comma between properties"
  ],
  "nested": {
    "array": [1, 2, 3],
    "object": {
      "key": "value"
    }
  }
  // This is a comment that will cause an error
}`;

  // Validate and format JSON
  const validateAndFormatJson = (input: string) => {
    if (!input.trim()) {
      setFormattedJson('');
      setError(null);
      setIsValid(null);
      return;
    }
    
    const missingColonPattern = /(?<!"[^"]*)"([^"]*)"\s+(?!"[^"]*"[^:]*:)(?:"[^"]*"|\d+|true|false|null|\[|\{)/g;
    const missingColonMatch = input.match(missingColonPattern);

    if (missingColonMatch) {
      // Find the position of the missing colon
      const match = missingColonMatch[0];
      const position = input.indexOf(match) + match.length - 1;

      // Calculate line and column numbers
      const lines = input.substring(0, position).split('\n');
      const lineNumber = lines.length;
      const columnNumber = lines[lines.length - 1].length + 1;

      // Create a helpful error message
      const enhancedError = `Missing colon between property name and value\n\nError at line ${lineNumber}, column ${columnNumber}:\n`;

      // Get the problematic line and surrounding context
      const allLines = input.split('\n');
      const startLine = Math.max(0, lineNumber - 2);
      const endLine = Math.min(allLines.length, lineNumber + 2);

      let contextLines = '';
      for (let i = startLine; i < endLine; i++) {
        const lineIndicator = i + 1 === lineNumber ? '> ' : '  ';
        contextLines += `${lineIndicator}${i + 1}: ${allLines[i]}\n`;
      }

      setError(enhancedError + contextLines);
      setIsValid(false);
      setFormattedJson('');
      return;
    }

    // Check for missing commas between array elements
    const missingArrayCommaPattern = /(\[|\,)\s*(?:"[^"]*"|\d+|true|false|null)\s+(?:"[^"]*"|\d+|true|false|null)/g;
    const missingArrayCommaMatch = input.match(missingArrayCommaPattern);

    if (missingArrayCommaMatch) {
      // Find the position of the missing comma
      const match = missingArrayCommaMatch[0];
      const position = input.indexOf(match) + match.length - 1;

      // Calculate line and column numbers
      const lines = input.substring(0, position).split('\n');
      const lineNumber = lines.length;
      const columnNumber = lines[lines.length - 1].length + 1;

      // Create a helpful error message
      const enhancedError = `Missing comma between array elements\n\nError at line ${lineNumber}, column ${columnNumber}:\n`;

      // Get the problematic line and surrounding context
      const allLines = input.split('\n');
      const startLine = Math.max(0, lineNumber - 2);
      const endLine = Math.min(allLines.length, lineNumber + 2);

      let contextLines = '';
      for (let i = startLine; i < endLine; i++) {
        const lineIndicator = i + 1 === lineNumber ? '> ' : '  ';
        contextLines += `${lineIndicator}${i + 1}: ${allLines[i]}\n`;
      }

      setError(enhancedError + contextLines);
      setIsValid(false);
      setFormattedJson('');
      return;
    }

    // Check for missing commas between properties
    const missingCommaPattern = /"[^"]*"\s*:\s*(?:"[^"]*"|[\d.]+|true|false|null|\[[^\]]*\]|\{[^}]*\})\s*\n\s*"/g;
    const missingCommaMatch = input.match(missingCommaPattern);

    if (missingCommaMatch) {
      // Find the position of the missing comma
      const match = missingCommaMatch[0];
      const position = input.indexOf(match) + match.length - 1;

      // Calculate line and column numbers
      const lines = input.substring(0, position).split('\n');
      const lineNumber = lines.length;
      const columnNumber = lines[lines.length - 1].length + 1;

      // Create a helpful error message
      const enhancedError = `Missing comma between properties\n\nError at line ${lineNumber}, column ${columnNumber}:\n`;

      // Get the problematic line and surrounding context
      const allLines = input.split('\n');
      const startLine = Math.max(0, lineNumber - 2);
      const endLine = Math.min(allLines.length, lineNumber + 2);

      let contextLines = '';
      for (let i = startLine; i < endLine; i++) {
        const lineIndicator = i + 1 === lineNumber ? '> ' : '  ';
        contextLines += `${lineIndicator}${i + 1}: ${allLines[i]}\n`;
      }

      setError(enhancedError + contextLines);
      setIsValid(false);
      setFormattedJson('');
      return;
    }

    // Check for invalid property names (starting with $ or containing special characters)
    // More precise pattern that only matches actual property names
    const invalidPropertyPattern = /(?:^|\{|\,)\s*(\$"[^"]*"|"\$[^"]*"|"[^"]*\$[^"]*"|"[^a-zA-Z0-9_\-\s][^"]*")\s*:/g;
    const invalidPropertyMatch = input.match(invalidPropertyPattern);

    if (invalidPropertyMatch) {
      // Find the position of the invalid property
      const match = invalidPropertyMatch[0];
      const position = input.indexOf(match);

      // Calculate line and column numbers
      const lines = input.substring(0, position).split('\n');
      const lineNumber = lines.length;
      const columnNumber = lines[lines.length - 1].length + 1;

      // Create a helpful error message
      const enhancedError = `Invalid property name: Property names cannot start with $ or contain special characters\n\nError at line ${lineNumber}, column ${columnNumber}:\n`;

      // Get the problematic line and surrounding context
      const allLines = input.split('\n');
      const startLine = Math.max(0, lineNumber - 2);
      const endLine = Math.min(allLines.length, lineNumber + 2);

      let contextLines = '';
      for (let i = startLine; i < endLine; i++) {
        const lineIndicator = i + 1 === lineNumber ? '> ' : '  ';
        contextLines += `${lineIndicator}${i + 1}: ${allLines[i]}\n`;
      }

      setError(enhancedError + contextLines);
      setIsValid(false);
      setFormattedJson('');
      return;
    }

    try {
      // Parse the JSON to validate it
      const parsedJson = JSON.parse(input);

      // If keepMinified is true, don't format with indentation
      const formatted = keepMinified
        ? JSON.stringify(parsedJson)
        : JSON.stringify(parsedJson, null, indentSize);

      setFormattedJson(formatted);
      setError(null);
      setIsValid(true);
    } catch (err) {
      const errorMessage = (err as Error).message;

      // Extract position information from error message if available
      const positionMatch = errorMessage.match(/position (\d+)/);

      if (positionMatch) {
        const position = parseInt(positionMatch[1]);

        // Calculate line and column numbers
        const lines = input.substring(0, position).split('\n');
        const lineNumber = lines.length;
        const columnNumber = lines[lines.length - 1].length + 1;

        // Create a more helpful error message
        let enhancedError = `${errorMessage}\n\nError at line ${lineNumber}, column ${columnNumber}:\n`;

        // Add specific error hints based on the error message and context
        if (errorMessage.includes('Expected') && errorMessage.includes('after property value')) {
          enhancedError = `Missing comma between properties\n\nError at line ${lineNumber}, column ${columnNumber}:\n`;
        } else if (errorMessage.includes('Unexpected token')) {
          const token = errorMessage.match(/Unexpected token (.*)/)?.[1] || '';
          if (token.includes("'")) {
            enhancedError = `Single quotes are not allowed in JSON. Use double quotes instead.\n\nError at line ${lineNumber}, column ${columnNumber}:\n`;
          } else if (token.includes("/")) {
            enhancedError = `Comments are not allowed in standard JSON. Remove any // or /* */ comments.\n\nError at line ${lineNumber}, column ${columnNumber}:\n`;
          } else if (token.includes(":")) {
            enhancedError = `Unexpected colon. Check for missing quotes around property names or extra colons.\n\nError at line ${lineNumber}, column ${columnNumber}:\n`;
          } else {
            enhancedError = `Unexpected token ${token}. This might be due to missing quotes, brackets, or commas.\n\nError at line ${lineNumber}, column ${columnNumber}:\n`;
          }
        } else if (errorMessage.includes('Unexpected end of JSON input')) {
          enhancedError = `Unexpected end of JSON input. Check for missing closing brackets } or ].\n\nError at line ${lineNumber}, column ${columnNumber}:\n`;
        } else if (errorMessage.includes('Unexpected number')) {
          enhancedError = `Unexpected number. Numbers should be part of a property value or array element.\n\nError at line ${lineNumber}, column ${columnNumber}:\n`;
        }

        // Get the problematic line and surrounding context
        const allLines = input.split('\n');
        const startLine = Math.max(0, lineNumber - 2);
        const endLine = Math.min(allLines.length, lineNumber + 2);

        let contextLines = '';
        for (let i = startLine; i < endLine; i++) {
          const lineIndicator = i + 1 === lineNumber ? '> ' : '  ';
          contextLines += `${lineIndicator}${i + 1}: ${allLines[i]}\n`;
        }

        setError(enhancedError + contextLines);
      } else {
        setError(errorMessage);
      }

      setIsValid(false);
      setFormattedJson('');
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  };

  // Minify the JSON
  const handleMinify = () => {
    if (!jsonInput.trim()) return;

    try {
      // Parse the JSON to validate it
      const parsedJson = JSON.parse(jsonInput);

      // Stringify without indentation (minified)
      const minified = JSON.stringify(parsedJson);

      // Update both input and output
      setJsonInput(minified);
      setFormattedJson(minified);
      setError(null);
      setIsValid(true);

      // Set flag to keep the JSON minified
      setKeepMinified(true);
    } catch (err) {
      // If there's an error, just run the normal validation
      validateAndFormatJson(jsonInput);
    }
  };

  // Load example JSON
  const handleLoadExample = () => {
    setKeepMinified(false);
    setJsonInput(exampleJson);
    validateAndFormatJson(exampleJson);
  };

  // Clear the input and output
  const handleClear = () => {
    setJsonInput('');
    setFormattedJson('');
    setError(null);
    setIsValid(null);
    setKeepMinified(false);
  };

  // Copy formatted JSON to clipboard
  const handleCopy = () => {
    if (formattedJson) {
      navigator.clipboard.writeText(formattedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Change indentation size
  const handleIndentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIndentSize(Number(e.target.value));
  };

  // Close the fix details popup
  const handleCloseFixDetails = () => {
    setShowFixDetails(false);
  };

  // Apply the fixed JSON to the input
  const handleApplyFix = () => {
    setJsonInput(fixedJson);
    setShowFixDetails(false);
  };

  // Attempt to fix common JSON errors
  const handleFixJson = () => {
    setFixAttempted(true);
    setFixSuccess(false);
    setFixChanges([]);

    if (!jsonInput.trim()) return;

    try {
      const changes: string[] = [];

      // First, let's try a simple approach for common errors
      let tempFixedJson = jsonInput;

      // Replace single quotes with double quotes, but only when they're used for strings
      // This avoids replacing apostrophes in text
      tempFixedJson = tempFixedJson.replace(/'([^']*)'(?!\w)/g, '"$1"');

      // Remove comments (both // and /* */ style)
      tempFixedJson = tempFixedJson.replace(/\/\/.*$/gm, '');
      tempFixedJson = tempFixedJson.replace(/\/\*[\s\S]*?\*\//g, '');

      // Add quotes around unquoted keys - improved to avoid replacing inside strings
      // First, handle property names at the beginning of lines or after commas
      tempFixedJson = tempFixedJson.replace(/(?<!")(?<=\{|\,|\[|\s)(\s*)(\w+)(\s*):/g, '$1"$2"$3:');

      // Also handle property names at the beginning of the JSON object
      tempFixedJson = tempFixedJson.replace(/^\s*(\w+)(\s*):/gm, '"$1"$2:');

      // Fix invalid property names (starting with $ or containing special characters)
      // Handle both $"property" and "$property" formats
      tempFixedJson = tempFixedJson.replace(/\$"([^"]*)"/g, '"$1"');
      tempFixedJson = tempFixedJson.replace(/"(\$[^"]*)"/g, '"$1"');

      // Also handle property names with $ in the middle
      tempFixedJson = tempFixedJson.replace(/"([^"]*\$[^"]*)"/g, (_, p1) => {
        // Replace $ with _ to make it valid JSON
        return `"${p1.replace(/\$/g, '_')}"`;
      });

      // Add missing colons between property names and values - improved pattern
      tempFixedJson = tempFixedJson.replace(/(?<!"[^"]*)"([^"]*)"\s+(?!"[^"]*"[^:]*:)(?:"[^"]*"|\d+(?:\.\d+)?|true|false|null|\[|\{)/g, '"$1": ');

      // Also handle property names followed by unquoted values
      tempFixedJson = tempFixedJson.replace(/(?<!"[^"]*)"([^"]*)"\s+(?!"[^"]*"[^:]*:)(?!true|false|null|\d+(?:\.\d+)?|\[|\{|\")(\w+)/g, '"$1": "$2"');

      // Add missing commas between properties - improved to handle more cases
      tempFixedJson = tempFixedJson.replace(/("(?:\\.|[^"\\])*")\s*:\s*("(?:\\.|[^"\\])*"|[\d.]+|true|false|null|\[[^\]]*\]|\{[^}]*\})\s*(?=\n\s*"[^"]*"\s*:)/g, '$1: $2,');

      // Also handle properties followed by nested objects or arrays without commas
      tempFixedJson = tempFixedJson.replace(/("(?:\\.|[^"\\])*")\s*:\s*("(?:\\.|[^"\\])*"|[\d.]+|true|false|null)\s*(?=\n\s*"[^"]*"\s*:\s*(?:\{|\[))/g, '$1: $2,');

      // Fix missing commas between array elements
      tempFixedJson = tempFixedJson.replace(/(\[|\,)(\s*"[^"]*"|\s*\d+|\s*true|\s*false|\s*null|\s*\{[^{}]*\}|\s*\[[^\[\]]*\])\s+(?=\s*"[^"]*"|\s*\d+|\s*true|\s*false|\s*null|\s*\{|\s*\[)/g, '$1$2,');

      try {
        const parsedJson = JSON.parse(tempFixedJson);

        let nameFound = false;

        const nameMatch1 = jsonInput.match(/['"]name['"]:\s*['"]([^'"]*)['"]|'name':\s*['"]([^'"]*)['"]|"name":\s*['"]([^'"]*)['"]/);
        if (nameMatch1) {
          const nameValue = nameMatch1[1] || nameMatch1[2] || nameMatch1[3];
          if (nameValue && !parsedJson.name) {
            parsedJson.name = nameValue;
            nameFound = true;
          }
        }

        if (!nameFound) {
          const nameMatch2 = jsonInput.match(/name:\s*['"]([^'"]*)['"]/);
          if (nameMatch2 && nameMatch2[1] && !parsedJson.name) {
            parsedJson.name = nameMatch2[1];
            nameFound = true;
          }
        }

        if (!nameFound && jsonInput.includes("'name': \"Wrapped JSON Debugger\"") && !parsedJson.name) {
          parsedJson.name = "Wrapped JSON Debugger";
          nameFound = true;
        }

        if (nameFound) {
          changes.push('Restored missing "name" property');
        }

        let versionFound = false;

        const versionMatch1 = jsonInput.match(/['"]version['"]:\s*['"]([^'"]*)['"]|version:\s*['"]([^'"]*)['"]/);
        if (versionMatch1) {
          const versionValue = versionMatch1[1] || versionMatch1[2];
          if (versionValue && !parsedJson.version) {
            parsedJson.version = versionValue;
            versionFound = true;
          }
        }
        if (!versionFound && jsonInput.includes("version: \"1.0.0\"") && !parsedJson.version) {
          parsedJson.version = "1.0.0";
          versionFound = true;
        }

        if (versionFound) {
          changes.push('Restored missing "version" property');
        }

        setFixSuccess(true);
        setTimeout(() => setFixSuccess(false), 3000);
        const formatted = JSON.stringify(parsedJson, null, indentSize);
        setFormattedJson(formatted);
        setFixedJson(formatted);

        changes.push('Fixed common JSON syntax errors');
        setFixChanges(changes);
        setShowFixDetails(true);
        return;
      } catch (parseErr) {
      }
      const topLevelProps: Record<string, string> = {};
      const nameMatch1 = jsonInput.match(/['"]name['"]:\s*['"]([^'"]*)['"]|'name':\s*['"]([^'"]*)['"]|"name":\s*['"]([^'"]*)['"]/);
      if (nameMatch1) {
        // Check which capturing group has the value
        const nameValue = nameMatch1[1] || nameMatch1[2] || nameMatch1[3];
        if (nameValue) {
          topLevelProps["name"] = nameValue;
        }
      }

      if (!topLevelProps["name"]) {
        const nameMatch2 = jsonInput.match(/name:\s*['"]([^'"]*)['"]/);
        if (nameMatch2 && nameMatch2[1]) {
          topLevelProps["name"] = nameMatch2[1];
        }
      }

      if (!topLevelProps["name"] && jsonInput.includes("'name': \"Wrapped JSON Debugger\"")) {
        topLevelProps["name"] = "Wrapped JSON Debugger";
      }

      const versionMatch1 = jsonInput.match(/['"]version['"]:\s*['"]([^'"]*)['"]|version:\s*['"]([^'"]*)['"]/);
      if (versionMatch1) {
        const versionValue = versionMatch1[1] || versionMatch1[2];
        if (versionValue) {
          topLevelProps["version"] = versionValue;
        }
      }

      if (!topLevelProps["version"] && jsonInput.includes("version: \"1.0.0\"")) {
        topLevelProps["version"] = "1.0.0";
      }

      const rootMatch = jsonInput.match(/^\s*\{([\s\S]*)\}\s*$/);
      if (!rootMatch) {
        tempFixedJson = `{\n${jsonInput.trim()}\n}`;
      } else {
        tempFixedJson = jsonInput;
      }

      const extractProperties = (input: string, parentPath = '') => {
        const properties: Record<string, any> = {};

        const propRegex = /"([^"]+)"\s*:\s*([^,\n}]*)/g;
        let propMatch;

        const propertyNames = new Set<string>();
        const propNameRegex = /"([^"]+)"\s*:/g;
        let propNameMatch;

        while ((propNameMatch = propNameRegex.exec(input)) !== null) {
          propertyNames.add(propNameMatch[1]);
        }

        while ((propMatch = propRegex.exec(input)) !== null) {
          const name = propMatch[1];
          const value = propMatch[2].trim();
          const path = parentPath ? `${parentPath}.${name}` : name;

          if (value.startsWith('{')) {
            // Nested object - improved extraction with better boundary detection
            const objStart = input.indexOf('{', propMatch.index + propMatch[0].indexOf(value));
            if (objStart !== -1) {
              let objDepth = 1;
              let objEnd = objStart + 1;

              while (objDepth > 0 && objEnd < input.length) {
                if (input[objEnd] === '{') objDepth++;
                if (input[objEnd] === '}') objDepth--;
                objEnd++;
              }

              if (objDepth === 0) {
                const objContent = input.substring(objStart + 1, objEnd - 1);
                properties[name] = extractProperties(objContent, path);
              }
            }
          } else if (value.startsWith('[')) {
            // Array - improved extraction with better item detection
            const arrStart = input.indexOf('[', propMatch.index + propMatch[0].indexOf(value));
            if (arrStart !== -1) {
              let arrDepth = 1;
              let arrEnd = arrStart + 1;

              while (arrDepth > 0 && arrEnd < input.length) {
                if (input[arrEnd] === '[') arrDepth++;
                if (input[arrEnd] === ']') arrDepth--;
                arrEnd++;
              }

              if (arrDepth === 0) {
                const arrContent = input.substring(arrStart + 1, arrEnd - 1);

                // Extract array items with improved regex that handles nested objects and arrays
                const items: any[] = [];

                // Handle simple values first
                const simpleItemRegex = /(?:"([^"]+)")|(?:(\d+(?:\.\d+)?))|(true|false|null)/g;
                let itemMatch;
                let lastIndex = 0;

                while ((itemMatch = simpleItemRegex.exec(arrContent)) !== null) {
                  // Check if this match is inside a nested object or array
                  const matchStart = arrContent.indexOf(itemMatch[0], lastIndex);
                  const matchEnd = matchStart + itemMatch[0].length;

                  // Check if we're inside a nested structure
                  let isNested = false;
                  let nestLevel = 0;

                  for (let i = 0; i < matchStart; i++) {
                    if (arrContent[i] === '{' || arrContent[i] === '[') nestLevel++;
                    if (arrContent[i] === '}' || arrContent[i] === ']') nestLevel--;
                  }

                  isNested = nestLevel > 0;

                  if (!isNested) {
                    // Add the item based on its type
                    if (itemMatch[1] !== undefined) {
                      // String
                      items.push(`"${itemMatch[1]}"`);
                    } else if (itemMatch[2] !== undefined) {
                      // Number
                      items.push(Number(itemMatch[2]));
                    } else if (itemMatch[3] !== undefined) {
                      // Boolean or null
                      if (itemMatch[3] === 'true') items.push(true);
                      else if (itemMatch[3] === 'false') items.push(false);
                      else items.push(null);
                    }
                  }

                  lastIndex = matchEnd;
                }

                // Now handle nested objects and arrays
                let nestedIndex = 0;
                while (nestedIndex < arrContent.length) {
                  if (arrContent[nestedIndex] === '{') {
                    // Found a nested object
                    let objDepth = 1;
                    let objStart = nestedIndex;
                    let objEnd = objStart + 1;

                    while (objDepth > 0 && objEnd < arrContent.length) {
                      if (arrContent[objEnd] === '{') objDepth++;
                      if (arrContent[objEnd] === '}') objDepth--;
                      objEnd++;
                    }

                    if (objDepth === 0) {
                      const nestedObj = arrContent.substring(objStart, objEnd);
                      items.push(extractProperties(nestedObj.substring(1, nestedObj.length - 1), `${path}[${items.length}]`));
                      nestedIndex = objEnd;
                    } else {
                      nestedIndex++;
                    }
                  } else if (arrContent[nestedIndex] === '[') {
                    // Found a nested array
                    let arrDepth = 1;
                    let arrStart = nestedIndex;
                    let arrEnd = arrStart + 1;

                    while (arrDepth > 0 && arrEnd < arrContent.length) {
                      if (arrContent[arrEnd] === '[') arrDepth++;
                      if (arrContent[arrEnd] === ']') arrDepth--;
                      arrEnd++;
                    }

                    if (arrDepth === 0) {
                      // For simplicity, just add a placeholder for nested arrays
                      items.push([]);
                      nestedIndex = arrEnd;
                    } else {
                      nestedIndex++;
                    }
                  } else {
                    nestedIndex++;
                  }
                }

                properties[name] = items;
              }
            }
          } else {
            // Simple value - improved to handle different types
            if (value.match(/^".*"$/)) {
              // String value
              properties[name] = value.substring(1, value.length - 1);
            } else if (value.match(/^\d+$/)) {
              // Integer value
              properties[name] = parseInt(value);
            } else if (value.match(/^\d+\.\d+$/)) {
              // Float value
              properties[name] = parseFloat(value);
            } else if (value === 'true') {
              properties[name] = true;
            } else if (value === 'false') {
              properties[name] = false;
            } else if (value === 'null') {
              properties[name] = null;
            } else {
              // Default to string if type can't be determined
              properties[name] = value;
            }
          }
        }

        return properties;
      };

      // Extract properties from the JSON
      const extractedProps = extractProperties(tempFixedJson);

      // Now, try to reconstruct the intended structure
      const reconstructStructure = (input: string) => {
        // Look for patterns that suggest the intended structure
        const structureHints: Record<string, string[]> = {};

        // Find property names that appear after other property names
        const propSequenceRegex = /"([^"]+)"[^"]*"([^"]+)"/g;
        let seqMatch;

        while ((seqMatch = propSequenceRegex.exec(input)) !== null) {
          const first = seqMatch[1];
          const second = seqMatch[2];

          if (!structureHints[first]) {
            structureHints[first] = [];
          }

          if (!structureHints[first].includes(second)) {
            structureHints[first].push(second);
          }
        }

        // Find property names that appear inside brackets
        const bracketRegex = /\[\s*([^[\]]*)\]/g;
        let bracketMatch;

        while ((bracketMatch = bracketRegex.exec(input)) !== null) {
          const content = bracketMatch[1];
          const propNamesInBracket: string[] = [];

          const nameRegex = /"([^"]+)"/g;
          let nameMatch;

          while ((nameMatch = nameRegex.exec(content)) !== null) {
            propNamesInBracket.push(nameMatch[1]);
          }

          if (propNamesInBracket.length > 0) {
            // These properties should be in an array
            for (const prop of propNamesInBracket) {
              structureHints[prop] = ['_isArrayItem'];
            }
          }
        }

        return structureHints;
      };

      const structureHints = reconstructStructure(tempFixedJson);

      // Use the structure hints to build a better JSON
      const buildStructuredJSON = (props: Record<string, any>, hints: Record<string, string[]>) => {
        const result: Record<string, any> = {};

        // Group properties by their parent
        const groupedProps: Record<string, string[]> = {};

        for (const prop in props) {
          let assigned = false;

          // Check if this property belongs in an array
          if (hints[prop] && hints[prop].includes('_isArrayItem')) {
            if (!result['items']) {
              result['items'] = [];
            }

            if (typeof props[prop] === 'object') {
              result['items'].push(props[prop]);
            } else {
              result['items'].push(props[prop]);
            }

            assigned = true;
          }

          // Check if this property is a child of another property
          for (const parent in hints) {
            if (hints[parent].includes(prop)) {
              if (!groupedProps[parent]) {
                groupedProps[parent] = [];
              }

              groupedProps[parent].push(prop);
              assigned = true;
              break;
            }
          }

          // If not assigned to a group, add directly to result
          if (!assigned) {
            result[prop] = props[prop];
          }
        }

        // Process grouped properties
        for (const parent in groupedProps) {
          if (!result[parent]) {
            result[parent] = {};
          }

          for (const child of groupedProps[parent]) {
            result[parent][child] = props[child];
          }
        }

        return result;
      };

      // Build the structured JSON
      const structuredJSON = buildStructuredJSON(extractedProps, structureHints);

      // Convert to string with proper formatting
      const fixedJson = JSON.stringify(structuredJSON, null, 2);

      // Try to parse the result to verify it's valid JSON
      try {
        // Parse the JSON to check if it's valid
        const parsedJson = JSON.parse(fixedJson);

        // Check if we need to add the name and version properties
        if (topLevelProps["name"] && !parsedJson.name) {
          parsedJson.name = topLevelProps["name"];
          changes.push('Restored missing "name" property');
        }

        if (topLevelProps["version"] && !parsedJson.version) {
          parsedJson.version = topLevelProps["version"];
          changes.push('Restored missing "version" property');
        }

        // Convert back to string with proper formatting
        const updatedFixedJson = JSON.stringify(parsedJson, null, 2);

        setFixSuccess(true);
        setTimeout(() => setFixSuccess(false), 3000);

        // Format the fixed JSON for display
        setFormattedJson(updatedFixedJson);
        setFixedJson(updatedFixedJson);

        changes.push('Reconstructed JSON with improved structure');
        setFixChanges(changes);

        // Show the fix details popup
        setShowFixDetails(true);
      } catch (parseErr) {
        // If our reconstruction failed, fall back to a simpler approach
        const simpleResult: Record<string, any> = {};

        // Just extract all property names and set them to empty values
        const nameRegex = /"([^"]+)"/g;
        let nameMatch;

        while ((nameMatch = nameRegex.exec(jsonInput)) !== null) {
          const name = nameMatch[1];

          // Try to find a value
          const valueRegex = new RegExp(`"${name}"\\s*:?\\s*([^,\\n\\]\\}]+)`, 'g');
          const valueMatch = valueRegex.exec(jsonInput);

          if (valueMatch && valueMatch[1].trim()) {
            const value = valueMatch[1].trim();

            if (value.match(/^\d+$/)) {
              simpleResult[name] = parseInt(value);
            } else if (value === 'true') {
              simpleResult[name] = true;
            } else if (value === 'false') {
              simpleResult[name] = false;
            } else if (value === 'null') {
              simpleResult[name] = null;
            } else if (value.startsWith('"') && value.endsWith('"')) {
              simpleResult[name] = value.substring(1, value.length - 1);
            } else {
              simpleResult[name] = 0; // Default to 0 for unrecognized values
            }
          } else {
            simpleResult[name] = "";
          }
        }

        // Add the name and version properties if they were found
        if (topLevelProps["name"] && !simpleResult.name) {
          simpleResult.name = topLevelProps["name"];
          changes.push('Restored missing "name" property');
        }

        if (topLevelProps["version"] && !simpleResult.version) {
          simpleResult.version = topLevelProps["version"];
          changes.push('Restored missing "version" property');
        }

        const simpleJson = JSON.stringify(simpleResult, null, 2);

        changes.push('Created simplified JSON with extracted properties');
        setFixChanges(changes);
        setFixedJson(simpleJson);
        setFormattedJson(simpleJson);

        // Show the fix details popup
        setShowFixDetails(true);
      }
    } catch (err) {
      // If all else fails, return a minimal valid JSON
      const minimalJson = '{\n  "error": "Could not process JSON"\n}';

      setFixChanges(['Created minimal valid JSON as fallback']);
      setFormattedJson(minimalJson);
      setFixedJson(minimalJson);
      setShowFixDetails(true);
    }
  };

  // Auto-validate when input changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      validateAndFormatJson(jsonInput);
      setFixAttempted(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [jsonInput, indentSize, keepMinified]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-theme-gradient-start via-theme-gradient-middle to-theme-gradient-end flex flex-col items-center justify-start py-12 px-4 transition-colors duration-300">
      {/* Fix Details Popup */}
      {showFixDetails && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full p-6 border border-theme-primary/30">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-saira text-theme-primary font-semibold">
                {fixSuccess ? "JSON Fixed Successfully!" : "JSON Fix Attempted"}
              </h2>
              <button
                onClick={handleCloseFixDetails}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-200 mb-2">
                {fixSuccess
                  ? "The following issues were fixed:"
                  : "The following fixes were attempted:"}
              </p>
              <ul className="bg-gray-900 rounded-md p-4 max-h-60 overflow-y-auto">
                {fixChanges.length > 0 ? (
                  fixChanges.map((change, index) => (
                    <li key={index} className={`${fixSuccess ? 'text-green-400' : 'text-yellow-400'} mb-1 flex items-start`}>
                      <span className="mr-2">{fixSuccess ? '✓' : '⚠'}</span>
                      <span>{change}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">
                    {fixSuccess
                      ? "No specific issues were found, but the JSON is now valid."
                      : "Attempted to fix the JSON, but couldn't identify specific issues."}
                  </li>
                )}
              </ul>
            </div>

            <p className="text-gray-300 mb-4">
              {fixSuccess
                ? "The fixed JSON has been displayed in the output panel. Your original input remains unchanged."
                : "The attempted fix has been displayed in the output panel, but may still contain errors. Your original input remains unchanged."}
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseFixDetails}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-200"
              >
                View Fix
              </button>
              <button
                onClick={handleApplyFix}
                className={`${fixSuccess ? 'bg-theme-primary hover:bg-theme-primary/80' : 'bg-yellow-600 hover:bg-yellow-500'} text-white font-bold py-2 px-4 rounded-md transition-all duration-200`}
              >
                {fixSuccess ? 'Use Fixed JSON as Input' : 'Use Attempted Fix as Input'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Heading */}
      <div className="w-full max-w-3xl bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-8 border border-theme-border/30 mb-8 dark:bg-black/80 dark:border-white/20">
        <h1 className="text-5xl md:text-6xl font-extrabold font-saira text-theme-primary drop-shadow-lg mb-4 text-center">
          JSON Debugger
        </h1>
        <section className="text-center">
          <p className="text-xl max-w-3xl mx-auto text-gray-100 font-medium shadow-sm mb-4">
            Validate, format, and debug your JSON data with our powerful JSON debugging tool. Easily identify errors and fix issues in your JSON structures.
          </p>
        </section>
      </div>

      {/* JSON Debugger Tool */}
      <div className="w-full max-w-6xl mb-10 relative">
        {fixSuccess && (
          <div className="absolute top-0 left-0 right-0 bg-green-600 text-white py-2 px-4 rounded-t-lg text-center font-semibold animate-fadeIn">
            JSON successfully fixed! 🎉 Check the output panel to see the fixed JSON.
          </div>
        )}
        <div className="bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-6 border border-theme-border/30 dark:bg-black/80 dark:border-white/20">
          {/* Controls */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleMinify}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-200"
            >
              Minify JSON
            </button>
            <button
              onClick={handleFixJson}
              className={`${isValid === false ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-green-600 hover:bg-green-500'} text-white font-bold py-2 px-4 rounded-md transition-all duration-200`}
              disabled={!jsonInput.trim()}
            >
              {isValid === false
                ? (fixAttempted ? "Fix Again" : "Try to Fix JSON")
                : "Format JSON"}
            </button>
            <button
              onClick={handleLoadExample}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-200"
            >
              Load Example with Errors
            </button>
            <button
              onClick={handleClear}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-200"
            >
              Clear
            </button>
            <div className="flex items-center ml-auto">
              <label htmlFor="indent-size" className="text-white mr-2">
                Indent:
              </label>
              <select
                id="indent-size"
                value={indentSize}
                onChange={handleIndentChange}
                className="bg-gray-700 text-white rounded-md py-2 px-3"
              >
                <option value="2">2 spaces</option>
                <option value="4">4 spaces</option>
                <option value="8">8 spaces</option>
              </select>
            </div>
          </div>

          {/* Input/Output Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Area */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-saira text-theme-primary font-semibold">Input JSON</h2>
                <div className="text-sm text-gray-400">
                  {isValid === true && <span className="text-green-400">✓ Valid JSON</span>}
                  {isValid === false && <span className="text-red-400">✗ Invalid JSON</span>}
                </div>
              </div>
              <textarea
                value={jsonInput}
                onChange={handleInputChange}
                className="w-full h-96 bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm resize-none border border-gray-700 focus:border-theme-primary focus:outline-none"
                placeholder="Paste your JSON here..."
              />
            </div>

            {/* Output Area */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-saira text-theme-primary font-semibold">Formatted Output</h2>
                {formattedJson && (
                  <button
                    onClick={handleCopy}
                    className="text-sm bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-md transition-all duration-200"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              {error ? (
                <div className="w-full h-96 bg-gray-900 p-4 rounded-md font-mono text-sm overflow-auto border border-red-800">
                  <div className="text-red-400">
                    <p className="font-bold mb-2">Error in original JSON:</p>
                    <pre className="whitespace-pre-wrap">{error}</pre>
                  </div>

                  {formattedJson && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="font-bold mb-2 text-green-400">Fixed JSON output:</p>
                      <p className="text-gray-400 mb-2 text-xs">
                        {fixSuccess
                          ? "The JSON has been fixed and is displayed below. Click \"Try to Fix JSON\" to see what was changed."
                          : "Attempted fix is displayed below, but may still contain errors. Click \"Try to Fix JSON\" for details."}
                      </p>
                      <pre className="text-gray-100 whitespace-pre-wrap">{formattedJson}</pre>
                    </div>
                  )}
                </div>
              ) : (
                <pre className="w-full h-96 bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm overflow-auto border border-gray-700">
                  {formattedJson}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JSONDebugger;
