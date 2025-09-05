/**
 * Fuzzy String Matching Library
 * Implements various string matching algorithms for name matching in KYC
 */

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Edit distance
 */
export function levenshteinDistance(str1, str2) {
  if (!str1 || !str2) return Math.max(str1?.length || 0, str2?.length || 0);
  
  const matrix = [];
  const len1 = str1.length;
  const len2 = str2.length;

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,     // deletion
        matrix[i][j - 1] + 1,     // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Calculate Jaro similarity between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Jaro similarity (0-1)
 */
export function jaroSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;

  const len1 = str1.length;
  const len2 = str2.length;
  const matchWindow = Math.floor(Math.max(len1, len2) / 2) - 1;

  if (matchWindow < 0) return 0;

  const str1Matches = new Array(len1).fill(false);
  const str2Matches = new Array(len2).fill(false);

  let matches = 0;
  let transpositions = 0;

  // Find matches
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchWindow);
    const end = Math.min(i + matchWindow + 1, len2);

    for (let j = start; j < end; j++) {
      if (str2Matches[j] || str1[i] !== str2[j]) continue;
      str1Matches[i] = true;
      str2Matches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0;

  // Count transpositions
  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (!str1Matches[i]) continue;
    while (!str2Matches[k]) k++;
    if (str1[i] !== str2[k]) transpositions++;
    k++;
  }

  return (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3;
}

/**
 * Calculate Jaro-Winkler similarity with prefix bonus
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @param {number} prefixScale - Scaling factor for prefix bonus (default 0.1)
 * @returns {number} - Jaro-Winkler similarity (0-1)
 */
export function jaroWinklerSimilarity(str1, str2, prefixScale = 0.1) {
  const jaroSim = jaroSimilarity(str1, str2);
  
  if (jaroSim < 0.7) return jaroSim;

  // Calculate common prefix length (up to 4 characters)
  let prefixLength = 0;
  const maxPrefix = Math.min(4, Math.min(str1.length, str2.length));
  
  for (let i = 0; i < maxPrefix; i++) {
    if (str1[i] === str2[i]) {
      prefixLength++;
    } else {
      break;
    }
  }

  return jaroSim + (prefixLength * prefixScale * (1 - jaroSim));
}

/**
 * Calculate similarity ratio between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Similarity ratio (0-1)
 */
export function similarityRatio(str1, str2) {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;

  const maxLength = Math.max(str1.length, str2.length);
  const distance = levenshteinDistance(str1, str2);
  
  return (maxLength - distance) / maxLength;
}

/**
 * Calculate Damerau-Levenshtein distance (allows transpositions)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Edit distance with transpositions
 */
export function damerauLevenshteinDistance(str1, str2) {
  if (!str1 || !str2) return Math.max(str1?.length || 0, str2?.length || 0);

  const len1 = str1.length;
  const len2 = str2.length;
  const maxDist = len1 + len2;
  
  const H = {};
  H[-1] = {};
  H[-1][-1] = maxDist;
  
  for (let i = 0; i <= len1; i++) {
    H[i] = {};
    H[i][-1] = maxDist;
    H[i][0] = i;
  }
  
  for (let j = 0; j <= len2; j++) {
    H[-1][j] = maxDist;
    H[0][j] = j;
  }

  const lastRow = {};
  
  for (let i = 1; i <= len1; i++) {
    let lastMatchCol = 0;
    
    for (let j = 1; j <= len2; j++) {
      const i1 = lastRow[str2[j - 1]] || 0;
      const j1 = lastMatchCol;
      let cost = 1;
      
      if (str1[i - 1] === str2[j - 1]) {
        cost = 0;
        lastMatchCol = j;
      }
      
      H[i][j] = Math.min(
        H[i - 1][j] + 1,     // deletion
        H[i][j - 1] + 1,     // insertion
        H[i - 1][j - 1] + cost, // substitution
        H[i1 - 1][j1 - 1] + (i - i1 - 1) + 1 + (j - j1 - 1) // transposition
      );
    }
    
    lastRow[str1[i - 1]] = i;
  }
  
  return H[len1][len2];
}

/**
 * Normalize string for comparison (lowercase, remove special chars, etc.)
 * @param {string} str - Input string
 * @returns {string} - Normalized string
 */
export function normalizeString(str) {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim();
}

/**
 * Calculate multiple similarity metrics for comprehensive matching
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @param {Object} options - Configuration options
 * @returns {Object} - Object containing various similarity scores
 */
export function calculateSimilarityMetrics(str1, str2, options = {}) {
  const {
    normalize = true,
    includePhonetic = false
  } = options;

  let s1 = str1;
  let s2 = str2;

  if (normalize) {
    s1 = normalizeString(str1);
    s2 = normalizeString(str2);
  }

  const metrics = {
    exact: s1 === s2,
    levenshtein: levenshteinDistance(s1, s2),
    levenshteinRatio: similarityRatio(s1, s2),
    jaro: jaroSimilarity(s1, s2),
    jaroWinkler: jaroWinklerSimilarity(s1, s2),
    damerauLevenshtein: damerauLevenshteinDistance(s1, s2),
    damerauLevenshteinRatio: (Math.max(s1.length, s2.length) - damerauLevenshteinDistance(s1, s2)) / Math.max(s1.length, s2.length)
  };

  // Calculate composite score
  metrics.composite = (
    metrics.levenshteinRatio * 0.3 +
    metrics.jaro * 0.2 +
    metrics.jaroWinkler * 0.3 +
    metrics.damerauLevenshteinRatio * 0.2
  );

  return metrics;
}

/**
 * Find best matches from a list of candidates
 * @param {string} target - Target string to match
 * @param {Array<string>} candidates - Array of candidate strings
 * @param {Object} options - Configuration options
 * @returns {Array} - Array of matches sorted by similarity
 */
export function findBestMatches(target, candidates, options = {}) {
  const {
    threshold = 0.6,
    maxResults = 10,
    normalize = true
  } = options;

  const matches = candidates
    .map(candidate => {
      const metrics = calculateSimilarityMetrics(target, candidate, { normalize });
      return {
        candidate,
        target,
        ...metrics,
        score: metrics.composite
      };
    })
    .filter(match => match.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  return matches;
}

/**
 * Check if two names are likely the same person
 * @param {string} name1 - First name
 * @param {string} name2 - Second name
 * @param {Object} options - Configuration options
 * @returns {Object} - Match result with confidence and details
 */
export function isNameMatch(name1, name2, options = {}) {
  const {
    threshold = 0.8,
    strictMode = false
  } = options;

  const metrics = calculateSimilarityMetrics(name1, name2, { normalize: true });
  
  let confidence = metrics.composite;
  let isMatch = confidence >= threshold;
  let reason = 'composite_score';

  // Exact match
  if (metrics.exact) {
    confidence = 1.0;
    isMatch = true;
    reason = 'exact_match';
  }
  // High Jaro-Winkler (good for names)
  else if (metrics.jaroWinkler >= 0.9) {
    confidence = Math.max(confidence, metrics.jaroWinkler);
    isMatch = true;
    reason = 'jaro_winkler_high';
  }
  // Strict mode requires higher thresholds
  else if (strictMode && confidence < 0.9) {
    isMatch = false;
    reason = 'strict_mode_threshold';
  }

  return {
    isMatch,
    confidence,
    reason,
    metrics,
    threshold
  };
}

export default {
  levenshteinDistance,
  jaroSimilarity,
  jaroWinklerSimilarity,
  similarityRatio,
  damerauLevenshteinDistance,
  normalizeString,
  calculateSimilarityMetrics,
  findBestMatches,
  isNameMatch
};

