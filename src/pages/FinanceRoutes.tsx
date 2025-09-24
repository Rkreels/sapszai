
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Finance from './Finance';
import GeneralLedger from './Finance/GeneralLedger';
import AccountsPayable from './Finance/AccountsPayable';
import AccountsReceivable from './Finance/AccountsReceivable';
import FixedAssets from './Finance/FixedAssets';
import CostAccounting from './Finance/CostAccounting';
import BudgetPlanning from './Finance/BudgetPlanning';
import CashManagement from './Finance/CashManagement';
import TaxManagement from './Finance/TaxManagement';
import FinancialReporting from './Finance/FinancialReporting';
import Consolidation from './Finance/Consolidation';
import BalanceSheet from './Finance/BalanceSheet';
import JournalEntry from './Finance/JournalEntry';
import ChartOfAccounts from './Finance/ChartOfAccounts';

const FinanceRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Finance />} />
      <Route path="/general-ledger" element={<GeneralLedger />} />
      <Route path="/accounts-payable" element={<AccountsPayable />} />
      <Route path="/accounts-receivable" element={<AccountsReceivable />} />
      <Route path="/fixed-assets" element={<FixedAssets />} />
      <Route path="/cost-accounting" element={<CostAccounting />} />
      <Route path="/budget-planning" element={<BudgetPlanning />} />
      <Route path="/cash-management" element={<CashManagement />} />
      <Route path="/tax-management" element={<TaxManagement />} />
      <Route path="/financial-reporting" element={<FinancialReporting />} />
      <Route path="/consolidation" element={<Consolidation />} />
      <Route path="/balance-sheet" element={<BalanceSheet />} />
      <Route path="/journal-entry" element={<JournalEntry />} />
      <Route path="/chart-of-accounts" element={<ChartOfAccounts />} />
      
      {/* Additional Finance routes */}
      <Route path="/ledger-line-items" element={<GeneralLedger />} />
      <Route path="/supplier-line-items" element={<AccountsPayable />} />
      <Route path="/ap-overview" element={<AccountsPayable />} />
      <Route path="/process-invoices" element={<AccountsPayable />} />
      <Route path="/payment-run" element={<AccountsPayable />} />
      <Route path="/overdue-payables" element={<AccountsPayable />} />
      <Route path="/cash-discount" element={<AccountsPayable />} />
      <Route path="/payment-blocks" element={<AccountsPayable />} />
      <Route path="/customer-line-items" element={<AccountsReceivable />} />
      <Route path="/process-receivables" element={<AccountsReceivable />} />
      <Route path="/customer-invoicing" element={<AccountsReceivable />} />
      <Route path="/incoming-payments" element={<AccountsReceivable />} />
      <Route path="/total-receivables" element={<AccountsReceivable />} />
      <Route path="/overdue-receivables" element={<AccountsReceivable />} />
      <Route path="/dunning-notices" element={<AccountsReceivable />} />
      <Route path="/asset-explorer" element={<FixedAssets />} />
      <Route path="/asset-acquisitions" element={<FixedAssets />} />
      <Route path="/asset-retirements" element={<FixedAssets />} />
      <Route path="/depreciation-run" element={<FixedAssets />} />
    </Routes>
  );
};

export default FinanceRoutes;
