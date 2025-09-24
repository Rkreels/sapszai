
import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import DataTable from '../../../components/data/DataTable';
import { Plus, Edit, Eye, FileText, DollarSign, Phone } from 'lucide-react';

interface DataTableRow {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  header: string;
  render?: (value: string | number, row?: DataTableRow) => React.ReactNode;
}

const AccountsReceivableManagement: React.FC = () => {
  const [customers, setCustomers] = useState([
    {
      customerId: 'C001',
      customerName: 'ABC Corporation',
      invoiceNumber: 'INV-C-001',
      amount: 25000,
      dueDate: '2025-02-10',
      status: 'Outstanding',
      daysPastDue: 0,
      salesRep: 'John Smith'
    },
    {
      customerId: 'C002',
      customerName: 'XYZ Industries',
      invoiceNumber: 'INV-C-002',
      amount: 18500,
      dueDate: '2025-01-25',
      status: 'Overdue',
      daysPastDue: 3,
      salesRep: 'Sarah Johnson'
    },
    {
      customerId: 'C003',
      customerName: 'Global Trading Ltd.',
      invoiceNumber: 'INV-C-003',
      amount: 42000,
      dueDate: '2025-02-28',
      status: 'Partial Payment',
      daysPastDue: 0,
      salesRep: 'Mike Wilson'
    }
  ]);

  const columns = [
    { key: 'customerId', header: 'Customer ID' },
    { key: 'customerName', header: 'Customer Name' },
    { key: 'invoiceNumber', header: 'Invoice Number' },
    { 
      key: 'amount', 
      header: 'Amount',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { key: 'dueDate', header: 'Due Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Outstanding': 'bg-blue-100 text-blue-800',
          'Overdue': 'bg-red-100 text-red-800',
          'Partial Payment': 'bg-yellow-100 text-yellow-800',
          'Paid': 'bg-green-100 text-green-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${colors[value as keyof typeof colors]}`}>
            {value}
          </span>
        );
      }
    },
    { 
      key: 'daysPastDue', 
      header: 'Days Past Due',
      render: (value: number) => value > 0 ? `${value} days` : 'Current'
    },
    { key: 'salesRep', header: 'Sales Rep' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row: any) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" title="View">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Edit">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Record Payment">
            <DollarSign className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Contact Customer">
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Accounts Receivable Management</h2>
        <div className="flex space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Aging Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Receivables</div>
          <div className="text-2xl font-bold">$3.2M</div>
          <div className="text-sm text-blue-600">127 invoices</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Overdue Amount</div>
          <div className="text-2xl font-bold">$245K</div>
          <div className="text-sm text-red-600">18 invoices</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Collection Rate</div>
          <div className="text-2xl font-bold">94.2%</div>
          <div className="text-sm text-green-600">Last 30 days</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Avg Collection Days</div>
          <div className="text-2xl font-bold">32</div>
          <div className="text-sm text-orange-600">Industry avg: 35</div>
        </Card>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={customers} />
      </Card>
    </div>
  );
};

export default AccountsReceivableManagement;
