import fs from 'fs';
import path from 'path';

export type UserRole = 'startup' | 'investor';

export interface UserRecord {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  passwordHash: string;
  // Startup fields
  startupName?: string;
  startupDetails?: string;
  // Investor fields
  firmName?: string;
  firmDetails?: string;
  portfolio?: string;
  createdAt: string;
}

export interface WaitlistRecord {
  id: string;
  name: string;
  email: string;
  accountType: 'Startup' | 'Investor' | 'Solopreneur';
  createdAt: string;
}

export interface DeckEvaluationRecord {
  id: string;
  userId: string;
  fileName: string;
  fileSizeBytes: number;
  estimatedSlides: number;
  overallScore: number;
  aiPowered: boolean;
  summary: string;
  presentSections: string[];
  missingInformation: string[];
  weakSlides: Array<{ slide: string; issue: string; fix: string }>;
  financialNarrativeGaps: string[];
  recommendations: string[];
  createdAt: string;
}

export interface DueDiligenceItem {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  hash?: string;
  updatedAt: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  waitlist: WaitlistRecord[];
  deckEvaluations: DeckEvaluationRecord[];
  dueDiligenceByUser: Record<string, DueDiligenceItem[]>;
}

const DEFAULT_DB: DatabaseSchema = {
  users: [],
  waitlist: [],
  deckEvaluations: [],
  dueDiligenceByUser: {},
};

// In-memory cache for serverless environments where disk is read-only
let memoryDb: DatabaseSchema | null = null;

function getDbPath(): string {
  return path.join(process.cwd(), '.data', 'waou_db.json');
}

export function readDb(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }
  try {
    const dbPath = getDbPath();
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, 'utf8');
      const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;
      memoryDb = {
        users: parsed.users || [],
        waitlist: parsed.waitlist || [],
        deckEvaluations: parsed.deckEvaluations || [],
        dueDiligenceByUser: parsed.dueDiligenceByUser || {},
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
    // Read-only filesystem in serverless environments is handled gracefully via memoryDb
  }
}

export function getDefaultDueDiligenceChecklist(): DueDiligenceItem[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'inc-docs',
      title: 'Certificate of Incorporation & Bylaws',
      category: 'Corporate',
      completed: false,
      updatedAt: now,
    },
    {
      id: 'cap-table',
      title: 'Fully Diluted Cap Table',
      category: 'Equity',
      completed: false,
      updatedAt: now,
    },
    {
      id: 'fin-model',
      title: '5-Year Financial Forecast & Assumptions',
      category: 'Financials',
      completed: false,
      updatedAt: now,
    },
    {
      id: 'ip-assign',
      title: 'Founder IP Assignment & Vesting Agreements',
      category: 'Legal & IP',
      completed: false,
      updatedAt: now,
    },
    {
      id: 'bank-stmts',
      title: 'Past 3 Months Bank Statements & Burn Summary',
      category: 'Financials',
      completed: false,
      updatedAt: now,
    },
    {
      id: 'cust-cohorts',
      title: 'Customer Retention Cohorts & Key Contracts',
      category: 'Traction',
      completed: false,
      updatedAt: now,
    },
  ];
}
