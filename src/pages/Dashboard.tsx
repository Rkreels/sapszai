
import React from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, CreditCard, TrendingUp, Package, Truck, Users, 
  ClipboardList, Factory, ShoppingCart, Globe, FileText, Settings
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">SAP S/4HANA Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: May 21, 2025, 10:30 AM
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200 p-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Revenue</span>
            </div>
            <span className="text-2xl font-bold">€2.45M</span>
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+12.5%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>
        </Card>
        
        <Card className="bg-green-50 border-green-200 p-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Orders</span>
            </div>
            <span className="text-2xl font-bold">342</span>
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+5.2%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200 p-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Deliveries</span>
            </div>
            <span className="text-2xl font-bold">287</span>
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+3.8%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200 p-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">Customers</span>
            </div>
            <span className="text-2xl font-bold">824</span>
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+2.1%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>
        </Card>
      </div>
      
      <Separator className="my-6" />
      
      <h2 className="text-xl font-semibold mb-4">Core Modules</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="p-6 cursor-pointer transform transition-all hover:shadow-md"
          onClick={() => handleNavigate('/finance')}
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-medium">Finance</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Manage financial operations, accounting, reporting, and cash management
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>General Ledger</span>
            </div>
            <div className="flex items-center space-x-1">
              <CreditCard className="h-3 w-3" />
              <span>Accounts Receivable</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>Accounts Payable</span>
            </div>
            <div className="flex items-center space-x-1">
              <BarChart3 className="h-3 w-3" />
              <span>Financial Reporting</span>
            </div>
          </div>
        </Card>
        
        <Card 
          className="p-6 cursor-pointer transform transition-all hover:shadow-md"
          onClick={() => handleNavigate('/manufacturing')}
        >
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Factory className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-lg font-medium">Manufacturing</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Oversee production, quality control, and manufacturing operations
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-1">
              <ClipboardList className="h-3 w-3" />
              <span>Production Planning</span>
            </div>
            <div className="flex items-center space-x-1">
              <Settings className="h-3 w-3" />
              <span>Quality Management</span>
            </div>
            <div className="flex items-center space-x-1">
              <Package className="h-3 w-3" />
              <span>Materials Management</span>
            </div>
            <div className="flex items-center space-x-1">
              <BarChart3 className="h-3 w-3" />
              <span>Cost Analysis</span>
            </div>
          </div>
        </Card>
        
        <Card 
          className="p-6 cursor-pointer transform transition-all hover:shadow-md"
          onClick={() => handleNavigate('/supply-chain')}
        >
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <Truck className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-lg font-medium">Supply Chain</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Handle procurement, inventory, and logistics operations
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>Purchase Orders</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>Supplier Management</span>
            </div>
            <div className="flex items-center space-x-1">
              <Package className="h-3 w-3" />
              <span>Inventory Management</span>
            </div>
            <div className="flex items-center space-x-1">
              <Truck className="h-3 w-3" />
              <span>Transportation</span>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="p-6 cursor-pointer transform transition-all hover:shadow-md"
          onClick={() => handleNavigate('/sales')}
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-medium">Sales</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Manage sales orders, customer relationships, and billing
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>Sales Orders</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>Customer Management</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>Invoices</span>
            </div>
            <div className="flex items-center space-x-1">
              <BarChart3 className="h-3 w-3" />
              <span>Sales Analytics</span>
            </div>
          </div>
        </Card>
        
        <Card 
          className="p-6 cursor-pointer transform transition-all hover:shadow-md"
          onClick={() => handleNavigate('/project-management')}
        >
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <ClipboardList className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-lg font-medium">Project Management</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Plan, execute, and monitor projects effectively
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-1">
              <ClipboardList className="h-3 w-3" />
              <span>Project Overview</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>Resource Planning</span>
            </div>
            <div className="flex items-center space-x-1">
              <Package className="h-3 w-3" />
              <span>Task Management</span>
            </div>
            <div className="flex items-center space-x-1">
              <BarChart3 className="h-3 w-3" />
              <span>Project Analytics</span>
            </div>
          </div>
        </Card>
        
        <Card 
          className="p-6 cursor-pointer transform transition-all hover:shadow-md"
          onClick={() => handleNavigate('/procurement')}
        >
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-lg font-medium">Procurement</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Manage purchasing, supplier relationships, and sourcing activities
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>Purchase Orders</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>Requisitions</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>Supplier Evaluation</span>
            </div>
            <div className="flex items-center space-x-1">
              <BarChart3 className="h-3 w-3" />
              <span>Spend Analysis</span>
            </div>
          </div>
        </Card>
      </div>
      
      <Separator className="my-6" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <ul className="space-y-3">
            <li className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">New sales order created</p>
                  <p className="text-xs text-gray-500">Order SO-10293 for Acme Corp.</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">1 hour ago</span>
            </li>
            <li className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Package className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Purchase order approved</p>
                  <p className="text-xs text-gray-500">Order 4500012767 for €243,725.00</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">3 hours ago</span>
            </li>
            <li className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <Truck className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Delivery completed</p>
                  <p className="text-xs text-gray-500">Delivery #DL-54321 to XYZ Industries</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">5 hours ago</span>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                  <FileText className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Invoice paid</p>
                  <p className="text-xs text-gray-500">Invoice INV-5823 for €12,350.00</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">Yesterday</span>
            </li>
          </ul>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">System Alerts</h2>
          <ul className="space-y-3">
            <li className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <Package className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Low Inventory Alert</p>
                  <p className="text-xs text-gray-500">5 items below reorder level</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">High Priority</span>
            </li>
            <li className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Payment Due</p>
                  <p className="text-xs text-gray-500">3 invoices require payment</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">Medium Priority</span>
            </li>
            <li className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <ClipboardList className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Purchase Orders Pending Approval</p>
                  <p className="text-xs text-gray-500">7 POs awaiting your review</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">Medium Priority</span>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Globe className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">System Update Available</p>
                  <p className="text-xs text-gray-500">Version 1.23.4 ready to install</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">Low Priority</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
