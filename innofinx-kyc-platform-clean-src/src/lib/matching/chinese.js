/**
 * Chinese Name Romanization and Matching Library
 * Handles Chinese name processing, romanization, and matching
 */

/**
 * Common Chinese surnames and their romanizations
 */
export const CHINESE_SURNAMES = {
  '王': ['Wang', 'Wong'],
  '李': ['Li', 'Lee'],
  '张': ['Zhang', 'Chang', 'Cheung'],
  '刘': ['Liu', 'Lau'],
  '陈': ['Chen', 'Chan'],
  '杨': ['Yang', 'Yeung'],
  '赵': ['Zhao', 'Chiu'],
  '黄': ['Huang', 'Wong', 'Hwang'],
  '周': ['Zhou', 'Chow'],
  '吴': ['Wu', 'Ng'],
  '徐': ['Xu', 'Tsui'],
  '孙': ['Sun', 'Suen'],
  '胡': ['Hu', 'Wu'],
  '朱': ['Zhu', 'Chu'],
  '高': ['Gao', 'Ko'],
  '林': ['Lin', 'Lam'],
  '何': ['He', 'Ho'],
  '郭': ['Guo', 'Kwok'],
  '马': ['Ma', 'Mah'],
  '罗': ['Luo', 'Lo'],
  '梁': ['Liang', 'Leung'],
  '宋': ['Song', 'Sung'],
  '郑': ['Zheng', 'Cheng'],
  '谢': ['Xie', 'Tse'],
  '韩': ['Han', 'Hon'],
  '唐': ['Tang', 'Tong'],
  '冯': ['Feng', 'Fung'],
  '于': ['Yu', 'Yue'],
  '董': ['Dong', 'Tung'],
  '萧': ['Xiao', 'Siu'],
  '程': ['Cheng', 'Ching'],
  '曹': ['Cao', 'Tso'],
  '袁': ['Yuan', 'Yuen'],
  '邓': ['Deng', 'Tang'],
  '许': ['Xu', 'Hui'],
  '傅': ['Fu', 'Foo'],
  '沈': ['Shen', 'Shum'],
  '曾': ['Zeng', 'Tsang'],
  '彭': ['Peng', 'Pang'],
  '吕': ['Lv', 'Lui'],
  '苏': ['Su', 'So'],
  '卢': ['Lu', 'Lo'],
  '蒋': ['Jiang', 'Chiang'],
  '蔡': ['Cai', 'Choi'],
  '贾': ['Jia', 'Chia'],
  '丁': ['Ding', 'Ting'],
  '魏': ['Wei', 'Wai'],
  '薛': ['Xue', 'Sit'],
  '叶': ['Ye', 'Yip'],
  '阎': ['Yan', 'Yim'],
  '余': ['Yu', 'Yue'],
  '潘': ['Pan', 'Poon'],
  '杜': ['Du', 'To'],
  '戴': ['Dai', 'Tai'],
  '夏': ['Xia', 'Ha'],
  '钟': ['Zhong', 'Chung'],
  '汪': ['Wang', 'Wong'],
  '田': ['Tian', 'Tin'],
  '任': ['Ren', 'Yam'],
  '姜': ['Jiang', 'Keung'],
  '范': ['Fan', 'Faan'],
  '方': ['Fang', 'Fong'],
  '石': ['Shi', 'Shek'],
  '姚': ['Yao', 'Yiu'],
  '谭': ['Tan', 'Tam'],
  '廖': ['Liao', 'Liu'],
  '邹': ['Zou', 'Chau'],
  '熊': ['Xiong', 'Hung'],
  '金': ['Jin', 'Kam'],
  '陆': ['Lu', 'Luk'],
  '郝': ['Hao', 'Ho'],
  '孔': ['Kong', 'Hung'],
  '白': ['Bai', 'Pak'],
  '崔': ['Cui', 'Chui'],
  '康': ['Kang', 'Hong'],
  '毛': ['Mao', 'Mo'],
  '邱': ['Qiu', 'Yau'],
  '秦': ['Qin', 'Chun'],
  '江': ['Jiang', 'Kong'],
  '史': ['Shi', 'See'],
  '顾': ['Gu', 'Koo'],
  '侯': ['Hou', 'Hau'],
  '邵': ['Shao', 'Siu'],
  '孟': ['Meng', 'Maang'],
  '龙': ['Long', 'Lung'],
  '万': ['Wan', 'Maan'],
  '段': ['Duan', 'Tuen'],
  '漕': ['Cao', 'Chou'],
  '钱': ['Qian', 'Chin'],
  '汤': ['Tang', 'Tong'],
  '尹': ['Yin', 'Wan'],
  '黎': ['Li', 'Lai'],
  '易': ['Yi', 'Yik'],
  '常': ['Chang', 'Sheung'],
  '武': ['Wu', 'Mou'],
  '乔': ['Qiao', 'Kiu'],
  '贺': ['He', 'Ho'],
  '赖': ['Lai', 'Loi'],
  '龚': ['Gong', 'Kung'],
  '文': ['Wen', 'Man']
};

/**
 * Common Chinese given names and their romanizations
 */
export const CHINESE_GIVEN_NAMES = {
  '伟': ['Wei', 'Wai'],
  '芳': ['Fang', 'Fong'],
  '娜': ['Na', 'Naa'],
  '敏': ['Min', 'Man'],
  '静': ['Jing', 'Ching'],
  '丽': ['Li', 'Lai'],
  '强': ['Qiang', 'Keung'],
  '磊': ['Lei', 'Lui'],
  '军': ['Jun', 'Kwan'],
  '洋': ['Yang', 'Yeung'],
  '勇': ['Yong', 'Yung'],
  '艳': ['Yan', 'Yim'],
  '杰': ['Jie', 'Kit'],
  '娟': ['Juan', 'Kuen'],
  '涛': ['Tao', 'To'],
  '明': ['Ming', 'Ming'],
  '超': ['Chao', 'Chiu'],
  '秀': ['Xiu', 'Sau'],
  '英': ['Ying', 'Ying'],
  '华': ['Hua', 'Wah'],
  '慧': ['Hui', 'Wai'],
  '嘉': ['Jia', 'Ka'],
  '建': ['Jian', 'Kin'],
  '文': ['Wen', 'Man'],
  '清': ['Qing', 'Ching'],
  '飞': ['Fei', 'Fai'],
  '红': ['Hong', 'Hung'],
  '梅': ['Mei', 'Mui'],
  '平': ['Ping', 'Ping'],
  '刚': ['Gang', 'Kong'],
  '桂': ['Gui', 'Kwai'],
  '鹏': ['Peng', 'Pang'],
  '玲': ['Ling', 'Ling'],
  '健': ['Jian', 'Kin'],
  '斌': ['Bin', 'Ban'],
  '辉': ['Hui', 'Fai'],
  '霞': ['Xia', 'Ha'],
  '鑫': ['Xin', 'Sum'],
  '雷': ['Lei', 'Lui'],
  '刚': ['Gang', 'Kong'],
  '燕': ['Yan', 'Yin'],
  '磊': ['Lei', 'Lui'],
  '浩': ['Hao', 'Ho'],
  '亮': ['Liang', 'Leung'],
  '政': ['Zheng', 'Ching'],
  '谦': ['Qian', 'Him'],
  '亨': ['Heng', 'Hang'],
  '利': ['Li', 'Lee'],
  '元': ['Yuan', 'Yuen'],
  '全': ['Quan', 'Chuen'],
  '国': ['Guo', 'Kwok'],
  '胜': ['Sheng', 'Sing'],
  '学': ['Xue', 'Hok'],
  '祥': ['Xiang', 'Cheung'],
  '才': ['Cai', 'Choi'],
  '发': ['Fa', 'Faat'],
  '武': ['Wu', 'Mou'],
  '新': ['Xin', 'San'],
  '利': ['Li', 'Lee'],
  '清': ['Qing', 'Ching'],
  '飞': ['Fei', 'Fai'],
  '彬': ['Bin', 'Ban'],
  '富': ['Fu', 'Fu'],
  '顺': ['Shun', 'Shun'],
  '信': ['Xin', 'Shun'],
  '子': ['Zi', 'Tsz'],
  '杰': ['Jie', 'Kit'],
  '涛': ['Tao', 'To'],
  '昌': ['Chang', 'Cheong'],
  '成': ['Cheng', 'Shing'],
  '康': ['Kang', 'Hong'],
  '星': ['Xing', 'Sing'],
  '光': ['Guang', 'Kwong'],
  '天': ['Tian', 'Tin'],
  '达': ['Da', 'Taat'],
  '安': ['An', 'On'],
  '岩': ['Yan', 'Ngaam'],
  '中': ['Zhong', 'Chung'],
  '茂': ['Mao', 'Mau'],
  '进': ['Jin', 'Chun'],
  '林': ['Lin', 'Lam'],
  '有': ['You', 'Yau'],
  '坚': ['Jian', 'Kin'],
  '和': ['He', 'Wo'],
  '彪': ['Biao', 'Biu'],
  '博': ['Bo', 'Bok'],
  '诚': ['Cheng', 'Shing'],
  '先': ['Xian', 'Sin'],
  '敬': ['Jing', 'King'],
  '震': ['Zhen', 'Chun'],
  '振': ['Zhen', 'Chun'],
  '壮': ['Zhuang', 'Chong'],
  '会': ['Hui', 'Wui'],
  '思': ['Si', 'See'],
  '群': ['Qun', 'Kwan'],
  '豪': ['Hao', 'Ho'],
  '心': ['Xin', 'Sam'],
  '邦': ['Bang', 'Bong'],
  '承': ['Cheng', 'Shing'],
  '乐': ['Le', 'Lok'],
  '绍': ['Shao', 'Siu'],
  '功': ['Gong', 'Kung'],
  '松': ['Song', 'Chung'],
  '善': ['Shan', 'Sin'],
  '厚': ['Hou', 'Hau'],
  '庆': ['Qing', 'Hing'],
  '磊': ['Lei', 'Lui'],
  '民': ['Min', 'Man'],
  '友': ['You', 'Yau'],
  '裕': ['Yu', 'Yue'],
  '河': ['He', 'Ho'],
  '哲': ['Zhe', 'Chit'],
  '江': ['Jiang', 'Kong'],
  '超': ['Chao', 'Chiu'],
  '浩': ['Hao', 'Ho'],
  '亮': ['Liang', 'Leung'],
  '政': ['Zheng', 'Ching'],
  '宏': ['Hong', 'Wang'],
  '宇': ['Yu', 'Yue']
};

/**
 * Detect if a string contains Chinese characters
 * @param {string} str - Input string
 * @returns {boolean} - True if contains Chinese characters
 */
export function containsChinese(str) {
  if (!str) return false;
  return /[\u4e00-\u9fff]/.test(str);
}

/**
 * Extract Chinese characters from a string
 * @param {string} str - Input string
 * @returns {string} - String containing only Chinese characters
 */
export function extractChinese(str) {
  if (!str) return '';
  return str.match(/[\u4e00-\u9fff]/g)?.join('') || '';
}

/**
 * Split Chinese name into surname and given name
 * @param {string} chineseName - Chinese name
 * @returns {Object} - Object with surname and givenName
 */
export function splitChineseName(chineseName) {
  if (!chineseName || !containsChinese(chineseName)) {
    return { surname: '', givenName: '', isValid: false };
  }

  const cleanName = extractChinese(chineseName);
  
  if (cleanName.length < 2) {
    return { surname: '', givenName: cleanName, isValid: false };
  }

  // Most Chinese names have 1-character surname and 1-2 character given name
  // Some compound surnames exist (2 characters)
  
  const compoundSurnames = ['欧阳', '太史', '端木', '上官', '司马', '东方', '独孤', '南宫', '万俟', '闻人', '夏侯', '诸葛', '尉迟', '公羊', '赫连', '澹台', '皇甫', '宗政', '濮阳', '公冶', '太叔', '申屠', '公孙', '慕容', '仲孙', '钟离', '长孙', '宇文', '司徒', '鲜于'];
  
  // Check for compound surnames
  for (const compoundSurname of compoundSurnames) {
    if (cleanName.startsWith(compoundSurname)) {
      return {
        surname: compoundSurname,
        givenName: cleanName.substring(2),
        isValid: true,
        isCompoundSurname: true
      };
    }
  }

  // Check for known single-character surnames
  const firstChar = cleanName[0];
  if (CHINESE_SURNAMES[firstChar]) {
    return {
      surname: firstChar,
      givenName: cleanName.substring(1),
      isValid: true,
      isCompoundSurname: false
    };
  }

  // Default: assume first character is surname
  return {
    surname: firstChar,
    givenName: cleanName.substring(1),
    isValid: true,
    isCompoundSurname: false
  };
}

/**
 * Generate possible romanizations for a Chinese character
 * @param {string} char - Chinese character
 * @param {boolean} isSurname - Whether this is a surname
 * @returns {Array<string>} - Array of possible romanizations
 */
export function getRomanizations(char, isSurname = false) {
  if (!char || !containsChinese(char)) return [];

  const lookupTable = isSurname ? CHINESE_SURNAMES : CHINESE_GIVEN_NAMES;
  return lookupTable[char] || [];
}

/**
 * Generate all possible romanizations for a Chinese name
 * @param {string} chineseName - Chinese name
 * @returns {Array<string>} - Array of possible romanized names
 */
export function generateRomanizations(chineseName) {
  if (!chineseName || !containsChinese(chineseName)) {
    return [];
  }

  const { surname, givenName, isValid } = splitChineseName(chineseName);
  
  if (!isValid) return [];

  const surnameRomanizations = getRomanizations(surname, true);
  const givenNameRomanizations = [];

  // Generate romanizations for each character in given name
  for (let i = 0; i < givenName.length; i++) {
    const char = givenName[i];
    const charRomanizations = getRomanizations(char, false);
    givenNameRomanizations.push(charRomanizations.length > 0 ? charRomanizations : [char]);
  }

  // Generate all combinations
  const results = [];
  
  for (const surnameRom of surnameRomanizations) {
    // Generate all combinations of given name romanizations
    const givenCombinations = cartesianProduct(givenNameRomanizations);
    
    for (const givenCombo of givenCombinations) {
      // Different name formats
      const givenNameStr = givenCombo.join('');
      const givenNameSpaced = givenCombo.join(' ');
      
      results.push(`${surnameRom} ${givenNameStr}`);
      results.push(`${surnameRom} ${givenNameSpaced}`);
      results.push(`${surnameRom}, ${givenNameStr}`);
      results.push(`${surnameRom}, ${givenNameSpaced}`);
      results.push(`${givenNameStr} ${surnameRom}`);
      results.push(`${givenNameSpaced} ${surnameRom}`);
    }
  }

  // Remove duplicates and return
  return [...new Set(results)];
}

/**
 * Helper function to generate cartesian product of arrays
 * @param {Array<Array>} arrays - Array of arrays
 * @returns {Array<Array>} - Cartesian product
 */
function cartesianProduct(arrays) {
  if (arrays.length === 0) return [[]];
  if (arrays.length === 1) return arrays[0].map(item => [item]);
  
  const result = [];
  const rest = cartesianProduct(arrays.slice(1));
  
  for (const item of arrays[0]) {
    for (const combination of rest) {
      result.push([item, ...combination]);
    }
  }
  
  return result;
}

/**
 * Check if a romanized name could match a Chinese name
 * @param {string} romanizedName - Romanized name to check
 * @param {string} chineseName - Chinese name
 * @param {Object} options - Matching options
 * @returns {Object} - Match result
 */
export function matchChineseName(romanizedName, chineseName, options = {}) {
  const {
    threshold = 0.8,
    fuzzyMatch = true
  } = options;

  if (!romanizedName || !chineseName) {
    return { isMatch: false, confidence: 0, reason: 'empty_input' };
  }

  if (!containsChinese(chineseName)) {
    return { isMatch: false, confidence: 0, reason: 'not_chinese' };
  }

  const possibleRomanizations = generateRomanizations(chineseName);
  
  if (possibleRomanizations.length === 0) {
    return { isMatch: false, confidence: 0, reason: 'no_romanizations' };
  }

  // Normalize input for comparison
  const normalizedInput = romanizedName.toLowerCase().replace(/[^\w\s]/g, '').trim();
  
  let bestMatch = { confidence: 0, romanization: '', exact: false };

  // Check for exact matches first
  for (const romanization of possibleRomanizations) {
    const normalizedRom = romanization.toLowerCase().replace(/[^\w\s]/g, '').trim();
    
    if (normalizedInput === normalizedRom) {
      return {
        isMatch: true,
        confidence: 1.0,
        reason: 'exact_match',
        matchedRomanization: romanization,
        allPossibleRomanizations: possibleRomanizations
      };
    }
  }

  // If fuzzy matching is enabled, check similarity
  if (fuzzyMatch) {
    // Import fuzzy matching dynamically to avoid circular dependencies
    const fuzzyModule = await import('./fuzzy.js');
    const { calculateSimilarityMetrics } = fuzzyModule.default || fuzzyModule;
    
    for (const romanization of possibleRomanizations) {
      const metrics = calculateSimilarityMetrics(normalizedInput, romanization.toLowerCase().replace(/[^\w\s]/g, '').trim());
      
      if (metrics.composite > bestMatch.confidence) {
        bestMatch = {
          confidence: metrics.composite,
          romanization: romanization,
          exact: false,
          metrics: metrics
        };
      }
    }
  }

  const isMatch = bestMatch.confidence >= threshold;

  return {
    isMatch,
    confidence: bestMatch.confidence,
    reason: isMatch ? 'fuzzy_match' : 'below_threshold',
    matchedRomanization: bestMatch.romanization,
    allPossibleRomanizations: possibleRomanizations,
    metrics: bestMatch.metrics
  };
}

/**
 * Generate aliases and variations for a Chinese name
 * @param {string} chineseName - Chinese name
 * @returns {Array<string>} - Array of name variations
 */
export function generateChineseNameAliases(chineseName) {
  if (!chineseName || !containsChinese(chineseName)) {
    return [];
  }

  const romanizations = generateRomanizations(chineseName);
  const aliases = new Set(romanizations);

  // Add variations with different spacing and punctuation
  for (const romanization of romanizations) {
    // Remove spaces
    aliases.add(romanization.replace(/\s+/g, ''));
    
    // Replace commas with spaces
    aliases.add(romanization.replace(/,/g, ' '));
    
    // Add initials
    const parts = romanization.split(/[\s,]+/);
    if (parts.length >= 2) {
      const initials = parts.map(part => part[0]).join('');
      aliases.add(initials);
      aliases.add(initials.toLowerCase());
      
      // First name + last initial
      aliases.add(`${parts[0]} ${parts[parts.length - 1][0]}`);
      
      // Last name + first initial
      aliases.add(`${parts[parts.length - 1]} ${parts[0][0]}`);
    }
  }

  return Array.from(aliases);
}

/**
 * Detect and normalize Chinese name format
 * @param {string} name - Input name
 * @returns {Object} - Normalized name information
 */
export function normalizeChineseName(name) {
  if (!name) return { original: '', normalized: '', isChinese: false };

  const isChinese = containsChinese(name);
  
  if (isChinese) {
    const chineseChars = extractChinese(name);
    const { surname, givenName, isValid } = splitChineseName(chineseChars);
    
    return {
      original: name,
      normalized: chineseChars,
      isChinese: true,
      isValid,
      surname,
      givenName,
      possibleRomanizations: generateRomanizations(chineseChars),
      aliases: generateChineseNameAliases(chineseChars)
    };
  } else {
    // Assume it's already romanized
    return {
      original: name,
      normalized: name.trim(),
      isChinese: false,
      isValid: true
    };
  }
}

export default {
  CHINESE_SURNAMES,
  CHINESE_GIVEN_NAMES,
  containsChinese,
  extractChinese,
  splitChineseName,
  getRomanizations,
  generateRomanizations,
  matchChineseName,
  generateChineseNameAliases,
  normalizeChineseName
};

