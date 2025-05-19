
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, KeyRound } from 'lucide-react';

interface ChatHeaderProps {
  onClearChat: () => void;
  onResetApiKey: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClearChat, onResetApiKey }) => {
  return (
    <div className="bg-muted/50 border-b p-3 flex justify-between items-center">
      <h2 className="font-semibold text-lg">Chat with OpenAI</h2>
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
