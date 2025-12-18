
export enum Severity {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  INFO = 'Info'
}

export interface Vulnerability {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  affectedUrl: string; 
  impact: string; 
  fixCode: string; 
  fixExplanation: string;
  proofOfConcept: string; 
  cwe?: string;
  capec?: string; 
  cvssScore?: number; 
  cvssVector?: string; 
}

export interface ProbableVulnerability {
  category: string; 
  title: string;
  likelihood: 'High' | 'Medium' | 'Low';
  location: string;
  reasoning: string; 
  verificationSteps: string; 
}

export interface SecurityHeader {
  name: string;
  value: string;
  status: 'secure' | 'warning' | 'missing';
}

export interface TechStackItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Server' | 'Other';
  version?: string;
}

export interface SecurityMetrics {
  authScore: number;     
  dbScore: number;       
  networkScore: number;  
  clientScore: number;   
  complianceScore: number; 
}

export interface OWASPItem {
  category: string;
  count: number;
}

export interface Port {
  port: number;
  protocol: string;
  service: string;
  state: 'open' | 'closed' | 'filtered';
  version?: string;
  risk: 'Safe' | 'Low' | 'Medium' | 'High' | 'Critical';
  reason?: string; 
}

export interface ScanResult {
  target: string; 
  scanType: 'url' | 'code';
  siteDescription: string;
  summary: string;
  riskScore: number; 
  maturityLevel: 'Hardened' | 'Enterprise' | 'Standard' | 'Vulnerable'; 
  securityMetrics: SecurityMetrics; 
  owaspDistribution: OWASPItem[];   
  techStack: TechStackItem[];
  vulnerabilities: Vulnerability[];
  probableVulnerabilities: ProbableVulnerability[]; 
  headers: SecurityHeader[];
  ports: Port[]; 
  sitemap: string[]; 
  apiEndpoints: string[]; 
  executiveSummary: string; 
  timestamp?: string; 
  modelUsed?: string; 
}

export interface ScanModule {
  name: string;
  enabled: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export type ScanStatus = 'idle' | 'scanning' | 'analyzing' | 'complete' | 'error';

export type ScanAggressiveness = 'stealth' | 'deep' | 'aggressive';
export type ScanSensitivity = 'high-confidence' | 'all-findings';

export interface ScanConfig {
  aggressiveness: ScanAggressiveness;
  sensitivity: ScanSensitivity;
  model: 'flash' | 'pro' | 'lite';
}

// Added AppSettings interface to fix the import error in SettingsPage
export interface AppSettings {
  highContrast: boolean;
  soundEffects: boolean;
  telemetry: boolean;
}

// --- MONETIZATION TYPES ---

export type PlanType = 'free' | 'onetime_350' | 'onetime_500' | 'sub_1899' | 'sub_2999';

export interface PlanConfig {
  id: PlanType;
  name: string;
  priceDisplay: string;
  maxScans: number; // -1 for unlimited
  resetPeriod?: 'daily' | 'monthly' | 'never';
  allowedModels: ('flash' | 'pro' | 'lite')[];
  allowedModes: ScanAggressiveness[];
  maxTools: number;
  showSolutions: boolean;
  allowDownload: boolean;
  showProbableVulns: boolean;
}

export interface UserSubscription {
  planId: PlanType;
  scansRemaining: number;
  lastResetDate: string; // ISO Date string
  expiryDate?: string; // For monthly subs
}
