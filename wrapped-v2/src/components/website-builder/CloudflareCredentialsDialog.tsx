import React, { useState, useEffect } from 'react';
import {
  getCloudflareConfig,
  saveCloudflareConfig,
  clearCloudflareConfig,
  hasCloudflareConfig
} from '../../utils/cloudflare.js';

interface CloudflareCredentialsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
}

const CloudflareCredentialsDialog: React.FC<CloudflareCredentialsDialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [accountId, setAccountId] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [hasExistingConfig, setHasExistingConfig] = useState(false);
  const [showApiToken, setShowApiToken] = useState(false);

  // Load existing configuration on mount
  useEffect(() => {
    if (isOpen) {
      const config = getCloudflareConfig();
      if (config) {
        setAccountId(config.accountId || '');
        setApiToken(config.apiToken || '');
        setHasExistingConfig(true);
      } else {
        setHasExistingConfig(false);
      }
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountId || !apiToken) {
      alert('Please fill in all fields');
      return;
    }

    const config = {
      accountId,
      apiToken,
    };

    saveCloudflareConfig(config);
    onSave(config);
    onClose();
  };

  // Handle clearing credentials
  const handleClear = () => {
    if (confirm('Are you sure you want to clear your Cloudflare credentials?')) {
      clearCloudflareConfig();
      setAccountId('');
      setApiToken('');
      setHasExistingConfig(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold text-white mb-4">
          {hasExistingConfig ? 'Update Cloudflare Credentials' : 'Set Cloudflare Credentials'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="accountId">
              Cloudflare Account ID
            </label>
            <input
              id="accountId"
              type="text"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded"
              placeholder="Enter your Cloudflare Account ID"
              required
            />
            <p className="text-gray-400 text-xs mt-1">
              Found in your Cloudflare dashboard under Account Home &gt; Account ID
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="apiToken">
              Cloudflare API Token
            </label>
            <div className="relative">
              <input
                id="apiToken"
                type={showApiToken ? "text" : "password"}
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded pr-10"
                placeholder="Enter your Cloudflare API Token"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-white"
                onClick={() => setShowApiToken(!showApiToken)}
              >
                {showApiToken ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-1">
              Create a token with Cloudflare Pages Edit permissions
            </p>
          </div>

          <div className="flex justify-between">
            {hasExistingConfig && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Clear Credentials
              </button>
            )}

            <div className="flex space-x-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-theme-primary text-white rounded hover:bg-theme-primary/80"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CloudflareCredentialsDialog;
