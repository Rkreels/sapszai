
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import SAPSection from '../components/SAPSection';
import SAPTile from '../components/SAPTile';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useVoiceAssistantContext } from '../context/VoiceAssistantContext';
import PageHeader from '../components/page/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  BarChart2, 
  DollarSign, 
  FileText, 
  ArrowRight, 
  Wallet, 
  CreditCard, 
  Coins,
  Users,
  Package,
  Calculator,
  TrendingUp,
  Building2,
  Shield
} from 'lucide-react';
import { Card } from '../components/ui/card';
import FinancialKPIs from './Finance/components/FinancialKPIs';
import FinanceReports from './Finance/components/FinanceReports';

const Finance: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  
  useEffect(() => {
    if (isEnabled) {
      speak("Welcome to the Finance module. This area provides access to all financial management functions, including general ledger, accounts payable, accounts receivable, and financial reporting with real-time SAP S/4HANA Universal Journal integration.");
    }
  }, [isEnabled, speak]);

  const handleNavigation = (path: string) => {
    navigate(`/finance/${path}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <PageHeader 
        title="Financial Management"
        description="Comprehensive SAP S/4HANA Finance with Universal Journal, real-time reporting, and integrated planning"
        voiceIntroduction="Welcome to Financial Management with comprehensive SAP S/4HANA capabilities."
      />

      <FinancialKPIs />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="col-span-1 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">Financial Accounting</h2>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between" 
                    onClick={() => handleNavigation('general-ledger')}>
              <span>General Ledger</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleNavigation('accounts-payable')}>
              <span>Accounts Payable</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleNavigation('accounts-receivable')}>
              <span>Accounts Receivable</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleNavigation('fixed-assets')}>
              <span>Fixed Assets</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Card>

        <Card className="col-span-1 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Calculator className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold">Management Accounting</h2>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleNavigation('cost-accounting')}>
              <span>Cost Accounting</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleNavigation('budget-planning')}>
              <span>Budget Planning</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleNavigation('consolidation')}>
              <span>Consolidation</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Card>

        <Card className="col-span-1 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <Wallet className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold">Treasury & Risk</h2>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleNavigation('cash-management')}>
              <span>Cash Management</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleNavigation('tax-management')}>
              <span>Tax Management</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Card>

        <Card className="col-span-1 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-orange-100 p-3 rounded-lg mr-4">
              <BarChart2 className="h-6 w-6 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold">Reporting & Analytics</h2>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleNavigation('financial-reporting')}>
              <span>Financial Reporting</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="general-ledger" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general-ledger">General Ledger</TabsTrigger>
          <TabsTrigger value="accounts-payable">Accounts Payable</TabsTrigger>
          <TabsTrigger value="accounts-receivable">Accounts Receivable</TabsTrigger>
          <TabsTrigger value="asset-accounting">Asset Accounting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general-ledger">
          <section>
            <h2 className="text-xl font-semibold mb-4">General Ledger</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SAPTile 
                title="Balance Sheet/Income Statement" 
                isVoiceAssistantEnabled={isEnabled}
                description="This tile provides access to your company's balance sheet and income statement reports."
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                onClick={() => handleNavigation('balance-sheet')}
              />
              
              <SAPTile 
                title="Display Line Items in General Ledger" 
                isVoiceAssistantEnabled={isEnabled}
                description="This tile allows you to view detailed line items recorded in the general ledger."
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                onClick={() => handleNavigation('ledger-line-items')}
              />

              <SAPTile 
                title="Journal Entry Processing" 
                isVoiceAssistantEnabled={isEnabled}
                description="Create and process journal entries for financial transactions."
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                onClick={() => handleNavigation('journal-entry')}
              />

              <SAPTile 
                title="Chart of Accounts" 
                isVoiceAssistantEnabled={isEnabled}
                description="Manage your organization's chart of accounts structure."
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                onClick={() => handleNavigation('chart-of-accounts')}
              />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="accounts-payable">
          <section>
            <h2 className="text-xl font-semibold mb-4">Accounts Payable</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SAPTile 
                title="Manage Supplier Line Items" 
                isVoiceAssistantEnabled={isEnabled}
                description="This tile allows you to manage individual line items for supplier accounts."
                icon={<Users className="h-5 w-5 text-blue-600" />}
                onClick={() => handleNavigation('supplier-line-items')}
              />
              
              <SAPTile 
                title="Accounts Payable Overview" 
                isVoiceAssistantEnabled={isEnabled}
                description="This tile provides a comprehensive view of all accounts payable data."
                icon={<Wallet className="h-5 w-5 text-blue-600" />}
                onClick={() => handleNavigation('ap-overview')}
              />
              
              <SAPTile 
                title="Process Invoices" 
                isVoiceAssistantEnabled={isEnabled}
                description="Process incoming supplier invoices and credit memos."
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                onClick={() => handleNavigation('process-invoices')}
              />
              
              <SAPTile 
                title="Payment Run" 
                isVoiceAssistantEnabled={isEnabled}
                description="Create and execute payment runs for supplier invoices."
                icon={<CreditCard className="h-5 w-5 text-blue-600" />}
                onClick={() => handleNavigation('payment-run')}
              />

              <SAPTile 
                title="Overdue Payables" 
                subtitle="Today" 
                value="91.52M" 
                valueSuffix="EUR" 
                isVoiceAssistantEnabled={isEnabled}
                description="This tile shows the total value of overdue payments to suppliers."
                onClick={() => handleNavigation('overdue-payables')}
              >
                <div>
                  <div className="mb-4">
                    <div className="text-xs mb-1 flex justify-between">
                      <span>Critical Overdue</span>
                      <span className="font-medium">91.52M EUR</span>
                    </div>
                    <div className="text-xs flex justify-between">
                      <span>Uncritical Overdue</span>
                      <span className="font-medium">75.20M EUR</span>
                    </div>
                  </div>
                  <div className="text-xs text-blue-500 flex items-center">
                    <span className="mr-1">⟳</span> 5m ago
                  </div>
                </div>
              </SAPTile>
              
              <SAPTile 
                title="Cash Discount Utilization" 
                subtitle="Today" 
                value="47.6" 
                valueSuffix="%" 
                isVoiceAssistantEnabled={isEnabled}
                description="This tile shows the percentage of cash discounts that have been utilized."
                onClick={() => handleNavigation('cash-discount')}
              >
                <div>
                  <div className="text-4xl font-semibold mb-4 text-red-500">47.6 <span className="text-sm">%</span></div>
                  <div className="text-xs text-blue-500 flex items-center">
                    <span className="mr-1">⟳</span> 5m ago
                  </div>
                </div>
              </SAPTile>
              
              <SAPTile 
                title="Manage Payment Blocks" 
                isVoiceAssistantEnabled={isEnabled}
                description="This tile allows you to manage payment blocks that prevent automated payments to specific vendors."
                icon={<CreditCard className="h-5 w-5 text-blue-600" />}
                onClick={() => handleNavigation('payment-blocks')}
              />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="accounts-receivable">
          <section>
            <h2 className="text-xl font-semibold mb-4">Accounts Receivable</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SAPTile 
                title="Manage Customer Line Items" 
                isVoiceAssistantEnabled={isEnabled}
                description="This tile allows you to manage individual line items for customer accounts."
                icon={<Users className="h-5 w-5 text-blue-600" />}
                onClick={() => handleNavigation('customer-line-items')}
              />
              
              <SAPTile 
                title="Process Receivables" 
                isVoiceAssistantEnabled={isEnabled}
                description="This tile provides tools for processing and managing customer receivables."
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                onClick={() => handleNavigation('process-receivables')}
              />
              
              <SAPTile 
                title="Customer Invoicing" 
                isVoiceAssistantEnabled={isEnabled}
                description="Create and manage customer invoices and credit memos."
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                onClick={() => handleNavigation('customer-invoicing')}
              />
              
              <SAPTile 
                title="Incoming Payments" 
                isVoiceAssistantEnabled={isEnabled}
                description="Process and reconcile incoming customer payments."
                icon={<Coins className="h-5 w-5 text-blue-600" />}
                onClick={() => handleNavigation('incoming-payments')}
              />
              
              <SAPTile 
                title="Total Receivables" 
                subtitle="Today" 
                value="357" 
                valueSuffix="M USD" 
                isVoiceAssistantEnabled={isEnabled}
                description="This tile shows the total amount of money owed to your company by customers."
                onClick={() => handleNavigation('total-receivables')}
              >
                <div>
                  <div className="text-4xl font-semibold mb-4">357 <span className="text-sm">M</span></div>
                  <div className="text-xs text-blue-500 flex items-center">
                    <span className="mr-1">⟳</span> 10m ago <span className="ml-2">USD</span>
                  </div>
                </div>
              </SAPTile>
              
              <SAPTile 
                title="Overdue Receivables" 
                subtitle="Today" 
                value="81.3" 
                valueSuffix="%" 
                isVoiceAssistantEnabled={isEnabled}
                description="This tile shows the percentage of customer receivables that are overdue."
                onClick={() => handleNavigation('overdue-receivables')}
              >
                <div>
                  <div className="text-4xl font-semibold mb-4">81.3 <span className="text-sm">%</span></div>
                  <div className="text-xs text-blue-500 flex items-center">
                    <span className="mr-1">⟳</span> 10m ago
                  </div>
                </div>
              </SAPTile>

              <SAPTile 
                title="Dunning Notices" 
                isVoiceAssistantEnabled={isEnabled}
                description="Create and manage dunning notices for overdue customer accounts."
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                onClick={() => handleNavigation('dunning-notices')}
              />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="asset-accounting">
          <section>
            <h2 className="text-xl font-semibold mb-4">Asset Accounting</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SAPTile 
                title="Asset Explorer" 
                isVoiceAssistantEnabled={isEnabled}
                description="View and manage your organization's fixed assets."
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                onClick={() => handleNavigation('asset-explorer')}
              />
              
              <SAPTile 
                title="Asset Acquisitions" 
                isVoiceAssistantEnabled={isEnabled}
                description="Process and manage asset acquisition transactions."
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                onClick={() => handleNavigation('asset-acquisitions')}
              />
              
              <SAPTile 
                title="Asset Retirements" 
                isVoiceAssistantEnabled={isEnabled}
                description="Process and manage asset retirement transactions."
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                onClick={() => handleNavigation('asset-retirements')}
              />
              
              <SAPTile 
                title="Depreciation Run" 
                isVoiceAssistantEnabled={isEnabled}
                description="Execute and manage depreciation calculations."
                icon={<BarChart2 className="h-5 w-5 text-blue-600" />}
                onClick={() => handleNavigation('depreciation-run')}
              />
            </div>
          </section>
        </TabsContent>
      </Tabs>

      <FinanceReports />
    </div>
  );
};

export default Finance;
