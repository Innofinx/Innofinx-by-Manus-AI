import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { 
  FileText, 
  Plus, 
  Search, 
  Download, 
  Eye, 
  Edit,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  TrendingUp
} from 'lucide-react';

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock invoice data
  const mockInvoices = [
    {
      id: 'INV-20240904-A1B2',
      invoiceNumber: 'INV-20240904-A1B2',
      clientName: 'ABC Corporation',
      issueDate: '2024-09-01T00:00:00Z',
      dueDate: '2024-10-01T00:00:00Z',
      status: 'sent',
      type: 'kyc_enhanced',
      totalAmount: 150,
      currency: 'USD',
      workflow: { currentStep: 'sent_to_partner' }
    },
    {
      id: 'INV-20240903-C3D4',
      invoiceNumber: 'INV-20240903-C3D4',
      clientName: 'XYZ Limited',
      issueDate: '2024-09-03T00:00:00Z',
      dueDate: '2024-10-03T00:00:00Z',
      status: 'paid',
      type: 'kyc_basic',
      totalAmount: 75,
      currency: 'USD',
      workflow: { currentStep: 'payment_received' }
    },
    {
      id: 'INV-20240902-E5F6',
      invoiceNumber: 'INV-20240902-E5F6',
      clientName: 'DEF Industries',
      issueDate: '2024-08-15T00:00:00Z',
      dueDate: '2024-09-15T00:00:00Z',
      status: 'overdue',
      type: 'sanctions_screening',
      totalAmount: 25,
      currency: 'USD',
      workflow: { currentStep: 'sent_to_partner' }
    },
    {
      id: 'INV-20240901-G7H8',
      invoiceNumber: 'INV-20240901-G7H8',
      clientName: 'GHI Enterprises',
      issueDate: '2024-09-04T00:00:00Z',
      dueDate: '2024-10-04T00:00:00Z',
      status: 'pending_review',
      type: 'compliance_report',
      totalAmount: 100,
      currency: 'USD',
      workflow: { currentStep: 'cpa_review' }
    }
  ];

  // Mock statistics
  const stats = {
    totalInvoices: 156,
    totalRevenue: 45250,
    pendingAmount: 8750,
    overdueAmount: 2100,
    paidThisMonth: 12500,
    averagePaymentTime: 18
  };

  useEffect(() => {
    setInvoices(mockInvoices);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'pending_review': return 'secondary';
      case 'approved': return 'default';
      case 'sent': return 'default';
      case 'paid': return 'default';
      case 'overdue': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      case 'pending_review': return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending_review', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-600">Manage invoices and billing workflow</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(stats.pendingAmount)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.overdueAmount)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats.paidThisMonth)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Payment</p>
                <p className="text-2xl font-bold text-purple-600">{stats.averagePaymentTime}d</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search invoices by client name or invoice number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={statusFilter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            {filteredInvoices.length} of {invoices.length} invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
                      <Badge variant={getStatusColor(invoice.status)} className="flex items-center space-x-1">
                        {getStatusIcon(invoice.status)}
                        <span className="capitalize">{invoice.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">Client</p>
                        <p>{invoice.clientName}</p>
                      </div>
                      <div>
                        <p className="font-medium">Issue Date</p>
                        <p>{formatDate(invoice.issueDate)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Due Date</p>
                        <p>{formatDate(invoice.dueDate)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Amount</p>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(invoice.totalAmount, invoice.currency)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Workflow:</span>
                        <Badge variant="outline" className="text-xs">
                          {invoice.workflow.currentStep.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => setSelectedInvoice(invoice)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {invoice.status === 'draft' && (
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredInvoices.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common invoice management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Plus className="h-6 w-6" />
              <span>Create Invoice</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Download className="h-6 w-6" />
              <span>Export Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-6 w-6" />
              <span>Client Management</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span>Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Detail Modal (simplified) */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Invoice Details</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Invoice Number</p>
                    <p>{selectedInvoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="font-medium">Status</p>
                    <Badge variant={getStatusColor(selectedInvoice.status)}>
                      {selectedInvoice.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">Client</p>
                    <p>{selectedInvoice.clientName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Amount</p>
                    <p className="font-semibold">
                      {formatCurrency(selectedInvoice.totalAmount, selectedInvoice.currency)}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="font-medium mb-2">Workflow Progress</p>
                  <div className="text-sm text-gray-600">
                    Current step: {selectedInvoice.workflow.currentStep.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InvoiceManagement;

