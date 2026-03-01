// Deal status types
export const DEAL_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  NEGOTIATING: 'negotiating',
  UNDER_CONTRACT: 'under_contract',
  LOST: 'lost',
  ARCHIVED: 'archived'
};

// Source types
export const SOURCE_TYPES = {
  MANUAL: 'manual',
  WHOLESALER: 'wholesaler',
  AGENT: 'agent',
  EXPIRED_MLS: 'expired_mls',
  TAX_DELINQUENT: 'tax_delinquent',
  PROBATE: 'probate',
  FORECLOSURE: 'foreclosure',
  SOCIAL: 'social',
  DIRECT_MAIL: 'direct_mail'
};

// Priority levels
export const PRIORITY = {
  HOT: 'hot',
  WARM: 'warm',
  COLD: 'cold'
};

// Default deal structure
export const createDeal = (data) => ({
  id: generateId(),
  address: data.address || '',
  city: data.city || '',
  state: data.state || 'TX',
  zip: data.zip || '',
  
  // Financials
  askingPrice: data.askingPrice || 0,
  estimatedArv: data.estimatedArv || 0,
  estimatedRepairs: data.estimatedRepairs || 0,
  
  // Source info
  sourceType: data.sourceType || SOURCE_TYPES.MANUAL,
  sourceDetail: data.sourceDetail || '',
  sourceContact: data.sourceContact || '',
  
  // Owner info
  ownerName: data.ownerName || '',
  ownerPhone: data.ownerPhone || '',
  ownerEmail: data.ownerEmail || '',
  
  // Status
  status: DEAL_STATUS.NEW,
  priority: PRIORITY.COLD,
  score: 0,
  
  // Timeline
  createdAt: new Date().toISOString(),
  lastContacted: null,
  nextFollowUp: null,
  
  // Notes
  notes: data.notes || '',
  tags: data.tags || [],
  
  // Calculated fields (to be filled by scoring engine)
  maxOffer: 0,
  estimatedProfit: 0,
  estimatedRoi: 0,
  isGoodDeal: false
});

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}