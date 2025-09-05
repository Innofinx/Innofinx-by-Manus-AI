/**
 * UN Security Council Sanctions API Integration
 * Handles downloading and parsing UN sanctions data
 */

const UN_SANCTIONS_URL = 'https://scsanctions.un.org/resources/xml/en/consolidated.xml';

export class UNSanctionsService {
  constructor() {
    this.cache = new Map();
    this.lastUpdate = null;
    this.updateInterval = 24 * 60 * 60 * 1000; // 24 hours
  }

  /**
   * Download and parse UN sanctions data
   */
  async downloadUNData() {
    try {
      console.log('Downloading UN sanctions data...');
      const response = await fetch(UN_SANCTIONS_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to download UN data: ${response.status}`);
      }

      const xmlText = await response.text();
      return this.parseUNXML(xmlText);
    } catch (error) {
      console.error('Error downloading UN sanctions data:', error);
      throw error;
    }
  }

  /**
   * Parse UN XML data into structured format
   */
  parseUNXML(xmlText) {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const sanctionedEntities = [];
      
      // Parse individuals
      const individuals = xmlDoc.getElementsByTagName('INDIVIDUAL');
      for (let i = 0; i < individuals.length; i++) {
        const entity = this.parseUNIndividual(individuals[i]);
        if (entity) {
          sanctionedEntities.push(entity);
        }
      }

      // Parse entities/organizations
      const entities = xmlDoc.getElementsByTagName('ENTITY');
      for (let i = 0; i < entities.length; i++) {
        const entity = this.parseUNEntity(entities[i]);
        if (entity) {
          sanctionedEntities.push(entity);
        }
      }

      console.log(`Parsed ${sanctionedEntities.length} UN sanctions entries`);
      return sanctionedEntities;
    } catch (error) {
      console.error('Error parsing UN XML:', error);
      throw error;
    }
  }

  /**
   * Parse UN individual entry
   */
  parseUNIndividual(individual) {
    try {
      const dataid = individual.getAttribute('dataid');
      
      // Get names
      const firstName = this.getElementText(individual, 'FIRST_NAME');
      const secondName = this.getElementText(individual, 'SECOND_NAME');
      const thirdName = this.getElementText(individual, 'THIRD_NAME');
      const fourthName = this.getElementText(individual, 'FOURTH_NAME');
      
      const fullName = [firstName, secondName, thirdName, fourthName]
        .filter(name => name)
        .join(' ');

      // Get other details
      const unListType = this.getElementText(individual, 'UN_LIST_TYPE');
      const referenceNumber = this.getElementText(individual, 'REFERENCE_NUMBER');
      const listedOn = this.getElementText(individual, 'LISTED_ON');
      const comments = this.getElementText(individual, 'COMMENTS1');

      // Get aliases
      const aliases = this.parseAliases(individual);

      // Get addresses
      const addresses = this.parseAddresses(individual);

      // Get nationalities
      const nationalities = this.parseNationalities(individual);

      // Get birth information
      const birthInfo = this.parseBirthInfo(individual);

      return {
        dataid,
        firstName,
        lastName: [secondName, thirdName, fourthName].filter(n => n).join(' '),
        fullName,
        unListType,
        referenceNumber,
        listedOn,
        comments,
        aliases,
        addresses,
        nationalities,
        birthInfo,
        entityType: 'INDIVIDUAL',
        source: 'UN_SANCTIONS',
        severity: 'HIGH',
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing UN individual:', error);
      return null;
    }
  }

  /**
   * Parse UN entity entry
   */
  parseUNEntity(entity) {
    try {
      const dataid = entity.getAttribute('dataid');
      
      const firstName = this.getElementText(entity, 'FIRST_NAME');
      const unListType = this.getElementText(entity, 'UN_LIST_TYPE');
      const referenceNumber = this.getElementText(entity, 'REFERENCE_NUMBER');
      const listedOn = this.getElementText(entity, 'LISTED_ON');
      const comments = this.getElementText(entity, 'COMMENTS1');

      // Get aliases
      const aliases = this.parseAliases(entity);

      // Get addresses
      const addresses = this.parseAddresses(entity);

      return {
        dataid,
        firstName,
        fullName: firstName,
        unListType,
        referenceNumber,
        listedOn,
        comments,
        aliases,
        addresses,
        entityType: 'ENTITY',
        source: 'UN_SANCTIONS',
        severity: 'HIGH',
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing UN entity:', error);
      return null;
    }
  }

  /**
   * Parse aliases from UN entry
   */
  parseAliases(entry) {
    const aliases = [];
    const individualAliases = entry.getElementsByTagName('INDIVIDUAL_ALIAS');
    
    for (let i = 0; i < individualAliases.length; i++) {
      const alias = individualAliases[i];
      const aliasName = this.getElementText(alias, 'ALIAS_NAME');
      const quality = this.getElementText(alias, 'QUALITY');
      
      if (aliasName) {
        aliases.push({
          name: aliasName,
          quality,
          type: 'alias'
        });
      }
    }

    return aliases;
  }

  /**
   * Parse addresses from UN entry
   */
  parseAddresses(entry) {
    const addresses = [];
    const individualAddresses = entry.getElementsByTagName('INDIVIDUAL_ADDRESS');
    
    for (let i = 0; i < individualAddresses.length; i++) {
      const addr = individualAddresses[i];
      const street = this.getElementText(addr, 'STREET');
      const city = this.getElementText(addr, 'CITY');
      const stateProvince = this.getElementText(addr, 'STATE_PROVINCE');
      const zipCode = this.getElementText(addr, 'ZIP_CODE');
      const country = this.getElementText(addr, 'COUNTRY');
      
      addresses.push({
        street,
        city,
        stateProvince,
        zipCode,
        country,
        fullAddress: [street, city, stateProvince, zipCode, country]
          .filter(part => part)
          .join(', ')
      });
    }

    return addresses;
  }

  /**
   * Parse nationalities from UN entry
   */
  parseNationalities(entry) {
    const nationalities = [];
    const nationalityElements = entry.getElementsByTagName('INDIVIDUAL_PLACE_OF_BIRTH');
    
    for (let i = 0; i < nationalityElements.length; i++) {
      const nationality = this.getElementText(nationalityElements[i], 'COUNTRY');
      if (nationality) {
        nationalities.push(nationality);
      }
    }

    return nationalities;
  }

  /**
   * Parse birth information from UN entry
   */
  parseBirthInfo(entry) {
    const birthElements = entry.getElementsByTagName('INDIVIDUAL_DATE_OF_BIRTH');
    const birthInfo = [];
    
    for (let i = 0; i < birthElements.length; i++) {
      const birth = birthElements[i];
      const type = birth.getAttribute('calendar');
      const date = this.getElementText(birth, 'DATE');
      const year = this.getElementText(birth, 'YEAR');
      
      birthInfo.push({
        type,
        date,
        year
      });
    }

    return birthInfo;
  }

  /**
   * Helper function to get text content from XML element
   */
  getElementText(parent, tagName) {
    const elements = parent.getElementsByTagName(tagName);
    return elements.length > 0 ? elements[0].textContent.trim() : '';
  }

  /**
   * Search for matches in UN data
   */
  async searchUN(searchTerm, threshold = 0.8) {
    try {
      // Check if we need to refresh data
      if (!this.lastUpdate || Date.now() - this.lastUpdate > this.updateInterval) {
        await this.refreshData();
      }

      const results = [];
      const sanctionedEntities = this.cache.get('un_data') || [];

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
      console.error('Error searching UN data:', error);
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
      if (alias.name) {
        const confidence = this.calculateSimilarity(alias.name.toLowerCase(), searchLower);
        if (confidence >= threshold) {
          matches.push({
            type: 'alias',
            value: alias.name,
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

    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 1 : (maxLen - matrix[len1][len2]) / maxLen;
  }

  /**
   * Refresh UN data
   */
  async refreshData() {
    try {
      const data = await this.downloadUNData();
      this.cache.set('un_data', data);
      this.lastUpdate = Date.now();
      console.log('UN sanctions data refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh UN data:', error);
      throw error;
    }
  }

  /**
   * Get statistics about cached data
   */
  getStats() {
    const data = this.cache.get('un_data') || [];
    return {
      totalEntries: data.length,
      lastUpdate: this.lastUpdate ? new Date(this.lastUpdate).toISOString() : null,
      source: 'UN_SANCTIONS'
    };
  }
}

export default UNSanctionsService;

