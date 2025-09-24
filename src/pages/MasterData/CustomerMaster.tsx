
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Plus, Users, Building, Edit, Trash2, Eye } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useForm } from 'react-hook-form';

interface Customer {
  id: string;
  customerNumber: string;
  customerName: string;
  country: string;
  city: string;
  customerGroup: string;
  paymentTerms: string;
  creditLimit: number;
  status: string;
}

interface CustomerFormData {
  customerNumber: string;
  customerName: string;
  country: string;
  city: string;
  customerGroup: string;
  paymentTerms: string;
  creditLimit: string;
}

const CustomerMaster: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const form = useForm<CustomerFormData>({
    defaultValues: {
      customerNumber: '',
      customerName: '',
      country: '',
      city: '',
      customerGroup: '',
      paymentTerms: '',
      creditLimit: ''
    }
  });

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Customer Master. Manage customer information including contact details, payment terms, and credit limits.');
    }
  }, [isEnabled, speak]);

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      customerNumber: 'CUST-001',
      customerName: 'ABC Corporation',
      country: 'United States',
      city: 'New York',
      customerGroup: 'Enterprise',
      paymentTerms: 'Net 30',
      creditLimit: 500000,
      status: 'Active'
    },
    {
      id: '2',
      customerNumber: 'CUST-002',
      customerName: 'Global Tech Solutions',
      country: 'Germany',
      city: 'Berlin',
      customerGroup: 'SMB',
      paymentTerms: 'Net 15',
      creditLimit: 100000,
      status: 'Active'
    },
    {
      id: '3',
      customerNumber: 'CUST-003',
      customerName: 'Regional Distributors',
      country: 'United Kingdom',
      city: 'London',
      customerGroup: 'Distributor',
      paymentTerms: 'Cash',
      creditLimit: 250000,
      status: 'Blocked'
    }
  ]);

  const handleCreateCustomer = (data: CustomerFormData) => {
    const newCustomer: Customer = {
      id: String(customers.length + 1),
      customerNumber: data.customerNumber,
      customerName: data.customerName,
      country: data.country,
      city: data.city,
      customerGroup: data.customerGroup,
      paymentTerms: data.paymentTerms,
      creditLimit: parseInt(data.creditLimit),
      status: 'Active'
    };
    setCustomers([...customers, newCustomer]);
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    form.reset({
      customerNumber: customer.customerNumber,
      customerName: customer.customerName,
      country: customer.country,
      city: customer.city,
      customerGroup: customer.customerGroup,
      paymentTerms: customer.paymentTerms,
      creditLimit: customer.creditLimit.toString()
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCustomer = (data: CustomerFormData) => {
    if (!selectedCustomer) return;
    
    setCustomers(customers.map(customer => 
      customer.id === selectedCustomer.id 
        ? { 
            ...customer, 
            customerNumber: data.customerNumber,
            customerName: data.customerName,
            country: data.country,
            city: data.city,
            customerGroup: data.customerGroup,
            paymentTerms: data.paymentTerms,
            creditLimit: parseInt(data.creditLimit)
          } 
        : customer
    ));
    setIsEditDialogOpen(false);
    setSelectedCustomer(null);
    form.reset();
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter(customer => customer.id !== id));
  };

  const columns = [
    { key: 'customerNumber', header: 'Customer Number' },
    { key: 'customerName', header: 'Customer Name' },
    { key: 'country', header: 'Country' },
    { key: 'city', header: 'City' },
    { key: 'customerGroup', header: 'Customer Group' },
    { key: 'paymentTerms', header: 'Payment Terms' },
    { 
      key: 'creditLimit', 
      header: 'Credit Limit',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        if (value === 'Blocked') variant = 'destructive';
        if (value === 'Inactive') variant = 'secondary';
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: string, row: any) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => alert(`Viewing details for ${row.customerName}`)}>
            <Eye className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleEditCustomer(row)}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDeleteCustomer(row.id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/master-data')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Customer Master"
          description="Create and maintain customer master records"
          voiceIntroduction="Welcome to Customer Master."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Customers</div>
          <div className="text-2xl font-bold">8,234</div>
          <div className="text-sm text-blue-600">All customer records</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Active Customers</div>
          <div className="text-2xl font-bold">7,891</div>
          <div className="text-sm text-green-600">Currently active</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Credit Exposure</div>
          <div className="text-2xl font-bold">$45.6M</div>
          <div className="text-sm text-orange-600">Total credit limits</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Countries</div>
          <div className="text-2xl font-bold">42</div>
          <div className="text-sm text-purple-600">Global presence</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Customer Records</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Customer</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateCustomer)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Group</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Enterprise">Enterprise</SelectItem>
                            <SelectItem value="SMB">SMB</SelectItem>
                            <SelectItem value="Distributor">Distributor</SelectItem>
                            <SelectItem value="Individual">Individual</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Net 15">Net 15</SelectItem>
                            <SelectItem value="Net 30">Net 30</SelectItem>
                            <SelectItem value="Net 60">Net 60</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="creditLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Limit</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Customer</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={customers} />
      </Card>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateCustomer)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Group</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Enterprise">Enterprise</SelectItem>
                          <SelectItem value="SMB">SMB</SelectItem>
                          <SelectItem value="Distributor">Distributor</SelectItem>
                          <SelectItem value="Individual">Individual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Net 15">Net 15</SelectItem>
                          <SelectItem value="Net 30">Net 30</SelectItem>
                          <SelectItem value="Net 60">Net 60</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="creditLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credit Limit</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
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

export default CustomerMaster;
