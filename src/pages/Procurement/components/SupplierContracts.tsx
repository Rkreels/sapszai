
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../../components/data/EnhancedDataTable';
import { Plus, Eye, Edit, FileText, Calendar } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';

interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired' | 'Pending';
  value: number;
  currency: string;
}

const SupplierContracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: 'ct-001',
      contractNumber: 'CT-DELL-2025-001',
      title: 'IT Equipment Supply Agreement',
      type: 'Supply',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      status: 'Active',
      value: 500000,
      currency: 'USD'
    },
    {
      id: 'ct-002',
      contractNumber: 'CT-DELL-2024-089',
      title: 'Maintenance Service Agreement',
      type: 'Service',
      startDate: '2024-06-01',
      endDate: '2025-05-31',
      status: 'Active',
      value: 120000,
      currency: 'USD'
    }
  ]);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Expired': 'bg-red-100 text-red-800',
      'Pending': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: EnhancedColumn[] = [
    { key: 'contractNumber', header: 'Contract #', sortable: true, searchable: true },
    { key: 'title', header: 'Title', searchable: true },
    { key: 'type', header: 'Type', filterable: true, filterOptions: [
      { label: 'Supply', value: 'Supply' },
      { label: 'Service', value: 'Service' }
    ]},
    { key: 'startDate', header: 'Start Date', sortable: true },
    { key: 'endDate', header: 'End Date', sortable: true },
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Active', value: 'Active' },
        { label: 'Expired', value: 'Expired' },
        { label: 'Pending', value: 'Pending' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'value', 
      header: 'Value',
      sortable: true,
      render: (value: number, row: Contract) => `${row.currency} ${value.toLocaleString()}`
    }
  ];

  const actions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: Contract) => {
        toast({
          title: 'View Contract',
          description: `Opening contract ${row.contractNumber}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: Contract) => {
        toast({
          title: 'Edit Contract',
          description: `Editing contract ${row.contractNumber}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Renew',
      icon: <Calendar className="h-4 w-4" />,
      onClick: (row: Contract) => {
        toast({
          title: 'Renew Contract',
          description: `Starting renewal process for ${row.contractNumber}`,
        });
      },
      variant: 'outline',
      condition: (row: Contract) => row.status === 'Active'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Active Contracts
          </span>
          <Button onClick={() => toast({ title: 'Create Contract', description: 'Opening contract creation form' })}>
            <Plus className="h-4 w-4 mr-2" />
            New Contract
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EnhancedDataTable 
          columns={columns}
          data={contracts}
          actions={actions}
          searchPlaceholder="Search contracts by number or title..."
          exportable={true}
          refreshable={true}
        />
      </CardContent>
    </Card>
  );
};

export default SupplierContracts;
