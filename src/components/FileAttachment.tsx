
import React from 'react';
import { File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface FileData {
  id: string;
  name: string;
  content: string;
  size: number;
}

interface FileAttachmentProps {
  file: FileData;
  onRemove?: () => void;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({ file, onRemove }) => {
  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
      <File className="h-4 w-4 flex-shrink-0" />
      <div className="text-sm truncate flex-grow">
        {file.name} <span className="text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
      </div>
      {onRemove && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 hover:bg-destructive/10" 
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remove file</span>
        </Button>
      )}
    </div>
  );
};

export default FileAttachment;
