
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Mail, Phone, User, Building, MapPin, FileText, TrendingUp, CreditCard, Calendar } from 'lucide-react';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import DataTable from '../../components/data/DataTable';
import { Column } from '../../components/data/DataTable';

// Sample customer data
const customerData = {
  id: 'C-001',
  name: 'Acme Corporation',
  status: 'Active',
  industry: 'Manufacturing',
  contactPerson: 'John Smith',
  title: 'Purchasing Manager',
  email: 'john.smith@acme.example.com',
  phone: '+1 (555) 987-6543',
  website: 'www.acme.example.com',
  address: '789 Industrial Blvd, Chicago, IL 60603',
  country: 'United States',
  revenueTarget: '€2.5M',
  lastOrder: 'May 10, 2025',
  paymentTerms: 'Net 45',
  creditLimit: '€500,000',
  accountManager: 'Emma Wilson',
};

// Sample sales orders data
const salesOrdersData = [
  { 
    id: "SO-10293", 
    date: "2025-05-22", 
    products: "Industrial Equipment, Spare Parts", 
    value: "€24,500", 
    status: "Processing" 
  },
  { 
    id: "SO-10245", 
    date: "2025-04-15", 
    products: "Manufacturing Supplies", 
    value: "€12,350", 
    status: "Delivered" 
  },
  { 
    id: "SO-10198", 
    date: "2025-03-28", 
    products: "Maintenance Kit, Tools", 
    value: "€8,750", 
    status: "Delivered" 
  },
  { 
    id: "SO-10132", 
    date: "2025-02-10", 
    products: "Production Equipment", 
    value: "€32,800", 
    status: "Delivered" 
  },
  { 
    id: "SO-10087", 
    date: "2025-01-05", 
    products: "Office Equipment", 
    value: "€5,400", 
    status: "Delivered" 
  },
];

// Sample invoices data
const invoicesData = [
  { 
    id: "INV-5823", 
    orderRef: "SO-10245", 
    date: "2025-04-15", 
    dueDate: "2025-05-30", 
    amount: "€12,350",
    status: "Paid" 
  },
  { 
    id: "INV-5782", 
    orderRef: "SO-10198", 
    date: "2025-03-28", 
    dueDate: "2025-05-12", 
    amount: "€8,750",
    status: "Paid" 
  },
  { 
    id: "INV-5689", 
    orderRef: "SO-10132", 
    date: "2025-02-10", 
    dueDate: "2025-03-27", 
    amount: "€32,800",
    status: "Paid" 
  },
  { 
    id: "INV-5645", 
    orderRef: "SO-10087", 
    date: "2025-01-05", 
    dueDate: "2025-02-19", 
    amount: "€5,400",
    status: "Paid" 
  },
];

// Sample opportunities data
const opportunitiesData = [
  { 
    id: "OPP-2025-021", 
    name: "Production Line Expansion", 
    stage: "Proposal", 
    value: "€120,000",
    probability: "60%",
    expectedClose: "2025-07-15" 
  },
  { 
    id: "OPP-2025-018", 
    name: "Annual Maintenance Contract", 
    stage: "Negotiation", 
    value: "€45,000",
    probability: "80%",
    expectedClose: "2025-06-30" 
  },
  { 
    id: "OPP-2025-012", 
    name: "Warehouse Automation", 
    stage: "Qualification", 
    value: "€250,000",
    probability: "40%",
    expectedClose: "2025-09-01" 
  },
];

const CustomerDetail: React.FC = () => {
  const navigate = useNavigate();
  const { customerId } = useParams<{ customerId: string }>();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('orders');
  
  useEffect(() => {
    if (isEnabled) {
      speak(`You are viewing customer details for ${customerData.name}. This is an ${customerData.status.toLowerCase()} customer in the ${customerData.industry} industry.`);
    }
  }, [isEnabled, speak]);

  // Orders columns configuration
  const orderColumns: Column[] = [
    { key: "id", header: "Order ID" },
    { key: "date", header: "Order Date" },
    { key: "products", header: "Products" },
    { key: "value", header: "Value" },
    { 
      key: "status", 
      header: "Status",
      render: (value) => (
        <Badge className={
          value === 'Delivered' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
          value === 'Processing' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
          'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
        }>
          {value}
        </Badge>
      )
    },
    { 
      key: "actions", 
      header: "Actions",
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">View</Button>
        </div>
      )
    }
  ];

  // Invoices columns configuration
  const invoiceColumns: Column[] = [
    { key: "id", header: "Invoice #" },
    { key: "orderRef", header: "Order Ref" },
    { key: "date", header: "Issue Date" },
    { key: "dueDate", header: "Due Date" },
    { key: "amount", header: "Amount" },
    { 
      key: "status", 
      header: "Status",
      render: (value) => (
        <Badge className={
          value === 'Paid' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
          value === 'Outstanding' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
          'bg-red-100 text-red-800 hover:bg-red-100'
        }>
          {value}
        </Badge>
      )
    },
    { 
      key: "actions", 
      header: "Actions",
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">View</Button>
        </div>
      )
    }
  ];

  // Opportunities columns configuration
  const opportunityColumns: Column[] = [
    { key: "id", header: "Opportunity ID" },
    { key: "name", header: "Name" },
    { 
      key: "stage", 
      header: "Stage",
      render: (value) => (
        <Badge className={
          value === 'Negotiation' ? 'bg-purple-100 text-purple-800 hover:bg-purple-100' :
          value === 'Proposal' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
          'bg-green-100 text-green-800 hover:bg-green-100'
        }>
          {value}
        </Badge>
      )
    },
    { key: "value", header: "Value" },
    { key: "probability", header: "Probability" },
    { key: "expectedClose", header: "Expected Close" },
    { 
      key: "actions", 
      header: "Actions",
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">View</Button>
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
          onClick={() => navigate('/sales')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Sales
        </Button>
        <PageHeader
          title={customerData.name}
          description={`Customer ID: ${customerData.id} | Industry: ${customerData.industry}`}
          voiceIntroduction={`You are viewing customer details for ${customerData.name}. This is an ${customerData.status.toLowerCase()} customer in the ${customerData.industry} industry.`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <ul className="space-y-3">
            <li className="flex">
              <User className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Contact Person</div>
                <div className="font-medium">{customerData.contactPerson}</div>
                <div className="text-sm text-gray-500">{customerData.title}</div>
              </div>
            </li>
            <li className="flex">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-medium">{customerData.email}</div>
              </div>
            </li>
            <li className="flex">
              <Phone className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Phone</div>
                <div className="font-medium">{customerData.phone}</div>
              </div>
            </li>
            <li className="flex">
              <MapPin className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Address</div>
                <div className="font-medium">{customerData.address}</div>
                <div className="text-sm">{customerData.country}</div>
              </div>
            </li>
          </ul>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Business Information</h2>
          <ul className="space-y-3">
            <li className="flex">
              <Building className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Industry</div>
                <div className="font-medium">{customerData.industry}</div>
              </div>
            </li>
            <li className="flex">
              <User className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Account Manager</div>
                <div className="font-medium">{customerData.accountManager}</div>
              </div>
            </li>
            <li className="flex">
              <TrendingUp className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Revenue Target</div>
                <div className="font-medium">{customerData.revenueTarget}</div>
              </div>
            </li>
            <li className="flex">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Last Order</div>
                <div className="font-medium">{customerData.lastOrder}</div>
              </div>
            </li>
          </ul>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Financial Information</h2>
          <ul className="space-y-3">
            <li className="flex">
              <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Payment Terms</div>
                <div className="font-medium">{customerData.paymentTerms}</div>
              </div>
            </li>
            <li className="flex">
              <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Credit Limit</div>
                <div className="font-medium">{customerData.creditLimit}</div>
              </div>
            </li>
            <li className="flex">
              <FileText className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Open Invoices</div>
                <div className="font-medium">€24,500.00</div>
              </div>
            </li>
            <li className="flex">
              <TrendingUp className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm text-gray-500">YTD Sales</div>
                <div className="font-medium">€83,800.00</div>
              </div>
            </li>
          </ul>
        </Card>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="orders">Sales Orders</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Sales Orders</h2>
              <Button variant="default" size="sm">Create Order</Button>
            </div>
            <DataTable columns={orderColumns} data={salesOrdersData} />
          </TabsContent>
          
          <TabsContent value="invoices">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Invoices</h2>
              <Button variant="default" size="sm">Create Invoice</Button>
            </div>
            <DataTable columns={invoiceColumns} data={invoicesData} />
          </TabsContent>
          
          <TabsContent value="opportunities">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Opportunities</h2>
              <Button variant="default" size="sm">Create Opportunity</Button>
            </div>
            <DataTable columns={opportunityColumns} data={opportunitiesData} />
          </TabsContent>
        </Tabs>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Customer Activity</h2>
          <ul className="space-y-4">
            <li className="border-l-2 border-blue-500 pl-4 py-1">
              <p className="font-medium">New order placed</p>
              <p className="text-sm text-gray-600">Order SO-10293, €24,500.00, May 22, 2025</p>
            </li>
            <li className="border-l-2 border-green-500 pl-4 py-1">
              <p className="font-medium">Invoice paid</p>
              <p className="text-sm text-gray-600">Invoice INV-5782, €8,750.00, May 2, 2025</p>
            </li>
            <li className="border-l-2 border-purple-500 pl-4 py-1">
              <p className="font-medium">Product demo completed</p>
              <p className="text-sm text-gray-600">For Warehouse Automation opportunity, April 28, 2025</p>
            </li>
            <li className="border-l-2 border-orange-500 pl-4 py-1">
              <p className="font-medium">Customer meeting</p>
              <p className="text-sm text-gray-600">Account manager meeting with John Smith, April 15, 2025</p>
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Documents</h2>
          <ul className="space-y-2">
            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-blue-500 mr-2" />
                <span>Framework Agreement 2025.pdf</span>
              </div>
              <Badge variant="outline">Contract</Badge>
            </li>
            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-green-500 mr-2" />
                <span>Product Catalog - Acme.xlsx</span>
              </div>
              <Badge variant="outline">Pricing</Badge>
            </li>
            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-purple-500 mr-2" />
                <span>Meeting Notes - Q1 Review.docx</span>
              </div>
              <Badge variant="outline">Meeting</Badge>
            </li>
            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-orange-500 mr-2" />
                <span>Customer Requirements.pdf</span>
              </div>
              <Badge variant="outline">Requirements</Badge>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDetail;
