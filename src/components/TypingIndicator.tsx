
import React from "react";
import { cn } from "@/lib/utils";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-3 animate-fade-in">
      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
        <span className="text-xs font-medium text-primary-foreground">AI</span>
      </div>
      
      <div className="px-4 py-3 rounded-xl rounded-bl-none bg-secondary text-secondary-foreground">
        <div className="typing-indicator flex gap-1">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
