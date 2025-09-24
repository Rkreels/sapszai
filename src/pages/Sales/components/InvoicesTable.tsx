
import React from 'react';
import { Button } from '../../../components/ui/button';
import { Printer } from 'lucide-react';
import FilterBar from '../../../components/filters/FilterBar';
import { Skeleton } from '../../../components/ui/skeleton';
import DataTable from '../../../components/data/DataTable';
import { useToast } from '../../../hooks/use-toast';

// Sample data
const invoiceData = [
  { id: "INV-5821", customer: "Acme Corp", amount: "€24,500", date: "2025-04-22", status: "Paid", dueDate: "2025-05-22" },
  { id: "INV-5820", customer: "XYZ Industries", amount: "€18,750", date: "2025-04-21", status: "Outstanding", dueDate: "2025-05-21" },
  { id: "INV-5819", customer: "Global Tech", amount: "€32,100", date: "2025-04-20", status: "Paid", dueDate: "2025-05-20" },
  { id: "INV-5818", customer: "Mega Enterprises", amount: "€15,800", date: "2025-04-19", status: "Overdue", dueDate: "2025-05-19" },
  { id: "INV-5817", customer: "Bright Solutions", amount: "€28,300", date: "2025-04-18", status: "Paid", dueDate: "2025-05-18" },
];

interface InvoicesTableProps {
  isLoading: boolean;
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({ isLoading }) => {
  const { toast } = useToast();
  
  // Handle search
  const handleSearch = (value: string) => {
    if (value.trim()) {
      toast({
        description: `Searching for: ${value}`,
      });
    }
  };
  
  // Invoice columns configuration
  const invoiceColumns = [
    { key: "id", header: "Invoice #" },
    { key: "customer", header: "Customer" },
    { key: "amount", header: "Amount" },
    { key: "date", header: "Issue Date" },
    { key: "dueDate", header: "Due Date" },
    { 
      key: "status", 
      header: "Status",
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'Paid' ? 'bg-green-100 text-green-800' :
          value === 'Outstanding' ? 'bg-blue-100 text-blue-800' :
          'bg-red-100 text-red-800'
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
          filters={['All', 'Paid', 'Outstanding', 'Overdue']}
          activeFilter={'All'}
          onFilterChange={(filter) => toast({ description: `Filter applied: ${filter}` })}
          onSearch={handleSearch}
        />
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Create Invoice
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <DataTable 
          columns={invoiceColumns}
          data={invoiceData}
          className="border rounded-md"
        />
      )}
      
      <div className="mt-4 text-xs text-gray-500 flex justify-between items-center">
        <span>Showing {invoiceData.length} invoices</span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-6 text-xs">Previous</Button>
          <Button variant="outline" size="sm" className="h-6 text-xs bg-blue-50 text-blue-700">1</Button>
          <Button variant="outline" size="sm" className="h-6 text-xs">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default InvoicesTable;
