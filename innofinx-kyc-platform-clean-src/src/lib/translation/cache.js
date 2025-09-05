/**
 * Translation Cache System
 * Manages caching of translations to reduce API costs and improve performance
 */

export class TranslationCache {
  constructor(maxSize = 1000, ttl = 24 * 60 * 60 * 1000) { // 24 hours TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl; // Time to live in milliseconds
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
  }

  /**
   * Generate cache key from text and context
   */
  generateKey(text, context = 'general') {
    // Normalize text for consistent caching
    const normalizedText = text.trim().toLowerCase();
    return `${normalizedText}|${context}`;
  }

  /**
   * Get translation from cache
   */
  get(text, context = 'general') {
    const key = this.generateKey(text, context);
    const cached = this.cache.get(key);

    if (!cached) {
      this.stats.misses++;
      return null;
    }

    // Check if cache entry has expired
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return cached.data;
  }

  /**
   * Store translation in cache
   */
  set(text, context, translationData) {
    const key = this.generateKey(text, context);

    // If cache is at max size, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      this.stats.evictions++;
    }

    const cacheEntry = {
      data: translationData,
      timestamp: Date.now()
    };

    this.cache.set(key, cacheEntry);
  }

  /**
   * Check if translation exists in cache
   */
  has(text, context = 'general') {
    const key = this.generateKey(text, context);
    const cached = this.cache.get(key);

    if (!cached) {
      return false;
    }

    // Check if expired
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Remove specific translation from cache
   */
  delete(text, context = 'general') {
    const key = this.generateKey(text, context);
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.stats.hits,
      misses: this.stats.misses,
      evictions: this.stats.evictions,
      hitRate: hitRate.toFixed(2) + '%',
      ttl: this.ttl
    };
  }

  /**
   * Get cache entries by context
   */
  getByContext(context) {
    const entries = [];
    
    for (const [key, value] of this.cache.entries()) {
      if (key.endsWith(`|${context}`)) {
        entries.push({
          key,
          data: value.data,
          timestamp: value.timestamp,
          age: Date.now() - value.timestamp
        });
      }
    }

    return entries;
  }

  /**
   * Clean expired entries
   */
  cleanExpired() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    console.log(`Cleaned ${cleaned} expired cache entries`);
    return cleaned;
  }

  /**
   * Export cache data for persistence
   */
  export() {
    const data = {
      entries: Array.from(this.cache.entries()),
      stats: this.stats,
      timestamp: Date.now()
    };

    return JSON.stringify(data);
  }

  /**
   * Import cache data from persistence
   */
  import(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      const now = Date.now();

      this.cache.clear();
      
      for (const [key, value] of data.entries) {
        // Only import non-expired entries
        if (now - value.timestamp <= this.ttl) {
          this.cache.set(key, value);
        }
      }

      this.stats = data.stats || {
        hits: 0,
        misses: 0,
        evictions: 0
      };

      console.log(`Imported ${this.cache.size} cache entries`);
    } catch (error) {
      console.error('Failed to import cache data:', error);
    }
  }

  /**
   * Get most frequently accessed translations
   */
  getTopTranslations(limit = 10) {
    // This would require tracking access frequency
    // For now, return most recent entries
    const entries = Array.from(this.cache.entries())
      .map(([key, value]) => ({
        key,
        data: value.data,
        timestamp: value.timestamp
      }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);

    return entries;
  }

  /**
   * Optimize cache by removing least recently used entries
   */
  optimize() {
    if (this.cache.size <= this.maxSize * 0.8) {
      return; // Cache is not full enough to optimize
    }

    // Remove oldest 20% of entries
    const entriesToRemove = Math.floor(this.cache.size * 0.2);
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    for (let i = 0; i < entriesToRemove; i++) {
      this.cache.delete(entries[i][0]);
      this.stats.evictions++;
    }

    console.log(`Optimized cache: removed ${entriesToRemove} old entries`);
  }
}

export default TranslationCache;

