import React, { useState } from 'react';
import { Users, FileText, CheckCircle, Clock, AlertTriangle, Upload, Eye, MessageSquare, ArrowRight, Filter, Search } from 'lucide-react';

const CPAWorkflow = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [selectedClient, setSelectedClient] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for CPA workflow
  const clientQueue = [
    {
      id: 'CLT-001',
      name: 'ABC Corporation Ltd',
      submittedBy: 'John Smith',
      submissionDate: '2024-12-01',
      status: 'pending_review',
      priority: 'high',
      documents: ['Business License', 'Articles of Incorporation', 'Financial Statements'],
      riskScore: 85,
      notes: 'Large corporation with complex structure requiring detailed review',
      assignedCPA: 'Sarah Johnson',
      dueDate: '2024-12-05'
    },
    {
      id: 'CLT-002',
      name: 'XYZ Trading Co',
      submittedBy: 'Mike Chen',
      submissionDate: '2024-11-28',
      status: 'in_review',
      priority: 'medium',
      documents: ['Trade License', 'Bank Statements', 'Tax Returns'],
      riskScore: 65,
      notes: 'Standard trading company, routine review required',
      assignedCPA: 'David Wilson',
      dueDate: '2024-12-03'
    },
    {
      id: 'CLT-003',
      name: 'DEF Industries',
      submittedBy: 'Lisa Wang',
      submissionDate: '2024-11-25',
      status: 'approved',
      priority: 'low',
      documents: ['Manufacturing License', 'Environmental Permits', 'Insurance Docs'],
      riskScore: 45,
      notes: 'Approved after standard review process',
      assignedCPA: 'Sarah Johnson',
      dueDate: '2024-11-30'
    },
    {
      id: 'CLT-004',
      name: 'GHI Consulting',
      submittedBy: 'Tom Brown',
      submissionDate: '2024-11-20',
      status: 'requires_clarification',
      priority: 'high',
      documents: ['Service Agreement', 'Professional Licenses'],
      riskScore: 75,
      notes: 'Missing key documentation, clarification requested',
      assignedCPA: 'David Wilson',
      dueDate: '2024-11-28'
    }
  ];

  // Filter clients based on status and search
  const filteredClients = clientQueue.filter(client => {
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending_review: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Review' },
      in_review: { color: 'bg-blue-100 text-blue-800', text: 'In Review' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Approved' },
      requires_clarification: { color: 'bg-red-100 text-red-800', text: 'Needs Clarification' },
      rejected: { color: 'bg-gray-100 text-gray-800', text: 'Rejected' }
    };
    
    const badge = badges[status] || badges.pending_review;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: { color: 'bg-red-100 text-red-800', text: 'High' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Medium' },
      low: { color: 'bg-green-100 text-green-800', text: 'Low' }
    };
    
    const badge = badges[priority] || badges.medium;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const getRiskScoreColor = (score) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleClientAction = (clientId, action) => {
    console.log(`Action ${action} for client ${clientId}`);
    // In real implementation, this would update the client status
    alert(`${action} action performed for client ${clientId}`);
  };

  const uploadDocument = () => {
    // Mock document upload
    alert('Document upload functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CPA Workflow Dashboard</h1>
          <p className="text-gray-600">Manage client reviews, approvals, and corporate document processing</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clientQueue.filter(c => c.status === 'pending_review').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clientQueue.filter(c => c.status === 'in_review').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clientQueue.filter(c => c.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Need Clarification</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clientQueue.filter(c => c.status === 'requires_clarification').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('queue')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'queue'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Client Queue
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Document Upload
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'audit'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Audit Trail
              </button>
            </nav>
          </div>

          {/* Client Queue Tab */}
          {activeTab === 'queue' && (
            <div className="p-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
                <div className="flex items-center space-x-4">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="requires_clarification">Needs Clarification</option>
                  </select>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search clients..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Client List */}
              <div className="space-y-4">
                {filteredClients.map((client) => (
                  <div key={client.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                        {getStatusBadge(client.status)}
                        {getPriorityBadge(client.priority)}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getRiskScoreColor(client.riskScore)}`}>
                          Risk: {client.riskScore}
                        </span>
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                        >
                          Review
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Submitted by:</span> {client.submittedBy}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {client.submissionDate}
                      </div>
                      <div>
                        <span className="font-medium">Due:</span> {client.dueDate}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {client.documents.length} documents
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Assigned to: {client.assignedCPA}</span>
                      </div>
                    </div>

                    {client.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
                        <MessageSquare className="h-4 w-4 inline mr-1" />
                        {client.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Upload Tab */}
          {activeTab === 'upload' && (
            <div className="p-6">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Corporate Document Upload</h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Corporate Documents</h4>
                  <p className="text-gray-600 mb-4">
                    Upload business licenses, articles of incorporation, financial statements, and other corporate documents
                  </p>
                  
                  <button
                    onClick={uploadDocument}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Choose Files
                  </button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Supported Document Types:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Business Registration & Licenses</li>
                    <li>• Articles of Incorporation</li>
                    <li>• Financial Statements & Tax Returns</li>
                    <li>• Bank Statements & References</li>
                    <li>• Insurance Documents</li>
                    <li>• Professional Certifications</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Audit Trail Tab */}
          {activeTab === 'audit' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">CPA Audit Trail</h3>
              
              <div className="space-y-4">
                {[
                  { action: 'Client Approved', client: 'DEF Industries', cpa: 'Sarah Johnson', time: '2024-12-01 14:30', details: 'Standard review completed successfully' },
                  { action: 'Clarification Requested', client: 'GHI Consulting', cpa: 'David Wilson', time: '2024-12-01 11:15', details: 'Missing professional license documentation' },
                  { action: 'Review Started', client: 'XYZ Trading Co', cpa: 'David Wilson', time: '2024-12-01 09:45', details: 'Assigned for detailed review' },
                  { action: 'Document Uploaded', client: 'ABC Corporation Ltd', cpa: 'System', time: '2024-12-01 08:20', details: 'Financial statements uploaded by John Smith' }
                ].map((entry, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{entry.action}</span>
                      <span className="text-sm text-gray-500">{entry.time}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><strong>Client:</strong> {entry.client}</p>
                      <p><strong>CPA:</strong> {entry.cpa}</p>
                      <p><strong>Details:</strong> {entry.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Client Detail Modal */}
        {selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{selectedClient.name}</h2>
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      {getStatusBadge(selectedClient.status)}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Priority</label>
                      {getPriorityBadge(selectedClient.priority)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Documents</label>
                    <div className="space-y-2">
                      {selectedClient.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{doc}</span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      defaultValue={selectedClient.notes}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleClientAction(selectedClient.id, 'approve')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleClientAction(selectedClient.id, 'request_clarification')}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                    >
                      Request Clarification
                    </button>
                    <button
                      onClick={() => handleClientAction(selectedClient.id, 'reject')}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CPAWorkflow;

