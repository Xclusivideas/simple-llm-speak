
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, KeyRound, File } from 'lucide-react';

interface ChatHeaderProps {
  onClearChat: () => void;
  onResetApiKey: () => void;
  hasFileContext?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onClearChat, 
  onResetApiKey,
  hasFileContext = false 
}) => {
  return (
    <div className="bg-muted/50 border-b p-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-lg">Chat with OpenAI</h2>
        {hasFileContext && (
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full flex items-center gap-1">
            <File className="h-3 w-3" />
            File Context
          </span>
        )}
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onResetApiKey}
          title="Change API key"
        >
          <KeyRound className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearChat}
          title="Clear chat"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
