export interface CloudflareConfig {
  accountId: string;
  apiToken: string;
  projectName?: string;
}

export function getCloudflareConfig(): CloudflareConfig;
export function saveCloudflareConfig(config: CloudflareConfig): void;
export function clearCloudflareConfig(): void;
export function hasCloudflareConfig(): boolean;
export function saveRecentProject(projectName: string): void;
export function getRecentProjects(): string[];
export function saveDeploymentHistory(projectName: string, deploymentUrl: string, timestamp?: string): void;
export function getDeploymentHistory(projectName: string): { url: string; timestamp: string }[];

export class CloudflareService {
  constructor(config: CloudflareConfig);
  createProject(projectName: string): Promise<any>;
  projectExists(projectName: string): Promise<boolean>;
  deployFiles(files: any, projectName: string): Promise<any>;
  getDeployments(projectName: string): Promise<any>;
} 