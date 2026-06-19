export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Category = 'garbage' | 'pothole' | 'streetlight' | 'water_supply' | 'drainage' | 'roads' | 'public_safety' | 'others';

export interface AIClassificationResult {
  category: Category;
  severity: Severity;
  confidenceScore: number; // 0-100
  keywords: string[];
  assignedOfficer: OfficerProfile;
  slaHours: number;
  aiSummary: string;
}

export interface OfficerProfile {
  id: string;
  name: string;
  department: string;
  contact: string;
  zone: string;
  photoInitials: string;
  resolutionRate: number; // percentage
}

const HIGH_SEVERITY_KEYWORDS = [
  'dangerous', 'accident', 'urgent', 'emergency', 'critical', 'hazard', 'fire',
  'injury', 'blocked', 'flooding', 'collapse', 'electric', 'spark', 'live wire',
  'overflow', 'sewage', 'dead animal', 'manhole', 'open', 'unsafe'
];

const MEDIUM_SEVERITY_KEYWORDS = [
  'broken', 'damaged', 'leaking', 'missing', 'pothole', 'not working',
  'delay', 'pending', 'repair', 'overflowing', 'stink', 'smell', 'pest'
];

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  garbage: ['garbage', 'trash', 'waste', 'bin', 'dump', 'litter', 'dirty', 'sweeping', 'cleaning'],
  pothole: ['pothole', 'pit', 'crater', 'road damage', 'broken road', 'uneven', 'depression'],
  streetlight: ['light', 'streetlight', 'lamp', 'dark', 'street light', 'illumination', 'bulb'],
  water_supply: ['water', 'supply', 'pipeline', 'tap', 'leakage', 'shortage', 'contamination'],
  drainage: ['drainage', 'drain', 'sewage', 'sewer', 'blocked drain', 'flooding', 'waterlogging'],
  roads: ['road', 'traffic', 'signal', 'footpath', 'pavement', 'divider', 'encroachment'],
  public_safety: ['accident', 'fire', 'collapse', 'unsafe', 'hazard', 'criminal', 'violence'],
  others: [],
};

const OFFICERS: OfficerProfile[] = [
  { id: 'OFF-001', name: 'Rajesh Kumar', department: 'Sanitation Department', contact: '9876543210', zone: 'Zone A', photoInitials: 'RK', resolutionRate: 92 },
  { id: 'OFF-002', name: 'Priya Sharma', department: 'Roads & Infrastructure', contact: '9876543211', zone: 'Zone B', photoInitials: 'PS', resolutionRate: 87 },
  { id: 'OFF-003', name: 'Amit Verma', department: 'Electrical Department', contact: '9876543212', zone: 'Zone C', photoInitials: 'AV', resolutionRate: 94 },
  { id: 'OFF-004', name: 'Sunita Patel', department: 'Water Supply Board', contact: '9876543213', zone: 'Zone A', photoInitials: 'SP', resolutionRate: 89 },
  { id: 'OFF-005', name: 'Mohan Das', department: 'Drainage & Sewage', contact: '9876543214', zone: 'Zone D', photoInitials: 'MD', resolutionRate: 78 },
  { id: 'OFF-006', name: 'Kavitha Reddy', department: 'Public Safety Cell', contact: '9876543215', zone: 'Zone B', photoInitials: 'KR', resolutionRate: 96 },
];

const CATEGORY_OFFICER_MAP: Record<Category, string> = {
  garbage: 'OFF-001',
  pothole: 'OFF-002',
  streetlight: 'OFF-003',
  water_supply: 'OFF-004',
  drainage: 'OFF-005',
  roads: 'OFF-002',
  public_safety: 'OFF-006',
  others: 'OFF-001',
};

const SLA_HOURS: Record<Severity, number> = {
  critical: 2,
  high: 24,
  medium: 72,
  low: 168,
};

export function classifyComplaint(text: string, categoryHint?: string): AIClassificationResult {
  const lowerText = text.toLowerCase();
  const foundKeywords: string[] = [];

  // Detect severity
  let severity: Severity = 'low';
  const highMatches = HIGH_SEVERITY_KEYWORDS.filter(kw => lowerText.includes(kw));
  const medMatches = MEDIUM_SEVERITY_KEYWORDS.filter(kw => lowerText.includes(kw));

  if (highMatches.length >= 2) {
    severity = 'critical';
    foundKeywords.push(...highMatches);
  } else if (highMatches.length >= 1) {
    severity = 'high';
    foundKeywords.push(...highMatches);
  } else if (medMatches.length >= 1) {
    severity = 'medium';
    foundKeywords.push(...medMatches);
  }

  // Detect category
  let category: Category = 'others';
  let bestScore = 0;

  if (categoryHint && Object.keys(CATEGORY_KEYWORDS).includes(categoryHint)) {
    category = categoryHint as Category;
  } else {
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      const score = keywords.filter(kw => lowerText.includes(kw)).length;
      if (score > bestScore) {
        bestScore = score;
        category = cat as Category;
        foundKeywords.push(...keywords.filter(kw => lowerText.includes(kw)));
      }
    }
  }

  const officerId = CATEGORY_OFFICER_MAP[category];
  const officer = OFFICERS.find(o => o.id === officerId) || OFFICERS[0];
  const confidence = Math.min(95, 55 + foundKeywords.length * 10 + (category !== 'others' ? 15 : 0));

  const summaries: Record<Severity, string> = {
    critical: 'This issue poses an immediate public safety risk. Emergency response has been initiated.',
    high: 'This complaint has been flagged as high priority and will be addressed within 24 hours.',
    medium: 'AI has classified this as a medium priority issue. Resolution expected within 72 hours.',
    low: 'This is a low severity issue. It has been queued for routine resolution.',
  };

  return {
    category,
    severity,
    confidenceScore: confidence,
    keywords: [...new Set(foundKeywords)].slice(0, 5),
    assignedOfficer: officer,
    slaHours: SLA_HOURS[severity],
    aiSummary: summaries[severity],
  };
}

export function getOfficerById(id: string): OfficerProfile | undefined {
  return OFFICERS.find(o => o.id === id);
}

export function getAllOfficers(): OfficerProfile[] {
  return OFFICERS;
}
