
// API Key utilities

export const getApiKey = (): string => {
  // Use the API key from localStorage if it exists
  return localStorage.getItem('openai_api_key') || '';
};

export const saveApiKey = (key: string): void => {
  localStorage.setItem('openai_api_key', key);
  // Update the global property when saving
  setupOpenAIKey(key);
};

export const clearApiKey = (): void => {
  localStorage.removeItem('openai_api_key');
};

// Check if API key is empty or invalid format
export const isValidApiKey = (key: string): boolean => {
  // OpenAI keys typically start with "sk-" and have a minimum length
  return key && key.trim() !== '' && key.startsWith('sk-') && key.length > 10;
};

// Override OpenAI configuration with current API key
export const setupOpenAIKey = (key: string): void => {
  // Create a global property for API key that our service can access
  window.openai_key = key;
};

// Add this to window.d.ts
