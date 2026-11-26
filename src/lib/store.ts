import fs from 'fs';
import path from 'path';

export type UserRole = 'startup' | 'investor' | 'consultant' | 'mentor' | 'incubator';

export interface UserRecord {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  passwordHash: string;
  // Startup / MSME fields
  linkedinProfile?: string;
  mobileNumber?: string;
  companyDetails?: string;
  hasWebsite?: boolean;
  websiteUrl?: string;
  weeklyEmailConsent?: boolean;
  companyName?: string;
  companyLogoUrl?: string;
  stage?: string;
  // Investor / Lender fields
  firmName?: string;
  firmDetails?: string;
  portfolio?: string;
  // Ecosystem Enabler fields (Consultant, Mentor, Incubator)
  organizationName?: string;
  expertiseDetails?: string;
  createdAt: string;
}

export interface FrsArea {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  status: 'complete' | 'issue';
  missingInfo: string;
  suggestedImprovement: string;
  generatedContent: string;
  approvedContent?: string;
}

export interface FrsState {
  fileName?: string;
  extractedCompanyName?: string;
  overallScore: number;
  errorCount: number;
  areas: FrsArea[];
  updatedAt: string;
}

export interface TeamAdvisorMember {
  id: string;
  name: string;
  linkedinProfile: string;
  role: string;
  email: string;
  invited: boolean;
  inviteStatus?: string;
  invitedAt?: string;
}

export interface CompetitorItem {
  name: string;
  url: string;
  offeringSummary: string;
  positioning: string;
}

export interface StrategyWorkflowState {
  gtmStrategy: string;
  revenueModel: string;
  stageSlides: string;
  teamAdvisors: TeamAdvisorMember[];
  hasLogo: boolean | null;
  closingLogoUrl?: string;
  competitors: CompetitorItem[];
  improvedSolutionSlide?: string;
  changeUspMoat: boolean | null;
  uspMoatContent?: string;
  generatedSlides: {
    competitorAnalysis?: string;
    tamSamSom?: string;
    businessModelUnitEconomics?: string;
  };
  updatedAt: string;
}

export interface PartnerMeetingRequest {
  id: string;
  name: string;
  email: string;
  roleType: string;
  preferredDate: string;
  notes: string;
  createdAt: string;
}

export interface WaitlistRecord {
  id: string;
  name: string;
  email: string;
  accountType: string;
  createdAt: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  frsByUser: Record<string, FrsState>;
  strategyByUser: Record<string, StrategyWorkflowState>;
  partnerMeetings: PartnerMeetingRequest[];
  waitlist: WaitlistRecord[];
}

const DEFAULT_DB: DatabaseSchema = {
  users: [],
  frsByUser: {},
  strategyByUser: {},
  partnerMeetings: [],
  waitlist: [],
};

let memoryDb: DatabaseSchema | null = null;

function getDbPath(): string {
  if (process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'waou_db.json');
  }
  return path.join(process.cwd(), '.data', 'waou_db.json');
}

export function readDb(): DatabaseSchema {
  if (memoryDb) return memoryDb;
  try {
    const dbPath = getDbPath();
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, 'utf8');
      const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;
      memoryDb = {
        users: parsed.users || [],
        frsByUser: parsed.frsByUser || {},
        strategyByUser: parsed.strategyByUser || {},
        partnerMeetings: parsed.partnerMeetings || [],
        waitlist: parsed.waitlist || [],
      };
      return memoryDb;
    }
  } catch {
    // Fallback to memory store
  }
  memoryDb = JSON.parse(JSON.stringify(DEFAULT_DB)) as DatabaseSchema;
  return memoryDb;
}

export function writeDb(db: DatabaseSchema): void {
  memoryDb = db;
  try {
    const dbPath = getDbPath();
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  } catch {
    // Read-only filesystem in serverless environments
  }
}

export function getDefaultStrategyState(): StrategyWorkflowState {
  return {
    gtmStrategy: '',
    revenueModel: '',
    stageSlides: '',
    teamAdvisors: [],
    hasLogo: null,
    competitors: [],
    changeUspMoat: null,
    generatedSlides: {},
    updatedAt: new Date().toISOString(),
  };
}
