import { marked } from 'marked';
import DOMPurify, { type Config } from 'dompurify';

// Configure marked options for better rendering
marked.setOptions({
  breaks: true, // Convert \n to <br>
  gfm: true, // GitHub Flavored Markdown
});

// Configure DOMPurify to allow common HTML elements and attributes
const purifyConfig: Config = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'strong', 'em', 'u', 'del', 's',
    'a', 'img',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'hr',
    'div', 'span'
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'alt', 'src',
    'id', 'class',
    'target', 'rel'
  ],
  ALLOW_DATA_ATTR: false,
  KEEP_CONTENT: true
};

/**
 * Parse markdown to HTML and sanitize the output
 * @param markdown - The markdown text to parse
 * @returns Sanitized HTML string
 */
export function parseMarkdown(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  try {
    // Parse markdown to HTML
    const rawHTML = marked.parse(markdown) as string;
    
    // Sanitize HTML to prevent XSS attacks
    const sanitizedHTML = DOMPurify.sanitize(rawHTML, purifyConfig);
    
    return sanitizedHTML;
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return '<p>Error parsing markdown content.</p>';
  }
}

type DebouncedParseCallback = (parsedHTML: string) => void;

/**
 * Creates a debounced markdown parser
 * @param delay - Delay in milliseconds
 * @returns Debounced parse function
 */
export function createDebouncedParser(delay: number = 300): (markdown: string, callback: DebouncedParseCallback) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (markdown: string, callback: DebouncedParseCallback) => {
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Set new timeout
    timeoutId = setTimeout(() => {
      const result = parseMarkdown(markdown);
      callback(result);
    }, delay);
  };
}