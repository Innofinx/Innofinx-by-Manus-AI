/**
 * GPT Translation Service
 * Handles Chinese to English translation using OpenAI GPT-4
 */

export class GPTTranslationService {
  constructor(apiKey = null) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1/chat/completions';
    this.cache = new Map();
    this.model = 'gpt-4o-mini'; // Cost-effective model for translations
  }

  /**
   * Translate Chinese text to English
   */
  async translateChineseToEnglish(text, context = 'general') {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text input for translation');
    }

    // Check cache first
    const cacheKey = `${text}_${context}`;
    if (this.cache.has(cacheKey)) {
      console.log('Translation retrieved from cache');
      return this.cache.get(cacheKey);
    }

    try {
      const systemPrompt = this.getSystemPrompt(context);
      const userPrompt = `Translate the following Chinese text to English: "${text}"`;

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3, // Lower temperature for more consistent translations
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const translation = data.choices[0]?.message?.content?.trim();

      if (!translation) {
        throw new Error('No translation received from API');
      }

      // Calculate confidence score based on various factors
      const confidence = this.calculateConfidence(text, translation, context);

      const result = {
        originalText: text,
        translatedText: translation,
        confidence,
        context,
        timestamp: new Date().toISOString(),
        model: this.model
      };

      // Cache the result
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  /**
   * Get system prompt based on context
   */
  getSystemPrompt(context) {
    const basePrompt = `You are a professional translator specializing in Chinese to English translation for KYC (Know Your Customer) and financial compliance purposes.`;

    const contextPrompts = {
      'business': `${basePrompt} Focus on business and corporate terminology. Translate company names, business descriptions, and corporate activities accurately. Maintain proper nouns when appropriate.`,
      
      'address': `${basePrompt} Focus on address translation. Translate Chinese addresses to English format, maintaining the logical order (building, street, district, city, province, country). Use standard English address formatting.`,
      
      'personal': `${basePrompt} Focus on personal information translation. Translate names, personal details, and identification information accurately. For Chinese names, provide both pinyin romanization and common English equivalents when applicable.`,
      
      'document': `${basePrompt} Focus on official document translation. Translate document titles, official stamps, government terminology, and legal language accurately. Maintain the formal tone and official nature of the content.`,
      
      'general': `${basePrompt} Provide accurate, professional translations suitable for financial and compliance documentation.`
    };

    return contextPrompts[context] || contextPrompts['general'];
  }

  /**
   * Calculate confidence score for translation
   */
  calculateConfidence(originalText, translatedText, context) {
    let confidence = 0.8; // Base confidence

    // Adjust based on text length
    if (originalText.length < 10) {
      confidence += 0.1; // Short texts are usually more reliable
    } else if (originalText.length > 100) {
      confidence -= 0.1; // Longer texts may have more complexity
    }

    // Adjust based on context
    if (context === 'address' || context === 'business') {
      confidence += 0.05; // These contexts have more structured patterns
    }

    // Check for potential issues
    if (translatedText.includes('?') || translatedText.includes('[unclear]')) {
      confidence -= 0.2;
    }

    // Ensure confidence is within bounds
    return Math.max(0.1, Math.min(1.0, confidence));
  }

  /**
   * Batch translate multiple texts
   */
  async batchTranslate(texts, context = 'general') {
    const results = [];
    const batchSize = 5; // Process in small batches to avoid rate limits

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchPromises = batch.map(text => 
        this.translateChineseToEnglish(text, context).catch(error => ({
          originalText: text,
          error: error.message,
          confidence: 0
        }))
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add delay between batches to respect rate limits
      if (i + batchSize < texts.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Translate business description
   */
  async translateBusinessDescription(chineseDescription) {
    return await this.translateChineseToEnglish(chineseDescription, 'business');
  }

  /**
   * Translate address
   */
  async translateAddress(chineseAddress) {
    return await this.translateChineseToEnglish(chineseAddress, 'address');
  }

  /**
   * Translate personal information
   */
  async translatePersonalInfo(chineseText) {
    return await this.translateChineseToEnglish(chineseText, 'personal');
  }

  /**
   * Translate document content
   */
  async translateDocument(chineseDocument) {
    return await this.translateChineseToEnglish(chineseDocument, 'document');
  }

  /**
   * Get translation statistics
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      model: this.model,
      supportedContexts: ['general', 'business', 'address', 'personal', 'document']
    };
  }

  /**
   * Clear translation cache
   */
  clearCache() {
    this.cache.clear();
    console.log('Translation cache cleared');
  }

  /**
   * Test translation service
   */
  async testTranslation() {
    const testCases = [
      { text: '北京市朝阳区建国门外大街1号', context: 'address' },
      { text: '科技有限公司', context: 'business' },
      { text: '张三', context: 'personal' }
    ];

    console.log('Testing GPT Translation Service...');
    
    for (const testCase of testCases) {
      try {
        const result = await this.translateChineseToEnglish(testCase.text, testCase.context);
        console.log(`Original: ${testCase.text}`);
        console.log(`Translated: ${result.translatedText}`);
        console.log(`Confidence: ${result.confidence}`);
        console.log(`Context: ${testCase.context}`);
        console.log('---');
      } catch (error) {
        console.error(`Test failed for "${testCase.text}":`, error.message);
      }
    }
  }
}

export default GPTTranslationService;

