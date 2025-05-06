/**
 * Cloudflare integration utilities
 */

// Preset Cloudflare configuration for the developer account
// These values should be set in the .env file
const PRESET_CLOUDFLARE_CONFIG = {
  accountId: import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || '',
  apiToken: import.meta.env.VITE_CLOUDFLARE_API_TOKEN || '',
};

// Check if the environment variables are set
if (!PRESET_CLOUDFLARE_CONFIG.accountId || !PRESET_CLOUDFLARE_CONFIG.apiToken) {
  console.warn(
    'Cloudflare credentials not found in environment variables. ' +
    'Please set VITE_CLOUDFLARE_ACCOUNT_ID and VITE_CLOUDFLARE_API_TOKEN in your .env file.'
  );
}

/**
 * Gets the preset Cloudflare configuration
 * @returns The preset Cloudflare configuration
 */
export const getCloudflareConfig = () => {
  console.log('Environment variables:');
  console.log('VITE_CLOUDFLARE_ACCOUNT_ID:', import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID ? 'Set (first 5 chars: ' + import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID.substring(0, 5) + '...)' : 'Not set');
  console.log('VITE_CLOUDFLARE_API_TOKEN:', import.meta.env.VITE_CLOUDFLARE_API_TOKEN ? 'Set (first 5 chars: ' + import.meta.env.VITE_CLOUDFLARE_API_TOKEN.substring(0, 5) + '...)' : 'Not set');

  return PRESET_CLOUDFLARE_CONFIG;
};

/**
 * Saves Cloudflare configuration
 * @param config The Cloudflare configuration to save
 */
export const saveCloudflareConfig = (config) => {
  // In this implementation, we're using preset credentials from environment variables
  // This function is kept for API compatibility with the CloudflareCredentialsDialog component
  console.log('Using preset Cloudflare credentials from environment variables');
};

/**
 * Clears Cloudflare configuration
 */
export const clearCloudflareConfig = () => {
  // In this implementation, we're using preset credentials from environment variables
  // This function is kept for API compatibility with the CloudflareCredentialsDialog component
  console.log('Using preset Cloudflare credentials from environment variables');
};

/**
 * Always returns true since we're using preset credentials
 * @returns Always true
 */
export const hasCloudflareConfig = () => {
  return true;
};

/**
 * Saves a project name to the list of recent projects
 * @param projectName The project name to save
 */
export const saveRecentProject = (projectName) => {
  try {
    const recentProjects = getRecentProjects();

    // Add to the beginning of the array and remove duplicates
    const updatedProjects = [
      projectName,
      ...recentProjects.filter(p => p !== projectName)
    ].slice(0, 10); // Keep only the 10 most recent projects

    localStorage.setItem('cloudflare_recent_projects', JSON.stringify(updatedProjects));
  } catch (error) {
    console.error('Error saving recent project:', error);
  }
};

/**
 * Gets the list of recent projects
 * @returns Array of recent project names
 */
export const getRecentProjects = () => {
  try {
    const recentProjects = localStorage.getItem('cloudflare_recent_projects');
    return recentProjects ? JSON.parse(recentProjects) : [];
  } catch (error) {
    console.error('Error retrieving recent projects:', error);
    return [];
  }
};

/**
 * Saves deployment history for a project
 * @param projectName The project name
 * @param deploymentUrl The deployment URL
 * @param timestamp The deployment timestamp
 */
export const saveDeploymentHistory = (
  projectName,
  deploymentUrl,
  timestamp = new Date().toISOString()
) => {
  try {
    const historyKey = `cloudflare_deployment_history_${projectName}`;
    const history = getDeploymentHistory(projectName);

    const updatedHistory = [
      { url: deploymentUrl, timestamp },
      ...history
    ].slice(0, 20); // Keep only the 20 most recent deployments

    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error saving deployment history:', error);
  }
};

/**
 * Gets deployment history for a project
 * @param projectName The project name
 * @returns Array of deployment history items
 */
export const getDeploymentHistory = (projectName) => {
  try {
    const historyKey = `cloudflare_deployment_history_${projectName}`;
    const history = localStorage.getItem(historyKey);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error retrieving deployment history:', error);
    return [];
  }
};

/**
 * Service for interacting with Cloudflare Pages
 */
export class CloudflareService {
  /**
   * Creates a new CloudflareService
   * @param config The Cloudflare configuration
   */
  constructor(config) {
    this.config = config;
    this.isDevelopment = import.meta.env.DEV;

    // Store mock data for development mode
    this.mockProjects = {};
    this.mockDeployments = {};

    // In production, use the real API
    this.baseUrl = 'https://api.cloudflare.com/client/v4';

    if (this.isDevelopment) {
      console.log('Using mock implementation for development');
    }
  }

  /**
   * Creates a new Cloudflare Pages project
   * @param projectName The name of the project
   * @returns The response from the API
   */
  async createProject(projectName) {
    console.log('Creating project:', projectName);

    // Use mock implementation in development mode
    if (this.isDevelopment) {
      console.log('Using mock implementation for createProject');

      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create a mock project
      this.mockProjects[projectName] = {
        name: projectName,
        subdomain: `${projectName}.pages.dev`,
        domains: [`${projectName}.pages.dev`],
        created_on: new Date().toISOString()
      };

      // Update the config with the new project name
      this.config.projectName = projectName;

      return {
        success: true,
        result: this.mockProjects[projectName],
        errors: []
      };
    }

    // Production implementation
    const url = `${this.baseUrl}/accounts/${this.config.accountId}/pages/projects`;
    console.log('Create project URL:', url);

    try {
      const requestBody = {
        name: projectName,
        production_branch: 'main'
      };
      console.log('Request body:', JSON.stringify(requestBody));

      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiToken}`
      };

      // Add CORS headers if using a proxy
      if (this.baseUrl.includes('corsproxy.io') || this.baseUrl.includes('cors-anywhere')) {
        headers['X-Requested-With'] = 'XMLHttpRequest';
        headers['Origin'] = window.location.origin;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        console.error('Project creation failed with status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        return {
          success: false,
          errors: [{ message: `Failed to create project: ${response.status} ${response.statusText}` }]
        };
      }

      const data = await response.json();
      console.log('Project creation response:', data);

      if (data.success) {
        // Update the config with the new project name
        this.config.projectName = projectName;
      }

      return data;
    } catch (error) {
      console.error('Error creating Cloudflare Pages project:', error);
      console.error('Error details:', error.message);
      return {
        success: false,
        errors: [{ message: `Failed to create project: ${error.message}` }]
      };
    }
  }

  /**
   * Checks if a project exists
   * @param projectName The name of the project
   * @returns True if the project exists, false otherwise
   */
  async projectExists(projectName) {
    console.log('Checking if project exists:', projectName);

    // Use mock implementation in development mode
    if (this.isDevelopment) {
      console.log('Using mock implementation for projectExists');

      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Check if the project exists in our mock data
      const exists = !!this.mockProjects[projectName];
      console.log(`Project ${projectName} ${exists ? 'exists' : 'does not exist'} in mock data`);

      return exists;
    }

    // Production implementation
    const url = `${this.baseUrl}/accounts/${this.config.accountId}/pages/projects/${projectName}`;
    console.log('Checking if project exists:', url);
    console.log('Using account ID:', this.config.accountId);
    console.log('API token (first 5 chars):', this.config.apiToken.substring(0, 5) + '...');

    try {
      // Prepare headers
      const headers = {
        'Authorization': `Bearer ${this.config.apiToken}`,
        'Content-Type': 'application/json'
      };

      // Add CORS headers if using a proxy
      if (this.baseUrl.includes('corsproxy.io') || this.baseUrl.includes('cors-anywhere')) {
        headers['X-Requested-With'] = 'XMLHttpRequest';
        headers['Origin'] = window.location.origin;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        console.error('Project check failed with status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        return false;
      }

      const data = await response.json();
      console.log('Project check response:', data);
      return data.success;
    } catch (error) {
      console.error('Error checking if project exists:', error);
      console.error('Error details:', error.message);
      return false;
    }
  }

  /**
   * Deploys files to Cloudflare Pages
   * @param files The files to deploy
   * @param projectName The name of the project
   * @returns The response from the API
   */
  async deployFiles(files, projectName) {
    console.log('Deploying files to project:', projectName);

    // Use mock implementation in development mode
    if (this.isDevelopment) {
      console.log('Using mock implementation for deployFiles');

      // First, check if the project exists
      const exists = await this.projectExists(projectName);

      if (!exists) {
        // If the project doesn't exist, create it
        const createResult = await this.createProject(projectName);

        if (!createResult.success) {
          return {
            success: false,
            errors: [{ message: 'Failed to create project' }]
          };
        }
      }

      // Simulate a delay for deployment
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create a mock deployment
      const deploymentId = `deployment-${Date.now()}`;
      const deploymentUrl = `https://${deploymentId}.${projectName}.pages.dev`;

      // Save to mock deployments
      if (!this.mockDeployments[projectName]) {
        this.mockDeployments[projectName] = [];
      }

      const deployment = {
        id: deploymentId,
        url: deploymentUrl,
        created_on: new Date().toISOString(),
        project_name: projectName,
        files_count: Object.keys(files).length
      };

      this.mockDeployments[projectName].unshift(deployment);

      // Save to deployment history
      saveDeploymentHistory(projectName, deploymentUrl);

      return {
        success: true,
        result: deployment,
        errors: []
      };
    }

    // Production implementation
    // First, check if the project exists
    const exists = await this.projectExists(projectName);

    if (!exists) {
      // If the project doesn't exist, create it
      const createResult = await this.createProject(projectName);

      if (!createResult.success) {
        return {
          success: false,
          errors: [{ message: 'Failed to create project' }]
        };
      }
    }

    // Now deploy the files
    try {
      // Create a FormData object to upload the files
      const formData = new FormData();

      // Add each file to the FormData
      for (const [path, content] of Object.entries(files)) {
        // Create a Blob from the content
        const blob = new Blob([content], { type: 'text/plain' });
        formData.append('files', blob, path);
      }

      // Create the deployment
      const deployUrl = `${this.baseUrl}/accounts/${this.config.accountId}/pages/projects/${projectName}/deployments`;

      // Prepare headers
      const headers = {
        'Authorization': `Bearer ${this.config.apiToken}`
      };

      // Add CORS headers if using a proxy
      if (this.baseUrl.includes('corsproxy.io') || this.baseUrl.includes('cors-anywhere')) {
        headers['X-Requested-With'] = 'XMLHttpRequest';
        headers['Origin'] = window.location.origin;
      }

      const response = await fetch(deployUrl, {
        method: 'POST',
        headers,
        body: formData
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deploying files to Cloudflare Pages:', error);
      return {
        success: false,
        errors: [{ message: 'Failed to deploy files' }]
      };
    }
  }

  /**
   * Gets a list of deployments for a project
   * @param projectName The name of the project
   * @returns The list of deployments
   */
  async getDeployments(projectName) {
    console.log('Getting deployments for project:', projectName);

    // Use mock implementation in development mode
    if (this.isDevelopment) {
      console.log('Using mock implementation for getDeployments');

      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Return mock deployments for this project
      return this.mockDeployments[projectName] || [];
    }

    // Production implementation
    const url = `${this.baseUrl}/accounts/${this.config.accountId}/pages/projects/${projectName}/deployments`;

    try {
      // Prepare headers
      const headers = {
        'Authorization': `Bearer ${this.config.apiToken}`
      };

      // Add CORS headers if using a proxy
      if (this.baseUrl.includes('corsproxy.io') || this.baseUrl.includes('cors-anywhere')) {
        headers['X-Requested-With'] = 'XMLHttpRequest';
        headers['Origin'] = window.location.origin;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      const data = await response.json();

      if (data.success) {
        return data.result;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error getting deployments:', error);
      return [];
    }
  }
}
