import { useState, useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import styles from './Editor.module.css';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Editor = ({ value, onChange, placeholder = "Start typing your markdown here..." }: EditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Handle focus and blur for styling
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Handle tab key for indentation
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className={`${styles.editorContainer} ${isFocused ? styles.focused : ''}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Markdown Editor</h3>
        <div className={styles.stats}>
          <span className={styles.stat}>
            {value.length} characters
          </span>
          <span className={styles.stat}>
            {value.split('\n').length} lines
          </span>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
};

export default Editor;