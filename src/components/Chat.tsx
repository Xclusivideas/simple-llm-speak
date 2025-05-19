
import React, { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import ChatHeader from "./ChatHeader";
import ChatMessage, { MessageType } from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

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
  
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
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
      // Simulate API call to LLM
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you'd call your API here
      // const response = await fetch("/api/chat", {
      //   method: "POST",
      //   body: JSON.stringify({ message: content }),
      // });
      
      // Add AI response
      const aiResponse: MessageType = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `I received your message: "${content}". This is a placeholder response. In a real application, this would be replaced with an actual response from an LLM API.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response from the AI. Please try again."
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
