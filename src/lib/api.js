// API Cache Utility
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const apiCache = {
  get: (key) => {
    const cached = cache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      cache.delete(key);
      return null;
    }
    return cached.data;
  },

  set: (key, data) => {
    cache.set(key, { data, timestamp: Date.now() });
  },

  clear: (key) => {
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
    }
  },

  invalidate: (pattern) => {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  }
};

export async function fetchWithCache(url, options = {}, cacheKey = null) {
  const key = cacheKey || url;

  const cached = apiCache.get(key);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    apiCache.set(key, data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BACKEND_URL}${url}`;
};
