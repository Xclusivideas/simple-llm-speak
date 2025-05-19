
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";

interface ChatHeaderProps {
  onClearChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClearChat }) => {
  return (
    <div className="flex items-center justify-between border-b bg-background p-4">
      <h1 className="text-lg font-semibold">Chat with AI</h1>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClearChat}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear conversation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ChatHeader;
