import { useState, useCallback } from 'react';
import {
  saveMarkdownToAPI,
  loadMarkdownFromAPI,
  listMarkdownDocuments,
  deleteMarkdownFromAPI,
  updateMarkdownInAPI
} from '../lib/api';

interface CloudDocument {
  id: string | number;
  title: string;
  content?: string;
  preview?: string;
  tags?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface APIResponse {
  success: boolean;
  data?: any;
  message?: string;
}

interface CloudSyncReturn {
  isLoading: boolean;
  error: string | null;
  cloudDocuments: CloudDocument[];
  lastSyncTime: string | null;
  saveToCloud: (title: string, content: string, tags?: string) => Promise<APIResponse>;
  loadFromCloud: (documentId: string | number) => Promise<APIResponse>;
  listCloudDocuments: (limit?: number) => Promise<APIResponse>;
  deleteFromCloud: (documentId: string | number) => Promise<APIResponse>;
  updateInCloud: (documentId: string | number, title: string, content: string, tags?: string) => Promise<APIResponse>;
  refreshCloudDocuments: () => Promise<APIResponse>;
  clearError: () => void;
}

/**
 * Custom hook for cloud synchronization operations
 */
export function useCloudSync(): CloudSyncReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cloudDocuments, setCloudDocuments] = useState<CloudDocument[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Save document to cloud
  const saveToCloud = useCallback(async (title: string, content: string, tags: string = ''): Promise<APIResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await saveMarkdownToAPI(title, content, tags);
      
      if (result.success) {
        setLastSyncTime(new Date().toISOString());
        return result;
      } else {
        setError(result.message || 'Failed to save to cloud');
        return result;
      }
    } catch (err: any) {
      const errorMsg = 'Network error: Unable to save to cloud';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load document from cloud
  const loadFromCloud = useCallback(async (documentId: string | number): Promise<APIResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await loadMarkdownFromAPI(documentId);
      
      if (result.success) {
        setLastSyncTime(new Date().toISOString());
        return result;
      } else {
        setError(result.message || 'Failed to load from cloud');
        return result;
      }
    } catch (err: any) {
      const errorMsg = 'Network error: Unable to load from cloud';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // List all cloud documents
  const listCloudDocuments = useCallback(async (limit: number = 10): Promise<APIResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await listMarkdownDocuments(limit);
      
      if (result.success) {
        setCloudDocuments(result.data);
        setLastSyncTime(new Date().toISOString());
        return result;
      } else {
        setError(result.message || 'Failed to list cloud documents');
        return result;
      }
    } catch (err: any) {
      const errorMsg = 'Network error: Unable to fetch cloud documents';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete document from cloud
  const deleteFromCloud = useCallback(async (documentId: string | number): Promise<APIResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await deleteMarkdownFromAPI(documentId);
      
      if (result.success) {
        // Remove from local state
        setCloudDocuments(prev => prev.filter(doc => doc.id !== documentId));
        setLastSyncTime(new Date().toISOString());
        return result;
      } else {
        setError(result.message || 'Failed to delete from cloud');
        return result;
      }
    } catch (err: any) {
      const errorMsg = 'Network error: Unable to delete from cloud';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update document in cloud
  const updateInCloud = useCallback(async (
    documentId: string | number, 
    title: string, 
    content: string, 
    tags: string = ''
  ): Promise<APIResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await updateMarkdownInAPI(documentId, title, content, tags);
      
      if (result.success) {
        setLastSyncTime(new Date().toISOString());
        return result;
      } else {
        setError(result.message || 'Failed to update cloud document');
        return result;
      }
    } catch (err: any) {
      const errorMsg = 'Network error: Unable to update cloud document';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh cloud documents list
  const refreshCloudDocuments = useCallback(() => {
    return listCloudDocuments();
  }, [listCloudDocuments]);

  return {
    // State
    isLoading,
    error,
    cloudDocuments,
    lastSyncTime,
    
    // Actions
    saveToCloud,
    loadFromCloud,
    listCloudDocuments,
    deleteFromCloud,
    updateInCloud,
    refreshCloudDocuments,
    clearError
  };
}