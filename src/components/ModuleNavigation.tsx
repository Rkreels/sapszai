
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useVoiceAssistantContext } from '../context/VoiceAssistantContext';

interface ModuleNavigationProps {
  module: string;
}

const ModuleNavigation: React.FC<ModuleNavigationProps> = ({ module }) => {
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const location = useLocation();

  const moduleMenus = {
    finance: [
      { name: 'Overview', path: '/finance' },
      { name: 'General Ledger', path: '/finance/general-ledger' },
      { name: 'Accounts Payable', path: '/finance/accounts-payable' },
      { name: 'Accounts Receivable', path: '/finance/accounts-receivable' },
      { name: 'Cash Management', path: '/finance/cash-management' },
      { name: 'Bank Accounts', path: '/finance/bank-accounts' },
      { name: 'Asset Accounting', path: '/finance/asset-accounting' },
      { name: 'Cost Center Accounting', path: '/finance/cost-center' },
      { name: 'Profit Center Accounting', path: '/finance/profit-center-accounting' },
      { name: 'Financial Planning', path: '/finance/financial-planning' },
      { name: 'Treasury', path: '/finance/treasury' },
      { name: 'Credit Management', path: '/finance/credit-management' },
      { name: 'Financial Reports', path: '/finance/financial-reports' },
    ],
    sales: [
      { name: 'Overview', path: '/sales' },
      { name: 'Customer Management', path: '/sales/customers' },
      { name: 'Sales Orders', path: '/sales/orders' },
      { name: 'Quotations', path: '/sales/quotations' },
      { name: 'Contracts', path: '/sales/contracts' },
      { name: 'Pricing', path: '/sales/pricing' },
      { name: 'Product Catalog', path: '/sales/products' },
      { name: 'Billing', path: '/sales/billing' },
      { name: 'Credit Management', path: '/sales/credit-management' },
      { name: 'Returns', path: '/sales/returns' },
      { name: 'Commission', path: '/sales/commission' },
      { name: 'Territory Management', path: '/sales/territory' },
      { name: 'Analytics', path: '/sales/analytics' },
    ],
    procurement: [
      { name: 'Overview', path: '/procurement' },
      { name: 'Purchase Requisitions', path: '/procurement/requisitions' },
      { name: 'Purchase Orders', path: '/procurement/purchase-orders' },
      { name: 'Supplier Management', path: '/procurement/suppliers' },
      { name: 'Source List', path: '/procurement/source-list' },
      { name: 'RFQ Management', path: '/procurement/rfq' },
      { name: 'Invoice Verification', path: '/procurement/invoice-verification' },
      { name: 'Catalog Management', path: '/procurement/catalog' },
      { name: 'Spend Analysis', path: '/procurement/spend-analysis' },
      { name: 'Supplier Performance', path: '/procurement/supplier-performance' },
      { name: 'Contract Management', path: '/procurement/contract-management' },
    ],
    manufacturing: [
      { name: 'Overview', path: '/manufacturing' },
      { name: 'Production Planning', path: '/manufacturing/production-planning' },
      { name: 'Production Scheduling', path: '/manufacturing/production-scheduling' },
      { name: 'Production Orders', path: '/manufacturing/production' },
      { name: 'Material Requirements', path: '/manufacturing/material-requirements' },
      { name: 'Capacity Planning', path: '/manufacturing/capacity-planning' },
      { name: 'Work Centers', path: '/manufacturing/work-centers' },
      { name: 'BOMs', path: '/manufacturing/boms' },
      { name: 'Routings', path: '/manufacturing/routings' },
      { name: 'Quality Management', path: '/manufacturing/quality' },
      { name: 'Maintenance', path: '/manufacturing/maintenance' },
      { name: 'Warehouse', path: '/manufacturing/warehouse' },
      { name: 'Cost Analysis', path: '/manufacturing/cost-analysis' },
      { name: 'Performance Analytics', path: '/manufacturing/performance-analytics' },
      { name: 'Production Reports', path: '/manufacturing/production-reports' },
      { name: 'Quality Analysis', path: '/manufacturing/quality-analysis' },
      { name: 'KPIs', path: '/manufacturing/kpis' },
      { name: 'Service', path: '/manufacturing/service' },
    ],
    'supply-chain': [
      { name: 'Overview', path: '/supply-chain' },
      { name: 'Inventory Management', path: '/supply-chain/inventory' },
      { name: 'Warehouse Management', path: '/supply-chain/warehouse' },
      { name: 'Transportation', path: '/supply-chain/transportation' },
      { name: 'Inbound Deliveries', path: '/supply-chain/inbound-deliveries' },
      { name: 'Outbound Deliveries', path: '/supply-chain/outbound-deliveries' },
      { name: 'Stock Transfers', path: '/supply-chain/stock-transfers' },
      { name: 'Physical Inventory', path: '/supply-chain/physical-inventory' },
      { name: 'Demand Planning', path: '/supply-chain/demand-planning' },
      { name: 'Supply Planning', path: '/supply-chain/supply-planning' },
      { name: 'Distribution Planning', path: '/supply-chain/distribution-planning' },
      { name: 'Vendor Managed Inventory', path: '/supply-chain/vmi' },
    ],
    'project-management': [
      { name: 'Overview', path: '/project-management' },
      { name: 'Project Planning', path: '/project-management/planning' },
      { name: 'Project Execution', path: '/project-management/execution' },
      { name: 'Resource Management', path: '/project-management/resources' },
      { name: 'Time Recording', path: '/project-management/time-recording' },
      { name: 'Cost Management', path: '/project-management/cost-management' },
      { name: 'Risk Management', path: '/project-management/risk-management' },
      { name: 'Document Management', path: '/project-management/documents' },
      { name: 'Portfolio Management', path: '/project-management/portfolio' },
      { name: 'Collaboration', path: '/project-management/collaboration' },
      { name: 'Project Analytics', path: '/project-management/analytics' },
    ],
    'human-resources': [
      { name: 'Overview', path: '/human-resources' },
      { name: 'Employee Central', path: '/human-resources/employee-central' },
      { name: 'Time Management', path: '/human-resources/time-management' },
      { name: 'Payroll', path: '/human-resources/payroll' },
      { name: 'Talent Management', path: '/human-resources/talent-management' },
      { name: 'Learning Management', path: '/human-resources/learning' },
      { name: 'Performance Management', path: '/human-resources/performance' },
      { name: 'Succession Planning', path: '/human-resources/succession' },
      { name: 'Recruitment', path: '/human-resources/recruitment' },
      { name: 'Compensation Management', path: '/human-resources/compensation' },
      { name: 'Benefits Administration', path: '/human-resources/benefits' },
    ],
    'master-data': [
      { name: 'Overview', path: '/master-data' },
      { name: 'Material Master', path: '/master-data/material' },
      { name: 'Customer Master', path: '/master-data/customer' },
      { name: 'Vendor Master', path: '/master-data/vendor' },
      { name: 'Asset Master', path: '/master-data/asset' },
      { name: 'Cost Center', path: '/master-data/cost-center' },
      { name: 'Profit Center', path: '/master-data/profit-center' },
      { name: 'Chart of Accounts', path: '/master-data/chart-accounts' },
      { name: 'Business Partner', path: '/master-data/business-partner' },
      { name: 'Bank Master', path: '/master-data/bank' },
      { name: 'Plant Master', path: '/master-data/plant' },
    ],
    'business-intelligence': [
      { name: 'Overview', path: '/business-intelligence' },
      { name: 'Executive Dashboard', path: '/business-intelligence/executive' },
      { name: 'Financial Analytics', path: '/business-intelligence/financial' },
      { name: 'Sales Analytics', path: '/business-intelligence/sales' },
      { name: 'Procurement Analytics', path: '/business-intelligence/procurement' },
      { name: 'Manufacturing Analytics', path: '/business-intelligence/manufacturing' },
      { name: 'HR Analytics', path: '/business-intelligence/hr' },
      { name: 'Predictive Analytics', path: '/business-intelligence/predictive' },
      { name: 'Real-time Analytics', path: '/business-intelligence/realtime' },
      { name: 'Data Visualization', path: '/business-intelligence/visualization' },
      { name: 'Report Builder', path: '/business-intelligence/report-builder' },
    ],
  };

  const currentModule = module.toLowerCase().replace(/\s+/g, '-');
  const menuItems = moduleMenus[currentModule as keyof typeof moduleMenus] || [];

  const handleItemClick = (itemName: string) => {
    if (isEnabled) {
      speak(`Navigating to ${itemName} in ${module} module. This section provides comprehensive tools for ${itemName.toLowerCase()} management and operations.`);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (menuItems.length === 0) return null;

  return (
    <nav className="bg-gray-50 border-b border-gray-200 w-full">
      <div className="px-4 overflow-x-auto">
        <div className="flex items-center h-10 space-x-6 min-w-max">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm whitespace-nowrap py-2 px-1 border-b-2 transition-colors ${
                isActive(item.path)
                  ? 'border-sap-blue text-sap-blue font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
              onClick={() => handleItemClick(item.name)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default ModuleNavigation;
