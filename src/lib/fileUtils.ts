
// File utility functions

/**
 * Reads a file and returns its contents as text
 */
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Get file extension from file name
 */
export const getFileExtension = (fileName: string): string => {
  return fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);
};

/**
 * Check if file is a supported text file
 */
export const isSupportedFile = (file: File): boolean => {
  const supportedExtensions = ['txt', 'md', 'js', 'jsx', 'ts', 'tsx', 'json', 'html', 'css', 'csv'];
  const extension = getFileExtension(file.name).toLowerCase();
  return supportedExtensions.includes(extension);
};

/**
 * Truncate content if it's too large for context window
 */
export const truncateContent = (content: string, maxLength: number = 10000): string => {
  if (content.length <= maxLength) return content;
  
  return content.substring(0, maxLength) + 
    `\n\n[Content truncated: ${content.length - maxLength} characters omitted due to length]`;
};
