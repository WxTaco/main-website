import { useState, useEffect, useRef } from 'react';
import { CopyNotification } from './ColorPaletteGenerator';

interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  mimeType: string;
}

const MarkdownEditor = () => {
  const [markdownText, setMarkdownText] = useState<string>('# Welcome to Discord Markdown Editor\n\nThis is a **live preview** editor for Discord-style markdown. Write on the left and see how it will look in Discord on the right.\n\n## Discord Formatting\n\n**Bold text** and *italic text* and ***bold italic text***\n__Underlined text__ and ~~strikethrough text~~\n\n`inline code` and ```code blocks```\n\n```js\n// Syntax highlighted code block\nfunction helloDiscord() {\n  console.log("Hello, Discord!");\n}\n```\n\n> Blockquote text\n>> Nested blockquote\n\n|| This is a spoiler ||\n\n# Heading 1\n## Heading 2\n### Heading 3\n\n• Bullet point\n• Another bullet point\n\nCheck out this [masked link to Discord](https://discord.com) or visit a [GitHub repo](https://github.com).\n\nTry editing this text to see the changes in real-time!');
  const [htmlPreview, setHtmlPreview] = useState<string>('');
  const [notification, setNotification] = useState<{ message: string; content: string; isVisible: boolean }>({
    message: '',
    content: '',
    isVisible: false
  });
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [selectedExportFormat, setSelectedExportFormat] = useState<string>('markdown');
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const exportFormats: ExportFormat[] = [
    {
      id: 'markdown',
      name: 'Markdown (.md)',
      extension: '.md',
      mimeType: 'text/markdown'
    },
    {
      id: 'html',
      name: 'HTML (.html)',
      extension: '.html',
      mimeType: 'text/html'
    },
    {
      id: 'text',
      name: 'Plain Text (.txt)',
      extension: '.txt',
      mimeType: 'text/plain'
    }
  ];

  const convertMarkdownToHtml = (markdown: string): string => {
    let html = markdown;

    html = html.replace(/```([a-z]*)\n?([\s\S]*?)```/g, (_, language, code) => {
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

      return `<div class="discord-codeblock${language ? ` language-${language}` : ''}"><div class="discord-codeblock-lang">${language || 'plaintext'}</div><pre><code>${escapedCode}</code></pre></div>`;
    });

    html = html.replace(/`([^`]+)`/g, '<code class="discord-inline-code">$1</code>');

    html = html.replace(/\|\|([\s\S]*?)\|\|/g, '<span class="discord-spoiler">$1</span>');

    html = html
      .replace(/^# (.*$)/gm, '<h1 class="discord-h1">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="discord-h2">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="discord-h3">$1</h3>');

    html = html
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\_\_\*\*(.*?)\*\*\_\_/g, '<u><strong>$1</strong></u>')
      .replace(/\*\*\_\_(.*?)\_\_\*\*/g, '<strong><u>$1</u></strong>')
      .replace(/\_\_\*(.*?)\*\_\_/g, '<u><em>$1</em></u>')
      .replace(/\*\_\_(.*?)\_\_\*/g, '<em><u>$1</u></em>')
      .replace(/\~\~\*\*(.*?)\*\*\~\~/g, '<s><strong>$1</strong></s>')
      .replace(/\*\*\~\~(.*?)\~\~\*\*/g, '<strong><s>$1</s></strong>')
      .replace(/\~\~\*(.*?)\*\~\~/g, '<s><em>$1</em></s>')
      .replace(/\*\~\~(.*?)\~\~\*/g, '<em><s>$1</s></em>')
      .replace(/\~\~\_\_(.*?)\_\_\~\~/g, '<s><u>$1</u></s>')
      .replace(/\_\_\~\~(.*?)\~\~\_\_/g, '<u><s>$1</s></u>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\_\_(.*?)\_\_/g, '<u>$1</u>')
      .replace(/\~\~(.*?)\~\~/g, '<s>$1</s>'); 

    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '___DISCORD_MASKED_LINK___$1___DISCORD_MASKED_LINK_URL___$2___DISCORD_MASKED_LINK_END___');

    html = html.replace(/(https?:\/\/[^\s<]+)/g, (url) => {
      if (url.match(/<a |<img |<\/a>/) || url.includes('___DISCORD_MASKED_LINK')) return url;
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="discord-link">${url}</a>`;
    });

    html = html.replace(/___DISCORD_MASKED_LINK___(.*?)___DISCORD_MASKED_LINK_URL___(.*?)___DISCORD_MASKED_LINK_END___/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="discord-link">$1</a>');

    html = html.replace(/^[•*-]\s+(.*$)/gm, '<div class="discord-bullet-point">$1</div>');

    html = html.replace(/^>\s*>\s*(.*$)/gm, '<div class="discord-blockquote discord-blockquote-nested">$1</div>');
    html = html.replace(/^>\s*(.*$)/gm, '<div class="discord-blockquote">$1</div>');

    html = html.replace(/^(\-{3,}|\*{3,}|_{3,})$/gm, '<hr class="discord-hr">');

    const lines = html.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('<') &&
          !line.startsWith('<code') &&
          !line.startsWith('<em>') &&
          !line.startsWith('<strong>') &&
          !line.startsWith('<s>') &&
          !line.startsWith('<u>')) {
        continue;
      }

      if (line.length > 0) {
        lines[i] = `<p class="discord-text">${line}</p>`;
      }
    }

    html = lines.join('\n');

    return html;
  };

  useEffect(() => {
    setHtmlPreview(convertMarkdownToHtml(markdownText));

    const words = markdownText.trim() ? markdownText.trim().split(/\s+/).length : 0;
    const chars = markdownText.length;
    setWordCount(words);
    setCharCount(chars);
  }, [markdownText]);

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

  // Copy markdown or HTML to clipboard
  const copyToClipboard = (format: 'markdown' | 'html') => {
    const content = format === 'markdown' ? markdownText : htmlPreview;
    navigator.clipboard.writeText(content);
    showNotification(`${format === 'markdown' ? 'Markdown' : 'HTML'} copied to clipboard!`, content);
  };

  // Export the content in the selected format
  const exportContent = () => {
    const format = exportFormats.find(f => f.id === selectedExportFormat);
    if (!format) return;

    let content = markdownText;
    if (format.id === 'html') {
      // Create a full HTML document
      content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Markdown</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    pre {
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
    }
    code {
      font-family: 'Courier New', Courier, monospace;
      background-color: #f5f5f5;
      padding: 2px 4px;
      border-radius: 3px;
    }
    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 16px;
      margin-left: 0;
      color: #666;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    table, th, td {
      border: 1px solid #ddd;
    }
    th, td {
      padding: 8px;
      text-align: left;
    }
  </style>
</head>
<body>
  ${htmlPreview}
</body>
</html>`;
    }

    // Create a blob and download it
    const blob = new Blob([content], { type: format.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document${format.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification(`Exported as ${format.name}!`, `File saved as document${format.extension}`);
  };

  // Insert Discord markdown formatting
  const insertFormatting = (type: string) => {
    let textToInsert = '';

    switch (type) {
      case 'bold':
        textToInsert = '**Bold Text**';
        break;
      case 'italic':
        textToInsert = '*Italic Text*';
        break;
      case 'heading':
        textToInsert = '## Heading';
        break;
      case 'link':
        textToInsert = '[Link Text](https://example.com)';
        break;
      case 'image':
        textToInsert = '![Alt Text](https://example.com/image.jpg)';
        break;
      case 'code':
        textToInsert = '`Inline Code`';
        break;
      case 'codeblock':
        textToInsert = '```js\n// Code Block with syntax highlighting\nconst discord = "awesome";\n```';
        break;
      case 'quote':
        textToInsert = '> Blockquote';
        break;
      case 'list':
        textToInsert = '• List Item 1\n• List Item 2\n• List Item 3';
        break;
      case 'orderedlist':
        textToInsert = '1. List Item 1\n2. List Item 2\n3. List Item 3';
        break;
      case 'hr':
        textToInsert = '---';
        break;
      case 'underline':
        textToInsert = '__Underlined Text__';
        break;
      case 'strikethrough':
        textToInsert = '~~Strikethrough Text~~';
        break;
      case 'spoiler':
        textToInsert = '||Spoiler Text||';
        break;
      default:
        return;
    }

    // Insert at cursor position or append to end
    setMarkdownText(prev => prev + '\n' + textToInsert);
  };

  // Clean up notification timer on unmount
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
          Discord Markdown Editor
        </h1>
        <section className="text-center">
          <p className="text-xl max-w-3xl mx-auto text-gray-100 font-medium shadow-sm mb-4">
            Create and preview Discord-style Markdown with our specialized editor. See exactly how your text will look in Discord before sending.
          </p>
        </section>
      </div>

      {/* Markdown Editor Tool */}
      <div className="w-full max-w-6xl mb-10">
        <div className="bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-6 border border-theme-border/30 dark:bg-black/80 dark:border-white/20">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 mb-6 p-2 bg-gray-900 rounded-lg border border-gray-700">
            <button
              onClick={() => insertFormatting('heading')}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
              title="Heading"
            >
              H
            </button>
            <button
              onClick={() => insertFormatting('bold')}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 font-bold"
              title="Bold"
            >
              B
            </button>
            <button
              onClick={() => insertFormatting('italic')}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 italic"
              title="Italic"
            >
              I
            </button>
            <button
              onClick={() => insertFormatting('underline')}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 underline"
              title="Underline"
            >
              U
            </button>
            <button
              onClick={() => insertFormatting('strikethrough')}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 line-through"
              title="Strikethrough"
            >
              S
            </button>
            <button
              onClick={() => insertFormatting('spoiler')}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
              title="Spoiler"
            >
              ||S||
            </button>
            <button
              onClick={() => insertFormatting('link')}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
              title="Link"
            >
              🔗
            </button>
            <button
              onClick={() => insertFormatting('image')}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
              title="Image"
            >
              🖼️
            </button>
            <button
              onClick={() => insertFormatting('code')}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 font-mono"
              title="Inline Code"
            >
              `code`
            </button>
            <button
              onClick={() => insertFormatting('codeblock')}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 font-mono"
              title="Code Block"
            >
              ```
            </button>
            <button
              onClick={() => insertFormatting('quote')}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
              title="Blockquote"
            >
              "
            </button>
            <button
              onClick={() => insertFormatting('list')}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
              title="Unordered List"
            >
              • List
            </button>
            <button
              onClick={() => insertFormatting('orderedlist')}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
              title="Ordered List"
            >
              1. List
            </button>
            <button
              onClick={() => insertFormatting('hr')}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
              title="Horizontal Rule"
            >
              ―
            </button>

            <div className="ml-auto flex gap-2">
              <button
                onClick={() => copyToClipboard('markdown')}
                className="px-3 py-1 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 flex items-center"
                title="Copy Markdown"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                MD
              </button>
              <button
                onClick={() => copyToClipboard('html')}
                className="px-3 py-1 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 flex items-center"
                title="Copy HTML"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                HTML
              </button>
              <div className="flex items-center">
                <select
                  value={selectedExportFormat}
                  onChange={(e) => setSelectedExportFormat(e.target.value)}
                  className="bg-gray-700 text-white rounded-l-md py-1 px-2 border-r border-gray-600 text-sm"
                >
                  {exportFormats.map(format => (
                    <option key={format.id} value={format.id}>
                      {format.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={exportContent}
                  className="px-3 py-1 rounded-r-md bg-theme-primary hover:bg-theme-primary/80 text-white"
                  title="Export"
                >
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Editor/Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Markdown Editor */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-saira text-theme-primary font-semibold">Discord Markdown</h2>
                <div className="text-sm text-gray-400">
                  {wordCount} words, {charCount} characters
                </div>
              </div>
              <textarea
                value={markdownText}
                onChange={(e) => setMarkdownText(e.target.value)}
                className="w-full h-[500px] bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm resize-none border border-gray-700 focus:border-theme-primary focus:outline-none"
                spellCheck="false"
              ></textarea>
            </div>

            {/* Preview */}
            <div className="flex flex-col">
              <h2 className="text-xl font-saira text-theme-primary font-semibold mb-2">Preview</h2>
              <div
                ref={previewRef}
                className="w-full h-[500px] bg-white text-black p-4 rounded-md border border-gray-700 overflow-auto custom-scrollbar markdown-preview"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'var(--theme-primary, #c94baf) #f8fafc',
                }}
                dangerouslySetInnerHTML={{ __html: htmlPreview }}
              ></div>
              <style>{`
                .markdown-preview {
                  font-family: 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  line-height: 1.375rem;
                  color: #dcddde;
                  background-color: #36393f;
                  padding: 16px;
                  border-radius: 4px;
                }

                .discord-text {
                  margin: 0 0 0.5rem;
                  white-space: pre-wrap;
                  color: #dcddde;
                }

                .discord-h1, .discord-h2, .discord-h3 {
                  font-weight: 600;
                  margin-top: 24px;
                  margin-bottom: 8px;
                  color: #ffffff;
                }

                .discord-h1 { font-size: 1.5rem; }
                .discord-h2 { font-size: 1.25rem; }
                .discord-h3 { font-size: 1rem; }

                .discord-link {
                  color: #00aff4;
                  text-decoration: none;
                }

                .discord-link:hover {
                  text-decoration: underline;
                }

                .discord-inline-code {
                  background-color: #2f3136;
                  font-family: Consolas, 'Andale Mono WT', 'Andale Mono', 'Lucida Console', 'Lucida Sans Typewriter', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Liberation Mono', 'Nimbus Mono L', Monaco, 'Courier New', Courier, monospace;
                  padding: 0.2em;
                  border-radius: 3px;
                  font-size: 0.85em;
                  color: #dcddde;
                }

                .discord-codeblock {
                  background-color: #2f3136;
                  border-radius: 4px;
                  margin: 8px 0;
                  position: relative;
                  overflow: hidden;
                }

                .discord-codeblock-lang {
                  background-color: #202225;
                  color: #dcddde;
                  font-size: 0.75rem;
                  font-weight: 500;
                  padding: 0 8px;
                  position: absolute;
                  top: 0;
                  right: 0;
                  border-bottom-left-radius: 4px;
                }

                .discord-codeblock pre {
                  background-color: transparent;
                  margin: 0;
                  padding: 12px 16px;
                  overflow-x: auto;
                }

                .discord-codeblock code {
                  font-family: Consolas, 'Andale Mono WT', 'Andale Mono', 'Lucida Console', 'Lucida Sans Typewriter', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Liberation Mono', 'Nimbus Mono L', Monaco, 'Courier New', Courier, monospace;
                  font-size: 0.875rem;
                  color: #dcddde;
                  white-space: pre;
                  line-height: 1.25rem;
                }

                .discord-blockquote {
                  border-left: 4px solid #4f545c;
                  padding: 0 8px 0 12px;
                  margin: 8px 0;
                  color: #b9bbbe;
                }

                .discord-blockquote-nested {
                  border-left-color: #36393f;
                  background-color: #2f3136;
                  margin-left: 4px;
                }

                .discord-bullet-point {
                  position: relative;
                  padding-left: 1.5em;
                  margin: 0.5em 0;
                }

                .discord-bullet-point:before {
                  content: "•";
                  position: absolute;
                  left: 0.5em;
                  color: #dcddde;
                }

                .discord-spoiler {
                  background-color: #202225;
                  color: transparent;
                  padding: 0 2px;
                  border-radius: 3px;
                  cursor: pointer;
                  user-select: none;
                }

                .discord-spoiler:hover {
                  background-color: rgba(32, 34, 37, 0.8);
                }

                .discord-spoiler.revealed {
                  background-color: rgba(32, 34, 37, 0.5);
                  color: #dcddde;
                }

                /* Ensure spoiler text is not selectable until revealed */
                .discord-spoiler:not(.revealed)::selection {
                  background-color: transparent;
                }

                /* Fix for Firefox */
                .discord-spoiler:not(.revealed)::-moz-selection {
                  background-color: transparent;
                }

                strong {
                  font-weight: 700;
                  color: #ffffff;
                }

                em {
                  font-style: italic;
                }

                u {
                  text-decoration: underline;
                }

                s {
                  text-decoration: line-through;
                }

                .discord-hr {
                  border: none;
                  border-top: 1px solid #4f545c;
                  margin: 20px 0;
                }
              `}</style>
              <script>{`
                // Add click handler for spoilers
                function setupSpoilers() {
                  const spoilers = document.querySelectorAll('.discord-spoiler');
                  spoilers.forEach(spoiler => {
                    if (!spoiler.hasAttribute('data-spoiler-initialized')) {
                      spoiler.setAttribute('data-spoiler-initialized', 'true');

                      // Use mousedown instead of click for better behavior
                      spoiler.addEventListener('mousedown', function(e) {
                        e.preventDefault(); // Prevent text selection
                        this.classList.add('revealed');
                      });
                    }
                  });
                }

                // Run immediately for any existing spoilers
                setupSpoilers();

                // Also run on DOMContentLoaded
                document.addEventListener('DOMContentLoaded', setupSpoilers);

                // Setup observer to handle dynamic content changes
                setTimeout(() => {
                  const previewContainer = document.querySelector('.markdown-preview');
                  if (previewContainer) {
                    const observer = new MutationObserver(() => {
                      setTimeout(setupSpoilers, 0);
                    });
                    observer.observe(previewContainer, {
                      childList: true,
                      subtree: true,
                      characterData: true
                    });
                  }
                }, 100);
              `}</script>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-saira text-theme-primary font-semibold mb-3">Discord Markdown Cheat Sheet</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-medium mb-2">Text Formatting</h4>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li><code className="bg-gray-800 px-1 rounded">**Bold**</code> - Makes text bold</li>
                  <li><code className="bg-gray-800 px-1 rounded">*Italic*</code> - Makes text italic</li>
                  <li><code className="bg-gray-800 px-1 rounded">***Bold Italic***</code> - Bold and italic</li>
                  <li><code className="bg-gray-800 px-1 rounded">__Underline__</code> - Underlines text</li>
                  <li><code className="bg-gray-800 px-1 rounded">~~Strikethrough~~</code> - Strikes through text</li>
                  <li><code className="bg-gray-800 px-1 rounded">||Spoiler||</code> - Creates a spoiler</li>
                  <li><code className="bg-gray-800 px-1 rounded">[Text](URL)</code> - Creates a masked link</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Discord Elements</h4>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li><code className="bg-gray-800 px-1 rounded">`Inline Code`</code> - Creates inline code</li>
                  <li><code className="bg-gray-800 px-1 rounded">```\nCode Block\n```</code> - Creates a code block</li>
                  <li><code className="bg-gray-800 px-1 rounded">```js\nCode\n```</code> - Syntax highlighted code</li>
                  <li><code className="bg-gray-800 px-1 rounded">{'>'} Text</code> - Creates a blockquote</li>
                  <li><code className="bg-gray-800 px-1 rounded">{'>'}{'>'}{'>'} Nested quote</code> - Creates a nested quote</li>
                  <li><code className="bg-gray-800 px-1 rounded">• Bullet point</code> - Creates a bullet point</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
