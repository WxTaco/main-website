import { useState, useEffect } from 'react';
import EmbedBuilder from '../components/builder/EmbedBuilder';
import type { EmbedData } from '../components/builder/EmbedBuilder';
import { CopyNotification } from './ColorPaletteGenerator';

const defaultEmbed: EmbedData = {
  title: 'Example Embed Title',
  description: 'This is an example embed description. You can edit this to create your own Discord embed.',
  color: '#c94baf',
  author: {
    name: 'Author Name',
    iconURL: '',
    url: '',
  },
  thumbnail: '',
  image: '',
  footer: {
    text: 'Footer Text',
    iconURL: '',
  },
  fields: [
    {
      name: 'Field 1',
      value: 'This is the value of field 1',
      inline: true,
    },
    {
      name: 'Field 2',
      value: 'This is the value of field 2',
      inline: true,
    },
  ],
  timestamp: true,
};


const generateDiscordJsCode = (embedData: EmbedData): string => {
  let code = 'const { EmbedBuilder } = require(\'discord.js\');\n\n';
  code += 'const embed = new EmbedBuilder()\n';

  if (embedData.title) {
    code += `  .setTitle('${embedData.title}')\n`;
  }

  if (embedData.description) {
    code += `  .setDescription('${embedData.description}')\n`;
  }

  if (embedData.color) {
    code += `  .setColor('${embedData.color}')\n`;
  }

  if (embedData.author?.name) {
    code += '  .setAuthor({\n';
    code += `    name: '${embedData.author.name}'`;

    if (embedData.author.iconURL) {
      code += `,\n    iconURL: '${embedData.author.iconURL}'`;
    }

    if (embedData.author.url) {
      code += `,\n    url: '${embedData.author.url}'`;
    }

    code += '\n  })\n';
  }

  if (embedData.thumbnail) {
    code += `  .setThumbnail('${embedData.thumbnail}')\n`;
  }

  if (embedData.image) {
    code += `  .setImage('${embedData.image}')\n`;
  }

  if (embedData.footer?.text) {
    code += '  .setFooter({\n';
    code += `    text: '${embedData.footer.text}'`;

    if (embedData.footer.iconURL) {
      code += `,\n    iconURL: '${embedData.footer.iconURL}'`;
    }

    code += '\n  })\n';
  }

  if (embedData.timestamp) {
    code += '  .setTimestamp()\n';
  }

  if (embedData.fields && embedData.fields.length > 0) {
    embedData.fields.forEach((field) => {
      code += '  .addFields({\n';
      code += `    name: '${field.name}',\n`;
      code += `    value: '${field.value}',\n`;
      code += `    inline: ${field.inline}\n`;
      code += '  })\n';
    });
  }

  code += ';\n\n';
  code += 
  code += 'await interaction.reply({ embeds: [embed] });';

  return code;
};

const DiscordEmbedBuilder = () => {
  const [embedData, setEmbedData] = useState<EmbedData>(defaultEmbed);
  const [exportFormat, setExportFormat] = useState<'json' | 'discord.js'>('discord.js');
  const [notification, setNotification] = useState<{ message: string; content: string; isVisible: boolean }>({
    message: '',
    content: '',
    isVisible: false
  });

 
  const showNotification = (message: string, content: string) => {
    setNotification({
      message,
      content,
      isVisible: true
    });

    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

 
  const copyToClipboard = () => {
    let content = '';

    if (exportFormat === 'json') {
      content = JSON.stringify(embedData, null, 2);
    } else {
      content = generateDiscordJsCode(embedData);
    }

    navigator.clipboard.writeText(content);
    showNotification(`Copied as ${exportFormat === 'json' ? 'JSON' : 'Discord.js code'}!`, content);
  };

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
          Discord Embed Builder
        </h1>
        <section className="text-center">
          <p className="text-xl max-w-3xl mx-auto text-gray-100 font-medium shadow-sm mb-4">
            Create beautiful Discord embeds for your bot or webhook. Customize colors, fields, and more.
          </p>
        </section>
      </div>

      {/* Discord Embed Builder Tool */}
      <div className="w-full max-w-6xl mb-10">
        <div className="bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-6 border border-theme-border/30 dark:bg-black/80 dark:border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Embed Builder */}
            <div>
              <h2 className="text-2xl font-saira text-theme-primary font-semibold mb-4">Customize Your Embed</h2>
              <EmbedBuilder embedData={embedData} onChange={setEmbedData} />
            </div>

            {/* Export Options */}
            <div>
              <h2 className="text-2xl font-saira text-theme-primary font-semibold mb-4">Export Your Embed</h2>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 mb-6">
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 font-medium">Export Format</label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setExportFormat('json')}
                      className={`px-4 py-2 rounded-md ${
                        exportFormat === 'json'
                          ? 'bg-theme-primary text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      JSON
                    </button>
                    <button
                      onClick={() => setExportFormat('discord.js')}
                      className={`px-4 py-2 rounded-md ${
                        exportFormat === 'discord.js'
                          ? 'bg-theme-primary text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Discord.js Code
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 font-medium">Preview</label>
                  <pre className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-gray-300 text-sm font-mono overflow-auto h-[300px] custom-scrollbar"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'var(--theme-primary, #c94baf) #2d3748',
                    }}
                  >
                    {exportFormat === 'json'
                      ? JSON.stringify(embedData, null, 2)
                      : generateDiscordJsCode(embedData)
                    }
                  </pre>
                </div>

                <button
                  onClick={copyToClipboard}
                  className="w-full bg-theme-primary hover:bg-theme-primary/80 text-white font-bold py-3 px-4 rounded-md transition-all duration-200 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy to Clipboard
                </button>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-saira text-theme-primary font-semibold mb-3">How to Use</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Customize your embed using the editor on the left</li>
                  <li>Choose between JSON or Discord.js code format</li>
                  <li>Copy the code and paste it into your bot or webhook</li>
                  <li>For webhooks, use the JSON format</li>
                  <li>For Discord.js bots, use the Discord.js code format</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscordEmbedBuilder;

