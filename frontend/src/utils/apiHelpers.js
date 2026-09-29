import { API_BASE_URL } from './config';

/**
 * Simple helper function using native fetch() to call SmartServe Express APIs
 */
export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const config = {
    ...options,
    headers: defaultHeaders
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMsg = `API error (${response.status})`;
    try {
      const errJson = await response.json();
      errorMsg = errJson.message || errorMsg;
    } catch (e) {
      // Ignore parse error
    }
    throw new Error(errorMsg);
  }

  return await response.json();
}

export const apiFetch = fetchApi;
export default fetchApi;

