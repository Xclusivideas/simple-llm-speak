
import React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import FileAttachment, { FileData } from "./FileAttachment";

export type MessageType = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp?: Date;
  files?: FileData[];
};

interface ChatMessageProps {
  message: MessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-3 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
          <span className="text-xs font-medium">AI</span>
        </Avatar>
      )}
      
      <div className="flex flex-col max-w-[80%] md:max-w-[70%]">
        {/* Files list */}
        {message.files && message.files.length > 0 && (
          <div className="flex flex-col gap-1 mb-2">
            {message.files.map((file) => (
              <FileAttachment key={file.id} file={file} />
            ))}
          </div>
        )}
        
        <div
          className={cn(
            "px-4 py-3 rounded-xl break-words",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-secondary text-secondary-foreground rounded-bl-none"
          )}
        >
          {message.content}
        </div>
        
        {message.timestamp && (
          <span className={cn("text-xs text-muted-foreground mt-1", 
            isUser ? "text-right" : "text-left"
          )}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        )}
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 bg-muted">
          <span className="text-xs font-medium">You</span>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
