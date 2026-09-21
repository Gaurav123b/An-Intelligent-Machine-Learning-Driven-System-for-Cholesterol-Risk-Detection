const API_URL = 'http://localhost:8000';

export const predictRisk = async (data) => {
  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Prediction failed');
  return response.json();
};

export const getMetrics = async () => {
  const response = await fetch(`${API_URL}/api/metrics`);
  if (!response.ok) throw new Error('Failed to fetch metrics');
  return response.json();
};

export const getFeatureImportance = async () => {
  const response = await fetch(`${API_URL}/api/feature-importance`);
  if (!response.ok) throw new Error('Failed to fetch feature importance');
  return response.json();
};

export const getCorrelation = async () => {
  const response = await fetch(`${API_URL}/api/correlation`);
  if (!response.ok) throw new Error('Failed to fetch correlation data');
  return response.json();
};
