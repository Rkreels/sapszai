
import React from 'react';
import { Button } from '../../../components/ui/button';
import DataTable from '../../../components/data/DataTable';
import { Search, Filter, Download, Plus } from 'lucide-react';

interface DataTableRow {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  header: string;
  render?: (value: string | number, row?: DataTableRow) => React.ReactNode;
}

const ProductionOrders = () => {
  // Sample production orders data
  const productionOrders = [
    { 
      order: '1000432', 
      material: 'Widget A', 
      quantity: 500, 
      unit: 'EA',
      startDate: '05/15/2025',
      endDate: '05/20/2025',
      status: 'In Process',
      completionPercent: 65
    },
    { 
      order: '1000433', 
      material: 'Widget B', 
      quantity: 350, 
      unit: 'EA',
      startDate: '05/16/2025',
      endDate: '05/19/2025',
      status: 'Released',
      completionPercent: 30
    },
    { 
      order: '1000434', 
      material: 'Assembly C', 
      quantity: 200, 
      unit: 'EA',
      startDate: '05/22/2025',
      endDate: '05/26/2025',
      status: 'Planned',
      completionPercent: 0
    },
    { 
      order: '1000435', 
      material: 'Widget D', 
      quantity: 1000, 
      unit: 'EA',
      startDate: '05/14/2025',
      endDate: '05/18/2025',
      status: 'Completed',
      completionPercent: 100
    }
  ];

  // Column definitions for the production orders table
  const columns = [
    { key: 'order', header: 'Order' },
    { key: 'material', header: 'Material' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'unit', header: 'Unit' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'endDate', header: 'End Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        let color = 'bg-gray-100 text-gray-800';
        
        if (value === 'In Process') color = 'bg-blue-100 text-blue-800';
        if (value === 'Released') color = 'bg-yellow-100 text-yellow-800';
        if (value === 'Planned') color = 'bg-purple-100 text-purple-800';
        if (value === 'Completed') color = 'bg-green-100 text-green-800';
        
        return (
          <span className={`px-2 py-1 ${color} rounded-full text-xs`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'completionPercent',
      header: 'Progress',
      render: (value: number) => (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${value}%` }}
          ></div>
        </div>
      )
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row: any) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">View</Button>
          <Button variant="outline" size="sm">Edit</Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="pl-10 py-2 pr-4 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="default" size="sm" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>
      
      <DataTable columns={columns} data={productionOrders} className="w-full" />
    </div>
  );
};

export default ProductionOrders;
