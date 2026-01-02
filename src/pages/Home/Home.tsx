import { useState, useRef, type ChangeEvent } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage.js';
import useThrottledAutosave from '../../hooks/useThrottledAutosave.js';
import { saveAsMarkdownFile, loadMarkdownFile, sanitizeFilename } from '../../lib/fileOperations.js';
import Editor from '../../components/Editor/Editor.jsx';
import Preview from '../../components/Preview/Preview.jsx';
import { CloudSync } from '../../components/CloudSync/CloudSync.jsx';
import styles from './Home.module.css';

type ViewMode = 'editor' | 'split' | 'preview';

const defaultMarkdown = `# Markdown syntax guide

## Headers

# This is a Heading h1
## This is a Heading h2
###### This is a Heading h6

## Emphasis

*This text will be italic*  
_This will also be italic_

**This text will be bold**  
__This will also be bold__

_You **can** combine them_

## Lists

### Unordered

* Item 1
* Item 2
* Item 2a
* Item 2b
    * Item 3a
    * Item 3b

### Ordered

1. Item 1
2. Item 2
3. Item 3
    1. Item 3a
    2. Item 3b

## Images

![This is an alt text.](/image/sample.webp "This is a sample image.")

## Links

You may be using [Markdown Live Preview]().

## Blockquotes

> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
>
>> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

## Tables

| Left columns  | Right columns |
| ------------- |:-------------:|
| left foo      | right foo     |
| left bar      | right bar     |
| left baz      | right baz     |

## Blocks of code

\`\`\`
let message = 'Hello world';
alert(message);
\`\`\`

## Inline code

This web site is using \`markedjs/marked\`.
`;

function Home() {
  const [markdown, setMarkdown] = useLocalStorage<string>('markdown-content', defaultMarkdown);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState<string>('Untitled Document');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Throttled autosave to localStorage
  const autosaveToStorage = (content: string) => {
    localStorage.setItem('markdown-content', JSON.stringify(content));
    setLastSaved(new Date().toLocaleTimeString());
  };
  
  useThrottledAutosave(markdown, autosaveToStorage, { delay: 2000 });

  const handleClear = () => {
    if (window.confirm('Clear all content?')) {
      setMarkdown('');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset to default?')) {
      setMarkdown(defaultMarkdown);
    }
  };

  const handleSaveFile = () => {
    const filename = prompt('Enter filename (without .md extension):', 'my-document');
    
    // Check if user cancelled the prompt
    if (filename === null) {
      return; // User cancelled, don't save
    }
    
    // Use 'document' as fallback only if user enters empty string
    const finalFilename = filename.trim() || 'document';
    const sanitized = sanitizeFilename(finalFilename);
    const success = saveAsMarkdownFile(markdown, sanitized);
    
    if (success) {
      alert(`File saved as ${sanitized}.md`);
    } else {
      alert('Failed to save file. Please try again.');
    }
  };

  const handleLoadFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const content = await loadMarkdownFile(file);
      setMarkdown(content);
      setDocumentTitle(file.name.replace(/\.(md|markdown|txt)$/i, ''));
      alert(`Successfully loaded ${file.name}`);
    } catch (error: any) {
      console.error('Error loading file:', error);
      alert(`Failed to load file: ${error.message}`);
    } finally {
      setIsLoading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Handler for loading content from cloud
  const handleCloudContentLoad = (content: string, title: string) => {
    setMarkdown(content);
    setDocumentTitle(title || 'Untitled Document');
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.viewControls}>
          <button
            className={`${styles.viewButton} ${viewMode === 'editor' ? styles.active : ''}`}
            onClick={() => setViewMode('editor')}
          >
            Editor
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'split' ? styles.active : ''}`}
            onClick={() => setViewMode('split')}
          >
            Split
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'preview' ? styles.active : ''}`}
            onClick={() => setViewMode('preview')}
          >
            Preview
          </button>
        </div>
        
        <div className={styles.fileOperations}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown,.txt"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button 
            className={styles.actionButton} 
            onClick={handleLoadFile}
            disabled={isLoading}
          >
            Upload
          </button>
          <button 
            className={styles.actionButton} 
            onClick={handleSaveFile}
            disabled={isLoading}
          >
            Save
          </button>
          <CloudSync 
            currentContent={markdown}
            onContentLoad={handleCloudContentLoad}
            documentTitle={documentTitle}
          />
        </div>
        
        <div className={styles.actions}>
          <button className={styles.actionButton} onClick={handleReset}>
            Reset
          </button>
          <button className={styles.actionButton} onClick={handleClear}>
            Clear
          </button>
          {lastSaved && (
            <span className={styles.autosaveIndicator}>
              Auto-saved: {lastSaved}
            </span>
          )}
        </div>
      </div>

      <div className={`${styles.editorContainer} ${styles[viewMode]}`}>
        {(viewMode === 'editor' || viewMode === 'split') && (
          <div className={styles.editorPanel}>
            <Editor
              value={markdown}
              onChange={setMarkdown}
              placeholder="Start writing your markdown here..."
            />
          </div>
        )}
        
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={styles.previewPanel}>
            <Preview 
              markdown={markdown}
              debounceDelay={300}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;