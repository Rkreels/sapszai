
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Search, FileText, Download, Filter, Calendar, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';

const BillingDocuments: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('invoices');

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Billing Documents. Manage invoices, credit memos, and billing reports for comprehensive revenue tracking.');
    }
  }, [isEnabled, speak]);

  const invoices = [
    { id: 'INV0012458', customer: 'Acme Corp', orderRef: 'SO78654', date: '2025-05-15', amount: '$24,580.00', status: 'Posted', paymentStatus: 'Paid' },
    { id: 'INV0012457', customer: 'TechSolutions Inc', orderRef: 'SO78432', date: '2025-05-14', amount: '$12,750.00', status: 'Posted', paymentStatus: 'Open' },
    { id: 'INV0012456', customer: 'Global Retail', orderRef: 'SO78201', date: '2025-05-12', amount: '$35,420.00', status: 'Posted', paymentStatus: 'Partially Paid' },
    { id: 'INV0012455', customer: 'Manufacturing Partners', orderRef: 'SO77985', date: '2025-05-10', amount: '$9,845.00', status: 'Posted', paymentStatus: 'Overdue' },
    { id: 'INV0012454', customer: 'Logistic Solutions', orderRef: 'SO77854', date: '2025-05-08', amount: '$18,320.00', status: 'Draft', paymentStatus: 'Not Applicable' },
  ];

  const creditMemos = [
    { id: 'CM0001245', customer: 'Acme Corp', invoiceRef: 'INV0012428', date: '2025-05-16', amount: '$1,250.00', reason: 'Return', status: 'Posted' },
    { id: 'CM0001244', customer: 'Global Retail', invoiceRef: 'INV0012412', date: '2025-05-14', amount: '$3,200.00', reason: 'Pricing Adjustment', status: 'Posted' },
    { id: 'CM0001243', customer: 'Manufacturing Partners', invoiceRef: 'INV0012402', date: '2025-05-12', amount: '$750.00', reason: 'Return', status: 'Draft' },
  ];

  const getPaymentStatusBadge = (status: string) => {
    const statusColors: Record<string, { bg: string, text: string }> = {
      'Paid': { bg: 'bg-green-100', text: 'text-green-800' },
      'Open': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Partially Paid': { bg: 'bg-amber-100', text: 'text-amber-800' },
      'Overdue': { bg: 'bg-red-100', text: 'text-red-800' },
      'Not Applicable': { bg: 'bg-gray-100', text: 'text-gray-800' },
    };
    
    const colors = statusColors[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors.bg} ${colors.text}`}>
        {status}
      </span>
    );
  };

  const getStatusIndicator = (status: string) => {
    if (status === 'Posted') {
      return <Check className="h-4 w-4 text-green-500" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/sales')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Billing Documents"
          description="Manage invoices, credit memos, and billing reports for revenue tracking"
          voiceIntroduction="Welcome to Billing Documents for comprehensive billing management."
        />
      </div>

      <VoiceTrainingComponent 
        module="sales"
        topic="Billing Documents Management"
        examples={[
          "Creating customer invoices from sales orders with automated tax calculations and payment terms",
          "Processing credit memos for returns and adjustments with proper accounting integration",
          "Generating billing reports for revenue recognition and customer payment analysis"
        ]}
        detailLevel="intermediate"
      />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Billing Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Billing Schedule
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      <Tabs defaultValue="invoices" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="creditMemos">Credit Memos</TabsTrigger>
          <TabsTrigger value="reports">Billing Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-72">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search invoices..." className="pl-8" />
                </div>
                <div className="flex items-center space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px] h-9">
                      <SelectValue placeholder="Payment Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="partially">Partially Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Order Reference</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map(invoice => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>{invoice.customer}</TableCell>
                        <TableCell>{invoice.orderRef}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.amount}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getStatusIndicator(invoice.status)}
                            <span className="ml-2">{invoice.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getPaymentStatusBadge(invoice.paymentStatus)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creditMemos" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-72">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search credit memos..." className="pl-8" />
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Credit Memo #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Invoice Reference</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creditMemos.map(memo => (
                      <TableRow key={memo.id}>
                        <TableCell>{memo.id}</TableCell>
                        <TableCell>{memo.customer}</TableCell>
                        <TableCell>{memo.invoiceRef}</TableCell>
                        <TableCell>{memo.date}</TableCell>
                        <TableCell>{memo.amount}</TableCell>
                        <TableCell>{memo.reason}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getStatusIndicator(memo.status)}
                            <span className="ml-2">{memo.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                <div className="border rounded-md p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <FileText className="h-8 w-8 text-blue-500 mb-2" />
                  <h3 className="font-medium">Monthly Billing Summary</h3>
                  <p className="text-sm text-gray-500 mt-1">Overview of all billing activity by month</p>
                </div>
                
                <div className="border rounded-md p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <FileText className="h-8 w-8 text-blue-500 mb-2" />
                  <h3 className="font-medium">Invoice Status Report</h3>
                  <p className="text-sm text-gray-500 mt-1">Track open, paid and overdue invoices</p>
                </div>
                
                <div className="border rounded-md p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <FileText className="h-8 w-8 text-blue-500 mb-2" />
                  <h3 className="font-medium">Customer Billing Analysis</h3>
                  <p className="text-sm text-gray-500 mt-1">Billing trends by customer segment</p>
                </div>
                
                <div className="border rounded-md p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <FileText className="h-8 w-8 text-blue-500 mb-2" />
                  <h3 className="font-medium">Credit Memo Analysis</h3>
                  <p className="text-sm text-gray-500 mt-1">Summary of credit memo reasons and amounts</p>
                </div>
                
                <div className="border rounded-md p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <FileText className="h-8 w-8 text-blue-500 mb-2" />
                  <h3 className="font-medium">Revenue Recognition Report</h3>
                  <p className="text-sm text-gray-500 mt-1">Track when revenue is recognized</p>
                </div>
                
                <div className="border rounded-md p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <FileText className="h-8 w-8 text-blue-500 mb-2" />
                  <h3 className="font-medium">Tax Summary Report</h3>
                  <p className="text-sm text-gray-500 mt-1">Summary of taxes collected by region</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingDocuments;
