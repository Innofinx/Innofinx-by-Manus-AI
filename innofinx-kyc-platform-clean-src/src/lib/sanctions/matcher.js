/**
 * Sanctions Matching Engine
 * Coordinates searches across multiple sanctions lists
 */

import OFACService from './ofac.js';
import UNSanctionsService from './un.js';

export class SanctionsMatchingEngine {
  constructor() {
    this.ofacService = new OFACService();
    this.unService = new UNSanctionsService();
    this.services = [
      { name: 'OFAC', service: this.ofacService, weight: 1.0 },
      { name: 'UN', service: this.unService, weight: 1.0 }
    ];
  }

  /**
   * Comprehensive sanctions screening
   */
  async screenEntity(entityData, options = {}) {
    const {
      threshold = 0.8,
      includeAliases = true,
      maxResults = 50
    } = options;

    try {
      const results = {
        entity: entityData,
        matches: [],
        summary: {
          totalMatches: 0,
          highRiskMatches: 0,
          sources: [],
          riskScore: 0,
          recommendation: 'CLEAR'
        },
        timestamp: new Date().toISOString()
      };

      // Extract search terms from entity data
      const searchTerms = this.extractSearchTerms(entityData, includeAliases);

      // Search across all sanctions lists
      for (const searchTerm of searchTerms) {
        for (const { name, service, weight } of this.services) {
          try {
            const matches = await this.searchService(service, searchTerm, threshold);
            
            for (const match of matches) {
              // Apply service weight to confidence
              const weightedConfidence = match.confidence * weight;
              
              results.matches.push({
                ...match,
                source: name,
                searchTerm,
                weightedConfidence,
                riskLevel: this.calculateRiskLevel(weightedConfidence)
              });
            }
          } catch (error) {
            console.error(`Error searching ${name}:`, error);
          }
        }
      }

      // Sort matches by confidence
      results.matches.sort((a, b) => b.weightedConfidence - a.weightedConfidence);

      // Limit results
      if (results.matches.length > maxResults) {
        results.matches = results.matches.slice(0, maxResults);
      }

      // Calculate summary
      results.summary = this.calculateSummary(results.matches);

      return results;
    } catch (error) {
      console.error('Error in sanctions screening:', error);
      throw error;
    }
  }

  /**
   * Search a specific service
   */
  async searchService(service, searchTerm, threshold) {
    if (service.searchOFAC) {
      return await service.searchOFAC(searchTerm, threshold);
    } else if (service.searchUN) {
      return await service.searchUN(searchTerm, threshold);
    }
    return [];
  }

  /**
   * Extract search terms from entity data
   */
  extractSearchTerms(entityData, includeAliases = true) {
    const terms = new Set();

    // Add primary names
    if (entityData.firstName && entityData.lastName) {
      terms.add(`${entityData.firstName} ${entityData.lastName}`);
    }
    if (entityData.fullName) {
      terms.add(entityData.fullName);
    }
    if (entityData.companyName) {
      terms.add(entityData.companyName);
    }
    if (entityData.businessName) {
      terms.add(entityData.businessName);
    }

    // Add aliases if requested
    if (includeAliases && entityData.aliases) {
      for (const alias of entityData.aliases) {
        if (alias.name) {
          terms.add(alias.name);
        }
        if (alias.fullName) {
          terms.add(alias.fullName);
        }
      }
    }

    // Add alternative name formats
    if (entityData.firstName && entityData.lastName) {
      // Last name, First name format
      terms.add(`${entityData.lastName}, ${entityData.firstName}`);
      // First name only
      terms.add(entityData.firstName);
      // Last name only
      terms.add(entityData.lastName);
    }

    return Array.from(terms).filter(term => term && term.length > 2);
  }

  /**
   * Calculate risk level based on confidence
   */
  calculateRiskLevel(confidence) {
    if (confidence >= 0.95) return 'CRITICAL';
    if (confidence >= 0.85) return 'HIGH';
    if (confidence >= 0.75) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Calculate summary statistics
   */
  calculateSummary(matches) {
    const summary = {
      totalMatches: matches.length,
      highRiskMatches: 0,
      sources: new Set(),
      riskScore: 0,
      recommendation: 'CLEAR'
    };

    let maxConfidence = 0;
    let totalWeightedScore = 0;

    for (const match of matches) {
      // Count high risk matches
      if (match.riskLevel === 'HIGH' || match.riskLevel === 'CRITICAL') {
        summary.highRiskMatches++;
      }

      // Track sources
      summary.sources.add(match.source);

      // Calculate max confidence and weighted score
      maxConfidence = Math.max(maxConfidence, match.weightedConfidence);
      totalWeightedScore += match.weightedConfidence;
    }

    // Convert sources set to array
    summary.sources = Array.from(summary.sources);

    // Calculate overall risk score (0-100)
    if (matches.length > 0) {
      summary.riskScore = Math.round(
        (maxConfidence * 0.7 + (totalWeightedScore / matches.length) * 0.3) * 100
      );
    }

    // Determine recommendation
    if (summary.riskScore >= 85) {
      summary.recommendation = 'REJECT';
    } else if (summary.riskScore >= 70) {
      summary.recommendation = 'MANUAL_REVIEW';
    } else if (summary.riskScore >= 50) {
      summary.recommendation = 'ENHANCED_DUE_DILIGENCE';
    } else {
      summary.recommendation = 'CLEAR';
    }

    return summary;
  }

  /**
   * Batch screening for multiple entities
   */
  async batchScreen(entities, options = {}) {
    const results = [];
    const batchSize = options.batchSize || 10;

    for (let i = 0; i < entities.length; i += batchSize) {
      const batch = entities.slice(i, i + batchSize);
      const batchPromises = batch.map(entity => this.screenEntity(entity, options));
      
      try {
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      } catch (error) {
        console.error(`Error processing batch ${i / batchSize + 1}:`, error);
      }
    }

    return results;
  }

  /**
   * Get statistics from all services
   */
  async getAllStats() {
    const stats = {
      services: [],
      totalEntries: 0,
      lastUpdate: null
    };

    for (const { name, service } of this.services) {
      try {
        const serviceStats = service.getStats();
        stats.services.push({
          name,
          ...serviceStats
        });
        stats.totalEntries += serviceStats.totalEntries;
        
        if (serviceStats.lastUpdate) {
          const updateTime = new Date(serviceStats.lastUpdate);
          if (!stats.lastUpdate || updateTime > new Date(stats.lastUpdate)) {
            stats.lastUpdate = serviceStats.lastUpdate;
          }
        }
      } catch (error) {
        console.error(`Error getting stats for ${name}:`, error);
      }
    }

    return stats;
  }

  /**
   * Refresh all sanctions data
   */
  async refreshAllData() {
    const results = [];

    for (const { name, service } of this.services) {
      try {
        await service.refreshData();
        results.push({ service: name, status: 'success' });
      } catch (error) {
        console.error(`Error refreshing ${name}:`, error);
        results.push({ service: name, status: 'error', error: error.message });
      }
    }

    return results;
  }

  /**
   * Test the matching engine with sample data
   */
  async testMatching() {
    const testEntities = [
      {
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe'
      },
      {
        companyName: 'Test Corporation',
        businessName: 'Test Corp'
      }
    ];

    console.log('Testing sanctions matching engine...');
    
    for (const entity of testEntities) {
      try {
        const result = await this.screenEntity(entity, { threshold: 0.7 });
        console.log(`Test entity: ${JSON.stringify(entity)}`);
        console.log(`Matches found: ${result.summary.totalMatches}`);
        console.log(`Risk score: ${result.summary.riskScore}`);
        console.log(`Recommendation: ${result.summary.recommendation}`);
        console.log('---');
      } catch (error) {
        console.error('Test failed:', error);
      }
    }
  }
}

export default SanctionsMatchingEngine;

