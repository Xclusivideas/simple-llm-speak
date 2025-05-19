
import OpenAI from 'openai';
import { MessageType } from '@/components/ChatMessage';
import { getApiKey, isValidApiKey } from '@/lib/apiKeyUtils';

// Initialize OpenAI client with a function that returns the current API key
const openai = new OpenAI({
  apiKey: 'placeholder_key', // This will be replaced dynamically
  dangerouslyAllowBrowser: true // Only for development - in production use a backend
});

export interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export const DEFAULT_MODEL = 'gpt-4o-mini';

export async function getChatCompletion(
  messages: Array<Pick<MessageType, 'role' | 'content'>>,
  options: ChatCompletionOptions = {}
): Promise<string> {
  try {
    // Get the current API key from localStorage
    const apiKey = getApiKey();
    
    if (!isValidApiKey(apiKey)) {
      throw new Error('Valid API key is required');
    }
    
    // Set the API key for this request
    openai.apiKey = apiKey;

    const completion = await openai.chat.completions.create({
      model: options.model || DEFAULT_MODEL,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens,
    });

    return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error: any) {
    console.error('Error calling OpenAI:', error);
    
    // Check for specific error types
    if (error.status === 429) {
      if (error.error?.type === 'insufficient_quota') {
        throw new Error('You have exceeded your OpenAI API quota. Please check your billing details or use a different API key.');
      } else {
        throw new Error('OpenAI rate limit exceeded. Please try again in a moment.');
      }
    } else if (error.status === 401) {
      throw new Error('Invalid API key. Please check your OpenAI API key and try again.');
    }
    
    throw new Error('Failed to get a response from OpenAI');
  }
}
