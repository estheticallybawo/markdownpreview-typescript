import { useState, useEffect } from 'react';
import { Cloud, CloudUpload, CloudDownload, RefreshCw, Trash2, FileText, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useCloudSync } from '../../hooks/useCloudSync.js';
import styles from './CloudSync.module.css';

interface CloudDocument {
  id: string | number;
  title: string;
  preview: string;
  createdAt: string;
}

interface Notification {
  type: 'success' | 'error';
  message: string;
}

interface CloudSyncProps {
  currentContent: string;
  onContentLoad: (content: string, title: string) => void;
  documentTitle?: string;
}

export function CloudSync({ currentContent, onContentLoad, documentTitle = 'Untitled Document' }: CloudSyncProps) {
  const {
    isLoading,
    error,
    cloudDocuments,
    lastSyncTime,
    saveToCloud,
    loadFromCloud,
    listCloudDocuments,
    deleteFromCloud,
    refreshCloudDocuments,
    clearError
  } = useCloudSync();

  const [isOpen, setIsOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState(documentTitle);
  const [saveTags, setSaveTags] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Load documents on component mount
  useEffect(() => {
    if (isOpen) {
      listCloudDocuments();
    }
  }, [isOpen, listCloudDocuments]);

  // Show notifications
  useEffect(() => {
    if (error) {
      setNotification({ type: 'error', message: error });
      const timer = setTimeout(() => {
        setNotification(null);
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSaveToCloud = async () => {
    if (!currentContent.trim()) {
      setNotification({ type: 'error', message: 'Cannot save empty document' });
      return;
    }

    const result = await saveToCloud(saveTitle || 'Untitled Document', currentContent, saveTags);
    
    if (result.success) {
      setNotification({ type: 'success', message: `Document "${saveTitle}" saved to cloud` });
      setShowSaveForm(false);
      setSaveTitle('');
      setSaveTags('');
      refreshCloudDocuments();
    }
  };

  const handleLoadFromCloud = async (documentId: string | number, title: string) => {
    const result = await loadFromCloud(documentId);
    
    if (result.success) {
      onContentLoad(result.data.content, result.data.title);
      setNotification({ type: 'success', message: `Loaded "${title}" from cloud` });
      setIsOpen(false);
    }
  };

  const handleDeleteFromCloud = async (documentId: string | number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from the cloud?`)) {
      const result = await deleteFromCloud(documentId);
      
      if (result.success) {
        setNotification({ type: 'success', message: `Deleted "${title}" from cloud` });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      {/* Cloud Sync Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.cloudButton}
        aria-label="Cloud Sync"
        title="Sync with Cloud"
      >
        <Cloud className={styles.icon} />
        Cloud
      </button>

      {/* Cloud Sync Modal */}
      {isOpen && (
        <div className={styles.modal} onClick={() => setIsOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <Cloud className={styles.titleIcon} />
                Cloud Sync
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className={styles.closeButton}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                <button
                  onClick={() => setShowSaveForm(!showSaveForm)}
                  className={styles.actionButton}
                  disabled={isLoading}
                >
                  <CloudUpload className={styles.buttonIcon} />
                  Save to Cloud
                </button>
                
                <button
                  onClick={refreshCloudDocuments}
                  className={styles.actionButton}
                  disabled={isLoading}
                >
                  <RefreshCw className={`${styles.buttonIcon} ${isLoading ? styles.spinning : ''}`} />
                  Refresh
                </button>
              </div>

              {/* Save Form */}
              {showSaveForm && (
                <div className={styles.saveForm}>
                  <h3 className={styles.formTitle}>Save Document</h3>
                  <input
                    type="text"
                    placeholder="Document title"
                    value={saveTitle}
                    onChange={(e) => setSaveTitle(e.target.value)}
                    className={styles.formInput}
                  />
                  <input
                    type="text"
                    placeholder="Tags (optional)"
                    value={saveTags}
                    onChange={(e) => setSaveTags(e.target.value)}
                    className={styles.formInput}
                  />
                  <div className={styles.formButtons}>
                    <button
                      onClick={handleSaveToCloud}
                      className={styles.saveButton}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setShowSaveForm(false)}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Documents List */}
              <div className={styles.documentsList}>
                <h3 className={styles.listTitle}>Cloud Documents</h3>
                
                {lastSyncTime && (
                  <div className={styles.syncTime}>
                    <Clock className={styles.clockIcon} />
                    Last sync: {formatDate(lastSyncTime)}
                  </div>
                )}

                {isLoading && cloudDocuments.length === 0 ? (
                  <div className={styles.loading}>Loading documents...</div>
                ) : cloudDocuments.length === 0 ? (
                  <div className={styles.emptyState}>
                    <FileText className={styles.emptyIcon} />
                    <p>No documents found in cloud</p>
                    <p className={styles.emptySubtext}>Save your first document to get started</p>
                  </div>
                ) : (
                  <div className={styles.documents}>
                    {cloudDocuments.map((doc: CloudDocument) => (
                      <div key={doc.id} className={styles.documentItem}>
                        <div className={styles.documentInfo}>
                          <h4 className={styles.documentTitle}>{doc.title}</h4>
                          <p className={styles.documentPreview}>{doc.preview}</p>
                          <span className={styles.documentDate}>
                            {formatDate(doc.createdAt)}
                          </span>
                        </div>
                        <div className={styles.documentActions}>
                          <button
                            onClick={() => handleLoadFromCloud(doc.id, doc.title)}
                            className={styles.loadButton}
                            disabled={isLoading}
                            title="Load document"
                          >
                            <CloudDownload className={styles.actionIcon} />
                          </button>
                          <button
                            onClick={() => handleDeleteFromCloud(doc.id, doc.title)}
                            className={styles.deleteButton}
                            disabled={isLoading}
                            title="Delete document"
                          >
                            <Trash2 className={styles.actionIcon} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.type === 'success' ? (
            <CheckCircle className={styles.notificationIcon} />
          ) : (
            <AlertCircle className={styles.notificationIcon} />
          )}
          <span>{notification.message}</span>
        </div>
      )}
    </>
  );
}