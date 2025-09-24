
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../../components/data/EnhancedDataTable';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';

interface Material {
  id: string;
  materialCode: string;
  description: string;
  category: string;
  unitPrice: number;
  currency: string;
  leadTime: number;
  status: 'Active' | 'Inactive';
  lastUpdated: string;
}

const SupplierMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: 'mat-001',
      materialCode: 'LAPTOP-DEL-001',
      description: 'Dell Latitude 7420 Laptop',
      category: 'IT Equipment',
      unitPrice: 1250,
      currency: 'USD',
      leadTime: 7,
      status: 'Active',
      lastUpdated: '2025-01-20'
    },
    {
      id: 'mat-002',
      materialCode: 'MONITOR-DEL-002',
      description: 'Dell UltraSharp 24" Monitor',
      category: 'IT Equipment',
      unitPrice: 320,
      currency: 'USD',
      leadTime: 5,
      status: 'Active',
      lastUpdated: '2025-01-18'
    }
  ]);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const columns: EnhancedColumn[] = [
    { key: 'materialCode', header: 'Material Code', sortable: true, searchable: true },
    { key: 'description', header: 'Description', searchable: true },
    { key: 'category', header: 'Category', filterable: true, filterOptions: [
      { label: 'IT Equipment', value: 'IT Equipment' },
      { label: 'Office Supplies', value: 'Office Supplies' }
    ]},
    { 
      key: 'unitPrice', 
      header: 'Unit Price',
      sortable: true,
      render: (value: number, row: Material) => `${row.currency} ${value.toLocaleString()}`
    },
    { 
      key: 'leadTime', 
      header: 'Lead Time',
      sortable: true,
      render: (value: number) => `${value} days`
    },
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    }
  ];

  const actions: TableAction[] = [
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: Material) => {
        toast({
          title: 'Edit Material',
          description: `Opening edit form for ${row.materialCode}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row: Material) => {
        setMaterials(prev => prev.filter(m => m.id !== row.id));
        toast({
          title: 'Material Deleted',
          description: `${row.materialCode} has been removed`,
        });
      },
      variant: 'destructive'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Supplier Materials
          </span>
          <Button onClick={() => toast({ title: 'Add Material', description: 'Opening material creation form' })}>
            <Plus className="h-4 w-4 mr-2" />
            Add Material
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EnhancedDataTable 
          columns={columns}
          data={materials}
          actions={actions}
          searchPlaceholder="Search materials by code or description..."
          exportable={true}
          refreshable={true}
        />
      </CardContent>
    </Card>
  );
};

export default SupplierMaterials;
