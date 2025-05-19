
import OpenAI from 'openai';
import { MessageType } from '@/components/ChatMessage';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
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
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw new Error('Failed to get a response from OpenAI');
  }
}
