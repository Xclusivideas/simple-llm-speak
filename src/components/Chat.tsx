
import React, { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import ChatHeader from "./ChatHeader";
import ChatMessage, { MessageType } from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { getChatCompletion } from "@/services/openai";
import { getApiKey, saveApiKey, clearApiKey, isValidApiKey } from "@/lib/apiKeyUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileData } from "./FileAttachment";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! How can I assist you today? You can upload files and I'll analyze them for you.",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>(getApiKey() || "");
  // Explicitly check for empty strings and invalid API key format
  const [showApiKeyInput, setShowApiKeyInput] = useState(!isValidApiKey(getApiKey()));
  const [hasFileContext, setHasFileContext] = useState(false);
  
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to check API key on startup
  useEffect(() => {
    const storedKey = getApiKey();
    if (!isValidApiKey(storedKey)) {
      setShowApiKeyInput(true);
    }
  }, []);

  // Effect to check if any messages have file context
  useEffect(() => {
    const hasFiles = messages.some(msg => msg.files && msg.files.length > 0);
    setHasFileContext(hasFiles);
  }, [messages]);

  const handleApiKeySubmit = (key: string) => {
    if (!isValidApiKey(key)) {
      toast({
        variant: "destructive",
        title: "Invalid API Key",
        description: "Please enter a valid OpenAI API key (starting with sk-)",
      });
      return;
    }

    setApiKey(key);
    saveApiKey(key);
    setShowApiKeyInput(false);
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved",
    });
  };

  const handleResetApiKey = () => {
    clearApiKey();
    setApiKey("");
    setShowApiKeyInput(true);
    toast({
      title: "API Key Reset",
      description: "Please enter a new OpenAI API key",
    });
  };

  const handleSendMessage = async (content: string, files?: FileData[]) => {
    // Check if API key is available and valid
    const currentKey = getApiKey();
    if (!isValidApiKey(currentKey)) {
      setShowApiKeyInput(true);
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to continue",
      });
      return;
    }

    // Add user message
    const newUserMessage: MessageType = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
      files
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Get conversation history (excluding welcome message if it's the first real exchange)
      const conversationHistory = messages.length > 1 ? 
        messages.map(m => ({ 
          role: m.role, 
          content: m.content,
          files: m.files 
        })) : 
        [];

      // Add the new user message to history
      conversationHistory.push({ 
        role: "user", 
        content,
        files
      });

      // Call OpenAI
      const aiResponseText = await getChatCompletion(conversationHistory);
      
      // Add AI response
      const aiResponse: MessageType = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: aiResponseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error: any) {
      console.error("Error getting AI response:", error);
      
      // Show specific error message based on error content
      let errorDescription = "Failed to get a response from OpenAI. Please check your API key and try again.";
      
      if (error.message?.includes('exceeded your OpenAI API quota')) {
        errorDescription = "You've exceeded your OpenAI API quota. Please check your billing details or use a different API key.";
        // When quota is exceeded, prompt for a new API key
        setShowApiKeyInput(true);
      } else if (error.message?.includes('rate limit')) {
        errorDescription = "OpenAI rate limit reached. Please wait a moment and try again.";
      } else if (error.message?.includes('API key')) {
        errorDescription = "Invalid API key. Please check your OpenAI API key and try again.";
        setShowApiKeyInput(true);
      } else if (error.message?.includes('too large for the model')) {
        errorDescription = "The files you uploaded are too large for the model's context window. Try with smaller files.";
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorDescription
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! How can I assist you today? You can upload files and I'll analyze them for you.",
        timestamp: new Date()
      }
    ]);
    // Reset file context flag
    setHasFileContext(false);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        onClearChat={handleClearChat} 
        onResetApiKey={handleResetApiKey} 
        hasFileContext={hasFileContext}
      />
      
      {showApiKeyInput && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">
              Enter your OpenAI API Key:
            </label>
            <div className="flex gap-2">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="sk-..."
              />
              <Button
                onClick={() => handleApiKeySubmit(apiKey)}
                className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium"
              >
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>
        </div>
      )}
      
      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isLoading || showApiKeyInput} 
      />
    </div>
  );
};

export default Chat;

