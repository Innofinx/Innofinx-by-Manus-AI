import React, { useState } from 'react';
import { Upload, User, Calendar, Building, FileText, CheckCircle, AlertCircle, Loader, Sparkles, Globe, Search } from 'lucide-react';
import { checkBusinessNameAvailability } from '../lib/soda/nyBusinessApi';

const ClientOnboarding = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    businessDescription: "",
    originalBusinessDescription: "",
    businessName: "",
  });
  
  const [isNameTaken, setIsNameTaken] = useState(false);
  
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [extractedAddress, setExtractedAddress] = useState('');
  const [translatedAddress, setTranslatedAddress] = useState('');
  const [refinedDescription, setRefinedDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [clientId, setClientId] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle document upload
  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedDocument(file);
    setIsProcessing(true);
    setProcessingStep('Extracting Chinese address from document...');

    // Simulate Azure OCR processing
    setTimeout(() => {
      // Mock extracted Chinese address
      const mockChineseAddresses = [
        '北京市朝阳区建国门外大街1号',
        '上海市浦东新区陆家嘴环路1000号',
        '广州市天河区珠江新城花城大道85号',
        '深圳市南山区深南大道10000号',
        '杭州市西湖区文三路90号'
      ];
      
      const randomAddress = mockChineseAddresses[Math.floor(Math.random() * mockChineseAddresses.length)];
      setExtractedAddress(randomAddress);
      
      setProcessingStep('Translating address to English...');
      
      // Simulate GPT translation
      setTimeout(() => {
        const translations = {
          '北京市朝阳区建国门外大街1号': 'No. 1 Jianguomenwai Street, Chaoyang District, Beijing',
          '上海市浦东新区陆家嘴环路1000号': 'No. 1000 Lujiazui Ring Road, Pudong New Area, Shanghai',
          '广州市天河区珠江新城花城大道85号': 'No. 85 Huacheng Avenue, Zhujiang New Town, Tianhe District, Guangzhou',
          '深圳市南山区深南大道10000号': 'No. 10000 Shennan Avenue, Nanshan District, Shenzhen',
          '杭州市西湖区文三路90号': 'No. 90 Wensan Road, Xihu District, Hangzhou'
        };
        
        setTranslatedAddress(translations[randomAddress] || 'Translated address will appear here');
        setIsProcessing(false);
        setProcessingStep('');
      }, 1500);
    }, 2000);
  };

  // Check business name availability
  const handleCheckBusinessName = async () => {
    if (!formData.businessName.trim()) return;

    setIsProcessing(true);
    setProcessingStep("Checking business name availability...");
    setIsNameTaken(null); // Reset status

    const taken = await checkBusinessNameAvailability(formData.businessName);
    setIsNameTaken(taken);
    setIsProcessing(false);
    setProcessingStep("");
  };

  // Refine business description using GPT
  const refineBusinessDescription = async () => {
    if (!formData.businessDescription.trim()) return;

    setIsProcessing(true);
    setProcessingStep('Refining business description for bank use...');

    // Store original description
    setFormData(prev => ({
      ...prev,
      originalBusinessDescription: prev.businessDescription
    }));

    // Simulate GPT refinement
    setTimeout(() => {
      const refinements = {
        '我们是一家科技公司': 'Technology company specializing in software development and digital solutions for enterprise clients.',
        '餐厅': 'Food service establishment operating as a restaurant providing dining services to customers.',
        '贸易公司': 'Trading company engaged in import/export operations and commercial distribution of goods.',
        '咨询服务': 'Professional consulting services firm providing business advisory and strategic planning solutions.',
        'tech startup': 'Technology startup company focused on innovative software solutions and digital product development.',
        'restaurant business': 'Food service business operating restaurant facilities with full-service dining operations.',
        'trading': 'Commercial trading enterprise engaged in wholesale and retail distribution of various commodities.',
        'consulting': 'Professional consulting firm providing specialized advisory services and business strategy consulting.'
      };

      // Find best match or create generic refinement
      let refined = '';
      const description = formData.businessDescription.toLowerCase();
      
      for (const [key, value] of Object.entries(refinements)) {
        if (description.includes(key.toLowerCase()) || key.toLowerCase().includes(description)) {
          refined = value;
          break;
        }
      }
      
      if (!refined) {
        refined = `Professional business entity engaged in ${formData.businessDescription.toLowerCase()} operations, providing services and solutions to clients in accordance with industry standards and regulatory requirements.`;
      }
      
      setRefinedDescription(refined);
      setIsProcessing(false);
      setProcessingStep('');
    }, 2000);
  };

  // Submit client onboarding
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsProcessing(true);
    setProcessingStep('Creating client profile...');

    // Generate client ID
    const newClientId = `CLT-${Date.now().toString().slice(-6)}`;
    
    setTimeout(() => {
      setClientId(newClientId);
      setIsProcessing(false);
      setProcessingStep('');
      
      // Reset form for next client
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          businessDescription: '',
          originalBusinessDescription: ''
        });
        setUploadedDocument(null);
        setExtractedAddress('');
        setTranslatedAddress('');
        setRefinedDescription('');
        setClientId('');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Onboarding</h1>
          <p className="text-gray-600">Create new client profiles with automated document processing and AI assistance</p>
        </div>

        {/* Success Message */}
        {clientId && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                Client successfully created with ID: {clientId}
              </span>
            </div>
          </div>
        )}

        {/* Processing Status */}
        {isProcessing && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <Loader className="h-5 w-5 text-blue-600 mr-2 animate-spin" />
              <span className="text-blue-800">{processingStep}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Client Information Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Client Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter first name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proposed Business Name *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="Enter proposed business name"
                  />
                  <button
                    type="button"
                    onClick={handleCheckBusinessName}
                    disabled={!formData.businessName.trim() || isProcessing}
                    className="absolute right-2 p-1 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                    title="Check availability"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
                {isNameTaken !== null && (
                  <p className={`text-xs mt-1 ${isNameTaken ? 'text-red-600' : 'text-green-600'}`}>
                    {isNameTaken ? 'This business name is already taken.' : 'This business name is available!'}
                  </p>
                )}
              </div>

              {/* Business Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description *
                </label>
                <div className="relative">
                  <textarea
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the business (English or Chinese)"
                  />
                  <button
                    type="button"
                    onClick={refineBusinessDescription}
                    disabled={!formData.businessDescription.trim() || isProcessing}
                    className="absolute top-2 right-2 p-1 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                    title="Refine for bank use with AI"
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Click the sparkle icon to refine description for bank use with AI
                </p>
              </div>

              {/* Refined Description Display */}
              {refinedDescription && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800 mb-2">AI-Refined Description (Bank Use):</h4>
                  <p className="text-sm text-green-700">{refinedDescription}</p>
                  {formData.originalBusinessDescription && (
                    <div className="mt-2 pt-2 border-t border-green-200">
                      <p className="text-xs text-green-600">
                        Original: "{formData.originalBusinessDescription}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || !formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.businessDescription}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Create Client Profile
              </button>
            </form>
          </div>

          {/* Right Column - Document Processing */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Document Processing
            </h2>

            {/* Document Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Document (Chinese Address Extraction)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload ID card, business license, or other documents
                </p>
                <input
                  type="file"
                  onChange={handleDocumentUpload}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </label>
              </div>
              
              {uploadedDocument && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Uploaded:</strong> {uploadedDocument.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Size: {(uploadedDocument.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              )}
            </div>

            {/* Extracted Chinese Address */}
            {extractedAddress && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  Extracted Chinese Address (Azure OCR)
                </h3>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 font-mono">{extractedAddress}</p>
                </div>
              </div>
            )}

            {/* Translated Address */}
            {translatedAddress && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  English Translation (GPT)
                </h3>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">{translatedAddress}</p>
                </div>
              </div>
            )}

            {/* Processing Steps */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Processing Pipeline:</h3>
              
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${uploadedDocument ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`text-sm ${uploadedDocument ? 'text-green-700' : 'text-gray-500'}`}>
                  Document Upload
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${extractedAddress ? 'bg-green-500' : uploadedDocument ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                <span className={`text-sm ${extractedAddress ? 'text-green-700' : uploadedDocument ? 'text-yellow-700' : 'text-gray-500'}`}>
                  Azure OCR Processing
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${translatedAddress ? 'bg-green-500' : extractedAddress ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                <span className={`text-sm ${translatedAddress ? 'text-green-700' : extractedAddress ? 'text-yellow-700' : 'text-gray-500'}`}>
                  GPT Translation
                </span>
              </div>
            </div>

            {/* AI Features Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">AI-Powered Features:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Azure OCR extracts Chinese text from documents</li>
                <li>• GPT-4 translates addresses to English</li>
                <li>• GPT refines business descriptions for bank compliance</li>
                <li>• Automatic address validation and formatting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientOnboarding;

