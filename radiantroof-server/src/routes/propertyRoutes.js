const express = require('express');
const router = express.Router();

// Mock property data for now
const mockProperties = [
  {
    id: 1,
    address: '123 Main St',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    price: 275000,
    status: 'Available'
  },
  {
    id: 2,
    address: '456 Oak Ave',
    city: 'Round Rock',
    state: 'TX',
    zip: '78664',
    price: 315000,
    status: 'Under Contract'
  }
];

// GET all properties
router.get('/', (req, res) => {
  console.log('📋 Fetching all properties');
  res.json(mockProperties);
});

// GET property by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const property = mockProperties.find(p => p.id === parseInt(id));
  
  if (property) {
    res.json(property);
  } else {
    res.status(404).json({ error: 'Property not found' });
  }
});

// POST create new property
router.post('/', (req, res) => {
  const newProperty = {
    id: mockProperties.length + 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  mockProperties.push(newProperty);
  res.status(201).json(newProperty);
});

// PUT update property
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const index = mockProperties.findIndex(p => p.id === parseInt(id));
  
  if (index !== -1) {
    mockProperties[index] = { ...mockProperties[index], ...req.body };
    res.json(mockProperties[index]);
  } else {
    res.status(404).json({ error: 'Property not found' });
  }
});

// DELETE property
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = mockProperties.findIndex(p => p.id === parseInt(id));
  
  if (index !== -1) {
    const deleted = mockProperties.splice(index, 1);
    res.json(deleted[0]);
  } else {
    res.status(404).json({ error: 'Property not found' });
  }
});

console.log('📋 Property routes registered:');
console.log('   GET /api/properties');
console.log('   GET /api/properties/:id');
console.log('   POST /api/properties');
console.log('   PUT /api/properties/:id');
console.log('   DELETE /api/properties/:id');

module.exports = router;