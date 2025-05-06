import React, { useState, useEffect } from 'react';
import { getRecentProjects, getDeploymentHistory } from '../../utils/cloudflare.js';

interface DeploymentHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeploymentHistoryDialog: React.FC<DeploymentHistoryDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [recentProjects, setRecentProjects] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [deploymentHistory, setDeploymentHistory] = useState<Array<{ url: string; timestamp: string }>>([]);

  // Load recent projects on mount
  useEffect(() => {
    if (isOpen) {
      const projects = getRecentProjects();
      setRecentProjects(projects);

      // Select the first project by default if available
      if (projects.length > 0 && !selectedProject) {
        setSelectedProject(projects[0]);
        setDeploymentHistory(getDeploymentHistory(projects[0]));
      }
    }
  }, [isOpen, selectedProject]);

  // Handle project selection
  const handleSelectProject = (project: string) => {
    setSelectedProject(project);
    setDeploymentHistory(getDeploymentHistory(project));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-xl font-bold text-white mb-4">Deployment History</h2>

        {recentProjects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No deployment history found</p>
            <p className="text-gray-500 text-sm mt-2">Deploy a website to see your deployment history</p>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Select Project
              </label>
              <div className="flex flex-wrap gap-2">
                {recentProjects.map((project) => (
                  <button
                    key={project}
                    type="button"
                    onClick={() => handleSelectProject(project)}
                    className={`px-3 py-1 text-sm rounded ${
                      selectedProject === project
                        ? 'bg-theme-primary text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {project}
                  </button>
                ))}
              </div>
            </div>

            {selectedProject && (
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  {selectedProject}.pages.dev
                </h3>

                {deploymentHistory.length === 0 ? (
                  <p className="text-gray-400 py-4">No deployments found for this project</p>
                ) : (
                  <div className="bg-gray-900 rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-800">
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-300">Deployment Date</th>
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-300">URL</th>
                          <th className="py-2 px-4 text-right text-sm font-medium text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deploymentHistory.map((deployment, index) => (
                          <tr key={index} className="border-t border-gray-700">
                            <td className="py-3 px-4 text-sm text-gray-300">
                              {formatDate(deployment.timestamp)}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-300 truncate max-w-xs">
                              {deployment.url}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <a
                                href={deployment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-theme-primary hover:underline text-sm"
                              >
                                Visit
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-theme-primary text-white rounded hover:bg-theme-primary/80"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeploymentHistoryDialog;
