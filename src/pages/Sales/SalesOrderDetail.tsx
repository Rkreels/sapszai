
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Calendar, User, TrendingUp, Package, Truck, FileText, Check, Mail, Printer } from 'lucide-react';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import DataTable from '../../components/data/DataTable';
import { Column } from '../../components/data/DataTable';
import { Separator } from '../../components/ui/separator';

// Sample order data
const orderData = {
  id: 'SO-10293',
  customer: 'Acme Corporation',
  customerId: 'C-001',
  status: 'Processing',
  date: '2025-05-22',
  requestedDelivery: '2025-06-05',
  scheduledDelivery: '2025-06-05',
  totalValue: '€24,500.00',
  currency: 'EUR',
  paymentTerms: 'Net 45',
  deliveryTerms: 'DAP',
  salesPerson: 'Emma Wilson',
  purchaseOrderRef: 'PO-ACM-78452',
  shippingAddress: '789 Industrial Blvd, Chicago, IL 60603, United States',
  billingAddress: '789 Industrial Blvd, Chicago, IL 60603, United States',
  notes: 'Priority customer. Delivery must be on time.',
};

// Sample order items data
const orderItemsData = [
  { 
    id: 1, 
    materialId: 'MAT-10045', 
    description: 'Industrial Press Machine', 
    quantity: 1, 
    unit: 'PC', 
    unitPrice: '€15,000.00',
    totalPrice: '€15,000.00',
    deliveryDate: '2025-06-05',
    status: 'In Stock'
  },
  { 
    id: 2, 
    materialId: 'MAT-20178', 
    description: 'Hydraulic Control Unit', 
    quantity: 3, 
    unit: 'PC', 
    unitPrice: '€2,500.00',
    totalPrice: '€7,500.00',
    deliveryDate: '2025-06-05',
    status: 'In Stock'
  },
  { 
    id: 3, 
    materialId: 'MAT-30256', 
    description: 'Installation Service', 
    quantity: 8, 
    unit: 'HR', 
    unitPrice: '€250.00',
    totalPrice: '€2,000.00',
    deliveryDate: '2025-06-10',
    status: 'Scheduled'
  },
];

const SalesOrderDetail: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  
  useEffect(() => {
    if (isEnabled) {
      speak(`You are viewing sales order ${orderData.id} for customer ${orderData.customer}. This order is currently ${orderData.status.toLowerCase()}.`);
    }
  }, [isEnabled, speak]);

  // Order items columns configuration
  const itemColumns: Column[] = [
    { key: "materialId", header: "Material ID" },
    { key: "description", header: "Description" },
    { key: "quantity", header: "Quantity" },
    { key: "unit", header: "Unit" },
    { key: "unitPrice", header: "Unit Price" },
    { key: "totalPrice", header: "Total Price" },
    { 
      key: "status", 
      header: "Status",
      render: (value) => (
        <Badge className={
          value === 'In Stock' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
          value === 'Scheduled' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
          value === 'Back Order' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' :
          'bg-gray-100 text-gray-800 hover:bg-gray-100'
        }>
          {value}
        </Badge>
      )
    },
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
          title={`Sales Order: ${orderData.id}`}
          description={`Customer: ${orderData.customer} | Order Date: ${orderData.date}`}
          voiceIntroduction={`You are viewing sales order ${orderData.id} for customer ${orderData.customer}. This order is currently ${orderData.status.toLowerCase()}.`}
        />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <Badge className={
            orderData.status === 'Processing' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100 text-base' :
            orderData.status === 'Delivered' ? 'bg-green-100 text-green-800 hover:bg-green-100 text-base' :
            'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-base'
          }>
            {orderData.status}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button variant="default" size="sm" className="flex items-center">
            <Check className="h-4 w-4 mr-2" />
            Release Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Order Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-medium">{orderData.customer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer ID</p>
              <p className="font-medium">{orderData.customerId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">{orderData.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Purchase Order Ref</p>
              <p className="font-medium">{orderData.purchaseOrderRef}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sales Person</p>
              <p className="font-medium">{orderData.salesPerson}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Terms</p>
              <p className="font-medium">{orderData.paymentTerms}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Requested Delivery</p>
              <p className="font-medium">{orderData.requestedDelivery}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Scheduled Delivery</p>
              <p className="font-medium">{orderData.scheduledDelivery}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivery Terms</p>
              <p className="font-medium">{orderData.deliveryTerms}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">{orderData.status}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Shipping Address</p>
            <p className="font-medium">{orderData.shippingAddress}</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Order Items</h2>
        <DataTable columns={itemColumns} data={orderItemsData} />
        
        <div className="mt-6 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Subtotal:</span>
              <span className="font-medium">€24,500.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">VAT (0%):</span>
              <span className="font-medium">€0.00</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>€24,500.00</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Order Processing</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Order Created</div>
                <div className="text-sm text-gray-500">May 22, 2025 - 10:30 AM</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Credit Check</div>
                <div className="text-sm text-gray-500">May 22, 2025 - 11:15 AM</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Picking</div>
                <div className="text-sm text-gray-500">In Progress</div>
              </div>
            </div>
            <div className="flex items-start opacity-50">
              <div className="bg-gray-100 p-2 rounded-lg mr-3">
                <Package className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <div className="font-medium">Packing</div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
            </div>
            <div className="flex items-start opacity-50">
              <div className="bg-gray-100 p-2 rounded-lg mr-3">
                <Truck className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <div className="font-medium">Shipping</div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
            </div>
            <div className="flex items-start opacity-50">
              <div className="bg-gray-100 p-2 rounded-lg mr-3">
                <FileText className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <div className="font-medium">Invoice</div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Notes</p>
              <p className="font-medium">{orderData.notes}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Billing Address</p>
              <p className="font-medium">{orderData.billingAddress}</p>
            </div>
          </div>
          
          <h3 className="text-md font-semibold mt-6 mb-3">Related Documents</h3>
          <ul className="space-y-2">
            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-blue-500 mr-2" />
                <span>Customer Purchase Order.pdf</span>
              </div>
              <Badge variant="outline">PO</Badge>
            </li>
            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-green-500 mr-2" />
                <span>Product Specifications.pdf</span>
              </div>
              <Badge variant="outline">Spec</Badge>
            </li>
            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-purple-500 mr-2" />
                <span>Delivery Instructions.docx</span>
              </div>
              <Badge variant="outline">Delivery</Badge>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default SalesOrderDetail;
