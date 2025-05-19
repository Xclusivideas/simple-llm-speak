
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import FileUploadButton from "./FileUploadButton";
import FileAttachment, { FileData } from "./FileAttachment";
import { readFileAsText, truncateContent } from "@/lib/fileUtils";

interface ChatInputProps {
  onSendMessage: (message: string, files?: FileData[]) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false 
}) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<FileData[]>([]);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || files.length > 0) && !disabled && !uploading) {
      onSendMessage(message.trim(), files.length > 0 ? files : undefined);
      setMessage("");
      setFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = async (file: File) => {
    try {
      setUploading(true);
      const content = await readFileAsText(file);
      
      // Truncate content if it's too long
      const truncatedContent = truncateContent(content);
      
      setFiles(prev => [
        ...prev, 
        { 
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: file.name, 
          content: truncatedContent,
          size: file.size
        }
      ]);
    } catch (error) {
      console.error('Failed to read file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative flex flex-col border-t bg-background p-4"
    >
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {files.map(file => (
            <FileAttachment 
              key={file.id} 
              file={file} 
              onRemove={() => handleRemoveFile(file.id)} 
            />
          ))}
        </div>
      )}
      
      <div className="relative flex items-end gap-2">
        <FileUploadButton 
          onFileSelect={handleFileSelect}
          disabled={disabled || uploading}
        />
        
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={files.length > 0 
            ? "Ask about the attached files or type a message..." 
            : "Type a message..."
          }
          className="min-h-12 max-h-36 pr-12 resize-none"
          disabled={disabled || uploading}
        />
        
        <Button 
          type="submit" 
          size="icon" 
          className="absolute right-2 bottom-2" 
          disabled={disabled || uploading || (message.trim() === "" && files.length === 0)}
        >
          <Send size={18} />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
