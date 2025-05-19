
// API Key utilities

export const getApiKey = (): string => {
  // Use the API key from localStorage if it exists
  return localStorage.getItem('openai_api_key') || '';
};

export const saveApiKey = (key: string): void => {
  localStorage.setItem('openai_api_key', key);
};

export const clearApiKey = (): void => {
  localStorage.removeItem('openai_api_key');
};

// Override OpenAI configuration with current API key
export const setupOpenAIKey = (key: string): void => {
  // Create a global property for API key that our service can access
  window.openai_key = key;
};

// Add this to window.d.ts
