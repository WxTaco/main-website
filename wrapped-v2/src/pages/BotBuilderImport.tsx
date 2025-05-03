import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

interface FileMap {
  [key: string]: File;
}

const BotBuilderImport = () => {
  const [files, setFiles] = useState<FileMap>({});
  const [importMethod, setImportMethod] = useState('upload');
  const [githubUrl, setGithubUrl] = useState('');
  const [importStatus, setImportStatus] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const newFiles: FileMap = {};

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      newFiles[file.name] = file;
    }

    setFiles(newFiles);
  };

  const handleImport = () => {
    if (importMethod === 'upload') {
      if (Object.keys(files).length === 0) {
        setImportStatus('Please select files to import');
        return;
      }

      setImportStatus('Importing files...');
      // In a real implementation, we would process the files here
      setTimeout(() => {
        setImportStatus('Files imported successfully! Redirecting to editor...');
        // Redirect to editor after a short delay
        setTimeout(() => {
          window.location.href = '/bot-builder/editor';
        }, 1500);
      }, 1000);
    } else {
      if (!githubUrl) {
        setImportStatus('Please enter a GitHub repository URL');
        return;
      }

      setImportStatus('Importing from GitHub...');
      // In a real implementation, we would fetch the repository here
      setTimeout(() => {
        setImportStatus('Repository imported successfully! Redirecting to editor...');
        // Redirect to editor after a short delay
        setTimeout(() => {
          window.location.href = '/bot-builder/editor';
        }, 1500);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-3xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Import Existing Bot</h1>
        <p className="text-lg text-white mb-6 text-center">
          Import your existing Discord bot code to continue building with our visual editor.
        </p>

        <div className="bg-gray-900/70 p-6 rounded-lg border border-wrapped-pink/30 mb-8">
          <div className="flex mb-6">
            <button
              onClick={() => setImportMethod('upload')}
              className={`flex-1 py-2 rounded-l-md transition-colors ${
                importMethod === 'upload'
                  ? 'bg-wrapped-pink text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Upload Files
            </button>

            <button
              onClick={() => setImportMethod('github')}
              className={`flex-1 py-2 rounded-r-md transition-colors ${
                importMethod === 'github'
                  ? 'bg-wrapped-pink text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              GitHub Repository
            </button>
          </div>

          {importMethod === 'upload' ? (
            <div>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mb-4">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-2 px-4 rounded-md inline-block mb-3"
                >
                  Select Files
                </label>
                <p className="text-gray-400 text-sm">
                  Or drag and drop files here
                </p>

                {Object.keys(files).length > 0 && (
                  <div className="mt-4 text-left">
                    <p className="text-white mb-2">{Object.keys(files).length} files selected:</p>
                    <ul className="text-pink-200 text-sm max-h-40 overflow-y-auto">
                      {Object.keys(files).map((filename) => (
                        <li key={filename} className="mb-1">{filename}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block text-white mb-2">GitHub Repository URL</label>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                />
              </div>

              <div className="text-gray-400 text-sm">
                <p className="mb-1">Make sure your repository:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Is public or you have access to it</li>
                  <li>Contains a Discord.js bot project</li>
                  <li>Has an index.js or bot.js file</li>
                </ul>
              </div>
            </div>
          )}

          {importStatus && (
            <div className={`mt-4 p-3 rounded-md ${
              importStatus.includes('successfully')
                ? 'bg-green-900/50 text-green-200'
                : importStatus.includes('error')
                  ? 'bg-red-900/50 text-red-200'
                  : 'bg-blue-900/50 text-blue-200'
            }`}>
              {importStatus}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Link
            to="/bot-builder"
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-4 rounded-md transition-colors"
          >
            Back
          </Link>

          <button
            onClick={handleImport}
            className="bg-wrapped-pink hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-md transition-colors"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default BotBuilderImport;
