import React from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Download, Filter, Calendar, BarChart2, FileText } from 'lucide-react';
import DataTable from '../../../components/data/DataTable';

const FinanceReports: React.FC = () => {
  // Sample data for the table
  const reports = [
    { 
      id: 'FIN-2025-042', 
      name: 'Monthly Financial Statement', 
      type: 'Financial Statement', 
      date: 'May 15, 2025', 
      status: 'Completed',
      format: 'Excel, PDF'
    },
    { 
      id: 'FIN-2025-041', 
      name: 'Q1 2025 Balance Sheet', 
      type: 'Balance Sheet', 
      date: 'Apr 10, 2025', 
      status: 'Completed',
      format: 'PDF'
    },
    { 
      id: 'FIN-2025-040', 
      name: 'Cash Flow Analysis', 
      type: 'Cash Flow', 
      date: 'Apr 5, 2025', 
      status: 'Completed',
      format: 'Excel, PDF'
    },
    { 
      id: 'FIN-2025-039', 
      name: 'Revenue by Business Segment', 
      type: 'Revenue Analysis', 
      date: 'Apr 1, 2025', 
      status: 'Completed',
      format: 'Excel, PDF, PowerPoint'
    },
  ];

  // Column definitions for the table
  const columns = [
    { key: 'id', header: 'Report ID' },
    { key: 'name', header: 'Report Name' },
    { key: 'type', header: 'Type' },
    { key: 'date', header: 'Generated On' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
          {value}
        </span>
      )
    },
    { key: 'format', header: 'Format' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row: Record<string, unknown>) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">View</Button>
          <Button variant="outline" size="sm">Download</Button>
        </div>
      )
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Financial Reports</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Change Period
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="default" size="sm" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Report Distribution</h3>
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <div className="text-center">
              <BarChart2 className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Report distribution chart will be displayed here</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Reports By Type</h3>
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <div className="text-center">
              <BarChart2 className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Reports by type chart will be displayed here</p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium mb-4">Recent Reports</h3>
      <DataTable columns={columns} data={reports} className="w-full" />
    </Card>
  );
};

export default FinanceReports;
