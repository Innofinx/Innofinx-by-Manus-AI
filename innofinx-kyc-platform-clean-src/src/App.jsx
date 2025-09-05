import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import SanctionsScreening from './components/SanctionsScreening.jsx'
import TranslationService from './components/TranslationService.jsx'
import InvoiceManagement from './components/InvoiceManagement.jsx'
import AdvancedNameMatching from './components/AdvancedNameMatching.jsx'
import ClientOnboarding from './components/ClientOnboarding.jsx'
import DocumentReports from './components/DocumentReports.jsx'
import CPAWorkflow from './components/CPAWorkflow.jsx'
import { 
  Shield, 
  Users, 
  FileText, 
  Settings as SettingsIcon, 
  BarChart3, 
  Upload, 
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  Menu,
  X,
  Languages,
  Receipt,
  Target
} from 'lucide-react'
import './App.css'

// Dashboard Component
function Dashboard() {
  const stats = [
    { title: 'Total Clients', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { title: 'Pending Reviews', value: '23', icon: Clock, color: 'bg-yellow-500' },
    { title: 'Completed KYC', value: '1,156', icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Flagged Cases', value: '8', icon: AlertTriangle, color: 'bg-red-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your KYC operations</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest KYC processing activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { client: 'ABC Corp', action: 'Document uploaded', time: '2 hours ago', status: 'pending' },
                { client: 'XYZ Ltd', action: 'KYC completed', time: '4 hours ago', status: 'completed' },
                { client: 'DEF Inc', action: 'Sanctions check flagged', time: '6 hours ago', status: 'flagged' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{activity.client}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={activity.status === 'completed' ? 'default' : activity.status === 'flagged' ? 'destructive' : 'secondary'}>
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                <Upload className="h-6 w-6" />
                <span>Upload Documents</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Search className="h-6 w-6" />
                <span>Search Clients</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <FileText className="h-6 w-6" />
                <span>Generate Report</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Clients Component
function Clients() {
  return <ClientOnboarding />;
}

// Documents Component
function Documents() {
  return <DocumentReports />;
}

// Invoices Component
function Invoices() {
  return <InvoiceManagement />;
}

// Translation Component
function Translation() {
  return <TranslationService />;
}

// Sanctions Component
function Sanctions() {
  return <SanctionsScreening />;
}

// Name Matching Component
function NameMatching() {
  return <AdvancedNameMatching />;
}

// CPA Workflow Component
function CPAWorkflowPage() {
  return <CPAWorkflow />;
}

// Settings Component
function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure platform settings and preferences</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <SettingsIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Platform Configuration</h3>
            <p className="text-gray-600 mb-4">Manage user roles, API settings, and compliance parameters.</p>
            <Button>Configure Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Navigation Component
function Navigation() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/clients', label: 'Clients', icon: Users },
    { path: '/documents', label: 'Documents', icon: FileText },
    { path: '/sanctions', label: 'Sanctions', icon: Shield },
    { path: '/name-matching', label: 'Name Matching', icon: Target },
    { path: '/cpa-workflow', label: 'CPA Workflow', icon: CheckCircle },
    { path: '/invoices', label: 'Invoices', icon: Receipt },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">InnoFinx KYC</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Main App Component
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/sanctions" element={<Sanctions />} />
            <Route path="/name-matching" element={<NameMatching />} />
            <Route path="/cpa-workflow" element={<CPAWorkflowPage />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

