export interface FranchiseLead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  currentBusiness: string;
  commercialSpaceStatus: string;
  carpetArea: string;
  investmentBudget: string;
  expectedTimeline: string;
  message: string;
  submittedAt: string;
  status: 'New' | 'Contacted' | 'In Discussion' | 'Approved' | 'Rejected';
  notes?: string;
}

export const INITIAL_FRANCHISE_LEADS: FranchiseLead[] = [
  {
    id: 'FL-2026-081',
    fullName: 'Rajesh Subramanian',
    email: 'rajesh.subramanian@retailventures.in',
    phone: '+91 98402 11982',
    city: 'Chennai',
    state: 'Tamil Nadu',
    currentBusiness: 'Footwear & Apparel Retailer (12+ years experience)',
    commercialSpaceStatus: 'Ready commercial space available (Owned/Leased)',
    carpetArea: '1500 - 2000 sq. ft.',
    investmentBudget: '₹35 Lakhs - ₹50 Lakhs',
    expectedTimeline: 'Immediate (Within 30 days)',
    message: 'We own a prime high-street commercial showroom on Anna Nagar 2nd Avenue. Looking to partner for FOFO flagship kids fashion store.',
    submittedAt: '15 Oct 2026, 03:15 PM',
    status: 'In Discussion',
    notes: 'Site inspection completed. High footfall near pediatric clinic.',
  },
  {
    id: 'FL-2026-079',
    fullName: 'Meenakshi Sundaram',
    email: 'meenakshi.s@coimbatorefashion.com',
    phone: '+91 94431 87210',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    currentBusiness: 'Textile Manufacturing & Distribution',
    commercialSpaceStatus: 'Space identified in top-tier shopping mall',
    carpetArea: '1000 - 1500 sq. ft.',
    investmentBudget: '₹25 Lakhs - ₹35 Lakhs',
    expectedTimeline: 'Within 60 days',
    message: 'Interested in FOCO model for Brookefields Mall corridor. Please share ROI documentation and brand margin structure.',
    submittedAt: '12 Oct 2026, 11:40 AM',
    status: 'Contacted',
    notes: 'Sent FOCO prospectus & margin slab on WhatsApp.',
  },
  {
    id: 'FL-2026-074',
    fullName: 'Vikramaditya Rao',
    email: 'vikram.rao@hyderabadretails.com',
    phone: '+91 99890 44219',
    city: 'Hyderabad',
    state: 'Telangana',
    currentBusiness: 'Pharmaceutical Distribution & Supermarket Chains',
    commercialSpaceStatus: 'Looking for brand recommendation on prime location',
    carpetArea: '2000+ sq. ft.',
    investmentBudget: '₹50 Lakhs+',
    expectedTimeline: 'Immediate (Within 30 days)',
    message: 'Looking to set up multiple Voraeclat stores across Gachibowli and Banjara Hills. Ready with investment capital.',
    submittedAt: '08 Oct 2026, 05:20 PM',
    status: 'Approved',
    notes: 'LOI signed. Store fitout blueprint shared with architecture team.',
  },
  {
    id: 'FL-2026-068',
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@blrventures.in',
    phone: '+91 97410 33819',
    city: 'Bengaluru',
    state: 'Karnataka',
    currentBusiness: 'Early Childhood Education & Daycare Director',
    commercialSpaceStatus: 'Ready commercial space available (Owned/Leased)',
    carpetArea: '1000 - 1500 sq. ft.',
    investmentBudget: '₹25 Lakhs - ₹35 Lakhs',
    expectedTimeline: 'Within 45 days',
    message: 'Passionate about child development. We have a 1,200 sq ft ground floor space in Indiranagar 100ft road.',
    submittedAt: '02 Oct 2026, 01:10 PM',
    status: 'New',
    notes: 'Follow up scheduled for Monday morning.',
  },
];

const STORAGE_KEY_LEADS = 'puppy_shame_franchise_leads';

export const getStoredFranchiseLeads = (): FranchiseLead[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEADS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  try {
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(INITIAL_FRANCHISE_LEADS));
  } catch {
    // ignore
  }
  return INITIAL_FRANCHISE_LEADS;
};

export const saveStoredFranchiseLeads = (leads: FranchiseLead[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads));
  } catch {
    // ignore
  }
};

export const appendFranchiseLead = (lead: FranchiseLead): FranchiseLead[] => {
  const current = getStoredFranchiseLeads();
  const updated = [lead, ...current];
  saveStoredFranchiseLeads(updated);
  return updated;
};
