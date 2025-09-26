import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Plus, Edit, Trash2, Eye, Download, AlertTriangle, Shield, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import DataTable, { Column } from '../../components/data/DataTable';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface Customer {
  id: string;
  name: string;
  creditLimit: string;
  utilized: string;
  available: string;
  riskRating: string;
  paymentTerms: string;
  overdue: string;
  dso: string;
  status: string;
}

interface CreditApplication {
  id: string;
  customer: string;
  requestedLimit: string;
  currentLimit: string;
  riskScore: string;
  submittedDate: string;
  reviewer: string;
  status: string;
}

interface Collection {
  id: string;
  customer: string;
  invoiceNumber: string;
  amount: string;
  overdueDays: string;
  collectionStage: string;
  assignedTo: string;
  lastContact: string;
  status: string;
}

interface InsurancePolicy {
  id: string;
  customer: string;
  insurer: string;
  coverage: string;
  premium: string;
  policyNumber: string;
  validUntil: string;
  status: string;
}

interface FormValues {
  customerName: string;
  creditLimit: string;
  riskRating: string;
  paymentTerms: string;
  currency: string;
  collateral: string;
}

// Form validation schemas
const customerSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  creditLimit: z.string().min(1, 'Credit limit is required'),
  riskRating: z.string().min(1, 'Risk rating is required'),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  currency: z.string().min(1, 'Currency is required'),
  collateral: z.string().optional()
});

const creditApplicationSchema = z.object({
  customer: z.string().min(2, 'Customer name must be at least 2 characters'),
  requestedLimit: z.string().min(1, 'Requested limit is required'),
  currentLimit: z.string().min(1, 'Current limit is required'),
  riskScore: z.string().min(1, 'Risk score is required'),
  reviewer: z.string().min(2, 'Reviewer name must be at least 2 characters')
});

const collectionSchema = z.object({
  customer: z.string().min(2, 'Customer name must be at least 2 characters'),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  amount: z.string().min(1, 'Amount is required'),
  overdueDays: z.string().min(1, 'Overdue days is required'),
  collectionStage: z.string().min(1, 'Collection stage is required'),
  assignedTo: z.string().min(2, 'Assigned to must be at least 2 characters'),
  lastContact: z.string().min(1, 'Last contact date is required'),
  status: z.string().min(1, 'Status is required')
});

const insurancePolicySchema = z.object({
  customer: z.string().min(2, 'Customer name must be at least 2 characters'),
  insurer: z.string().min(2, 'Insurer name must be at least 2 characters'),
  coverage: z.string().min(1, 'Coverage is required'),
  premium: z.string().min(1, 'Premium is required'),
  policyNumber: z.string().min(1, 'Policy number is required'),
  validUntil: z.string().min(1, 'Valid until date is required'),
  status: z.string().min(1, 'Status is required')
});

const reportConfigSchema = z.object({
  reportType: z.string().min(1, 'Report type is required'),
  dateRange: z.string().min(1, 'Date range is required'),
  format: z.string().min(1, 'Format is required'),
  includeCharts: z.boolean(),
  customerFilter: z.string().min(1, 'Customer filter is required')
});

interface Column {
  key: string;
  header: string;
  render?: (value: string | number, row?: RenderableRow) => React.ReactNode;
}

interface RenderableRow {
  id: string;
}

const FinanceCreditManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customers');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerName: '',
      creditLimit: '',
      riskRating: '',
      paymentTerms: '',
      currency: '',
      collateral: ''
    }
  });

  // Credit Reports form state
  const [reports, setReports] = useState([
    { id: 'RPT-001', name: 'Credit Risk Analysis', type: 'Risk Report', generatedDate: '2024-05-20', status: 'Completed', size: '2.4 MB' },
    { id: 'RPT-002', name: 'Collections Performance', type: 'Collections Report', generatedDate: '2024-05-19', status: 'Completed', size: '1.8 MB' },
    { id: 'RPT-003', name: 'DSO Analysis Q2', type: 'DSO Report', generatedDate: '2024-05-18', status: 'Completed', size: '3.1 MB' }
  ]);

  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('');

  interface ReportConfig {
    reportType: string;
    dateRange: string;
    format: string;
    includeCharts: boolean;
    customerFilter: string;
  }

  const reportConfigForm = useForm<ReportConfig>({
    resolver: zodResolver(reportConfigSchema),
    defaultValues: {
      reportType: '',
      dateRange: 'last30days',
      format: 'pdf',
      includeCharts: true,
      customerFilter: 'all'
    }
  });

  // Credit Reports CRUD operations
  const handleGenerateReport = (config: ReportConfig) => {
    const reportTypes = {
      'risk': 'Credit Risk Analysis',
      'collections': 'Collections Performance',
      'utilization': 'Credit Utilization',
      'dso': 'DSO Analysis'
    };

    const reportName = `${reportTypes[config.reportType as keyof typeof reportTypes]} - ${new Date().toLocaleDateString()}`;
    
    const newReport = {
      id: `RPT-${String(reports.length + 1).padStart(3, '0')}`,
      name: reportName,
      type: reportTypes[config.reportType as keyof typeof reportTypes],
      generatedDate: new Date().toISOString().split('T')[0],
      status: 'Completed',
      size: `${(Math.random() * 3 + 1).toFixed(1)} MB`
    };

    setReports([newReport, ...reports]);
    setIsReportDialogOpen(false);
    reportConfigForm.reset();
    toast({
      title: 'Report Generated',
      description: `${reportName} has been generated successfully.`,
    });
  };

  const handleDeleteReport = (id: string) => {
    const report = reports.find(r => r.id === id);
    setReports(reports.filter(r => r.id !== id));
    if (report) {
      toast({
        title: 'Report Deleted',
        description: `${report.name} has been deleted.`,
      });
    }
  };

  const handleDownloadReport = (id: string) => {
    const report = reports.find(r => r.id === id);
    if (report) {
      toast({
        title: 'Report Downloaded',
        description: `${report.name} has been downloaded.`,
      });
    }
  };

  const handleQuickReport = (reportType: string) => {
    setSelectedReportType(reportType);
    reportConfigForm.setValue('reportType', reportType);
    setIsReportDialogOpen(true);
  };

  // Credit Insurance Policies form state
  const [isInsuranceDialogOpen, setIsInsuranceDialogOpen] = useState(false);
  const [isEditInsuranceDialogOpen, setIsEditInsuranceDialogOpen] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState<InsurancePolicy | null>(null);

  interface InsurancePolicyForm {
    customer: string;
    insurer: string;
    coverage: string;
    premium: string;
    policyNumber: string;
    validUntil: string;
    status: string;
  }

  const insuranceForm = useForm<InsurancePolicyForm>({
    resolver: zodResolver(insurancePolicySchema),
    defaultValues: {
      customer: '',
      insurer: '',
      coverage: '',
      premium: '',
      policyNumber: '',
      validUntil: '',
      status: 'Active'
    }
  });

  // Insurance Policies CRUD operations
  const handleCreateInsurance = (data: InsurancePolicyForm) => {
    const newInsurance: InsurancePolicy = {
      id: `INS-${String(insurancePolicies.length + 1).padStart(3, '0')}`,
      customer: data.customer,
      insurer: data.insurer,
      coverage: data.coverage,
      premium: data.premium,
      policyNumber: data.policyNumber,
      validUntil: data.validUntil,
      status: data.status
    };
    setInsurancePolicies([...insurancePolicies, newInsurance]);
    setIsInsuranceDialogOpen(false);
    insuranceForm.reset();
    toast({
      title: 'Insurance Policy Created',
      description: `New insurance policy for ${data.customer} has been created successfully.`,
    });
  };

  const handleEditInsurance = (insurance: InsurancePolicy) => {
    setSelectedInsurance(insurance);
    insuranceForm.reset({
      customer: insurance.customer,
      insurer: insurance.insurer,
      coverage: insurance.coverage,
      premium: insurance.premium,
      policyNumber: insurance.policyNumber,
      validUntil: insurance.validUntil,
      status: insurance.status
    });
    setIsEditInsuranceDialogOpen(true);
  };

  const handleUpdateInsurance = (data: InsurancePolicyForm) => {
    setInsurancePolicies(insurancePolicies.map(ins => 
      ins.id === selectedInsurance?.id 
        ? { 
            ...ins, 
            customer: data.customer,
            insurer: data.insurer,
            coverage: data.coverage,
            premium: data.premium,
            policyNumber: data.policyNumber,
            validUntil: data.validUntil,
            status: data.status
          } 
        : ins
    ));
    setIsEditInsuranceDialogOpen(false);
    setSelectedInsurance(null);
    toast({
      title: 'Insurance Policy Updated',
      description: `Insurance policy for ${data.customer} has been updated successfully.`,
    });
  };

  const handleDeleteInsurance = (id: string) => {
    const insurance = insurancePolicies.find(ins => ins.id === id);
    setInsurancePolicies(insurancePolicies.filter(ins => ins.id !== id));
    if (insurance) {
      toast({
        title: 'Insurance Policy Deleted',
        description: `Insurance policy for ${insurance.customer} has been deleted.`,
      });
    }
  };

  const handleRenewInsurance = (id: string) => {
    const insurance = insurancePolicies.find(ins => ins.id === id);
    if (insurance) {
      const renewedDate = new Date(insurance.validUntil);
      renewedDate.setFullYear(renewedDate.getFullYear() + 1);
      
      setInsurancePolicies(insurancePolicies.map(ins => 
        ins.id === id 
          ? { 
              ...ins, 
              validUntil: renewedDate.toISOString().split('T')[0],
              status: 'Active' as const
            } 
          : ins
      ));
      toast({
        title: 'Insurance Policy Renewed',
        description: `Insurance policy for ${insurance.customer} has been renewed until ${renewedDate.toISOString().split('T')[0]}.`,
      });
    }
  };

  // Collections Management form state
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [isEditCollectionDialogOpen, setIsEditCollectionDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  interface CollectionForm {
    customer: string;
    invoiceNumber: string;
    amount: string;
    overdueDays: string;
    collectionStage: string;
    assignedTo: string;
    lastContact: string;
    status: string;
  }

  const collectionForm = useForm<CollectionForm>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      customer: '',
      invoiceNumber: '',
      amount: '',
      overdueDays: '',
      collectionStage: 'Friendly Reminder',
      assignedTo: '',
      lastContact: new Date().toISOString().split('T')[0],
      status: 'In Progress'
    }
  });

  // Collections CRUD operations
  const handleCreateCollection = (data: CollectionForm) => {
    const newCollection: Collection = {
      id: `COL-${String(collections.length + 1).padStart(3, '0')}`,
      customer: data.customer,
      invoiceNumber: data.invoiceNumber,
      amount: data.amount,
      overdueDays: data.overdueDays,
      collectionStage: data.collectionStage,
      assignedTo: data.assignedTo,
      lastContact: data.lastContact,
      status: data.status
    };
    setCollections([...collections, newCollection]);
    setIsCollectionDialogOpen(false);
    collectionForm.reset();
    toast({
      title: 'Collection Case Created',
      description: `New collection case for ${data.customer} has been created successfully.`,
    });
  };

  const handleEditCollection = (collection: Collection) => {
    setSelectedCollection(collection);
    collectionForm.reset({
      customer: collection.customer,
      invoiceNumber: collection.invoiceNumber,
      amount: collection.amount,
      overdueDays: collection.overdueDays,
      collectionStage: collection.collectionStage,
      assignedTo: collection.assignedTo,
      lastContact: collection.lastContact,
      status: collection.status
    });
    setIsEditCollectionDialogOpen(true);
  };

  const handleUpdateCollection = (data: CollectionForm) => {
    setCollections(collections.map(col => 
      col.id === selectedCollection?.id 
        ? { 
            ...col, 
            customer: data.customer,
            invoiceNumber: data.invoiceNumber,
            amount: data.amount,
            overdueDays: data.overdueDays,
            collectionStage: data.collectionStage,
            assignedTo: data.assignedTo,
            lastContact: data.lastContact,
            status: data.status
          } 
        : col
    ));
    setIsEditCollectionDialogOpen(false);
    setSelectedCollection(null);
    toast({
      title: 'Collection Case Updated',
      description: `Collection case for ${data.customer} has been updated successfully.`,
    });
  };

  const handleDeleteCollection = (id: string) => {
    const collection = collections.find(col => col.id === id);
    setCollections(collections.filter(col => col.id !== id));
    if (collection) {
      toast({
        title: 'Collection Case Deleted',
        description: `Collection case for ${collection.customer} has been deleted.`,
      });
    }
  };

  const handleResolveCollection = (id: string) => {
    setCollections(collections.map(col => 
      col.id === id 
        ? { ...col, status: 'Resolved' as const } 
        : col
    ));
    const collection = collections.find(col => col.id === id);
    if (collection) {
      toast({
        title: 'Collection Case Resolved',
        description: `Collection case for ${collection.customer} has been marked as resolved.`,
      });
    }
  };

  const handleEscalateCollection = (id: string) => {
    setCollections(collections.map(col => 
      col.id === id 
        ? { ...col, status: 'Escalated' as const, collectionStage: 'Legal Notice' as const } 
        : col
    ));
    const collection = collections.find(col => col.id === id);
    if (collection) {
      toast({
        title: 'Collection Case Escalated',
        description: `Collection case for ${collection.customer} has been escalated to legal department.`,
      });
    }
  };

  // Credit Application form state
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [isEditApplicationDialogOpen, setIsEditApplicationDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<CreditApplication | null>(null);

  interface CreditApplicationForm {
    customer: string;
    requestedLimit: string;
    currentLimit: string;
    riskScore: string;
    reviewer: string;
  }

  const applicationForm = useForm<CreditApplicationForm>({
    resolver: zodResolver(creditApplicationSchema),
    defaultValues: {
      customer: '',
      requestedLimit: '',
      currentLimit: '',
      riskScore: '',
      reviewer: ''
    }
  });

  const [customers, setCustomers] = useState<Customer[]>([
    { id: 'CUS-001', name: 'ABC Manufacturing Ltd', creditLimit: '500,000', utilized: '425,000', available: '75,000', riskRating: 'AAA', paymentTerms: '30 days', overdue: '0', dso: '28', status: 'Active' },
    { id: 'CUS-002', name: 'Global Tech Solutions', creditLimit: '1,000,000', utilized: '750,000', available: '250,000', riskRating: 'AA+', paymentTerms: '45 days', overdue: '25,000', dso: '42', status: 'Watch' },
    { id: 'CUS-003', name: 'European Retailers Inc', creditLimit: '300,000', utilized: '280,000', available: '20,000', riskRating: 'A', paymentTerms: '60 days', overdue: '15,000', dso: '55', status: 'Active' },
    { id: 'CUS-004', name: 'Industrial Components Co', creditLimit: '750,000', utilized: '650,000', available: '100,000', riskRating: 'BBB+', paymentTerms: '30 days', overdue: '45,000', dso: '65', status: 'Blocked' },
    { id: 'CUS-005', name: 'Advanced Materials Group', creditLimit: '400,000', utilized: '320,000', available: '80,000', riskRating: 'AA', paymentTerms: '30 days', overdue: '0', dso: '25', status: 'Active' }
  ]);

  const [creditApplications, setCreditApplications] = useState<CreditApplication[]>([
    { id: 'APP-001', customer: 'New Customer Ltd', requestedLimit: '250,000', currentLimit: '0', riskScore: '85', submittedDate: '2024-05-18', reviewer: 'John Smith', status: 'Under Review' },
    { id: 'APP-002', customer: 'Expansion Corp', requestedLimit: '500,000', currentLimit: '300,000', riskScore: '92', submittedDate: '2024-05-19', reviewer: 'Sarah Johnson', status: 'Approved' },
    { id: 'APP-003', customer: 'Startup Innovations', requestedLimit: '100,000', currentLimit: '0', riskScore: '65', submittedDate: '2024-05-20', reviewer: 'Mike Wilson', status: 'Rejected' },
    { id: 'APP-004', customer: 'Established Firm LLC', requestedLimit: '800,000', currentLimit: '600,000', riskScore: '88', submittedDate: '2024-05-17', reviewer: 'Lisa Brown', status: 'Pending Documentation' }
  ]);

  const [collections, setCollections] = useState<Collection[]>([
    { id: 'COL-001', customer: 'Global Tech Solutions', invoiceNumber: 'INV-2024-001', amount: '25,000', overdueDays: '15', collectionStage: 'First Notice', assignedTo: 'Collection Team A', lastContact: '2024-05-18', status: 'In Progress' },
    { id: 'COL-002', customer: 'European Retailers Inc', invoiceNumber: 'INV-2024-023', amount: '15,000', overdueDays: '22', collectionStage: 'Second Notice', assignedTo: 'Collection Team B', lastContact: '2024-05-17', status: 'In Progress' },
    { id: 'COL-003', customer: 'Industrial Components Co', invoiceNumber: 'INV-2024-035', amount: '45,000', overdueDays: '35', collectionStage: 'Legal Notice', assignedTo: 'Legal Department', lastContact: '2024-05-16', status: 'Escalated' },
    { id: 'COL-004', customer: 'Old Debt Ltd', invoiceNumber: 'INV-2024-012', amount: '8,500', overdueDays: '8', collectionStage: 'Friendly Reminder', assignedTo: 'Collection Team A', lastContact: '2024-05-19', status: 'Resolved' }
  ]);

  const [insurancePolicies, setInsurancePolicies] = useState<InsurancePolicy[]>([
    { id: 'INS-001', customer: 'ABC Manufacturing Ltd', insurer: 'Euler Hermes', coverage: '80%', premium: '2,500', policyNumber: 'EH-2024-001', validUntil: '2024-12-31', status: 'Active' },
    { id: 'INS-002', customer: 'Global Tech Solutions', insurer: 'Atradius', coverage: '75%', premium: '4,200', policyNumber: 'AT-2024-008', validUntil: '2024-11-30', status: 'Active' },
    { id: 'INS-003', customer: 'European Retailers Inc', insurer: 'Coface', coverage: '70%', premium: '1,800', policyNumber: 'CF-2024-015', validUntil: '2025-01-15', status: 'Pending Renewal' },
    { id: 'INS-004', customer: 'Advanced Materials Group', insurer: 'Euler Hermes', coverage: '85%', premium: '3,100', policyNumber: 'EH-2024-022', validUntil: '2024-10-20', status: 'Active' }
  ]);

  // State for loading indicators
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const newCustomer = {
        id: `CUS-${String(customers.length + 1).padStart(3, '0')}`,
        name: data.customerName,
        creditLimit: data.creditLimit,
        utilized: '0',
        available: data.creditLimit,
        riskRating: data.riskRating,
        paymentTerms: data.paymentTerms,
        overdue: '0',
        dso: '0',
        status: 'Active'
      };
      setCustomers([...customers, newCustomer]);
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: 'Customer Created',
        description: `Credit customer ${data.customerName} has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create customer. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    form.reset({
      customerName: customer.name,
      creditLimit: customer.creditLimit,
      riskRating: customer.riskRating,
      paymentTerms: customer.paymentTerms
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (data: FormValues) => {
    setIsLoading(true);
    try {
      setCustomers(customers.map(c => c.id === selectedCustomer?.id ? { 
        ...c, 
        name: data.customerName,
        creditLimit: data.creditLimit,
        riskRating: data.riskRating,
        paymentTerms: data.paymentTerms
      } : c));
      setIsEditDialogOpen(false);
      setSelectedCustomer(null);
      toast({
        title: 'Customer Updated',
        description: `Credit customer ${data.customerName} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update customer. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const customer = customers.find(c => c.id === id);
      setCustomers(customers.filter(c => c.id !== id));
      if (customer) {
        toast({
          title: 'Customer Deleted',
          description: `Credit customer ${customer.name} has been deleted.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete customer. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Credit Application CRUD operations
  const handleCreateApplication = async (data: CreditApplicationForm) => {
    setIsLoading(true);
    try {
      const newApplication: CreditApplication = {
        id: `APP-${String(creditApplications.length + 1).padStart(3, '0')}`,
        customer: data.customer,
        requestedLimit: data.requestedLimit,
        currentLimit: data.currentLimit,
        riskScore: data.riskScore,
        submittedDate: new Date().toISOString().split('T')[0],
        reviewer: data.reviewer,
        status: 'Under Review'
      };
      setCreditApplications([...creditApplications, newApplication]);
      setIsApplicationDialogOpen(false);
      applicationForm.reset();
      toast({
        title: 'Application Created',
        description: `Credit application for ${data.customer} has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create application. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditApplication = (application: CreditApplication) => {
    setSelectedApplication(application);
    applicationForm.reset({
      customer: application.customer,
      requestedLimit: application.requestedLimit,
      currentLimit: application.currentLimit,
      riskScore: application.riskScore,
      reviewer: application.reviewer
    });
    setIsEditApplicationDialogOpen(true);
  };

  const handleUpdateApplication = (data: CreditApplicationForm) => {
    setCreditApplications(creditApplications.map(app => 
      app.id === selectedApplication?.id 
        ? { 
            ...app, 
            customer: data.customer,
            requestedLimit: data.requestedLimit,
            currentLimit: data.currentLimit,
            riskScore: data.riskScore,
            reviewer: data.reviewer
          } 
        : app
    ));
    setIsEditApplicationDialogOpen(false);
    setSelectedApplication(null);
    toast({
      title: 'Application Updated',
      description: `Credit application for ${data.customer} has been updated successfully.`,
    });
  };

  const handleDeleteApplication = (id: string) => {
    const application = creditApplications.find(app => app.id === id);
    setCreditApplications(creditApplications.filter(app => app.id !== id));
    if (application) {
      toast({
        title: 'Application Deleted',
        description: `Credit application for ${application.customer} has been deleted.`,
      });
    }
  };

  const handleApproveApplication = (id: string) => {
    setCreditApplications(creditApplications.map(app => 
      app.id === id 
        ? { ...app, status: 'Approved' as const } 
        : app
    ));
    const application = creditApplications.find(app => app.id === id);
    if (application) {
      toast({
        title: 'Application Approved',
        description: `Credit application for ${application.customer} has been approved.`,
      });
    }
  };

  const handleRejectApplication = (id: string) => {
    setCreditApplications(creditApplications.map(app => 
      app.id === id 
        ? { ...app, status: 'Rejected' as const } 
        : app
    ));
    const application = creditApplications.find(app => app.id === id);
    if (application) {
      toast({
        title: 'Application Rejected',
        description: `Credit application for ${application.customer} has been rejected.`,
      });
    }
  };

  const customerColumns: Column[] = [
    { key: 'id', header: 'Customer ID' },
    { key: 'name', header: 'Customer Name' },
    { 
      key: 'creditLimit', 
      header: 'Credit Limit',
      render: (value: string) => (
        <span className="font-semibold">€{value}</span>
      )
    },
    { 
      key: 'utilized', 
      header: 'Utilized',
      render: (value: string) => (
        <span className="font-semibold text-orange-600">€{value}</span>
      )
    },
    { 
      key: 'available', 
      header: 'Available',
      render: (value: string) => (
        <span className="font-semibold text-green-600">€{value}</span>
      )
    },
    { 
      key: 'riskRating', 
      header: 'Risk Rating',
      render: (value: string) => (
        <Badge variant={
          value.startsWith('AAA') || value.startsWith('AA') ? 'default' :
          value.startsWith('A') ? 'outline' : 'secondary'
        }>{value}</Badge>
      )
    },
    { key: 'paymentTerms', header: 'Payment Terms' },
    { 
      key: 'overdue', 
      header: 'Overdue',
      render: (value: string) => (
        <span className={`font-semibold ${value === '0' ? 'text-green-600' : 'text-red-600'}`}>
          €{value}
        </span>
      )
    },
    { key: 'dso', header: 'DSO' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'Active' ? 'default' :
          value === 'Watch' ? 'secondary' : 'destructive'
        }>{value}</Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: string | number, row: RenderableRow) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      )
    }
  ];

  const applicationColumns: Column[] = [
    { key: 'id', header: 'Application ID' },
    { key: 'customer', header: 'Customer' },
    { 
      key: 'requestedLimit', 
      header: 'Requested Limit',
      render: (value: string) => (
        <span className="font-semibold">€{value}</span>
      )
    },
    { 
      key: 'currentLimit', 
      header: 'Current Limit',
      render: (value: string) => (
        <span className="font-semibold">€{value}</span>
      )
    },
    { key: 'riskScore', header: 'Risk Score' },
    { key: 'submittedDate', header: 'Submitted' },
    { key: 'reviewer', header: 'Reviewer' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'Approved' ? 'default' :
          value === 'Rejected' ? 'destructive' : 'secondary'
        }>{value}</Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: string | number, row: RenderableRow) => (
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              toast({
                title: 'View Application',
                description: `Viewing details for application ${row.id}`,
              });
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleEditApplication(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              if (row.status !== 'Approved') {
                handleApproveApplication(row.id);
              } else {
                toast({
                  title: 'Already Approved',
                  description: 'This application is already approved.',
                  variant: 'destructive'
                });
              }
            }}
            disabled={row.status === 'Approved'}
          >
            <TrendingUp className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              if (row.status !== 'Rejected') {
                handleRejectApplication(row.id);
              } else {
                toast({
                  title: 'Already Rejected',
                  description: 'This application is already rejected.',
                  variant: 'destructive'
                });
              }
            }}
            disabled={row.status === 'Rejected'}
          >
            <AlertTriangle className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              if (confirm(`Are you sure you want to delete application ${row.id}?`)) {
                handleDeleteApplication(row.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const collectionColumns: Column[] = [
    { key: 'id', header: 'Collection ID' },
    { key: 'customer', header: 'Customer' },
    { key: 'invoiceNumber', header: 'Invoice' },
    { 
      key: 'amount', 
      header: 'Amount',
      render: (value: string) => (
        <span className="font-semibold text-red-600">€{value}</span>
      )
    },
    { key: 'overdueDays', header: 'Overdue Days' },
    { key: 'collectionStage', header: 'Stage' },
    { key: 'assignedTo', header: 'Assigned To' },
    { key: 'lastContact', header: 'Last Contact' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'Resolved' ? 'default' :
          value === 'Escalated' ? 'destructive' : 'secondary'
        }>{value}</Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: string | number, row: RenderableRow) => (
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              toast({
                title: 'View Collection Case',
                description: `Viewing details for collection case ${row.id}`,
              });
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleEditCollection(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              if (row.status !== 'Resolved') {
                handleResolveCollection(row.id);
              } else {
                toast({
                  title: 'Already Resolved',
                  description: 'This collection case is already resolved.',
                  variant: 'destructive'
                });
              }
            }}
            disabled={row.status === 'Resolved'}
          >
            <TrendingUp className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              if (row.status !== 'Escalated') {
                handleEscalateCollection(row.id);
              } else {
                toast({
                  title: 'Already Escalated',
                  description: 'This collection case is already escalated.',
                  variant: 'destructive'
                });
              }
            }}
            disabled={row.status === 'Escalated'}
          >
            <AlertTriangle className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              if (confirm(`Are you sure you want to delete collection case ${row.id}?`)) {
                handleDeleteCollection(row.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const insuranceColumns: Column[] = [
    { key: 'id', header: 'Policy ID' },
    { key: 'customer', header: 'Customer' },
    { key: 'insurer', header: 'Insurer' },
    { key: 'coverage', header: 'Coverage' },
    { 
      key: 'premium', 
      header: 'Premium',
      render: (value: string) => (
        <span className="font-semibold">€{value}</span>
      )
    },
    { key: 'policyNumber', header: 'Policy Number' },
    { key: 'validUntil', header: 'Valid Until' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'default' : 'secondary'}>{value}</Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: string | number, row: RenderableRow) => (
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              toast({
                title: 'View Insurance Policy',
                description: `Viewing details for insurance policy ${row.id}`,
              });
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleEditInsurance(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleRenewInsurance(row.id)}
          >
            <TrendingUp className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              if (confirm(`Are you sure you want to delete insurance policy ${row.id}?`)) {
                handleDeleteInsurance(row.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const reportColumns: Column[] = [
    { key: 'id', header: 'Report ID' },
    { key: 'name', header: 'Report Name' },
    { key: 'type', header: 'Type' },
    { key: 'generatedDate', header: 'Generated Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Completed' ? 'default' : 'secondary'}>{value}</Badge>
      )
    },
    { key: 'size', header: 'Size' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: string | number, row: RenderableRow) => (
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              toast({
                title: 'View Report',
                description: `Opening report ${row.name} for viewing`,
              });
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDownloadReport(row.id)}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              if (confirm(`Are you sure you want to delete report ${row.id}?`)) {
                handleDeleteReport(row.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const totalCreditLimit = customers.reduce((sum, customer: Customer) => {
    return sum + parseFloat(customer.creditLimit.replace(/,/g, ''));
  }, 0);

  const totalUtilized = customers.reduce((sum, customer: Customer) => {
    return sum + parseFloat(customer.utilized.replace(/,/g, ''));
  }, 0);

  const totalOverdue = customers.reduce((sum, customer: Customer) => {
    return sum + parseFloat(customer.overdue.replace(/,/g, ''));
  }, 0);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/finance')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Credit Management"
          description="Manage customer credit limits, risk assessment, and collections"
          voiceIntroduction="Welcome to Credit Management. Monitor customer credit limits, assess risk, and manage collections effectively."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">€{(totalCreditLimit / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">Total Credit Limit</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">€{(totalUtilized / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">Credit Utilized</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">€{totalOverdue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{customers.length}</p>
                <p className="text-xs text-muted-foreground">Active Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="customers">Credit Customers</TabsTrigger>
          <TabsTrigger value="applications">Credit Applications</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="insurance">Credit Insurance</TabsTrigger>
          <TabsTrigger value="reporting">Credit Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Credit Customers</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Customer
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Credit Customer</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="customerName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Customer Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="creditLimit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Credit Limit</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="number" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="riskRating"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Risk Rating</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select rating" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="AAA">AAA</SelectItem>
                                      <SelectItem value="AA+">AA+</SelectItem>
                                      <SelectItem value="AA">AA</SelectItem>
                                      <SelectItem value="A">A</SelectItem>
                                      <SelectItem value="BBB+">BBB+</SelectItem>
                                      <SelectItem value="BBB">BBB</SelectItem>
                                      <SelectItem value="BB">BB</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="paymentTerms"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Payment Terms</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select terms" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="30 days">30 days</SelectItem>
                                      <SelectItem value="45 days">45 days</SelectItem>
                                      <SelectItem value="60 days">60 days</SelectItem>
                                      <SelectItem value="90 days">90 days</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="currency"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Currency</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="EUR">EUR</SelectItem>
                                      <SelectItem value="USD">USD</SelectItem>
                                      <SelectItem value="GBP">GBP</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Add Customer</Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={customerColumns} data={customers} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Credit Applications</CardTitle>
                <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Application
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>New Credit Application</DialogTitle>
                    </DialogHeader>
                    <Form {...applicationForm}>
                      <form onSubmit={applicationForm.handleSubmit(handleCreateApplication)} className="space-y-4">
                        <FormField
                          control={applicationForm.control}
                          name="customer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Customer Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter customer name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={applicationForm.control}
                            name="requestedLimit"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Requested Limit (€)</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" placeholder="0" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={applicationForm.control}
                            name="currentLimit"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Limit (€)</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" placeholder="0" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={applicationForm.control}
                            name="riskScore"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Risk Score</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" min="0" max="100" placeholder="0" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={applicationForm.control}
                            name="reviewer"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Reviewer</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Assign reviewer" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsApplicationDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Submit Application</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={applicationColumns} data={creditApplications} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Collections Management</CardTitle>
                <Dialog open={isCollectionDialogOpen} onOpenChange={setIsCollectionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Collection Case
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>New Collection Case</DialogTitle>
                    </DialogHeader>
                    <Form {...collectionForm}>
                      <form onSubmit={collectionForm.handleSubmit(handleCreateCollection)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={collectionForm.control}
                            name="customer"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Customer</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter customer name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={collectionForm.control}
                            name="invoiceNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Invoice Number</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="INV-2024-001" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={collectionForm.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount (€)</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" placeholder="0" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={collectionForm.control}
                            name="overdueDays"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Overdue Days</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" placeholder="0" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={collectionForm.control}
                            name="collectionStage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Collection Stage</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select stage" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Friendly Reminder">Friendly Reminder</SelectItem>
                                    <SelectItem value="First Notice">First Notice</SelectItem>
                                    <SelectItem value="Second Notice">Second Notice</SelectItem>
                                    <SelectItem value="Final Notice">Final Notice</SelectItem>
                                    <SelectItem value="Legal Notice">Legal Notice</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={collectionForm.control}
                            name="assignedTo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Assigned To</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Assign to team/member" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={collectionForm.control}
                            name="lastContact"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Contact</FormLabel>
                                <FormControl>
                                  <Input {...field} type="date" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={collectionForm.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Escalated">Escalated</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsCollectionDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Create Collection Case</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={collectionColumns} data={collections} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Credit Insurance Policies</CardTitle>
                <Dialog open={isInsuranceDialogOpen} onOpenChange={setIsInsuranceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Policy
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>New Credit Insurance Policy</DialogTitle>
                    </DialogHeader>
                    <Form {...insuranceForm}>
                      <form onSubmit={insuranceForm.handleSubmit(handleCreateInsurance)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={insuranceForm.control}
                            name="customer"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Customer</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter customer name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={insuranceForm.control}
                            name="insurer"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Insurer</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select insurer" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Euler Hermes">Euler Hermes</SelectItem>
                                    <SelectItem value="Atradius">Atradius</SelectItem>
                                    <SelectItem value="Coface">Coface</SelectItem>
                                    <SelectItem value="Allianz Trade">Allianz Trade</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={insuranceForm.control}
                            name="coverage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Coverage</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select coverage" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="50%">50%</SelectItem>
                                    <SelectItem value="60%">60%</SelectItem>
                                    <SelectItem value="70%">70%</SelectItem>
                                    <SelectItem value="75%">75%</SelectItem>
                                    <SelectItem value="80%">80%</SelectItem>
                                    <SelectItem value="85%">85%</SelectItem>
                                    <SelectItem value="90%">90%</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={insuranceForm.control}
                            name="premium"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Premium (€)</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" placeholder="0" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={insuranceForm.control}
                            name="policyNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Policy Number</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="POL-2024-001" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={insuranceForm.control}
                            name="validUntil"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valid Until</FormLabel>
                                <FormControl>
                                  <Input {...field} type="date" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={insuranceForm.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Active">Active</SelectItem>
                                  <SelectItem value="Pending Renewal">Pending Renewal</SelectItem>
                                  <SelectItem value="Expired">Expired</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsInsuranceDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Create Policy</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={insuranceColumns} data={insurancePolicies} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reporting" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Credit Risk Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive credit risk analysis and exposure reports.
                </p>
                <Button className="w-full" onClick={() => handleQuickReport('risk')}>
                  Generate Risk Report
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Collections Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Detailed collections performance and aging analysis.
                </p>
                <Button className="w-full" onClick={() => handleQuickReport('collections')}>
                  Generate Collections Report
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Credit Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Credit limit utilization and availability analysis.
                </p>
                <Button className="w-full" onClick={() => handleQuickReport('utilization')}>
                  Generate Utilization Report
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>DSO Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Days sales outstanding trends and customer analysis.
                </p>
                <Button className="w-full" onClick={() => handleQuickReport('dso')}>
                  Generate DSO Report
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Generated Reports</CardTitle>
                <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Custom Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Generate Custom Report</DialogTitle>
                    </DialogHeader>
                    <Form {...reportConfigForm}>
                      <form onSubmit={reportConfigForm.handleSubmit(handleGenerateReport)} className="space-y-4">
                        <FormField
                          control={reportConfigForm.control}
                          name="reportType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Report Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select report type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="risk">Credit Risk Analysis</SelectItem>
                                  <SelectItem value="collections">Collections Performance</SelectItem>
                                  <SelectItem value="utilization">Credit Utilization</SelectItem>
                                  <SelectItem value="dso">DSO Analysis</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={reportConfigForm.control}
                            name="dateRange"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date Range</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select date range" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="last7days">Last 7 Days</SelectItem>
                                    <SelectItem value="last30days">Last 30 Days</SelectItem>
                                    <SelectItem value="last90days">Last 90 Days</SelectItem>
                                    <SelectItem value="ytd">Year to Date</SelectItem>
                                    <SelectItem value="custom">Custom Range</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={reportConfigForm.control}
                            name="format"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Format</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select format" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                    <SelectItem value="excel">Excel</SelectItem>
                                    <SelectItem value="csv">CSV</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={reportConfigForm.control}
                            name="customerFilter"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Customer Filter</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select filter" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="all">All Customers</SelectItem>
                                    <SelectItem value="active">Active Only</SelectItem>
                                    <SelectItem value="overdue">Overdue Only</SelectItem>
                                    <SelectItem value="highrisk">High Risk Only</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={reportConfigForm.control}
                            name="includeCharts"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                  <FormLabel>Include Charts</FormLabel>
                                  <FormLabel className="text-sm text-muted-foreground">
                                    Add visual charts to the report
                                  </FormLabel>
                                </div>
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="h-4 w-4"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Generate Report</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={reportColumns} data={reports} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Credit Customer</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="creditLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Limit</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="riskRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Rating</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AAA">AAA</SelectItem>
                          <SelectItem value="AA+">AA+</SelectItem>
                          <SelectItem value="AA">AA</SelectItem>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="BBB+">BBB+</SelectItem>
                          <SelectItem value="BBB">BBB</SelectItem>
                          <SelectItem value="BB">BB</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select terms" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="30 days">30 days</SelectItem>
                          <SelectItem value="45 days">45 days</SelectItem>
                          <SelectItem value="60 days">60 days</SelectItem>
                          <SelectItem value="90 days">90 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Customer</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditApplicationDialogOpen} onOpenChange={setIsEditApplicationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Credit Application</DialogTitle>
          </DialogHeader>
          <Form {...applicationForm}>
            <form onSubmit={applicationForm.handleSubmit(handleUpdateApplication)} className="space-y-4">
              <FormField
                control={applicationForm.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter customer name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={applicationForm.control}
                  name="requestedLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requested Limit (€)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={applicationForm.control}
                  name="currentLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Limit (€)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={applicationForm.control}
                  name="riskScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Score</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" max="100" placeholder="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={applicationForm.control}
                  name="reviewer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reviewer</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Assign reviewer" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditApplicationDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Application</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditCollectionDialogOpen} onOpenChange={setIsEditCollectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection Case</DialogTitle>
          </DialogHeader>
          <Form {...collectionForm}>
            <form onSubmit={collectionForm.handleSubmit(handleUpdateCollection)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={collectionForm.control}
                  name="customer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter customer name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={collectionForm.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="INV-2024-001" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={collectionForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (€)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={collectionForm.control}
                  name="overdueDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overdue Days</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={collectionForm.control}
                  name="collectionStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collection Stage</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Friendly Reminder">Friendly Reminder</SelectItem>
                          <SelectItem value="First Notice">First Notice</SelectItem>
                          <SelectItem value="Second Notice">Second Notice</SelectItem>
                          <SelectItem value="Final Notice">Final Notice</SelectItem>
                          <SelectItem value="Legal Notice">Legal Notice</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={collectionForm.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Assign to team/member" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={collectionForm.control}
                  name="lastContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Contact</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={collectionForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Escalated">Escalated</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditCollectionDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Collection Case</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditInsuranceDialogOpen} onOpenChange={setIsEditInsuranceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Credit Insurance Policy</DialogTitle>
          </DialogHeader>
          <Form {...insuranceForm}>
            <form onSubmit={insuranceForm.handleSubmit(handleUpdateInsurance)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={insuranceForm.control}
                  name="customer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter customer name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={insuranceForm.control}
                  name="insurer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurer</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select insurer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Euler Hermes">Euler Hermes</SelectItem>
                          <SelectItem value="Atradius">Atradius</SelectItem>
                          <SelectItem value="Coface">Coface</SelectItem>
                          <SelectItem value="Allianz Trade">Allianz Trade</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={insuranceForm.control}
                  name="coverage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coverage</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select coverage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="50%">50%</SelectItem>
                          <SelectItem value="60%">60%</SelectItem>
                          <SelectItem value="70%">70%</SelectItem>
                          <SelectItem value="75%">75%</SelectItem>
                          <SelectItem value="80%">80%</SelectItem>
                          <SelectItem value="85%">85%</SelectItem>
                          <SelectItem value="90%">90%</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={insuranceForm.control}
                  name="premium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Premium (€)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={insuranceForm.control}
                  name="policyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="POL-2024-001" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={insuranceForm.control}
                  name="validUntil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valid Until</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={insuranceForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending Renewal">Pending Renewal</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditInsuranceDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Policy</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinanceCreditManagement;
