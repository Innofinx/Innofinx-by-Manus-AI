import React, { useState } from 'react';
import { Download, FileText, Shield, Users, Calendar, Filter, Search, Eye, Lock, CheckCircle } from 'lucide-react';

const DocumentReports = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState('admin'); // admin, cpa, analyst
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingType, setGeneratingType] = useState('');

  // Mock data for available reports and documents
  const documents = [
    {
      id: 'RPT-001',
      name: 'KYC Compliance Report - Q4 2024',
      type: 'compliance',
      client: 'ABC Corp',
      date: '2024-12-01',
      size: '2.4 MB',
      status: 'ready',
      permissions: ['admin', 'cpa'],
      description: 'Quarterly compliance assessment and risk analysis'
    },
    {
      id: 'RPT-002',
      name: 'Client Risk Assessment - XYZ Ltd',
      type: 'risk',
      client: 'XYZ Ltd',
      date: '2024-11-28',
      size: '1.8 MB',
      status: 'ready',
      permissions: ['admin', 'cpa', 'analyst'],
      description: 'Individual client risk profile and sanctions screening results'
    },
    {
      id: 'RPT-003',
      name: 'Sanctions Screening Summary',
      type: 'sanctions',
      client: 'Multiple',
      date: '2024-11-25',
      size: '3.2 MB',
      status: 'ready',
      permissions: ['admin', 'cpa'],
      description: 'Comprehensive sanctions screening results for all active clients'
    },
    {
      id: 'RPT-004',
      name: 'Document Verification Report - DEF Inc',
      type: 'verification',
      client: 'DEF Inc',
      date: '2024-11-20',
      size: '1.5 MB',
      status: 'processing',
      permissions: ['admin'],
      description: 'Document authenticity and verification status report'
    },
    {
      id: 'RPT-005',
      name: 'Translation Audit Log',
      type: 'audit',
      client: 'System',
      date: '2024-11-15',
      size: '892 KB',
      status: 'ready',
      permissions: ['admin'],
      description: 'Complete audit trail of all translation activities and accuracy metrics'
    },
    {
      id: 'RPT-006',
      name: 'CPA Review Summary - November',
      type: 'cpa',
      client: 'Multiple',
      date: '2024-11-30',
      size: '2.1 MB',
      status: 'ready',
      permissions: ['admin', 'cpa'],
      description: 'Monthly summary of CPA reviews and approval decisions'
    }
  ];

  // Filter documents based on user role and permissions
  const filteredDocuments = documents.filter(doc => {
    const hasPermission = doc.permissions.includes(userRole);
    const matchesFilter = selectedFilter === 'all' || doc.type === selectedFilter;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    return hasPermission && matchesFilter && matchesSearch;
  });

  // Generate new report
  const generateReport = async (reportType) => {
    setIsGenerating(true);
    setGeneratingType(reportType);

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratingType('');
      // In real implementation, this would trigger actual PDF generation
      alert(`${reportType} report generated successfully!`);
    }, 3000);
  };

  // Download document
  const downloadDocument = (doc) => {
    // In real implementation, this would trigger actual file download
    console.log(`Downloading ${doc.name}...`);
    
    // Create a mock download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Mock PDF content for ${doc.name}`));
    element.setAttribute('download', `${doc.name}.pdf`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Preview document
  const previewDocument = (doc) => {
    alert(`Preview functionality for ${doc.name} would open here`);
  };

  const getStatusBadge = (status) => {
    const badges = {
      ready: { color: 'bg-green-100 text-green-800', text: 'Ready' },
      processing: { color: 'bg-yellow-100 text-yellow-800', text: 'Processing' },
      error: { color: 'bg-red-100 text-red-800', text: 'Error' }
    };
    
    const badge = badges[status] || badges.ready;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    const icons = {
      compliance: Shield,
      risk: Users,
      sanctions: Shield,
      verification: CheckCircle,
      audit: FileText,
      cpa: Users
    };
    
    const IconComponent = icons[type] || FileText;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document & Report Downloads</h1>
          <p className="text-gray-600">Generate and download KYC reports, compliance documents, and audit trails</p>
        </div>

        {/* User Role Selector (for demo purposes) */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-blue-800">Current Role:</span>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="px-3 py-1 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="admin">Administrator</option>
              <option value="cpa">CPA</option>
              <option value="analyst">Analyst</option>
            </select>
            <span className="text-xs text-blue-600">
              (Role determines document access permissions)
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => generateReport('KYC Compliance')}
            disabled={isGenerating}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 disabled:opacity-50"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Generate KYC Report</p>
                <p className="text-xs text-gray-500">Compliance summary</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => generateReport('Risk Assessment')}
            disabled={isGenerating}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 disabled:opacity-50"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Users className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Risk Assessment</p>
                <p className="text-xs text-gray-500">Client risk analysis</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => generateReport('Audit Trail')}
            disabled={isGenerating}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 disabled:opacity-50"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Audit Trail</p>
                <p className="text-xs text-gray-500">Activity logs</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => generateReport('Bulk Export')}
            disabled={isGenerating}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 disabled:opacity-50"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Download className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Bulk Export</p>
                <p className="text-xs text-gray-500">All documents</p>
              </div>
            </div>
          </button>
        </div>

        {/* Generation Status */}
        {isGenerating && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-3"></div>
              <span className="text-yellow-800">
                Generating {generatingType} report... This may take a few moments.
              </span>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Documents</option>
                  <option value="compliance">Compliance Reports</option>
                  <option value="risk">Risk Assessments</option>
                  <option value="sanctions">Sanctions Reports</option>
                  <option value="verification">Verification Reports</option>
                  <option value="audit">Audit Logs</option>
                  <option value="cpa">CPA Reports</option>
                </select>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search documents..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Available Documents ({filteredDocuments.length})
            </h2>
            
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getTypeIcon(doc.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="font-medium text-gray-900">{doc.name}</h3>
                          {getStatusBadge(doc.status)}
                          {!doc.permissions.includes(userRole) && (
                            <Lock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Client: {doc.client}</span>
                          <span>Date: {doc.date}</span>
                          <span>Size: {doc.size}</span>
                          <span>ID: {doc.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => previewDocument(doc)}
                        disabled={doc.status !== 'ready'}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => downloadDocument(doc)}
                        disabled={doc.status !== 'ready'}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 text-sm"
                      >
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-600">
                  {searchQuery ? 'Try adjusting your search terms' : 'No documents match the selected filter'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Role-based Access Info */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Role-based Access Control:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
            <div>
              <strong>Administrator:</strong> Full access to all documents and reports
            </div>
            <div>
              <strong>CPA:</strong> Access to compliance, risk, and CPA-specific reports
            </div>
            <div>
              <strong>Analyst:</strong> Limited access to risk assessments and basic reports
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentReports;

