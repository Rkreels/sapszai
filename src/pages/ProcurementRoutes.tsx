
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Procurement from './Procurement';
import PurchaseOrders from './Procurement/PurchaseOrders';
import PurchaseRequisitions from './Procurement/PurchaseRequisitions';
import RFQManagement from './Procurement/RFQManagement';
import SupplierManagement from './Procurement/SupplierManagement';
import SupplierDetail from './Procurement/SupplierDetail';
import ContractManagement from './Procurement/ContractManagement';
import SourceDetermination from './Procurement/SourceDetermination';
import GoodsReceipt from './Procurement/GoodsReceipt';
import InvoiceVerification from './Procurement/InvoiceVerification';
import BiddingAuctions from './Procurement/BiddingAuctions';
import ProcurementAnalytics from './Procurement/ProcurementAnalytics';
import CatalogManagement from './Procurement/CatalogManagement';
import SpendAnalysis from './Procurement/SpendAnalysis';
import SupplierPerformance from './Procurement/SupplierPerformance';

const ProcurementRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Procurement />} />
      <Route path="/purchase-orders" element={<PurchaseOrders />} />
      <Route path="/purchase-requisitions" element={<PurchaseRequisitions />} />
      <Route path="/requisitions" element={<PurchaseRequisitions />} />
      <Route path="/rfq" element={<RFQManagement />} />
      <Route path="/supplier-management" element={<SupplierManagement />} />
      <Route path="/supplier-management/:supplierId" element={<SupplierDetail />} />
      <Route path="/suppliers" element={<SupplierManagement />} />
      <Route path="/contract-management" element={<ContractManagement />} />
      <Route path="/source-determination" element={<SourceDetermination />} />
      <Route path="/source-list" element={<SourceDetermination />} />
      <Route path="/goods-receipt" element={<GoodsReceipt />} />
      <Route path="/invoice-verification" element={<InvoiceVerification />} />
      <Route path="/bidding-auctions" element={<BiddingAuctions />} />
      <Route path="/analytics" element={<ProcurementAnalytics />} />
      <Route path="/catalog-management" element={<CatalogManagement />} />
      <Route path="/spend-analysis" element={<SpendAnalysis />} />
      <Route path="/supplier-performance" element={<SupplierPerformance />} />
    </Routes>
  );
};

export default ProcurementRoutes;
