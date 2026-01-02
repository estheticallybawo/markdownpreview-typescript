/**
 * API service for saving and loading markdown content
 * Supports multiple endpoints with fallback options
 */

// API Configuration
interface APIEndpoint {
  name: string;
  baseUrl: string;
  endpoints: {
    posts: string;
    post: (id: string | number) => string;
  };
}

interface APIConfig {
  primary: APIEndpoint;
  fallback: APIEndpoint;
}

const API_CONFIG: APIConfig = {
  primary: {
    name: 'oluwasetemi',
    baseUrl: 'https://api.oluwasetemi.dev',
    endpoints: {
      posts: '/posts',
      post: (id: string | number) => `/posts/${id}`
    }
  },
  fallback: {
    name: 'jsonplaceholder',
    baseUrl: 'https://jsonplaceholder.typicode.com',
    endpoints: {
      posts: '/posts',
      post: (id: string | number) => `/posts/${id}`
    }
  }
};

// Interface for API responses
interface PostData {
  id?: string | number;
  title: string;
  body: string;
  userId: number;
  tags?: string;
  createdAt?: string;
  updatedAt?: string;
  type?: string;
}

interface APIResponse {
  success: boolean;
  data?: any;
  error?: string;
  message: string;
}

interface DocumentPreview {
  id: string | number;
  title: string;
  preview: string;
  createdAt: string;
  type: string;
}

interface DocumentData {
  id: string | number;
  title: string;
  content: string;
  tags: string;
  createdAt: string;
  type: string;
}

/**
 * Generic API request handler with error handling
 */
async function apiRequest(url: string, options: RequestInit = {}): Promise<any> {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

/**
 * Try primary API, fallback to secondary if it fails
 */
async function apiRequestWithFallback(endpoint: string, options: RequestInit = {}): Promise<any> {
  try {
    // Try primary API first
    const primaryUrl = `${API_CONFIG.primary.baseUrl}${endpoint}`;
    return await apiRequest(primaryUrl, options);
  } catch (primaryError) {
    console.warn(`Primary API (${API_CONFIG.primary.name}) failed, trying fallback...`);
    
    try {
      // Fallback to JSONPlaceholder
      const fallbackUrl = `${API_CONFIG.fallback.baseUrl}${endpoint}`;
      return await apiRequest(fallbackUrl, options);
    } catch (fallbackError) {
      console.error('Both APIs failed:', { primaryError, fallbackError });
      throw new Error('All API endpoints are unavailable');
    }
  }
}

/**
 * Save markdown content to the API
 * @param title - Title for the markdown document
 * @param content - Markdown content to save
 * @param tags - Optional tags for the document
 * @returns Promise with saved document data
 */
export async function saveMarkdownToAPI(title: string, content: string, tags: string = ''): Promise<APIResponse> {
  const payload: PostData = {
    title: title || 'Untitled Document',
    body: content,
    userId: 1, // Default user ID for demo purposes
    tags: tags || '',
    createdAt: new Date().toISOString(),
    type: 'markdown'
  };

  try {
    const result = await apiRequestWithFallback(API_CONFIG.primary.endpoints.posts, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    return {
      success: true,
      data: result,
      message: 'Document saved successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to save document to API'
    };
  }
}

/**
 * Load markdown content from the API by ID
 * @param documentId - ID of the document to load
 * @returns Promise with document data
 */
export async function loadMarkdownFromAPI(documentId: string | number): Promise<APIResponse> {
  try {
    const result = await apiRequestWithFallback(API_CONFIG.primary.endpoints.post(documentId));
    
    return {
      success: true,
      data: {
        id: result.id,
        title: result.title,
        content: result.body,
        tags: result.tags || '',
        createdAt: result.createdAt || new Date().toISOString(),
        type: result.type || 'markdown'
      } as DocumentData,
      message: 'Document loaded successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to load document from API'
    };
  }
}

/**
 * Get list of all saved documents
 * @param limit - Maximum number of documents to fetch
 * @returns Promise with list of documents
 */
export async function listMarkdownDocuments(limit: number = 10): Promise<APIResponse> {
  try {
    const result = await apiRequestWithFallback(`${API_CONFIG.primary.endpoints.posts}?_limit=${limit}`);
    
    const documents = Array.isArray(result) ? result : [result];
    
    return {
      success: true,
      data: documents.map((doc: any): DocumentPreview => ({
        id: doc.id,
        title: doc.title,
        preview: doc.body ? doc.body.substring(0, 100) + '...' : '',
        createdAt: doc.createdAt || new Date().toISOString(),
        type: doc.type || 'markdown'
      })),
      message: 'Documents retrieved successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to retrieve documents from API'
    };
  }
}

/**
 * Delete a document from the API
 * @param documentId - ID of the document to delete
 * @returns Promise with deletion result
 */
export async function deleteMarkdownFromAPI(documentId: string | number): Promise<APIResponse> {
  try {
    await apiRequestWithFallback(API_CONFIG.primary.endpoints.post(documentId), {
      method: 'DELETE'
    });
    
    return {
      success: true,
      message: 'Document deleted successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to delete document from API'
    };
  }
}

/**
 * Update existing markdown document
 * @param documentId - ID of the document to update
 * @param title - Updated title
 * @param content - Updated content
 * @param tags - Updated tags
 * @returns Promise with update result
 */
export async function updateMarkdownInAPI(
  documentId: string | number, 
  title: string, 
  content: string, 
  tags: string = ''
): Promise<APIResponse> {
  const payload: PostData = {
    id: documentId,
    title: title || 'Untitled Document',
    body: content,
    userId: 1,
    tags: tags || '',
    updatedAt: new Date().toISOString(),
    type: 'markdown'
  };

  try {
    const result = await apiRequestWithFallback(API_CONFIG.primary.endpoints.post(documentId), {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    return {
      success: true,
      data: result,
      message: 'Document updated successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to update document in API'
    };
  }
}