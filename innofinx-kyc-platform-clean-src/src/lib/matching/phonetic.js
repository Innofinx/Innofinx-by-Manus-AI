/**
 * Phonetic Matching Library
 * Implements Soundex, Metaphone, and other phonetic algorithms for name matching
 */

/**
 * Generate Soundex code for a string
 * @param {string} str - Input string
 * @returns {string} - Soundex code (4 characters)
 */
export function soundex(str) {
  if (!str) return '0000';
  
  str = str.toUpperCase().replace(/[^A-Z]/g, '');
  if (str.length === 0) return '0000';

  const firstLetter = str[0];
  let code = firstLetter;
  
  // Soundex mapping
  const mapping = {
    'B': '1', 'F': '1', 'P': '1', 'V': '1',
    'C': '2', 'G': '2', 'J': '2', 'K': '2', 'Q': '2', 'S': '2', 'X': '2', 'Z': '2',
    'D': '3', 'T': '3',
    'L': '4',
    'M': '5', 'N': '5',
    'R': '6'
  };

  let prevCode = mapping[firstLetter] || '0';
  
  for (let i = 1; i < str.length && code.length < 4; i++) {
    const char = str[i];
    const currentCode = mapping[char] || '0';
    
    // Skip vowels and H, W, Y
    if (currentCode === '0') {
      prevCode = '0';
      continue;
    }
    
    // Skip consecutive identical codes
    if (currentCode !== prevCode) {
      code += currentCode;
    }
    
    prevCode = currentCode;
  }
  
  // Pad with zeros
  return (code + '0000').substring(0, 4);
}

/**
 * Generate Double Metaphone codes for a string
 * @param {string} str - Input string
 * @returns {Object} - Object with primary and secondary metaphone codes
 */
export function doubleMetaphone(str) {
  if (!str) return { primary: '', secondary: '' };
  
  str = str.toUpperCase().replace(/[^A-Z]/g, '');
  if (str.length === 0) return { primary: '', secondary: '' };

  let primary = '';
  let secondary = '';
  let current = 0;
  const length = str.length;
  
  // Helper function to check if character is a vowel
  const isVowel = (char) => 'AEIOUY'.includes(char);
  
  // Helper function to get character at position
  const charAt = (pos) => pos >= 0 && pos < length ? str[pos] : '';
  
  // Helper function to check substring at position
  const stringAt = (start, len, ...patterns) => {
    if (start < 0 || start >= length) return false;
    const substr = str.substring(start, start + len);
    return patterns.includes(substr);
  };

  // Skip initial silent letters
  if (stringAt(0, 2, 'GN', 'KN', 'PN', 'WR', 'PS')) {
    current = 1;
  }

  // Initial X is pronounced Z
  if (charAt(0) === 'X') {
    primary += 'S';
    secondary += 'S';
    current = 1;
  }

  while (current < length) {
    const char = charAt(current);
    
    switch (char) {
      case 'A':
      case 'E':
      case 'I':
      case 'O':
      case 'U':
      case 'Y':
        if (current === 0) {
          primary += 'A';
          secondary += 'A';
        }
        current++;
        break;
        
      case 'B':
        primary += 'P';
        secondary += 'P';
        current = charAt(current + 1) === 'B' ? current + 2 : current + 1;
        break;
        
      case 'C':
        if (current > 1 && !isVowel(charAt(current - 2)) && 
            stringAt(current - 1, 3, 'ACH') && 
            charAt(current + 2) !== 'I' && 
            (charAt(current + 2) !== 'E' || stringAt(current - 2, 6, 'BACHER', 'MACHER'))) {
          primary += 'K';
          secondary += 'K';
          current += 2;
          break;
        }
        
        if (current === 0 && stringAt(current, 6, 'CAESAR')) {
          primary += 'S';
          secondary += 'S';
          current += 2;
          break;
        }
        
        if (stringAt(current, 2, 'CH')) {
          if (current > 0 && stringAt(current, 4, 'CHAE')) {
            primary += 'K';
            secondary += 'X';
            current += 2;
            break;
          }
          
          if (current === 0 && (stringAt(current + 1, 5, 'HARAC', 'HARIS') || 
              stringAt(current + 1, 3, 'HOR', 'HYM', 'HIA', 'HEM')) && 
              !stringAt(0, 5, 'CHORE')) {
            primary += 'K';
            secondary += 'K';
            current += 2;
            break;
          }
          
          if ((stringAt(0, 4, 'VAN ', 'VON ') || stringAt(0, 3, 'SCH')) ||
              stringAt(current - 2, 6, 'ORCHES', 'ARCHIT', 'ORCHID') ||
              stringAt(current + 2, 1, 'T', 'S') ||
              ((stringAt(current - 1, 1, 'A', 'O', 'U', 'E') || current === 0) &&
               stringAt(current + 2, 1, 'L', 'R', 'N', 'M', 'B', 'H', 'F', 'V', 'W', ' '))) {
            primary += 'K';
            secondary += 'K';
          } else {
            if (current > 0) {
              if (stringAt(0, 2, 'MC')) {
                primary += 'K';
                secondary += 'K';
              } else {
                primary += 'X';
                secondary += 'K';
              }
            } else {
              primary += 'X';
              secondary += 'X';
            }
          }
          current += 2;
          break;
        }
        
        if (stringAt(current, 2, 'CZ') && !stringAt(current - 2, 4, 'WICZ')) {
          primary += 'S';
          secondary += 'X';
          current += 2;
          break;
        }
        
        if (stringAt(current + 1, 3, 'CIA')) {
          primary += 'X';
          secondary += 'X';
          current += 3;
          break;
        }
        
        if (stringAt(current, 2, 'CC') && !(current === 1 && charAt(0) === 'M')) {
          if (stringAt(current + 2, 1, 'I', 'E', 'H') && !stringAt(current + 2, 2, 'HU')) {
            if ((current === 1 && charAt(current - 1) === 'A') ||
                stringAt(current - 1, 5, 'UCCEE', 'UCCES')) {
              primary += 'KS';
              secondary += 'KS';
            } else {
              primary += 'X';
              secondary += 'X';
            }
            current += 3;
            break;
          } else {
            primary += 'K';
            secondary += 'K';
            current += 2;
            break;
          }
        }
        
        if (stringAt(current, 2, 'CK', 'CG', 'CQ')) {
          primary += 'K';
          secondary += 'K';
          current += 2;
          break;
        }
        
        if (stringAt(current, 2, 'CI', 'CE', 'CY')) {
          if (stringAt(current, 3, 'CIO', 'CIE', 'CIA')) {
            primary += 'S';
            secondary += 'X';
          } else {
            primary += 'S';
            secondary += 'S';
          }
          current += 2;
          break;
        }
        
        primary += 'K';
        secondary += 'K';
        if (stringAt(current + 1, 2, ' C', ' Q', ' G')) {
          current += 3;
        } else if (stringAt(current + 1, 1, 'C', 'K', 'Q') && 
                   !stringAt(current + 1, 2, 'CE', 'CI')) {
          current += 2;
        } else {
          current++;
        }
        break;
        
      case 'D':
        if (stringAt(current, 2, 'DG')) {
          if (stringAt(current + 2, 1, 'I', 'E', 'Y')) {
            primary += 'J';
            secondary += 'J';
            current += 3;
          } else {
            primary += 'TK';
            secondary += 'TK';
            current += 2;
          }
          break;
        }
        
        if (stringAt(current, 2, 'DT', 'DD')) {
          primary += 'T';
          secondary += 'T';
          current += 2;
          break;
        }
        
        primary += 'T';
        secondary += 'T';
        current++;
        break;
        
      case 'F':
        primary += 'F';
        secondary += 'F';
        current = charAt(current + 1) === 'F' ? current + 2 : current + 1;
        break;
        
      case 'G':
        if (charAt(current + 1) === 'H') {
          if (current > 0 && !isVowel(charAt(current - 1))) {
            primary += 'K';
            secondary += 'K';
            current += 2;
            break;
          }
          
          if (current < 3) {
            if (current === 0) {
              if (charAt(current + 2) === 'I') {
                primary += 'J';
                secondary += 'J';
              } else {
                primary += 'K';
                secondary += 'K';
              }
              current += 2;
              break;
            }
          }
          
          if ((current > 1 && stringAt(current - 2, 1, 'B', 'H', 'D')) ||
              (current > 2 && stringAt(current - 3, 1, 'B', 'H', 'D')) ||
              (current > 3 && stringAt(current - 4, 1, 'B', 'H'))) {
            current += 2;
            break;
          } else {
            if (current > 2 && charAt(current - 1) === 'U' && 
                stringAt(current - 3, 1, 'C', 'G', 'L', 'R', 'T')) {
              primary += 'F';
              secondary += 'F';
            } else if (current > 0 && charAt(current - 1) !== 'I') {
              primary += 'K';
              secondary += 'K';
            }
            current += 2;
            break;
          }
        }
        
        if (charAt(current + 1) === 'N') {
          if (current === 1 && isVowel(charAt(0)) && !isVowel(charAt(0))) {
            primary += 'KN';
            secondary += 'N';
          } else if (!stringAt(current + 2, 2, 'EY') && 
                     charAt(current + 1) !== 'Y' && !isVowel(charAt(0))) {
            primary += 'N';
            secondary += 'KN';
          } else {
            primary += 'KN';
            secondary += 'KN';
          }
          current += 2;
          break;
        }
        
        if (stringAt(current + 1, 2, 'LI') && !isVowel(charAt(0))) {
          primary += 'KL';
          secondary += 'L';
          current += 2;
          break;
        }
        
        if (current === 0 && (charAt(current + 1) === 'Y' || 
            stringAt(current + 1, 2, 'ES', 'EP', 'EB', 'EL', 'EY', 'IB', 'IL', 'IN', 'IE', 'EI', 'ER'))) {
          primary += 'K';
          secondary += 'J';
          current += 2;
          break;
        }
        
        if ((stringAt(current + 1, 2, 'ER') || charAt(current + 1) === 'Y') &&
            !stringAt(0, 6, 'DANGER', 'RANGER', 'MANGER') &&
            !stringAt(current - 1, 1, 'E', 'I') &&
            !stringAt(current - 1, 3, 'RGY', 'OGY')) {
          primary += 'K';
          secondary += 'J';
          current += 2;
          break;
        }
        
        if (stringAt(current + 1, 1, 'E', 'I', 'Y') || 
            stringAt(current - 1, 4, 'AGGI', 'OGGI')) {
          if (stringAt(0, 4, 'VAN ', 'VON ') || stringAt(0, 3, 'SCH') ||
              stringAt(current + 1, 2, 'ET')) {
            primary += 'K';
            secondary += 'K';
          } else if (stringAt(current + 1, 3, 'IER')) {
            primary += 'J';
            secondary += 'J';
          } else {
            primary += 'J';
            secondary += 'K';
          }
          current += 2;
          break;
        }
        
        primary += 'K';
        secondary += 'K';
        current = charAt(current + 1) === 'G' ? current + 2 : current + 1;
        break;
        
      case 'H':
        if ((current === 0 || isVowel(charAt(current - 1))) && isVowel(charAt(current + 1))) {
          primary += 'H';
          secondary += 'H';
          current += 2;
        } else {
          current++;
        }
        break;
        
      case 'J':
        if (stringAt(current, 4, 'JOSE') || stringAt(0, 4, 'SAN ')) {
          if ((current === 0 && charAt(current + 4) === ' ') || stringAt(0, 4, 'SAN ')) {
            primary += 'H';
            secondary += 'H';
          } else {
            primary += 'J';
            secondary += 'H';
          }
          current++;
          break;
        }
        
        if (current === 0 && !stringAt(current, 4, 'JOSE')) {
          primary += 'J';
          secondary += 'A';
        } else if (isVowel(charAt(current - 1)) && !isVowel(charAt(0)) && 
                   stringAt(current, 1, 'A', 'O')) {
          primary += 'J';
          secondary += 'H';
        } else if (current === length - 1) {
          primary += 'J';
          secondary += '';
        } else if (!stringAt(current + 1, 1, 'L', 'T', 'K', 'S', 'N', 'M', 'B', 'Z') &&
                   !stringAt(current - 1, 1, 'S', 'K', 'L')) {
          primary += 'J';
          secondary += 'J';
        }
        
        current = charAt(current + 1) === 'J' ? current + 2 : current + 1;
        break;
        
      case 'K':
        primary += 'K';
        secondary += 'K';
        current = charAt(current + 1) === 'K' ? current + 2 : current + 1;
        break;
        
      case 'L':
        if (charAt(current + 1) === 'L') {
          if (((current === length - 3) && stringAt(current - 1, 4, 'ILLO', 'ILLA', 'ALLE')) ||
              ((stringAt(length - 2, 2, 'AS', 'OS') || stringAt(length - 1, 1, 'A', 'O')) &&
               stringAt(current - 1, 4, 'ALLE'))) {
            primary += 'L';
            secondary += '';
            current += 2;
            break;
          }
          current += 2;
        } else {
          current++;
        }
        primary += 'L';
        secondary += 'L';
        break;
        
      case 'M':
        if ((stringAt(current - 1, 3, 'UMB') && 
             ((current + 1) === length - 1 || stringAt(current + 2, 2, 'ER'))) ||
            charAt(current + 1) === 'M') {
          current += 2;
        } else {
          current++;
        }
        primary += 'M';
        secondary += 'M';
        break;
        
      case 'N':
        primary += 'N';
        secondary += 'N';
        current = charAt(current + 1) === 'N' ? current + 2 : current + 1;
        break;
        
      case 'Ñ':
        primary += 'N';
        secondary += 'N';
        current++;
        break;
        
      case 'P':
        if (charAt(current + 1) === 'H') {
          primary += 'F';
          secondary += 'F';
          current += 2;
          break;
        }
        
        primary += 'P';
        secondary += 'P';
        current = stringAt(current + 1, 1, 'P', 'B') ? current + 2 : current + 1;
        break;
        
      case 'Q':
        primary += 'K';
        secondary += 'K';
        current = charAt(current + 1) === 'Q' ? current + 2 : current + 1;
        break;
        
      case 'R':
        if (current === length - 1 && !isVowel(charAt(0)) && 
            stringAt(current - 2, 2, 'ER') && 
            !stringAt(current - 4, 2, 'ME', 'MA')) {
          primary += '';
          secondary += 'R';
        } else {
          primary += 'R';
          secondary += 'R';
        }
        current = charAt(current + 1) === 'R' ? current + 2 : current + 1;
        break;
        
      case 'S':
        if (stringAt(current - 1, 3, 'ISL', 'YSL')) {
          current++;
          break;
        }
        
        if (current === 0 && stringAt(current, 5, 'SUGAR')) {
          primary += 'X';
          secondary += 'S';
          current++;
          break;
        }
        
        if (stringAt(current, 2, 'SH')) {
          if (stringAt(current + 1, 4, 'HEIM', 'HOEK', 'HOLM', 'HOLZ')) {
            primary += 'S';
            secondary += 'S';
          } else {
            primary += 'X';
            secondary += 'X';
          }
          current += 2;
          break;
        }
        
        if (stringAt(current, 3, 'SIO', 'SIA') || stringAt(current, 4, 'SIAN')) {
          if (!isVowel(charAt(0))) {
            primary += 'S';
            secondary += 'S';
          } else {
            primary += 'S';
            secondary += 'X';
          }
          current += 3;
          break;
        }
        
        if ((current === 0 && stringAt(current + 1, 1, 'M', 'N', 'L', 'W')) ||
            stringAt(current + 1, 1, 'Z')) {
          primary += 'S';
          secondary += 'X';
          current = stringAt(current + 1, 1, 'Z') ? current + 2 : current + 1;
          break;
        }
        
        if (stringAt(current, 2, 'SC')) {
          if (charAt(current + 2) === 'H') {
            if (stringAt(current + 3, 2, 'OO', 'ER', 'EN', 'UY', 'ED', 'EM')) {
              if (stringAt(current + 3, 2, 'ER', 'EN')) {
                primary += 'X';
                secondary += 'SK';
              } else {
                primary += 'SK';
                secondary += 'SK';
              }
              current += 3;
              break;
            } else {
              if (current === 0 && !isVowel(charAt(3)) && charAt(3) !== 'W') {
                primary += 'X';
                secondary += 'S';
              } else {
                primary += 'X';
                secondary += 'X';
              }
              current += 3;
              break;
            }
          }
          
          if (stringAt(current + 2, 1, 'I', 'E', 'Y')) {
            primary += 'S';
            secondary += 'S';
            current += 3;
            break;
          }
          
          primary += 'SK';
          secondary += 'SK';
          current += 3;
          break;
        }
        
        if (current === length - 1 && stringAt(current - 2, 2, 'AI', 'OI')) {
          primary += '';
          secondary += 'S';
        } else {
          primary += 'S';
          secondary += 'S';
        }
        
        current = stringAt(current + 1, 1, 'S', 'Z') ? current + 2 : current + 1;
        break;
        
      case 'T':
        if (stringAt(current, 4, 'TION')) {
          primary += 'X';
          secondary += 'X';
          current += 3;
          break;
        }
        
        if (stringAt(current, 3, 'TIA', 'TCH')) {
          primary += 'X';
          secondary += 'X';
          current += 3;
          break;
        }
        
        if (stringAt(current, 2, 'TH') || stringAt(current, 3, 'TTH')) {
          if (stringAt(current + 2, 2, 'OM', 'AM') || 
              stringAt(0, 4, 'VAN ', 'VON ') || 
              stringAt(0, 3, 'SCH')) {
            primary += 'T';
            secondary += 'T';
          } else {
            primary += '0';
            secondary += 'T';
          }
          current += 2;
          break;
        }
        
        primary += 'T';
        secondary += 'T';
        current = stringAt(current + 1, 1, 'T', 'D') ? current + 2 : current + 1;
        break;
        
      case 'V':
        primary += 'F';
        secondary += 'F';
        current = charAt(current + 1) === 'V' ? current + 2 : current + 1;
        break;
        
      case 'W':
        if (stringAt(current, 2, 'WR')) {
          primary += 'R';
          secondary += 'R';
          current += 2;
          break;
        }
        
        if (current === 0 && (isVowel(charAt(current + 1)) || stringAt(current, 2, 'WH'))) {
          if (isVowel(charAt(current + 1))) {
            primary += 'A';
            secondary += 'F';
          } else {
            primary += 'A';
            secondary += 'A';
          }
        }
        
        if ((current === length - 1 && isVowel(charAt(current - 1))) ||
            stringAt(current - 1, 5, 'EWSKI', 'EWSKY', 'OWSKI', 'OWSKY') ||
            stringAt(0, 3, 'SCH')) {
          primary += '';
          secondary += 'F';
          current++;
          break;
        }
        
        if (stringAt(current, 4, 'WICZ', 'WITZ')) {
          primary += 'TS';
          secondary += 'FX';
          current += 4;
          break;
        }
        
        current++;
        break;
        
      case 'X':
        if (!(current === length - 1 && 
              (stringAt(current - 3, 3, 'IAU', 'EAU') || 
               stringAt(current - 2, 2, 'AU', 'OU')))) {
          primary += 'KS';
          secondary += 'KS';
        }
        
        current = stringAt(current + 1, 1, 'C', 'X') ? current + 2 : current + 1;
        break;
        
      case 'Z':
        if (charAt(current + 1) === 'H') {
          primary += 'J';
          secondary += 'J';
          current += 2;
          break;
        } else if (stringAt(current + 1, 2, 'ZO', 'ZI', 'ZA') || 
                   (isVowel(charAt(0)) && current > 0 && charAt(current + 1) !== 'Z')) {
          primary += 'S';
          secondary += 'TS';
        } else {
          primary += 'S';
          secondary += 'S';
        }
        
        current = charAt(current + 1) === 'Z' ? current + 2 : current + 1;
        break;
        
      default:
        current++;
        break;
    }
  }

  return {
    primary: primary.substring(0, 4),
    secondary: secondary.substring(0, 4)
  };
}

/**
 * Generate simple Metaphone code for a string
 * @param {string} str - Input string
 * @returns {string} - Metaphone code
 */
export function metaphone(str) {
  if (!str) return '';
  
  str = str.toUpperCase().replace(/[^A-Z]/g, '');
  if (str.length === 0) return '';

  let metaphoneKey = '';
  let current = 0;
  const length = str.length;
  
  // Helper function to get character at position
  const charAt = (pos) => pos >= 0 && pos < length ? str[pos] : '';
  
  // Helper function to check if character is a vowel
  const isVowel = (char) => 'AEIOU'.includes(char);
  
  // Skip initial silent letters
  if (str.startsWith('KN') || str.startsWith('GN') || str.startsWith('PN') || 
      str.startsWith('AE') || str.startsWith('WR')) {
    current = 1;
  }
  
  // Initial X becomes S
  if (charAt(0) === 'X') {
    metaphoneKey += 'S';
    current = 1;
  }
  
  while (current < length) {
    const char = charAt(current);
    
    switch (char) {
      case 'A':
      case 'E':
      case 'I':
      case 'O':
      case 'U':
        if (current === 0) {
          metaphoneKey += char;
        }
        break;
        
      case 'B':
        metaphoneKey += 'B';
        if (charAt(current + 1) === 'B') current++;
        break;
        
      case 'C':
        if (charAt(current + 1) === 'H') {
          metaphoneKey += 'X';
          current++;
        } else if (current > 0 && charAt(current - 1) === 'S' && 
                   (charAt(current + 1) === 'I' || charAt(current + 1) === 'E')) {
          // Skip
        } else if (charAt(current + 1) === 'I' || charAt(current + 1) === 'E') {
          metaphoneKey += 'S';
        } else {
          metaphoneKey += 'K';
        }
        break;
        
      case 'D':
        if (charAt(current + 1) === 'G' && 
            (charAt(current + 2) === 'E' || charAt(current + 2) === 'I')) {
          metaphoneKey += 'J';
          current += 2;
        } else {
          metaphoneKey += 'T';
        }
        break;
        
      case 'F':
        metaphoneKey += 'F';
        if (charAt(current + 1) === 'F') current++;
        break;
        
      case 'G':
        if (charAt(current + 1) === 'H') {
          if (current === 0 || isVowel(charAt(current - 1))) {
            metaphoneKey += 'G';
          }
          current++;
        } else if (charAt(current + 1) === 'N') {
          if (current === 0 || (current === 1 && isVowel(charAt(0)))) {
            metaphoneKey += 'N';
            current++;
          } else {
            metaphoneKey += 'KN';
            current++;
          }
        } else if (charAt(current + 1) === 'I' || charAt(current + 1) === 'E' || charAt(current + 1) === 'Y') {
          metaphoneKey += 'J';
        } else {
          metaphoneKey += 'K';
        }
        break;
        
      case 'H':
        if (current === 0 || isVowel(charAt(current - 1))) {
          if (isVowel(charAt(current + 1))) {
            metaphoneKey += 'H';
          }
        }
        break;
        
      case 'J':
        metaphoneKey += 'J';
        break;
        
      case 'K':
        if (current === 0 || charAt(current - 1) !== 'C') {
          metaphoneKey += 'K';
        }
        break;
        
      case 'L':
        metaphoneKey += 'L';
        if (charAt(current + 1) === 'L') current++;
        break;
        
      case 'M':
        metaphoneKey += 'M';
        if (charAt(current + 1) === 'M') current++;
        break;
        
      case 'N':
        metaphoneKey += 'N';
        if (charAt(current + 1) === 'N') current++;
        break;
        
      case 'P':
        if (charAt(current + 1) === 'H') {
          metaphoneKey += 'F';
          current++;
        } else {
          metaphoneKey += 'P';
        }
        break;
        
      case 'Q':
        metaphoneKey += 'K';
        break;
        
      case 'R':
        metaphoneKey += 'R';
        if (charAt(current + 1) === 'R') current++;
        break;
        
      case 'S':
        if (charAt(current + 1) === 'H') {
          metaphoneKey += 'X';
          current++;
        } else if (charAt(current + 1) === 'I' && 
                   (charAt(current + 2) === 'O' || charAt(current + 2) === 'A')) {
          metaphoneKey += 'X';
          current += 2;
        } else {
          metaphoneKey += 'S';
        }
        break;
        
      case 'T':
        if (charAt(current + 1) === 'H') {
          metaphoneKey += '0';
          current++;
        } else if (charAt(current + 1) === 'I' && 
                   (charAt(current + 2) === 'O' || charAt(current + 2) === 'A')) {
          metaphoneKey += 'X';
          current += 2;
        } else {
          metaphoneKey += 'T';
        }
        break;
        
      case 'V':
        metaphoneKey += 'F';
        break;
        
      case 'W':
        if (isVowel(charAt(current + 1))) {
          metaphoneKey += 'W';
        }
        break;
        
      case 'X':
        metaphoneKey += 'KS';
        break;
        
      case 'Y':
        if (isVowel(charAt(current + 1))) {
          metaphoneKey += 'Y';
        }
        break;
        
      case 'Z':
        metaphoneKey += 'S';
        break;
    }
    
    current++;
  }
  
  return metaphoneKey;
}

/**
 * Compare two strings using phonetic matching
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @param {string} algorithm - Algorithm to use ('soundex', 'metaphone', 'double_metaphone')
 * @returns {Object} - Comparison result
 */
export function phoneticMatch(str1, str2, algorithm = 'soundex') {
  if (!str1 || !str2) return { match: false, codes: null };
  
  let codes1, codes2, match = false;
  
  switch (algorithm.toLowerCase()) {
    case 'soundex':
      codes1 = soundex(str1);
      codes2 = soundex(str2);
      match = codes1 === codes2;
      break;
      
    case 'metaphone':
      codes1 = metaphone(str1);
      codes2 = metaphone(str2);
      match = codes1 === codes2;
      break;
      
    case 'double_metaphone':
      codes1 = doubleMetaphone(str1);
      codes2 = doubleMetaphone(str2);
      match = codes1.primary === codes2.primary || 
              codes1.primary === codes2.secondary ||
              codes1.secondary === codes2.primary ||
              codes1.secondary === codes2.secondary;
      break;
      
    default:
      throw new Error(`Unknown phonetic algorithm: ${algorithm}`);
  }
  
  return {
    match,
    codes: { str1: codes1, str2: codes2 },
    algorithm
  };
}

/**
 * Generate all phonetic codes for a string
 * @param {string} str - Input string
 * @returns {Object} - Object containing all phonetic codes
 */
export function getAllPhoneticCodes(str) {
  return {
    soundex: soundex(str),
    metaphone: metaphone(str),
    doubleMetaphone: doubleMetaphone(str)
  };
}

export default {
  soundex,
  metaphone,
  doubleMetaphone,
  phoneticMatch,
  getAllPhoneticCodes
};

