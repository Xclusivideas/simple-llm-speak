
import React, { useRef } from 'react';
import { Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isSupportedFile } from '@/lib/fileUtils';
import { useToast } from '@/components/ui/use-toast';

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onFileSelect, disabled }) => {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isSupportedFile(file)) {
      onFileSelect(file);
    } else {
      toast({
        variant: "destructive",
        title: "Unsupported file type",
        description: "Please upload a text-based file (txt, md, js, ts, json, etc.)"
      });
    }
    
    // Reset the input to allow selecting the same file again
    e.target.value = '';
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        className="hidden"
        accept=".txt,.md,.js,.jsx,.ts,.tsx,.json,.html,.css,.csv"
        disabled={disabled}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleClick}
        disabled={disabled}
        title="Attach a file"
      >
        <Paperclip className="h-4 w-4" />
        <span className="sr-only">Attach file</span>
      </Button>
    </>
  );
};

export default FileUploadButton;
