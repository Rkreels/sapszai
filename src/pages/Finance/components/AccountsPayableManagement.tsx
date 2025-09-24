
import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import DataTable from '../../../components/data/DataTable';
import { Plus, Edit, Trash2, Eye, FileText, DollarSign } from 'lucide-react';

interface DataTableRow {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  header: string;
  render?: (value: string | number, row?: DataTableRow) => React.ReactNode;
}

const AccountsPayableManagement: React.FC = () => {
  const [vendors, setVendors] = useState([
    {
      vendorId: 'V001',
      vendorName: 'Tech Supplies Inc.',
      invoiceNumber: 'INV-2025-001',
      amount: 15000,
      dueDate: '2025-02-15',
      status: 'Pending',
      paymentTerms: 'Net 30',
      currency: 'USD'
    },
    {
      vendorId: 'V002',
      vendorName: 'Office Equipment Co.',
      invoiceNumber: 'INV-2025-002',
      amount: 8500,
      dueDate: '2025-02-20',
      status: 'Approved',
      paymentTerms: 'Net 15',
      currency: 'USD'
    },
    {
      vendorId: 'V003',
      vendorName: 'Global Services Ltd.',
      invoiceNumber: 'INV-2025-003',
      amount: 22000,
      dueDate: '2025-01-30',
      status: 'Overdue',
      paymentTerms: 'Net 30',
      currency: 'EUR'
    }
  ]);

  const columns = [
    { key: 'vendorId', header: 'Vendor ID' },
    { key: 'vendorName', header: 'Vendor Name' },
    { key: 'invoiceNumber', header: 'Invoice Number' },
    { 
      key: 'amount', 
      header: 'Amount',
      render: (value: number, row: any) => `${row.currency} ${value.toLocaleString()}`
    },
    { key: 'dueDate', header: 'Due Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Pending': 'bg-yellow-100 text-yellow-800',
          'Approved': 'bg-green-100 text-green-800',
          'Overdue': 'bg-red-100 text-red-800',
          'Paid': 'bg-blue-100 text-blue-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${colors[value as keyof typeof colors]}`}>
            {value}
          </span>
        );
      }
    },
    { key: 'paymentTerms', header: 'Payment Terms' },
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
          <Button variant="ghost" size="sm" title="Process Payment">
            <DollarSign className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Generate Report">
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Accounts Payable Management</h2>
        <div className="flex space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Payment Run
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Outstanding</div>
          <div className="text-2xl font-bold">$2.1M</div>
          <div className="text-sm text-red-600">45 invoices</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Overdue Amount</div>
          <div className="text-2xl font-bold">$158K</div>
          <div className="text-sm text-red-600">8 invoices</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Due This Week</div>
          <div className="text-2xl font-bold">$385K</div>
          <div className="text-sm text-orange-600">12 invoices</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Avg Payment Days</div>
          <div className="text-2xl font-bold">28</div>
          <div className="text-sm text-green-600">Within terms</div>
        </Card>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={vendors} />
      </Card>
    </div>
  );
};

export default AccountsPayableManagement;
