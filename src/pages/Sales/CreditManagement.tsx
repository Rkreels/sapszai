
import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Search, AlertCircle, Check, Clock, Ban, RefreshCw, Eye, Settings } from 'lucide-react';
import { Input } from '../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { useToast } from '../../hooks/use-toast';

const CreditManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('checks');
  const [selectedCheck, setSelectedCheck] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isViewCheckDialogOpen, setIsViewCheckDialogOpen] = useState(false);
  const [isManageCustomerDialogOpen, setIsManageCustomerDialogOpen] = useState(false);
  const { toast } = useToast();

  const creditChecks = [
    { id: 'CC001', customer: 'Acme Corp', orderRef: 'SO78954', amount: '$28,500', checkDate: '2025-05-20 14:30', status: 'Approved', limit: '$100,000', exposure: '$72,500' },
    { id: 'CC002', customer: 'TechSolutions Inc', orderRef: 'SO78965', amount: '$45,200', checkDate: '2025-05-20 13:15', status: 'Pending', limit: '$50,000', exposure: '$48,700' },
    { id: 'CC003', customer: 'Global Retail', orderRef: 'SO79001', amount: '$120,000', checkDate: '2025-05-20 11:20', status: 'Blocked', limit: '$100,000', exposure: '$110,000' },
    { id: 'CC004', customer: 'Manufacturing Partners', orderRef: 'SO78990', amount: '$12,750', checkDate: '2025-05-20 10:05', status: 'Approved', limit: '$75,000', exposure: '$42,300' },
    { id: 'CC005', customer: 'Logistic Solutions', orderRef: 'SO78975', amount: '$36,200', checkDate: '2025-05-19 16:40', status: 'Approved', limit: '$120,000', exposure: '$86,500' },
  ];

  const customers = [
    { id: 'C001', name: 'Acme Corp', creditLimit: '$100,000', currentExposure: '$72,500', riskCategory: 'Medium', lastReview: '2025-03-15', nextReview: '2025-09-15' },
    { id: 'C002', name: 'TechSolutions Inc', creditLimit: '$50,000', currentExposure: '$48,700', riskCategory: 'High', lastReview: '2025-04-10', nextReview: '2025-07-10' },
    { id: 'C003', name: 'Global Retail', creditLimit: '$100,000', currentExposure: '$110,000', riskCategory: 'Critical', lastReview: '2025-05-05', nextReview: '2025-06-05' },
    { id: 'C004', name: 'Manufacturing Partners', creditLimit: '$75,000', currentExposure: '$42,300', riskCategory: 'Low', lastReview: '2025-02-20', nextReview: '2025-08-20' },
    { id: 'C005', name: 'Logistic Solutions', creditLimit: '$120,000', currentExposure: '$86,500', riskCategory: 'Medium', lastReview: '2025-03-01', nextReview: '2025-09-01' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'Blocked':
        return <Ban className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const handleViewCheckDetails = (check: any) => {
    setSelectedCheck(check);
    setIsViewCheckDialogOpen(true);
  };

  const handleManageCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsManageCustomerDialogOpen(true);
  };

  const handleUpdateCustomerCredit = () => {
    toast({
      title: 'Customer Credit Updated',
      description: 'Customer credit information has been updated successfully.',
    });
    setIsManageCustomerDialogOpen(false);
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Low':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>;
      case 'Medium':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Medium</Badge>;
      case 'High':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">High</Badge>;
      case 'Critical':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>;
      default:
        return null;
    }
  };

  const calculateUsagePercentage = (exposure: string, limit: string) => {
    const exposureValue = parseFloat(exposure.replace(/[$,]/g, ''));
    const limitValue = parseFloat(limit.replace(/[$,]/g, ''));
    return Math.min(Math.round((exposureValue / limitValue) * 100), 100);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Credit Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            Credit Alerts
          </Button>
        </div>
      </div>

      <Tabs defaultValue="checks" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="checks">Credit Checks</TabsTrigger>
          <TabsTrigger value="customers">Customer Credit</TabsTrigger>
          <TabsTrigger value="settings">Credit Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="checks" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-72">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search credit checks..." className="pl-8" />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Check ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Order Ref</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Check Date/Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creditChecks.map(check => (
                      <TableRow key={check.id}>
                        <TableCell>{check.id}</TableCell>
                        <TableCell>{check.customer}</TableCell>
                        <TableCell>{check.orderRef}</TableCell>
                        <TableCell>{check.amount}</TableCell>
                        <TableCell>{check.checkDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getStatusIcon(check.status)}
                            <span className="ml-2">{check.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleViewCheckDetails(creditCheck)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-72">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search customers..." className="pl-8" />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Credit Limit</TableHead>
                      <TableHead>Credit Usage</TableHead>
                      <TableHead>Risk Category</TableHead>
                      <TableHead>Last Review</TableHead>
                      <TableHead>Next Review</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map(customer => {
                      const usagePercentage = calculateUsagePercentage(customer.currentExposure, customer.creditLimit);
                      
                      return (
                        <TableRow key={customer.id}>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell>{customer.creditLimit}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span>{customer.currentExposure}</span>
                                <span>{usagePercentage}%</span>
                              </div>
                              <Progress 
                                value={usagePercentage} 
                                max={100}
                                className={`h-2 ${
                                  usagePercentage >= 90 ? 'bg-red-100' :
                                  usagePercentage >= 75 ? 'bg-amber-100' :
                                  'bg-gray-100'
                                }`}
                              />
                            </div>
                          </TableCell>
                          <TableCell>{getRiskBadge(customer.riskCategory)}</TableCell>
                          <TableCell>{customer.lastReview}</TableCell>
                          <TableCell>{customer.nextReview}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleManageCustomer(customer)}>
                              <Settings className="h-4 w-4 mr-2" />
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6 p-6 flex flex-col items-center justify-center">
              <h3 className="text-lg font-medium mb-2">Credit Management Configuration</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">Configure credit check rules, risk categories, approval workflows, and credit limits</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
                <Button variant="outline" className="h-24 flex flex-col">
                  <span className="text-sm font-medium">Credit Limit Rules</span>
                  <span className="text-xs text-muted-foreground mt-1">Configure automatic credit limit determination</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <span className="text-sm font-medium">Risk Categories</span>
                  <span className="text-xs text-muted-foreground mt-1">Define risk levels and scoring models</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <span className="text-sm font-medium">Approval Workflows</span>
                  <span className="text-xs text-muted-foreground mt-1">Set up credit approval processes</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <span className="text-sm font-medium">Block Reasons</span>
                  <span className="text-xs text-muted-foreground mt-1">Configure credit block reasons</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Check Details Dialog */}
      <Dialog open={isViewCheckDialogOpen} onOpenChange={setIsViewCheckDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-w-lg lg:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Credit Check Details</DialogTitle>
          </DialogHeader>
          {selectedCheck && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Check ID</Label>
                  <p className="text-lg font-semibold">{selectedCheck.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Customer</Label>
                  <p className="text-lg font-semibold">{selectedCheck.customer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Order Reference</Label>
                  <p className="text-lg font-semibold">{selectedCheck.orderRef}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                  <p className="text-lg font-semibold text-green-600">{selectedCheck.amount}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Check Date</Label>
                  <p className="text-lg font-semibold">{selectedCheck.checkDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge variant={selectedCheck.status === 'Approved' ? 'default' : selectedCheck.status === 'Pending' ? 'secondary' : 'destructive'}>
                    {selectedCheck.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Credit Limit</Label>
                  <p className="text-lg font-semibold">{selectedCheck.limit}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Current Exposure</Label>
                  <p className="text-lg font-semibold">{selectedCheck.exposure}</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsViewCheckDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Customer Dialog */}
      <Dialog open={isManageCustomerDialogOpen} onOpenChange={setIsManageCustomerDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-w-lg lg:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Customer Credit</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Customer ID</Label>
                  <p className="text-lg font-semibold">{selectedCustomer.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Customer Name</Label>
                  <p className="text-lg font-semibold">{selectedCustomer.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Credit Limit</Label>
                  <p className="text-lg font-semibold">{selectedCustomer.creditLimit}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Current Exposure</Label>
                  <p className="text-lg font-semibold">{selectedCustomer.currentExposure}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Risk Category</Label>
                  <p className="text-lg font-semibold">{selectedCustomer.riskCategory}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Review</Label>
                  <p className="text-lg font-semibold">{selectedCustomer.lastReview}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Next Review</Label>
                  <p className="text-lg font-semibold">{selectedCustomer.nextReview}</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsManageCustomerDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateCustomerCredit}>Update Credit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreditManagement;
