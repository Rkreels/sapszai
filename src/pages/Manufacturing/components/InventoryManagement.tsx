import React from 'react';
import { Box, Package, TrendingUp, BarChart2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import DataTable from '../../../components/data/DataTable';

interface DataTableRow {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  header: string;
  render?: (value: string | number, row?: DataTableRow) => React.ReactNode;
}

const InventoryManagement = () => {
  // Sample inventory data
  const inventoryData = [
    { 
      material: '1000234', 
      description: 'Widget A', 
      stockQuantity: 2450, 
      unit: 'EA',
      warehouse: 'WH-001',
      location: 'A-01-02',
      reorderPoint: 500,
      status: 'In Stock'
    },
    { 
      material: '1000235', 
      description: 'Widget B', 
      stockQuantity: 180, 
      unit: 'EA',
      warehouse: 'WH-001',
      location: 'A-02-03',
      reorderPoint: 200,
      status: 'Low Stock'
    },
    { 
      material: '1000236', 
      description: 'Component C', 
      stockQuantity: 5200, 
      unit: 'EA',
      warehouse: 'WH-002',
      location: 'B-03-01',
      reorderPoint: 1000,
      status: 'In Stock'
    },
    { 
      material: '1000237', 
      description: 'Raw Material D', 
      stockQuantity: 850, 
      unit: 'KG',
      warehouse: 'WH-003',
      location: 'C-01-04',
      reorderPoint: 400,
      status: 'In Stock'
    }
  ];

  // Column definitions for the inventory table
  const columns = [
    { key: 'material', header: 'Material' },
    { key: 'description', header: 'Description' },
    { key: 'stockQuantity', header: 'Quantity' },
    { key: 'unit', header: 'Unit' },
    { key: 'warehouse', header: 'Warehouse' },
    { key: 'location', header: 'Storage Location' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const color = value === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
        return (
          <span className={`px-2 py-1 ${color} rounded-full text-xs`}>
            {value}
          </span>
        );
      }
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row: any) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">View</Button>
          <Button variant="outline" size="sm">Transfer</Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center mb-2">
            <Box className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium">Material Master</h3>
          </div>
          <p className="text-xs text-gray-500">View and manage material data</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center mb-2">
            <Package className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium">Stock Overview</h3>
          </div>
          <p className="text-xs text-gray-500">Check inventory levels across warehouses</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium">Stock Movements</h3>
          </div>
          <p className="text-xs text-gray-500">Track and process inventory transactions</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center mb-2">
            <BarChart2 className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium">Inventory Reports</h3>
          </div>
          <p className="text-xs text-gray-500">Access inventory analytics and reports</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Inventory Items</h3>
        <DataTable columns={columns} data={inventoryData} className="w-full" />
      </div>
    </div>
  );
};

export default InventoryManagement;
