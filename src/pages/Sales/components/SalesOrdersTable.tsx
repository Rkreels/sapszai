
import React from 'react';
import { Button } from '../../../components/ui/button';
import { Eye, FileText } from 'lucide-react';
import FilterBar from '../../../components/filters/FilterBar';
import { Skeleton } from '../../../components/ui/skeleton';
import DataTable from '../../../components/data/DataTable';
import { useToast } from '../../../hooks/use-toast';

// Sample data
const recentSalesOrders = [
  { id: "SO-10293", customer: "Acme Corp", value: "€24,500", status: "Processing", date: "2025-04-22" },
  { id: "SO-10292", customer: "XYZ Industries", value: "€18,750", status: "Delivered", date: "2025-04-21" },
  { id: "SO-10291", customer: "Global Tech", value: "€32,100", status: "Processing", date: "2025-04-20" },
  { id: "SO-10290", customer: "Mega Enterprises", value: "€15,800", status: "Awaiting Payment", date: "2025-04-19" },
  { id: "SO-10289", customer: "Bright Solutions", value: "€28,300", status: "Delivered", date: "2025-04-18" },
  { id: "SO-10288", customer: "TechForward", value: "€42,700", status: "Processing", date: "2025-04-17" },
  { id: "SO-10287", customer: "Elite Corp", value: "€19,250", status: "Delivered", date: "2025-04-16" },
];

interface SalesOrdersTableProps {
  isLoading: boolean;
  salesFilter: string;
  setSalesFilter: (filter: string) => void;
}

const SalesOrdersTable: React.FC<SalesOrdersTableProps> = ({ isLoading, salesFilter, setSalesFilter }) => {
  const { toast } = useToast();

  // Handle creating a new sales order
  const handleCreateSalesOrder = () => {
    toast({
      title: "Creating new sales order",
      description: "The sales order creation form has been opened.",
    });
  };
  
  // Handle viewing order details
  const handleViewOrderDetails = (orderId: string) => {
    toast({
      title: "Opening order details",
      description: `Viewing details for order ${orderId}`,
    });
  };
  
  // Handle filter changes
  const handleFilterChange = (filter: string) => {
    setSalesFilter(filter);
    toast({
      description: `Filter applied: ${filter}`,
    });
  };
  
  // Handle search
  const handleSearch = (value: string) => {
    if (value.trim()) {
      toast({
        description: `Searching for: ${value}`,
      });
    }
  };
  
  // Order columns configuration for DataTable
  const orderColumns = [
    { key: "id", header: "Order ID" },
    { 
      key: "customer", 
      header: "Customer",
      render: (value: string) => (
        <span className="text-blue-600 underline cursor-pointer">{value}</span>
      )
    },
    { key: "value", header: "Value" },
    { 
      key: "status", 
      header: "Status",
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'Delivered' ? 'bg-green-100 text-green-800' :
          value === 'Processing' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: "date", header: "Date" },
    { 
      key: "actions", 
      header: "Actions",
      render: (_, row: Record<string, unknown>) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => handleViewOrderDetails(row.id as string)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0"
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <FilterBar 
          filters={['All', 'Processing', 'Delivered', 'Awaiting Payment']}
          activeFilter={salesFilter}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          showSort={true}
        />
        <Button 
          onClick={handleCreateSalesOrder}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create Sales Order
        </Button>
      </div>
      
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <DataTable 
          columns={orderColumns}
          data={recentSalesOrders.filter(order => salesFilter === 'All' || order.status === salesFilter)}
          className="border rounded-md"
        />
      )}
      
      <div className="mt-4 text-xs text-gray-500 flex justify-between items-center">
        <span>Showing {recentSalesOrders.filter(order => salesFilter === 'All' || order.status === salesFilter).length} orders</span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-6 text-xs">Previous</Button>
          <Button variant="outline" size="sm" className="h-6 text-xs bg-blue-50 text-blue-700">1</Button>
          <Button variant="outline" size="sm" className="h-6 text-xs">2</Button>
          <Button variant="outline" size="sm" className="h-6 text-xs">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default SalesOrdersTable;
