import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { 
  Languages, 
  FileText, 
  MapPin, 
  Building, 
  User, 
  RefreshCw,
  Copy,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const TranslationService = () => {
  const [inputText, setInputText] = useState('');
  const [translationContext, setTranslationContext] = useState('general');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState(null);
  const [cacheStats, setCacheStats] = useState(null);

  // Mock cache statistics
  const mockCacheStats = {
    size: 156,
    maxSize: 1000,
    hits: 342,
    misses: 89,
    evictions: 12,
    hitRate: '79.4%',
    ttl: 86400000
  };

  useEffect(() => {
    setCacheStats(mockCacheStats);
  }, []);

  const contextOptions = [
    { value: 'general', label: 'General', icon: FileText },
    { value: 'business', label: 'Business', icon: Building },
    { value: 'address', label: 'Address', icon: MapPin },
    { value: 'personal', label: 'Personal', icon: User },
    { value: 'document', label: 'Document', icon: FileText }
  ];

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);
    
    // Simulate translation API call
    setTimeout(() => {
      const mockTranslations = {
        '北京市朝阳区建国门外大街1号': {
          translatedText: 'No. 1 Jianguomenwai Street, Chaoyang District, Beijing',
          confidence: 0.95,
          context: 'address'
        },
        '科技有限公司': {
          translatedText: 'Technology Co., Ltd.',
          confidence: 0.92,
          context: 'business'
        },
        '张三': {
          translatedText: 'Zhang San',
          confidence: 0.88,
          context: 'personal'
        },
        '营业执照': {
          translatedText: 'Business License',
          confidence: 0.94,
          context: 'document'
        }
      };

      const result = mockTranslations[inputText] || {
        translatedText: `[Translated] ${inputText}`,
        confidence: 0.85,
        context: translationContext
      };

      setTranslationResult({
        originalText: inputText,
        translatedText: result.translatedText,
        confidence: result.confidence,
        context: translationContext,
        timestamp: new Date().toISOString(),
        model: 'gpt-4o-mini',
        cached: Math.random() > 0.3 // 70% chance of being cached
      });

      setIsTranslating(false);
    }, 1500);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (confidence) => {
    if (confidence >= 0.9) return 'default';
    if (confidence >= 0.8) return 'secondary';
    return 'destructive';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const sampleTexts = [
    { text: '北京市朝阳区建国门外大街1号', context: 'address', label: 'Beijing Address' },
    { text: '科技有限公司', context: 'business', label: 'Tech Company' },
    { text: '张三', context: 'personal', label: 'Chinese Name' },
    { text: '营业执照', context: 'document', label: 'Business License' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Translation Services</h1>
        <p className="text-gray-600">Chinese to English translation for KYC documents</p>
      </div>

      {/* Cache Statistics */}
      {cacheStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{cacheStats.size}</p>
                <p className="text-sm text-gray-600">Cached</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{cacheStats.hits}</p>
                <p className="text-sm text-gray-600">Cache Hits</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{cacheStats.misses}</p>
                <p className="text-sm text-gray-600">Cache Misses</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{cacheStats.hitRate}</p>
                <p className="text-sm text-gray-600">Hit Rate</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{cacheStats.evictions}</p>
                <p className="text-sm text-gray-600">Evictions</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{cacheStats.maxSize}</p>
                <p className="text-sm text-gray-600">Max Size</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Translation Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Languages className="h-5 w-5" />
            <span>Chinese to English Translation</span>
          </CardTitle>
          <CardDescription>
            Translate Chinese text for KYC and compliance purposes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Context Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Translation Context
            </label>
            <div className="flex flex-wrap gap-2">
              {contextOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={translationContext === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTranslationContext(option.value)}
                  className="flex items-center space-x-1"
                >
                  <option.icon className="h-4 w-4" />
                  <span>{option.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Chinese Text
            </label>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter Chinese text to translate..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTranslate()}
                className="flex-1"
              />
              <Button 
                onClick={handleTranslate} 
                disabled={isTranslating || !inputText.trim()}
              >
                {isTranslating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Languages className="h-4 w-4" />
                )}
                {isTranslating ? 'Translating...' : 'Translate'}
              </Button>
            </div>
          </div>

          {/* Sample Texts */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Sample Texts
            </label>
            <div className="flex flex-wrap gap-2">
              {sampleTexts.map((sample, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputText(sample.text);
                    setTranslationContext(sample.context);
                  }}
                >
                  {sample.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translation Result */}
      {translationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Translation Result</span>
              <div className="flex items-center space-x-2">
                {translationResult.cached && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Cached
                  </Badge>
                )}
                <Badge variant={getConfidenceBadge(translationResult.confidence)}>
                  {(translationResult.confidence * 100).toFixed(1)}% Confidence
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Original Text */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Original (Chinese)</label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-gray-900">{translationResult.originalText}</p>
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(translationResult.originalText)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Translated Text */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Translation (English)</label>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-gray-900">{translationResult.translatedText}</p>
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(translationResult.translatedText)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Translation Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Context</p>
                <p className="text-sm text-gray-900 capitalize">{translationResult.context}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Model</p>
                <p className="text-sm text-gray-900">{translationResult.model}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Timestamp</p>
                <p className="text-sm text-gray-900">
                  {new Date(translationResult.timestamp).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Confidence Warning */}
            {translationResult.confidence < 0.8 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Low confidence translation. Manual review recommended for critical applications.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Translation Tools</CardTitle>
          <CardDescription>Additional translation utilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Upload className="h-6 w-6" />
              <span>Batch Translate</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Download className="h-6 w-6" />
              <span>Export Translations</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <RefreshCw className="h-6 w-6" />
              <span>Clear Cache</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationService;

