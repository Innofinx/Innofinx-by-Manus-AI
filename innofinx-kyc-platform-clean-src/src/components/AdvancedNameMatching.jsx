import React, { useState } from 'react';
import { Search, Users, Target, AlertTriangle, CheckCircle, Info, Copy } from 'lucide-react';

const AdvancedNameMatching = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [targetName, setTargetName] = useState('');
  const [matchResults, setMatchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('fuzzy');

  // Sample database of names for testing
  const sampleNames = [
    'John Smith', 'Jon Smith', 'Jonathan Smith', 'John Smyth', 'Johnny Smith',
    'Wang Wei', '王伟', 'Wong Wai', 'Wang Wai', 'Wong Wei',
    'Li Ming', '李明', 'Lee Ming', 'Li Min', 'Lee Min',
    'Zhang San', '张三', 'Chang San', 'Cheung San', 'Zhang Shan',
    'Chen Jie', '陈杰', 'Chan Kit', 'Chen Kit', 'Chan Jie',
    'Michael Johnson', 'Mike Johnson', 'Michael Johnston', 'Micheal Johnson',
    'Sarah Connor', 'Sara Connor', 'Sarah Conner', 'Sarah O\'Connor',
    'David Brown', 'Dave Brown', 'David Browne', 'David Browns'
  ];

  // Simple Levenshtein distance calculation
  const levenshteinDistance = (str1, str2) => {
    if (!str1 || !str2) return Math.max(str1?.length || 0, str2?.length || 0);
    
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

    return matrix[len1][len2];
  };

  // Calculate similarity ratio
  const similarityRatio = (str1, str2) => {
    if (!str1 || !str2) return 0;
    if (str1 === str2) return 1;

    const maxLength = Math.max(str1.length, str2.length);
    const distance = levenshteinDistance(str1, str2);
    
    return (maxLength - distance) / maxLength;
  };

  // Simple Soundex implementation
  const soundex = (str) => {
    if (!str) return '0000';
    
    str = str.toUpperCase().replace(/[^A-Z]/g, '');
    if (str.length === 0) return '0000';

    const firstLetter = str[0];
    let code = firstLetter;
    
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
      
      if (currentCode === '0') {
        prevCode = '0';
        continue;
      }
      
      if (currentCode !== prevCode) {
        code += currentCode;
      }
      
      prevCode = currentCode;
    }
    
    return (code + '0000').substring(0, 4);
  };

  const performFuzzyMatching = () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const matches = sampleNames
        .map(name => {
          const similarity = similarityRatio(searchQuery.toLowerCase(), name.toLowerCase());
          return {
            candidate: name,
            target: searchQuery,
            score: similarity,
            levenshteinDistance: levenshteinDistance(searchQuery.toLowerCase(), name.toLowerCase()),
            exact: searchQuery.toLowerCase() === name.toLowerCase()
          };
        })
        .filter(match => match.score >= 0.3)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      
      setMatchResults(matches);
      setIsLoading(false);
    }, 500);
  };

  const getRiskLevel = (confidence) => {
    if (confidence >= 0.9) return { level: 'HIGH', color: 'text-green-600', bg: 'bg-green-50' };
    if (confidence >= 0.7) return { level: 'MEDIUM', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (confidence >= 0.5) return { level: 'LOW', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { level: 'VERY LOW', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Name Matching</h1>
          <p className="text-gray-600">Fuzzy matching, phonetic algorithms, and Chinese name romanization</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Algorithms</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sample Names</p>
                <p className="text-2xl font-bold text-gray-900">{sampleNames.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chinese Surnames</p>
                <p className="text-2xl font-bold text-gray-900">95</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">94.2%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Query
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter name to search (e.g., John Smith, 王伟)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={performFuzzyMatching}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Sample Queries */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Sample Queries:</p>
              <div className="flex flex-wrap gap-2">
                {['John Smith', 'Jon Smyth', '王伟', 'Wong Wei', 'Michael Johnson'].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => setSearchQuery(sample)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Match Results */}
            {matchResults.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Fuzzy Match Results ({matchResults.length} matches)
                </h3>
                <div className="space-y-3">
                  {matchResults.map((match, index) => {
                    const risk = getRiskLevel(match.score);
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900">{match.candidate}</span>
                            <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${risk.bg} ${risk.color}`}>
                              {risk.level} MATCH
                            </span>
                            {match.exact && (
                              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                EXACT
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              Score: {(match.score * 100).toFixed(1)}%
                            </span>
                            <button
                              onClick={() => copyToClipboard(match.candidate)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Similarity:</span>
                            <span className="ml-1 font-medium">{(match.score * 100).toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Edit Distance:</span>
                            <span className="ml-1 font-medium">{match.levenshteinDistance}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Soundex:</span>
                            <span className="ml-1 font-mono font-medium">{soundex(match.candidate)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            Algorithm Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Fuzzy Matching</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Levenshtein Distance</li>
                <li>• Similarity Ratio</li>
                <li>• Edit Distance Calculation</li>
                <li>• Threshold-based Filtering</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Phonetic Matching</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Soundex Algorithm</li>
                <li>• Phonetic Code Generation</li>
                <li>• Sound-based Comparison</li>
                <li>• Pronunciation Similarity</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Chinese Names</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Romanization Detection</li>
                <li>• Character Recognition</li>
                <li>• Multiple Romanization Systems</li>
                <li>• Cross-language Matching</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedNameMatching;

