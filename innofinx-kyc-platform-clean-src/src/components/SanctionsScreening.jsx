import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Download,
  Eye,
  Upload
} from 'lucide-react';

const SanctionsScreening = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  // Mock stats data
  const stats = {
    services: [
      { name: 'OFAC', totalEntries: 12543, lastUpdate: '2024-09-04T10:00:00Z' },
      { name: 'UN', totalEntries: 8921, lastUpdate: '2024-09-04T09:30:00Z' },
      { name: 'EU', totalEntries: 15672, lastUpdate: '2024-09-04T11:15:00Z' },
      { name: 'BIS', totalEntries: 3456, lastUpdate: '2024-09-04T08:45:00Z' }
    ],
    totalEntries: 40592,
    lastUpdate: '2024-09-04T11:15:00Z'
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      if (searchTerm.toLowerCase().includes('john')) {
        setSearchResults({
          entity: { fullName: searchTerm },
          matches: [
            {
              entity: {
                fullName: 'John Smith',
                source: 'OFAC_SDN',
                programs: ['SDGT', 'TERRORISM'],
                remarks: 'Designated for terrorism activities'
              },
              matches: [{ type: 'name', value: 'John Smith', confidence: 0.95 }],
              confidence: 0.95,
              source: 'OFAC',
              riskLevel: 'CRITICAL'
            }
          ],
          summary: {
            totalMatches: 1,
            highRiskMatches: 1,
            sources: ['OFAC'],
            riskScore: 92,
            recommendation: 'REJECT'
          },
          timestamp: new Date().toISOString()
        });
      } else {
        setSearchResults({
          entity: { fullName: searchTerm },
          matches: [],
          summary: {
            totalMatches: 0,
            highRiskMatches: 0,
            sources: [],
            riskScore: 0,
            recommendation: 'CLEAR'
          },
          timestamp: new Date().toISOString()
        });
      }
      setIsSearching(false);
    }, 2000);
  };

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case 'CRITICAL': return 'destructive';
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'secondary';
      case 'LOW': return 'outline';
      default: return 'outline';
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'REJECT': return 'destructive';
      case 'MANUAL_REVIEW': return 'secondary';
      case 'ENHANCED_DUE_DILIGENCE': return 'secondary';
      case 'CLEAR': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sanctions Screening</h1>
        <p className="text-gray-600">Real-time screening against global sanctions lists</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.services.map((service, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{service.name}</p>
                  <p className="text-xl font-bold text-gray-900">
                    {service.totalEntries.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Updated: {new Date(service.lastUpdate).toLocaleDateString()}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Sanctions Search</span>
          </CardTitle>
          <CardDescription>
            Search for individuals or entities across all sanctions lists
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter name or entity to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchTerm.trim()}
            >
              {isSearching ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            Total entries: {stats.totalEntries.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Search Results</span>
              <Badge variant={getRecommendationColor(searchResults.summary.recommendation)}>
                {searchResults.summary.recommendation.replace('_', ' ')}
              </Badge>
            </CardTitle>
            <CardDescription>
              Results for: "{searchResults.entity.fullName}"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {searchResults.summary.totalMatches}
                </p>
                <p className="text-sm text-gray-600">Total Matches</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {searchResults.summary.highRiskMatches}
                </p>
                <p className="text-sm text-gray-600">High Risk</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {searchResults.summary.riskScore}
                </p>
                <p className="text-sm text-gray-600">Risk Score</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Sources</p>
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  {searchResults.summary.sources.map((source, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Matches */}
            {searchResults.matches.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Potential Matches</h4>
                {searchResults.matches.map((match, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h5 className="font-medium text-gray-900">
                            {match.entity.fullName}
                          </h5>
                          <Badge variant={getRiskBadgeColor(match.riskLevel)}>
                            {match.riskLevel}
                          </Badge>
                          <Badge variant="outline">
                            {match.source}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Confidence:</strong> {(match.confidence * 100).toFixed(1)}%</p>
                          
                          {match.entity.programs && (
                            <p><strong>Programs:</strong> {match.entity.programs.join(', ')}</p>
                          )}
                          
                          {match.entity.remarks && (
                            <p><strong>Remarks:</strong> {match.entity.remarks}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  No matches found in sanctions lists. Entity appears to be clear.
                </AlertDescription>
              </Alert>
            )}

            {/* Timestamp */}
            <div className="text-xs text-gray-500 text-right">
              Search completed: {new Date(searchResults.timestamp).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common sanctions screening tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Upload className="h-6 w-6" />
              <span>Batch Upload</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Download className="h-6 w-6" />
              <span>Export Results</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Clock className="h-6 w-6" />
              <span>Schedule Screening</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SanctionsScreening;

