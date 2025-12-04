const stateLanguageMap = {
  Telangana: 'te',
  'Andhra Pradesh': 'te',
  Karnataka: 'en',
  Kerala: 'en',
  'Tamil Nadu': 'en',
  Maharashtra: 'hi',
  Gujarat: 'hi',
  'Uttar Pradesh': 'hi',
  'Madhya Pradesh': 'hi',
  'Bihar': 'hi',
  'Rajasthan': 'hi',
  'Haryana': 'hi',
  'Punjab': 'hi',
  'Delhi': 'hi',
  'Chhattisgarh': 'hi',
  'Jharkhand': 'hi',
  Odisha: 'en',
  'West Bengal': 'en',
  Assam: 'en',
  'Jammu and Kashmir': 'hi'
};

export const inferLanguageFromLocation = (location) => {
  if (!location) return null;
  const stateName = location.state?.trim();
  if (!stateName) return null;
  return stateLanguageMap[stateName] || 'en';
};

