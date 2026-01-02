import { useEffect, useState } from 'react';
import { createDebouncedParser } from '../../lib/markdownParser.ts';
import styles from './Preview.module.css';

interface PreviewProps {
  markdown: string;
  debounceDelay?: number;
}

const Preview = ({ markdown, debounceDelay = 300 }: PreviewProps) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Create debounced parser instance
  const debouncedParser = createDebouncedParser(debounceDelay);

  useEffect(() => {
    if (!markdown) {
      setHtmlContent('');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Use debounced parser to avoid performance issues with large content
    debouncedParser(markdown, (parsedHTML: string) => {
      setHtmlContent(parsedHTML);
      setIsLoading(false);
    });
  }, [markdown, debouncedParser]);

  const wordCount = markdown ? markdown.trim().split(/\s+/).filter(word => word.length > 0).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // Assuming 200 words per minute

  return (
    <div className={styles.previewContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>Preview</h3>
        <div className={styles.stats}>
          <span className={styles.stat}>
            {wordCount} words
          </span>
          <span className={styles.stat}>
            {readingTime} min read
          </span>
          {isLoading && (
            <span className={styles.loadingIndicator}>
              Updating...
            </span>
          )}
        </div>
      </div>
      <div className={styles.content}>
        {htmlContent ? (
          <div 
            className={styles.markdown}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <div className={styles.emptyState}>
            <p>Start typing in the editor to see a preview of your markdown.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;