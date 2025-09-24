import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sales from './Sales';
import CustomerDetail from './Sales/CustomerDetail';
import SalesOrderDetail from './Sales/SalesOrderDetail';
import ProductCatalog from './Sales/ProductCatalog';
import ProductDetail from './Sales/ProductDetail';
import SalesAnalytics from './Sales/SalesAnalytics';
import QuotationManagement from './Sales/QuotationManagement';
import PricingManagement from './Sales/PricingManagement';
import SalesContracts from './Sales/SalesContracts';
import CreditManagement from './Sales/CreditManagement';
import SalesReturns from './Sales/SalesReturns';
import BillingDocuments from './Sales/BillingDocuments';
import CustomerManagement from './Sales/CustomerManagement';
import SalesOrders from './Sales/SalesOrders';
import Commission from './Sales/Commission';
import TerritoryManagement from './Sales/TerritoryManagement';
import NotFound from '../pages/NotFound';

const SalesRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Sales />} />
      <Route path="/sales-orders" element={<SalesOrders />} />
      <Route path="/orders" element={<SalesOrders />} />
      <Route path="/quotations" element={<QuotationManagement />} />
      <Route path="/customer-management" element={<CustomerManagement />} />
      <Route path="/customers" element={<CustomerManagement />} />
      <Route path="/pricing-management" element={<PricingManagement />} />
      <Route path="/pricing" element={<PricingManagement />} />
      <Route path="/product-catalog" element={<ProductCatalog />} />
      <Route path="/products" element={<ProductCatalog />} />
      <Route path="/credit-management" element={<CreditManagement />} />
      <Route path="/credit" element={<CreditManagement />} />
      <Route path="/sales-analytics" element={<SalesAnalytics />} />
      <Route path="/analytics" element={<SalesAnalytics />} />
      <Route path="/billing" element={<BillingDocuments />} />
      <Route path="/billing-documents" element={<BillingDocuments />} />
      <Route path="/sales-contracts" element={<SalesContracts />} />
      <Route path="/contracts" element={<SalesContracts />} />
      <Route path="/sales-returns" element={<SalesReturns />} />
      <Route path="/returns" element={<SalesReturns />} />
      <Route path="/commission" element={<Commission />} />
      <Route path="/territory-management" element={<TerritoryManagement />} />
      <Route path="/territory" element={<TerritoryManagement />} />
      <Route path="/customer/:customerId" element={<CustomerDetail />} />
      <Route path="/sales-order/:orderId" element={<SalesOrderDetail />} />
      <Route path="/product/:productId" element={<ProductDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default SalesRoutes;
