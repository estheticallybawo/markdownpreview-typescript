import { useTheme } from '../../contexts/ThemeContext.jsx';
import styles from './ThemeToggle.module.css';

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <span className={styles.label}>
        {isDarkMode ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}

export default ThemeToggle;