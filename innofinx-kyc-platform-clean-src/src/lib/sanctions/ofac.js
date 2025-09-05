/**
 * OFAC SDN (Specially Designated Nationals) API Integration
 * Handles downloading and parsing OFAC sanctions data
 */

const OFAC_SDN_URL = 'https://www.treasury.gov/ofac/downloads/sanctions/1.0/sdn_advanced.xml';
const OFAC_CONSOLIDATED_URL = 'https://www.treasury.gov/ofac/downloads/sanctions/1.0/cons_advanced.xml';

export class OFACService {
  constructor() {
    this.cache = new Map();
    this.lastUpdate = null;
    this.updateInterval = 24 * 60 * 60 * 1000; // 24 hours
  }

  /**
   * Download and parse OFAC SDN data
   */
  async downloadSDNData() {
    try {
      console.log('Downloading OFAC SDN data...');
      const response = await fetch(OFAC_SDN_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to download OFAC data: ${response.status}`);
      }

      const xmlText = await response.text();
      return this.parseSDNXML(xmlText);
    } catch (error) {
      console.error('Error downloading OFAC SDN data:', error);
      throw error;
    }
  }

  /**
   * Parse OFAC XML data into structured format
   */
  parseSDNXML(xmlText) {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const sanctionedEntities = [];
      const sdnEntries = xmlDoc.getElementsByTagName('sdnEntry');

      for (let i = 0; i < sdnEntries.length; i++) {
        const entry = sdnEntries[i];
        const entity = this.parseSDNEntry(entry);
        if (entity) {
          sanctionedEntities.push(entity);
        }
      }

      console.log(`Parsed ${sanctionedEntities.length} OFAC SDN entries`);
      return sanctionedEntities;
    } catch (error) {
      console.error('Error parsing OFAC XML:', error);
      throw error;
    }
  }

  /**
   * Parse individual SDN entry
   */
  parseSDNEntry(entry) {
    try {
      const uid = entry.getAttribute('uid');
      const firstName = this.getElementText(entry, 'firstName');
      const lastName = this.getElementText(entry, 'lastName');
      const title = this.getElementText(entry, 'title');
      const sdnType = this.getElementText(entry, 'sdnType');
      const remarks = this.getElementText(entry, 'remarks');

      // Get aliases
      const aliases = [];
      const akaList = entry.getElementsByTagName('aka');
      for (let j = 0; j < akaList.length; j++) {
        const aka = akaList[j];
        const akaType = aka.getAttribute('type');
        const akaCategory = aka.getAttribute('category');
        const akaFirstName = this.getElementText(aka, 'firstName');
        const akaLastName = this.getElementText(aka, 'lastName');
        
        aliases.push({
          type: akaType,
          category: akaCategory,
          firstName: akaFirstName,
          lastName: akaLastName,
          fullName: `${akaFirstName} ${akaLastName}`.trim()
        });
      }

      // Get addresses
      const addresses = [];
      const addressList = entry.getElementsByTagName('address');
      for (let k = 0; k < addressList.length; k++) {
        const addr = addressList[k];
        const address = {
          uid: addr.getAttribute('uid'),
          address1: this.getElementText(addr, 'address1'),
          address2: this.getElementText(addr, 'address2'),
          city: this.getElementText(addr, 'city'),
          stateOrProvince: this.getElementText(addr, 'stateOrProvince'),
          postalCode: this.getElementText(addr, 'postalCode'),
          country: this.getElementText(addr, 'country')
        };
        addresses.push(address);
      }

      // Get programs (sanctions programs)
      const programs = [];
      const programList = entry.getElementsByTagName('program');
      for (let l = 0; l < programList.length; l++) {
        programs.push(programList[l].textContent.trim());
      }

      return {
        uid,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`.trim(),
        title,
        sdnType,
        remarks,
        aliases,
        addresses,
        programs,
        source: 'OFAC_SDN',
        severity: 'HIGH', // OFAC SDN is high severity
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing SDN entry:', error);
      return null;
    }
  }

  /**
   * Helper function to get text content from XML element
   */
  getElementText(parent, tagName) {
    const elements = parent.getElementsByTagName(tagName);
    return elements.length > 0 ? elements[0].textContent.trim() : '';
  }

  /**
   * Search for matches in OFAC data
   */
  async searchOFAC(searchTerm, threshold = 0.8) {
    try {
      // Check if we need to refresh data
      if (!this.lastUpdate || Date.now() - this.lastUpdate > this.updateInterval) {
        await this.refreshData();
      }

      const results = [];
      const sanctionedEntities = this.cache.get('ofac_data') || [];

      for (const entity of sanctionedEntities) {
        const matches = this.findMatches(entity, searchTerm, threshold);
        if (matches.length > 0) {
          results.push({
            entity,
            matches,
            confidence: Math.max(...matches.map(m => m.confidence))
          });
        }
      }

      return results.sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      console.error('Error searching OFAC data:', error);
      throw error;
    }
  }

  /**
   * Find matches for a given search term
   */
  findMatches(entity, searchTerm, threshold) {
    const matches = [];
    const searchLower = searchTerm.toLowerCase();

    // Check main name
    if (entity.fullName) {
      const confidence = this.calculateSimilarity(entity.fullName.toLowerCase(), searchLower);
      if (confidence >= threshold) {
        matches.push({
          type: 'name',
          value: entity.fullName,
          confidence
        });
      }
    }

    // Check aliases
    for (const alias of entity.aliases || []) {
      if (alias.fullName) {
        const confidence = this.calculateSimilarity(alias.fullName.toLowerCase(), searchLower);
        if (confidence >= threshold) {
          matches.push({
            type: 'alias',
            value: alias.fullName,
            confidence
          });
        }
      }
    }

    return matches;
  }

  /**
   * Calculate string similarity using Levenshtein distance
   */
  calculateSimilarity(str1, str2) {
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
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 1 : (maxLen - matrix[len1][len2]) / maxLen;
  }

  /**
   * Refresh OFAC data
   */
  async refreshData() {
    try {
      const data = await this.downloadSDNData();
      this.cache.set('ofac_data', data);
      this.lastUpdate = Date.now();
      console.log('OFAC data refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh OFAC data:', error);
      throw error;
    }
  }

  /**
   * Get statistics about cached data
   */
  getStats() {
    const data = this.cache.get('ofac_data') || [];
    return {
      totalEntries: data.length,
      lastUpdate: this.lastUpdate ? new Date(this.lastUpdate).toISOString() : null,
      source: 'OFAC_SDN'
    };
  }
}

export default OFACService;

