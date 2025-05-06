import React, { useState, useEffect } from 'react';
import type { Component } from '../../pages/WebsiteBuilderEditor';
import { exportWebsite } from '../../utils/exportWebsite';
import {
  CloudflareService,
  getCloudflareConfig,
  saveRecentProject,
  saveDeploymentHistory,
  getRecentProjects
} from '../../utils/cloudflare.js';

interface DeploymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  components: Component[];
  websiteName: string;
}

const DeploymentDialog: React.FC<DeploymentDialogProps> = ({
  isOpen,
  onClose,
  components,
  websiteName,
}) => {
  const [projectName, setProjectName] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<{
    success: boolean;
    message: string;
    url?: string;
  } | null>(null);
  const [recentProjects, setRecentProjects] = useState<string[]>([]);
  const [deploymentStep, setDeploymentStep] = useState<'config' | 'deploying' | 'result'>('config');

  // Initialize state when dialog opens
  useEffect(() => {
    if (isOpen) {
      // Generate a default project name from the website name
      const defaultProjectName = websiteName.toLowerCase().replace(/\s+/g, '-');
      setProjectName(defaultProjectName);

      // Load recent projects
      setRecentProjects(getRecentProjects());

      // Reset deployment state
      setDeploymentResult(null);
      setDeploymentStep('config');
    }
  }, [isOpen, websiteName]);

  // Handle form submission
  const handleDeploy = async () => {
    if (!projectName) {
      alert('Please enter a project name');
      return;
    }

    setIsDeploying(true);
    setDeploymentStep('deploying');
    setDeploymentResult(null);

    try {
      // Export the website to static files
      const files = exportWebsite(components, websiteName);

      // Get the Cloudflare configuration
      const cloudflareConfig = getCloudflareConfig();

      // Check if the Cloudflare credentials are set
      if (!cloudflareConfig.accountId || !cloudflareConfig.apiToken) {
        setDeploymentResult({
          success: false,
          message: 'Cloudflare credentials not found. Please check your environment variables.',
        });
        setIsDeploying(false);
        setDeploymentStep('result');
        return;
      }

      // Create a Cloudflare service instance
      const cloudflareService = new CloudflareService({
        ...cloudflareConfig,
        projectName,
      });

      // Deploy the files to Cloudflare Pages
      const result = await cloudflareService.deployFiles(files, projectName);

      if (result.success && result.result) {
        // Save the project name to recent projects
        saveRecentProject(projectName);

        // Save deployment history
        if (result.result.url) {
          saveDeploymentHistory(projectName, result.result.url);
        }

        setDeploymentResult({
          success: true,
          message: 'Website deployed successfully!',
          url: result.result.url,
        });

        // Refresh recent projects list
        setRecentProjects(getRecentProjects());
      } else {
        setDeploymentResult({
          success: false,
          message: `Deployment failed: ${result.errors.map(e => e.message).join(', ')}`,
        });
      }
    } catch (error) {
      console.error('Error deploying website:', error);
      setDeploymentResult({
        success: false,
        message: `Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsDeploying(false);
      setDeploymentStep('result');
    }
  };

  // Handle dialog close
  const handleClose = () => {
    if (!isDeploying) {
      setDeploymentResult(null);
      onClose();
    }
  };

  // Handle project selection from recent projects
  const handleSelectProject = (project: string) => {
    setProjectName(project);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold text-white mb-4">Deploy to Cloudflare Pages</h2>

        {deploymentStep === 'deploying' && (
          <div className="p-6 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-primary mb-4"></div>
            <p className="text-white text-center">Deploying your website to Cloudflare Pages...</p>
            <p className="text-gray-400 text-sm text-center mt-2">This may take a few moments</p>
          </div>
        )}

        {deploymentStep === 'result' && deploymentResult && (
          <div className={`p-4 mb-4 rounded ${deploymentResult.success ? 'bg-green-800' : 'bg-red-800'}`}>
            <p className="text-white">{deploymentResult.message}</p>
            {deploymentResult.url && (
              <div className="mt-2">
                <a
                  href={deploymentResult.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:underline"
                >
                  View your website
                </a>
              </div>
            )}
          </div>
        )}

        {deploymentStep === 'config' && (
          <div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="projectName">
                Project Name
              </label>

              <input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                placeholder="Enter a project name"
                required
              />
              <p className="text-gray-400 text-xs mt-1">
                This will be used as your Cloudflare Pages subdomain: {projectName}.pages.dev
              </p>
            </div>

            {recentProjects.length > 0 && (
              <div className="mb-6">
                <label className="block text-white text-sm font-bold mb-2">
                  Recent Projects
                </label>
                <div className="flex flex-wrap gap-2">
                  {recentProjects.map((project) => (
                    <button
                      key={project}
                      type="button"
                      onClick={() => handleSelectProject(project)}
                      className={`px-2 py-1 text-xs rounded ${
                        projectName === project
                          ? 'bg-theme-primary text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {project}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeploy}
                className="px-4 py-2 bg-theme-primary text-white rounded hover:bg-theme-primary/80"
              >
                Deploy
              </button>
            </div>
          </div>
        )}

        {deploymentStep === 'result' && (
          <div className="flex justify-end mt-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-theme-primary text-white rounded hover:bg-theme-primary/80"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentDialog;
