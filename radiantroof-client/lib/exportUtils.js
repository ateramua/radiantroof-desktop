export const exportToCSV = (properties, filename = 'property-inventory') => {
  // Define CSV headers
  const headers = [
    'ID',
    'Address',
    'Country',
    'Price',
    'Status',
    'Description',
    'Photo URL',
    'Created At',
    'Last Updated',
    'Screening Data',
    'Analysis Data',
    'Decision Data',
    'Acquisition Data'
  ];

  // Format properties data
  const csvData = properties.map(property => [
    property.id,
    property.address || '',
    property.country || 'USA',
    property.price || 0,
    property.status || 'Available',
    property.description || '',
    property.photo || '',
    property.createdAt ? new Date(property.createdAt).toLocaleString() : '',
    property.updatedAt ? new Date(property.updatedAt).toLocaleString() : '',
    JSON.stringify(property.screening || {}),
    JSON.stringify(property.analysis || {}),
    JSON.stringify(property.decision || {}),
    JSON.stringify(property.acquisition || {})
  ]);

  // Combine headers and data
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => 
      typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
    ).join(','))
  ].join('\n');

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};