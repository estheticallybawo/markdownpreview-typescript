/**
 * Save markdown content as a downloadable .md file
 * @param content - The markdown content to save
 * @param filename - The filename (without extension)
 * @returns boolean indicating success
 */
export function saveAsMarkdownFile(content: string, filename: string = 'document'): boolean {
  try {
    // Create a Blob with the markdown content
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    
    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element for download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.md`;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error saving file:', error);
    return false;
  }
}

/**
 * Load markdown content from a .md file
 * @param file - The file object from input[type=file]
 * @returns Promise that resolves to file content
 */
export function loadMarkdownFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }
    
    // Check if it's a markdown file (optional - can load any text file)
    const validExtensions = ['.md', '.markdown', '.txt'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      console.warn('File extension not recognized as markdown, but proceeding anyway');
    }
    
    // Create FileReader
    const reader = new FileReader();
    
    // Set up event handlers
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        resolve(content);
      } catch (error: any) {
        reject(new Error('Error reading file content: ' + error.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file: ' + reader.error));
    };
    
    // Read the file as text
    reader.readAsText(file);
  });
}

/**
 * Get a safe filename from user input
 * @param input - User input for filename
 * @returns Sanitized filename
 */
export function sanitizeFilename(input: string): string {
  if (!input || typeof input !== 'string') {
    return 'document';
  }
  
  // Remove invalid characters and limit length
  return input
    .replace(/[^a-zA-Z0-9\s\-_]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .substring(0, 50) || 'document';
}