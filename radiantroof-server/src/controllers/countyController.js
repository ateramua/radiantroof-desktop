const CountyService = require('../services/CountyService');

const countyController = {
  // Get all enabled counties
  async getCounties(req, res) {
    try {
      const counties = CountyService.getEnabledCounties();
      res.json({ success: true, counties });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Fetch expired listings from a specific county
  async fetchExpiredListings(req, res) {
    try {
      const { countyId } = req.params;
      
      const properties = await CountyService.fetchExpiredListings(countyId);
      
      const standardized = properties.map(p => 
        CountyService.standardizeProperty(p, countyId)
      );

      res.json({ 
        success: true, 
        county: countyId,
        count: standardized.length,
        properties: standardized 
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Fetch properties (alias for fetchExpiredListings)
  async fetchProperties(req, res) {
    try {
      const { countyId } = req.params;
      const { type, limit = 50 } = req.query;

      const properties = await CountyService.fetchExpiredListings(countyId, { limit });
      const standardized = properties.map(p => CountyService.standardizeProperty(p, countyId));

      res.json({
        success: true,
        county: countyId,
        type: type || 'all',
        count: standardized.length,
        properties: standardized
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = countyController;