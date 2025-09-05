/**
 * Invoice Data Models and Types
 * Defines the structure for invoice management system
 */

// Invoice Status Enum
export const InvoiceStatus = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
};

// Invoice Type Enum
export const InvoiceType = {
  KYC_BASIC: 'kyc_basic',
  KYC_ENHANCED: 'kyc_enhanced',
  SANCTIONS_SCREENING: 'sanctions_screening',
  DOCUMENT_PROCESSING: 'document_processing',
  TRANSLATION_SERVICE: 'translation_service',
  COMPLIANCE_REPORT: 'compliance_report'
};

// User Role Enum
export const UserRole = {
  CPA: 'cpa',
  ADMIN: 'admin',
  PARTNER: 'partner',
  BANK: 'bank'
};

// Payment Method Enum
export const PaymentMethod = {
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  CHECK: 'check',
  WIRE_TRANSFER: 'wire_transfer'
};

/**
 * Invoice Line Item Model
 */
export class InvoiceLineItem {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.description = data.description || '';
    this.quantity = data.quantity || 1;
    this.unitPrice = data.unitPrice || 0;
    this.discount = data.discount || 0;
    this.taxRate = data.taxRate || 0;
    this.total = this.calculateTotal();
  }

  calculateTotal() {
    const subtotal = this.quantity * this.unitPrice;
    const discountAmount = subtotal * (this.discount / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (this.taxRate / 100);
    return afterDiscount + taxAmount;
  }

  generateId() {
    return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  toJSON() {
    return {
      id: this.id,
      description: this.description,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      discount: this.discount,
      taxRate: this.taxRate,
      total: this.total
    };
  }
}

/**
 * Invoice Model
 */
export class Invoice {
  constructor(data = {}) {
    this.id = data.id || this.generateInvoiceNumber();
    this.invoiceNumber = data.invoiceNumber || this.generateInvoiceNumber();
    this.clientId = data.clientId || '';
    this.clientName = data.clientName || '';
    this.clientAddress = data.clientAddress || {};
    this.issueDate = data.issueDate || new Date().toISOString();
    this.dueDate = data.dueDate || this.calculateDueDate();
    this.status = data.status || InvoiceStatus.DRAFT;
    this.type = data.type || InvoiceType.KYC_BASIC;
    this.lineItems = (data.lineItems || []).map(item => new InvoiceLineItem(item));
    this.subtotal = data.subtotal || 0;
    this.taxAmount = data.taxAmount || 0;
    this.discountAmount = data.discountAmount || 0;
    this.totalAmount = data.totalAmount || 0;
    this.currency = data.currency || 'USD';
    this.notes = data.notes || '';
    this.terms = data.terms || this.getDefaultTerms();
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.paidAt = data.paidAt || null;
    this.paymentMethod = data.paymentMethod || null;
    this.paymentReference = data.paymentReference || '';
    this.workflow = data.workflow || this.initializeWorkflow();
    
    this.calculateTotals();
  }

  generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `INV-${year}${month}${day}-${random}`;
  }

  calculateDueDate(days = 30) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);
    return dueDate.toISOString();
  }

  getDefaultTerms() {
    return `Payment is due within 30 days of invoice date. Late payments may incur additional charges. All services are subject to InnoFinx KYC Platform terms and conditions.`;
  }

  initializeWorkflow() {
    return {
      currentStep: 'created',
      steps: [
        { step: 'created', completedAt: new Date().toISOString(), completedBy: this.createdBy },
        { step: 'cpa_review', completedAt: null, completedBy: null },
        { step: 'admin_approval', completedAt: null, completedBy: null },
        { step: 'sent_to_partner', completedAt: null, completedBy: null },
        { step: 'payment_received', completedAt: null, completedBy: null }
      ]
    };
  }

  addLineItem(description, quantity, unitPrice, options = {}) {
    const lineItem = new InvoiceLineItem({
      description,
      quantity,
      unitPrice,
      discount: options.discount || 0,
      taxRate: options.taxRate || 0
    });
    
    this.lineItems.push(lineItem);
    this.calculateTotals();
    this.updatedAt = new Date().toISOString();
    
    return lineItem;
  }

  removeLineItem(itemId) {
    this.lineItems = this.lineItems.filter(item => item.id !== itemId);
    this.calculateTotals();
    this.updatedAt = new Date().toISOString();
  }

  calculateTotals() {
    this.subtotal = this.lineItems.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    this.discountAmount = this.lineItems.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      return sum + (itemSubtotal * (item.discount / 100));
    }, 0);

    const afterDiscount = this.subtotal - this.discountAmount;

    this.taxAmount = this.lineItems.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      const itemAfterDiscount = itemSubtotal - (itemSubtotal * (item.discount / 100));
      return sum + (itemAfterDiscount * (item.taxRate / 100));
    }, 0);

    this.totalAmount = afterDiscount + this.taxAmount;
  }

  updateStatus(newStatus, userId = '') {
    const oldStatus = this.status;
    this.status = newStatus;
    this.updatedAt = new Date().toISOString();

    // Update workflow
    this.updateWorkflow(newStatus, userId);

    // Handle status-specific logic
    if (newStatus === InvoiceStatus.PAID) {
      this.paidAt = new Date().toISOString();
    }

    return { oldStatus, newStatus };
  }

  updateWorkflow(status, userId) {
    const stepMapping = {
      [InvoiceStatus.PENDING_REVIEW]: 'cpa_review',
      [InvoiceStatus.APPROVED]: 'admin_approval',
      [InvoiceStatus.SENT]: 'sent_to_partner',
      [InvoiceStatus.PAID]: 'payment_received'
    };

    const step = stepMapping[status];
    if (step) {
      const workflowStep = this.workflow.steps.find(s => s.step === step);
      if (workflowStep && !workflowStep.completedAt) {
        workflowStep.completedAt = new Date().toISOString();
        workflowStep.completedBy = userId;
        this.workflow.currentStep = step;
      }
    }
  }

  isOverdue() {
    if (this.status === InvoiceStatus.PAID || this.status === InvoiceStatus.CANCELLED) {
      return false;
    }
    return new Date() > new Date(this.dueDate);
  }

  getDaysOverdue() {
    if (!this.isOverdue()) return 0;
    const today = new Date();
    const dueDate = new Date(this.dueDate);
    const diffTime = today - dueDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  canBeEditedBy(userRole) {
    switch (this.status) {
      case InvoiceStatus.DRAFT:
        return userRole === UserRole.CPA;
      case InvoiceStatus.PENDING_REVIEW:
        return userRole === UserRole.ADMIN;
      default:
        return false;
    }
  }

  canBeViewedBy(userRole) {
    switch (userRole) {
      case UserRole.CPA:
      case UserRole.ADMIN:
        return true;
      case UserRole.PARTNER:
        return [InvoiceStatus.SENT, InvoiceStatus.PAID, InvoiceStatus.OVERDUE].includes(this.status);
      case UserRole.BANK:
        return this.status === InvoiceStatus.PAID;
      default:
        return false;
    }
  }

  getPartnerSafeData() {
    // Return invoice data safe for partner viewing (without internal notes, etc.)
    return {
      id: this.id,
      invoiceNumber: this.invoiceNumber,
      clientName: this.clientName,
      issueDate: this.issueDate,
      dueDate: this.dueDate,
      status: this.status,
      lineItems: this.lineItems.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total
      })),
      subtotal: this.subtotal,
      taxAmount: this.taxAmount,
      totalAmount: this.totalAmount,
      currency: this.currency,
      terms: this.terms
    };
  }

  toJSON() {
    return {
      id: this.id,
      invoiceNumber: this.invoiceNumber,
      clientId: this.clientId,
      clientName: this.clientName,
      clientAddress: this.clientAddress,
      issueDate: this.issueDate,
      dueDate: this.dueDate,
      status: this.status,
      type: this.type,
      lineItems: this.lineItems.map(item => item.toJSON()),
      subtotal: this.subtotal,
      taxAmount: this.taxAmount,
      discountAmount: this.discountAmount,
      totalAmount: this.totalAmount,
      currency: this.currency,
      notes: this.notes,
      terms: this.terms,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      paidAt: this.paidAt,
      paymentMethod: this.paymentMethod,
      paymentReference: this.paymentReference,
      workflow: this.workflow
    };
  }
}

/**
 * Pricing Rules for different service types
 */
export const PricingRules = {
  [InvoiceType.KYC_BASIC]: {
    basePrice: 50,
    description: 'Basic KYC Processing',
    taxRate: 10
  },
  [InvoiceType.KYC_ENHANCED]: {
    basePrice: 150,
    description: 'Enhanced KYC with Due Diligence',
    taxRate: 10
  },
  [InvoiceType.SANCTIONS_SCREENING]: {
    basePrice: 25,
    description: 'Sanctions List Screening',
    taxRate: 10
  },
  [InvoiceType.DOCUMENT_PROCESSING]: {
    basePrice: 30,
    description: 'Document OCR and Processing',
    taxRate: 10
  },
  [InvoiceType.TRANSLATION_SERVICE]: {
    basePrice: 20,
    description: 'Chinese to English Translation',
    taxRate: 10
  },
  [InvoiceType.COMPLIANCE_REPORT]: {
    basePrice: 100,
    description: 'Compliance Report Generation',
    taxRate: 10
  }
};

export default { Invoice, InvoiceLineItem, InvoiceStatus, InvoiceType, UserRole, PaymentMethod, PricingRules };

