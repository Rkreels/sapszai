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
    defaultValues: {
      customerName: '',
      creditLimit: '',
      riskRating: '',
      paymentTerms: '',
      currency: '',
      collateral: ''
    }
  });

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

  const handleCreate = (data: FormValues) => {
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

  const handleUpdate = (data: FormValues) => {
    setCustomers(customers.map(c => c.id === selectedCustomer?.id ? { 
      ...c, 
      name: data.customerName,
      creditLimit: data.creditLimit,
      riskRating: data.riskRating,
      paymentTerms: data.paymentTerms
    } : c));
    setIsEditDialogOpen(false);
    setSelectedCustomer(null);
  };

  const handleDelete = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  // Credit Application CRUD operations
  const handleCreateApplication = (data: CreditApplicationForm) => {
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
          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
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
          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
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
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Application
                </Button>
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
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Collection Case
                </Button>
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
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Policy
                </Button>
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
                <Button className="w-full">Generate Risk Report</Button>
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
                <Button className="w-full">Generate Collections Report</Button>
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
                <Button className="w-full">Generate Utilization Report</Button>
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
                <Button className="w-full">Generate DSO Report</Button>
              </CardContent>
            </Card>
          </div>
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
    </div>
  );
};

export default FinanceCreditManagement;
