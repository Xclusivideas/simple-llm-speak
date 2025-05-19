
import React, { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import ChatHeader from "./ChatHeader";
import ChatMessage, { MessageType } from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { getChatCompletion } from "@/services/openai";
import { getApiKey, saveApiKey } from "@/lib/apiKeyUtils";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>(getApiKey() || "");
  const [showApiKeyInput, setShowApiKeyInput] = useState(!getApiKey());
  
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    saveApiKey(key);
    setShowApiKeyInput(false);
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved",
    });
  };

  const handleSendMessage = async (content: string) => {
    // Check if API key is available
    if (!getApiKey()) {
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
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Get conversation history (excluding welcome message if it's the first real exchange)
      const conversationHistory = messages.length > 1 ? 
        messages.map(m => ({ role: m.role, content: m.content })) : 
        [];

      // Add the new user message to history
      conversationHistory.push({ role: "user", content });

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
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response from OpenAI. Please check your API key and try again."
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
        content: "Hello! How can I assist you today?",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader onClearChat={handleClearChat} />
      
      {showApiKeyInput && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">
              Enter your OpenAI API Key:
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="sk-..."
              />
              <button
                onClick={() => handleApiKeySubmit(apiKey)}
                className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium"
              >
                Save
              </button>
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
        disabled={isLoading} 
      />
    </div>
  );
};

export default Chat;
