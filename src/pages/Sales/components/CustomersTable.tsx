
import React from 'react';
import { Button } from '../../../components/ui/button';
import FilterBar from '../../../components/filters/FilterBar';
import { Skeleton } from '../../../components/ui/skeleton';
import DataTable from '../../../components/data/DataTable';
import { useToast } from '../../../hooks/use-toast';

// Sample data
const customerData = [
  { id: "C-001", name: "Acme Corp", industry: "Manufacturing", revenue: "€1.2M", orders: 24, status: "Active" },
  { id: "C-002", name: "XYZ Industries", industry: "Technology", revenue: "€2.4M", orders: 18, status: "Active" },
  { id: "C-003", name: "Global Tech", industry: "Technology", revenue: "€3.7M", orders: 32, status: "Active" },
  { id: "C-004", name: "Mega Enterprises", industry: "Retail", revenue: "€850K", orders: 15, status: "Inactive" },
  { id: "C-005", name: "Bright Solutions", industry: "Services", revenue: "€1.8M", orders: 27, status: "Active" },
];

interface CustomersTableProps {
  isLoading: boolean;
}

const CustomersTable: React.FC<CustomersTableProps> = ({ isLoading }) => {
  const { toast } = useToast();
  
  // Handle search
  const handleSearch = (value: string) => {
    if (value.trim()) {
      toast({
        description: `Searching for: ${value}`,
      });
    }
  };
  
  // Customer columns configuration
  const customerColumns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "industry", header: "Industry" },
    { key: "revenue", header: "Annual Revenue" },
    { key: "orders", header: "Orders" },
    { 
      key: "status", 
      header: "Status",
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    }
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <FilterBar 
          filters={['All', 'Active', 'Inactive']}
          activeFilter={'All'}
          onFilterChange={(filter) => toast({ description: `Filter applied: ${filter}` })}
          onSearch={handleSearch}
        />
        <Button className="bg-blue-600 hover:bg-blue-700">
          Add Customer
        </Button>
      </div>
      
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <DataTable 
          columns={customerColumns}
          data={customerData}
          className="border rounded-md"
        />
      )}
      
      <div className="mt-4 text-xs text-gray-500 flex justify-between items-center">
        <span>Showing {customerData.length} customers</span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-6 text-xs">Previous</Button>
          <Button variant="outline" size="sm" className="h-6 text-xs bg-blue-50 text-blue-700">1</Button>
          <Button variant="outline" size="sm" className="h-6 text-xs">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default CustomersTable;
