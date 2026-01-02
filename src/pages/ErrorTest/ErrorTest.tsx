import { useState } from 'react';
import styles from './ErrorTest.module.css';

function ErrorTest() {
  const [showError, setShowError] = useState<boolean>(false);

  const triggerError = () => {
    setShowError(true);
  };

  if (showError) {
    throw new Error('This is a test error for ErrorBoundary testing!');
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Error Boundary Test</h1>
      <p className={styles.description}>
        This page is used to test the ErrorBoundary component. Click the button below to trigger an error.
      </p>
      <button 
        className={styles.errorButton}
        onClick={triggerError}
      >
        Trigger Test Error
      </button>
    </div>
  );
}

export default ErrorTest;