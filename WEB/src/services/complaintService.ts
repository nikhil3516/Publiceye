import { classifyComplaint } from './aiClassifier';
import type { AIClassificationResult } from './aiClassifier';

export type { AIClassificationResult };

export interface Complaint {
  id: string;
  category: "garbage" | "pothole" | "streetlight" | "water_supply" | "drainage" | "roads" | "public_safety" | "others";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  status: "submitted" | "classified" | "assigned" | "in_progress" | "resolved" | "closed" | "escalated";
  location: {
    address: string;
    ward: string;
    lat: number;
    lng: number;
  };
  slaDeadline: string;
  createdAt: string;
  upvoteCount: number;
  photos?: string[];
  resolvedPhoto?: string;
  aiClassification?: {
    confidenceScore: number;
    keywords: string[];
    aiSummary: string;
  };
  timeline: {
    status: string;
    timestamp: string;
    note: string;
    actor: string;
  }[];
  authority?: {
    id: string;
    name: string;
    dept: string;
    contact: string;
    photoInitials: string;
    resolutionRate: number;
  };
  citizenRating?: number;
  citizenFeedback?: string;
  isEscalated?: boolean;
  escalationHistory?: {
    reason: string;
    timestamp: string;
    escalatedTo: string;
  }[];
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: "PE-892341",
    category: "garbage",
    severity: "high",
    title: "Overflowing Bin at Market Street",
    description: "The main bin in front of the vegetable market has not been cleared for 3 days. Foul smell and dogs are scattering waste — dangerous for pedestrians.",
    status: "in_progress",
    location: { address: "Market Street, Ward 12, Main City", ward: "12", lat: 17.3850, lng: 78.4867 },
    slaDeadline: new Date(Date.now() + 12 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    upvoteCount: 15,
    aiClassification: { confidenceScore: 92, keywords: ['dangerous', 'overflow', 'smell'], aiSummary: 'High priority sanitation emergency detected. 24-hour SLA enforced.' },
    timeline: [
      { status: "Submitted", timestamp: new Date(Date.now() - 172800000).toISOString(), note: "Complaint logged by citizen", actor: "Citizen" },
      { status: "AI Classified", timestamp: new Date(Date.now() - 170000000).toISOString(), note: "Categorized as Garbage — High Severity (92% confidence)", actor: "AI System" },
      { status: "Assigned", timestamp: new Date(Date.now() - 160000000).toISOString(), note: "Assigned to Ward 12 Sanitary Inspector", actor: "Admin" },
      { status: "In Progress", timestamp: new Date(Date.now() - 86400000).toISOString(), note: "Truck dispatched for collection", actor: "Sanitary Dept" }
    ],
    authority: { id: "OFF-001", name: "Rajesh Kumar", dept: "Sanitation Department", contact: "9876543210", photoInitials: "RK", resolutionRate: 92 }
  },
  {
    id: "PE-765219",
    category: "streetlight",
    severity: "medium",
    title: "Streetlight Not Working Near School",
    description: "The streetlight at the corner of Lane 5 near Govt Primary School has been flickering and turning off for a week. Children walk this route at dusk.",
    status: "resolved",
    location: { address: "Green Valley Road, Ward 4", ward: "4", lat: 17.4000, lng: 78.5000 },
    slaDeadline: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    upvoteCount: 4,
    resolvedPhoto: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    aiClassification: { confidenceScore: 88, keywords: ['light', 'school', 'dark'], aiSummary: 'Medium priority electrical issue near a school zone.' },
    timeline: [
      { status: "Submitted", timestamp: new Date(Date.now() - 432000000).toISOString(), note: "Complaint logged", actor: "Citizen" },
      { status: "AI Classified", timestamp: new Date(Date.now() - 430000000).toISOString(), note: "Classified as Streetlight — Medium Severity", actor: "AI System" },
      { status: "Assigned", timestamp: new Date(Date.now() - 360000000).toISOString(), note: "Assigned to Amit Verma, Electrical Dept", actor: "Admin" },
      { status: "Resolved", timestamp: new Date(Date.now() - 172800000).toISOString(), note: "Bulb replaced and circuit fixed", actor: "Electrical Dept" }
    ],
    authority: { id: "OFF-003", name: "Amit Verma", dept: "Electrical Department", contact: "9876543212", photoInitials: "AV", resolutionRate: 94 },
    citizenRating: 5,
    citizenFeedback: "Fixed quickly, thank you!"
  },
  {
    id: "PE-543876",
    category: "pothole",
    severity: "critical",
    title: "Giant Pothole Caused Accident",
    description: "A very large pothole on the main bypass road caused an accident yesterday. Two bikes have swerved. Urgent action needed immediately — dangerous and blocked half the road.",
    status: "escalated",
    isEscalated: true,
    location: { address: "Bypass Road, Ward 3, Near Highway", ward: "3", lat: 17.3700, lng: 78.4600 },
    slaDeadline: new Date(Date.now() - 24 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    upvoteCount: 42,
    aiClassification: { confidenceScore: 97, keywords: ['accident', 'dangerous', 'urgent', 'blocked'], aiSummary: 'CRITICAL: Road hazard causing accidents. Immediate 2-hour response required.' },
    escalationHistory: [
      { reason: 'SLA Breached: No action within 24 hours', timestamp: new Date(Date.now() - 86400000).toISOString(), escalatedTo: 'Deputy Commissioner Roads' }
    ],
    timeline: [
      { status: "Submitted", timestamp: new Date(Date.now() - 4 * 86400000).toISOString(), note: "Complaint logged — marked Emergency by citizen", actor: "Citizen" },
      { status: "AI Classified", timestamp: new Date(Date.now() - 4 * 86400000 + 600000).toISOString(), note: "CRITICAL classification — accident reported. 2-hr SLA activated.", actor: "AI System" },
      { status: "Assigned", timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), note: "Assigned to Priya Sharma — Roads Dept", actor: "Admin" },
      { status: "Escalated", timestamp: new Date(Date.now() - 86400000).toISOString(), note: "SLA breached. Auto-escalated to Deputy Commissioner", actor: "System" }
    ],
    authority: { id: "OFF-002", name: "Priya Sharma", dept: "Roads & Infrastructure", contact: "9876543211", photoInitials: "PS", resolutionRate: 87 }
  },
  {
    id: "PE-334512",
    category: "water_supply",
    severity: "medium",
    title: "No Water Supply for 3 Days",
    description: "Our entire colony has had no water supply for 3 consecutive days. The pipeline near Block B seems broken. Multiple households affected.",
    status: "assigned",
    location: { address: "Shanti Colony, Block B, Ward 8", ward: "8", lat: 17.4100, lng: 78.4900 },
    slaDeadline: new Date(Date.now() + 24 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    upvoteCount: 28,
    aiClassification: { confidenceScore: 85, keywords: ['water', 'pipeline', 'broken', 'shortage'], aiSummary: 'Medium priority water supply disruption affecting multiple households.' },
    timeline: [
      { status: "Submitted", timestamp: new Date(Date.now() - 72 * 3600000).toISOString(), note: "Complaint logged", actor: "Citizen" },
      { status: "AI Classified", timestamp: new Date(Date.now() - 71 * 3600000).toISOString(), note: "Water Supply — Medium Severity", actor: "AI System" },
      { status: "Assigned", timestamp: new Date(Date.now() - 48 * 3600000).toISOString(), note: "Assigned to Sunita Patel, Water Supply Board", actor: "Admin" },
    ],
    authority: { id: "OFF-004", name: "Sunita Patel", dept: "Water Supply Board", contact: "9876543213", photoInitials: "SP", resolutionRate: 89 }
  },
  {
    id: "PE-221098",
    category: "drainage",
    severity: "high",
    title: "Sewage Overflow on Residential Street",
    description: "Raw sewage has been overflowing from a broken drain near Park Road for 2 days. Foul smell, health hazard for children and elderly residents.",
    status: "submitted",
    location: { address: "Park Road, Ward 6", ward: "6", lat: 17.3950, lng: 78.4750 },
    slaDeadline: new Date(Date.now() + 18 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    upvoteCount: 7,
    aiClassification: { confidenceScore: 91, keywords: ['sewage', 'overflow', 'hazard', 'smell'], aiSummary: 'High priority drainage emergency. Public health risk identified.' },
    timeline: [
      { status: "Submitted", timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), note: "Complaint logged by citizen", actor: "Citizen" },
      { status: "AI Classified", timestamp: new Date(Date.now() - 5.9 * 3600000).toISOString(), note: "Drainage — High Severity (91% confidence)", actor: "AI System" },
    ],
    authority: { id: "OFF-005", name: "Mohan Das", dept: "Drainage & Sewage", contact: "9876543214", photoInitials: "MD", resolutionRate: 78 }
  },
  {
    id: "PE-119034",
    category: "roads",
    severity: "low",
    title: "Faded Road Markings at Intersection",
    description: "Lane markings at the Rose Garden intersection have completely faded. Causes confusion for drivers, especially at night.",
    status: "classified",
    location: { address: "Rose Garden Intersection, Ward 2", ward: "2", lat: 17.3800, lng: 78.4950 },
    slaDeadline: new Date(Date.now() + 7 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    upvoteCount: 3,
    aiClassification: { confidenceScore: 79, keywords: ['road', 'markings', 'intersection'], aiSummary: 'Low severity road marking issue. Queued for routine maintenance.' },
    timeline: [
      { status: "Submitted", timestamp: new Date(Date.now() - 86400000).toISOString(), note: "Complaint logged", actor: "Citizen" },
      { status: "AI Classified", timestamp: new Date(Date.now() - 85000000).toISOString(), note: "Roads — Low Severity", actor: "AI System" },
    ],
    authority: { id: "OFF-002", name: "Priya Sharma", dept: "Roads & Infrastructure", contact: "9876543211", photoInitials: "PS", resolutionRate: 87 }
  },
];

export const complaintService = {
  getComplaints: async (): Promise<Complaint[]> => {
    await delay(800);
    return MOCK_COMPLAINTS;
  },

  getComplaintById: async (id: string): Promise<Complaint | null> => {
    await delay(500);
    return MOCK_COMPLAINTS.find(c => c.id === id) || null;
  },

  submitComplaint: async (data: {
    category: string;
    description: string;
    severity: string;
    photos: string[];
    location: { lat: number; lng: number; address: string };
  }): Promise<Complaint> => {
    await delay(1500);
    const classification = classifyComplaint(data.description, data.category);
    const id = `PE-${Math.floor(100000 + Math.random() * 900000)}`;
    const slaMs = classification.slaHours * 3600000;

    const newComplaint: Complaint = {
      id,
      category: classification.category,
      severity: classification.severity,
      title: `${data.category.replace(/_/g, ' ')} Issue — ${data.location.address || 'Location Detected'}`,
      description: data.description,
      status: "classified",
      location: { address: data.location.address, ward: '5', lat: data.location.lat, lng: data.location.lng },
      slaDeadline: new Date(Date.now() + slaMs).toISOString(),
      createdAt: new Date().toISOString(),
      upvoteCount: 0,
      photos: data.photos,
      aiClassification: {
        confidenceScore: classification.confidenceScore,
        keywords: classification.keywords,
        aiSummary: classification.aiSummary,
      },
      timeline: [
        { status: "Submitted", timestamp: new Date().toISOString(), note: "Complaint lodged by citizen", actor: "Citizen" },
        { status: "AI Classified", timestamp: new Date(Date.now() + 2000).toISOString(), note: `${classification.category} — ${classification.severity} severity (${classification.confidenceScore}% confidence)`, actor: "AI System" },
        { status: "Assigned", timestamp: new Date(Date.now() + 5000).toISOString(), note: `Assigned to ${classification.assignedOfficer.name}`, actor: "Admin" },
      ],
      authority: {
        id: classification.assignedOfficer.id,
        name: classification.assignedOfficer.name,
        dept: classification.assignedOfficer.department,
        contact: classification.assignedOfficer.contact,
        photoInitials: classification.assignedOfficer.photoInitials,
        resolutionRate: classification.assignedOfficer.resolutionRate,
      },
    };

    MOCK_COMPLAINTS.unshift(newComplaint);
    return newComplaint;
  },

  updateComplaintStatus: async (id: string, status: Complaint['status'], note: string): Promise<void> => {
    await delay(500);
    const complaint = MOCK_COMPLAINTS.find(c => c.id === id);
    if (complaint) {
      complaint.status = status;
      complaint.timeline.push({
        status: status.replace('_', ' '),
        timestamp: new Date().toISOString(),
        note,
        actor: 'Admin',
      });
    }
  },

  submitCitizenRating: async (id: string, rating: number, feedback: string): Promise<void> => {
    await delay(500);
    const complaint = MOCK_COMPLAINTS.find(c => c.id === id);
    if (complaint) {
      complaint.citizenRating = rating;
      complaint.citizenFeedback = feedback;
      complaint.status = 'closed';
    }
  },
};
