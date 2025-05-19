
import OpenAI from 'openai';
import { MessageType } from '@/components/ChatMessage';
import { getApiKey, isValidApiKey } from '@/lib/apiKeyUtils';
import { FileData } from '@/components/FileAttachment';

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

/**
 * Format messages with file content for the API
 */
function formatMessagesWithFileContext(
  messages: Array<Pick<MessageType, 'role' | 'content' | 'files'>>,
): Array<OpenAI.Chat.ChatCompletionMessageParam> {
  const formattedMessages: Array<OpenAI.Chat.ChatCompletionMessageParam> = [];
  
  // Add a system message explaining the file context feature
  let hasFiles = false;
  messages.forEach(msg => {
    if (msg.files && msg.files.length > 0) {
      hasFiles = true;
    }
  });
  
  if (hasFiles) {
    formattedMessages.push({
      role: 'system',
      content: `You are an assistant that can access and analyze file content shared by the user. When referencing file content in your responses, be specific about which file you're referring to.`
    });
  }
  
  // Process each message
  for (const msg of messages) {
    // Regular message content
    let content = msg.content || '';
    
    // If this message has files, add their content
    if (msg.files && msg.files.length > 0) {
      content += '\n\n';
      
      // Add files content
      msg.files.forEach(file => {
        content += `\n--- FILE: ${file.name} ---\n`;
        content += file.content;
        content += '\n--- END FILE ---\n\n';
      });
      
      // If it's a user message with files but no text, add a default question
      if (!msg.content.trim() && msg.role === 'user') {
        content += 'Please analyze these files and provide insights.';
      }
    }
    
    // Use a type guard to ensure we're creating a valid message type
    // OpenAI API expects role to be one of: 'system', 'user', 'assistant', 'function', 'tool'
    const role = msg.role as 'system' | 'user' | 'assistant';
    
    formattedMessages.push({
      role: role,
      content: content
    });
  }
  
  return formattedMessages;
}

export async function getChatCompletion(
  messages: Array<Pick<MessageType, 'role' | 'content' | 'files'>>,
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

    // Format messages to include file content if present
    const formattedMessages = formatMessagesWithFileContext(messages);

    const completion = await openai.chat.completions.create({
      model: options.model || DEFAULT_MODEL,
      messages: formattedMessages,
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
    } else if (error.status === 400 && error.error?.message?.includes('maximum context length')) {
      throw new Error('The files you uploaded are too large for the model\'s context window. Please try with smaller or fewer files.');
    }
    
    throw new Error('Failed to get a response from OpenAI');
  }
}
