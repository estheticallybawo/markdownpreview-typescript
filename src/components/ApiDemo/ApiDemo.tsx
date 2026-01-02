import { useState } from 'react';
import { 
  saveMarkdownToAPI, 
  loadMarkdownFromAPI, 
  listMarkdownDocuments 
} from '../../lib/api.ts';
import styles from './ApiDemo.module.css';

interface TestResult {
  id: number;
  timestamp: string;
  operation: string;
  success: boolean;
  data: any;
  error: string | null;
}

interface APIResult {
  success: boolean;
  data?: any;
  error?: string;
}

export function ApiDemo() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (operation: string, success: boolean, data: any, error: string | null) => {
    const result: TestResult = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      operation,
      success,
      data,
      error
    };
    setTestResults(prev => [result, ...prev]);
  };

  const testSaveAPI = async () => {
    setIsLoading(true);
    try {
      const result: APIResult = await saveMarkdownToAPI(
        'API Test Document',
        '# Test Document\n\nThis is a test document created from the Markdown Preview App.\n\n## Features Tested\n- Save to API\n- JSON serialization\n- Error handling',
        'test, api, demo'
      );
      addResult('Save Document', result.success, result.data, result.error || null);
    } catch (error: any) {
      addResult('Save Document', false, null, error.message);
    }
    setIsLoading(false);
  };

  const testLoadAPI = async () => {
    setIsLoading(true);
    try {
      // Test with ID 1 (should exist in JSONPlaceholder)
      const result: APIResult = await loadMarkdownFromAPI(1);
      addResult('Load Document', result.success, result.data, result.error || null);
    } catch (error: any) {
      addResult('Load Document', false, null, error.message);
    }
    setIsLoading(false);
  };

  const testListAPI = async () => {
    setIsLoading(true);
    try {
      const result: APIResult = await listMarkdownDocuments(5);
      addResult('List Documents', result.success, result.data, result.error || null);
    } catch (error: any) {
      addResult('List Documents', false, null, error.message);
    }
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>API Integration Demo</h2>
      <p className={styles.description}>
        Test the cloud sync functionality with live API calls
      </p>

      <div className={styles.controls}>
        <button
          onClick={testSaveAPI}
          disabled={isLoading}
          className={styles.testButton}
        >
          Test Save API
        </button>
        <button
          onClick={testLoadAPI}
          disabled={isLoading}
          className={styles.testButton}
        >
          Test Load API
        </button>
        <button
          onClick={testListAPI}
          disabled={isLoading}
          className={styles.testButton}
        >
          Test List API
        </button>
        <button
          onClick={clearResults}
          disabled={isLoading}
          className={styles.clearButton}
        >
          Clear Results
        </button>
      </div>

      {isLoading && (
        <div className={styles.loading}>
          Running API test...
        </div>
      )}

      <div className={styles.results}>
        <h3>API Test Results</h3>
        {testResults.length === 0 ? (
          <p className={styles.noResults}>No tests run yet</p>
        ) : (
          <div className={styles.resultsList}>
            {testResults.map(result => (
              <div
                key={result.id}
                className={`${styles.result} ${result.success ? styles.success : styles.error}`}
              >
                <div className={styles.resultHeader}>
                  <span className={styles.operation}>{result.operation}</span>
                  <span className={styles.timestamp}>{result.timestamp}</span>
                  <span className={`${styles.status} ${result.success ? styles.statusSuccess : styles.statusError}`}>
                    {result.success ? 'SUCCESS' : 'ERROR'}
                  </span>
                </div>
                
                {result.success ? (
                  <div className={styles.resultData}>
                    <pre>{JSON.stringify(result.data, null, 2)}</pre>
                  </div>
                ) : (
                  <div className={styles.resultError}>
                    <p><strong>Error:</strong> {result.error}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}