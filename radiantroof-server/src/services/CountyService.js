// CountyService.js - Core service for county data operations
const CountyService = {
  // ============================================
  // County Configuration
  // ============================================
  
  /**
   * Get all enabled counties
   * @returns {Array} List of enabled counties with their configurations
   */
  getEnabledCounties() {
    return [
      { 
        id: 'travis-tx', 
        name: 'Travis County', 
        state: 'TX', 
        enabled: true
      },
      { 
        id: 'dallas-tx', 
        name: 'Dallas County', 
        state: 'TX', 
        enabled: true
      }
    ];
  },

  // ============================================
  // Property Fetching Methods
  // ============================================
  
  /**
   * Fetch expired listings from a specific county
   * @param {string} countyId - County identifier (e.g., 'travis-tx')
   * @param {Object} params - Additional parameters (type, limit, etc.)
   * @returns {Promise<Array>} Array of property objects
   */
  async fetchExpiredListings(countyId, params = {}) {
    console.log(`📡 Fetching expired listings from ${countyId} with params:`, params);
    
    // Mock data for Travis County
    if (countyId === 'travis-tx') {
      return [
        {
          parcelId: '0123456789',
          address: '123 Main St',
          city: 'Austin',
          zip: '78701',
          ownerName: 'John Smith',
          ownerAddress: '123 Main St, Austin, TX 78701',
          assessedValue: 425000,
          marketValue: 450000,
          lastSalePrice: 275000,
          lastSaleDate: '2015-06-15',
          taxDelinquent: true,
          taxAmount: 8750,
          taxYear: 2024,
          yearBuilt: 1985,
          sqft: 1850,
          bedrooms: 3,
          bathrooms: 2,
          lotSize: 0.25
        },
        {
          parcelId: '9876543210',
          address: '456 Oak Ave',
          city: 'Austin',
          zip: '78702',
          ownerName: 'Mary Johnson',
          ownerAddress: '789 Remote Ln, Dallas, TX 75201',
          assessedValue: 385000,
          marketValue: 410000,
          lastSalePrice: 165000,
          lastSaleDate: '2008-03-20',
          taxDelinquent: false,
          taxAmount: 7200,
          taxYear: 2024,
          yearBuilt: 1975,
          sqft: 1650,
          bedrooms: 3,
          bathrooms: 1.5,
          lotSize: 0.2
        },
        {
          parcelId: '5551234567',
          address: '789 Pine St',
          city: 'Austin',
          zip: '78703',
          ownerName: 'Estate of Robert Davis',
          ownerAddress: '789 Pine St, Austin, TX 78703',
          assessedValue: 625000,
          marketValue: 650000,
          lastSalePrice: 180000,
          lastSaleDate: '1995-11-02',
          taxDelinquent: true,
          taxAmount: 12400,
          taxYear: 2023,
          yearBuilt: 1960,
          sqft: 2100,
          bedrooms: 4,
          bathrooms: 2.5,
          lotSize: 0.3
        }
      ];
    }
    
    // Mock data for Dallas County
    if (countyId === 'dallas-tx') {
      return [
        {
          parcelId: 'DAL-123456',
          address: '123 Elm St',
          city: 'Dallas',
          zip: '75201',
          ownerName: 'Sarah Wilson',
          ownerAddress: '456 Beach Dr, Miami, FL 33139',
          assessedValue: 325000,
          marketValue: 350000,
          lastSalePrice: 195000,
          lastSaleDate: '2010-08-12',
          taxDelinquent: true,
          taxAmount: 6800,
          taxYear: 2024,
          yearBuilt: 1978,
          sqft: 1750,
          bedrooms: 3,
          bathrooms: 2,
          lotSize: 0.22
        },
        {
          parcelId: 'DAL-789012',
          address: '456 Maple Ave',
          city: 'Dallas',
          zip: '75202',
          ownerName: 'Michael Brown',
          ownerAddress: '456 Maple Ave, Dallas, TX 75202',
          assessedValue: 485000,
          marketValue: 510000,
          lastSalePrice: 310000,
          lastSaleDate: '2018-04-05',
          taxDelinquent: false,
          taxAmount: 9800,
          taxYear: 2024,
          yearBuilt: 1995,
          sqft: 2200,
          bedrooms: 4,
          bathrooms: 2.5,
          lotSize: 0.28
        }
      ];
    }
    
    return [];
  },

  /**
   * Fetch from all enabled counties
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Results from all counties
   */
  async fetchAllCounties(params = {}) {
    const counties = this.getEnabledCounties();
    const results = {};
    
    for (const county of counties) {
      try {
        results[county.id] = await this.fetchExpiredListings(county.id, params);
      } catch (error) {
        console.error(`Error fetching ${county.name}:`, error.message);
        results[county.id] = { error: error.message, listings: [] };
      }
    }
    
    return results;
  },

  /**
   * Standardize property format across different county sources
   * @param {Object} rawProperty - Raw property data from county
   * @param {string} countyId - Source county identifier
   * @returns {Object} Standardized property object
   */
  standardizeProperty(rawProperty, countyId) {
    const countyName = countyId === 'travis-tx' ? 'Travis County' : 
                      countyId === 'dallas-tx' ? 'Dallas County' : 
                      'Unknown County';
    
    return {
      id: `${countyId}-${rawProperty.parcelId || Date.now()}`,
      address: rawProperty.address || '',
      city: rawProperty.city || '',
      state: 'TX',
      zip: rawProperty.zip || '',
      parcelId: rawProperty.parcelId || '',
      ownerName: rawProperty.ownerName || '',
      ownerAddress: rawProperty.ownerAddress || '',
      assessedValue: rawProperty.assessedValue || 0,
      marketValue: rawProperty.marketValue || 0,
      lastSalePrice: rawProperty.lastSalePrice || 0,
      lastSaleDate: rawProperty.lastSaleDate || null,
      taxDelinquent: rawProperty.taxDelinquent || false,
      taxAmount: rawProperty.taxAmount || 0,
      taxYear: rawProperty.taxYear || new Date().getFullYear(),
      yearBuilt: rawProperty.yearBuilt || null,
      sqft: rawProperty.sqft || null,
      bedrooms: rawProperty.bedrooms || null,
      bathrooms: rawProperty.bathrooms || null,
      lotSize: rawProperty.lotSize || null,
      sourceType: 'county',
      sourceDetail: countyName,
      fetchedAt: new Date().toISOString()
    };
  }
};

// ✅ Make sure this export is at the bottom
module.exports = CountyService;