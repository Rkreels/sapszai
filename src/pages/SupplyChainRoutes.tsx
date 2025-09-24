
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SupplyChain from './SupplyChain';
import PurchaseOrders from './SupplyChain/PurchaseOrders';
import Requisitions from './SupplyChain/Requisitions';
import SupplierManagement from './SupplyChain/SupplierManagement';
import InboundDeliveries from './SupplyChain/InboundDeliveries';
import OutboundDeliveries from './SupplyChain/OutboundDeliveries';
import Transportation from './SupplyChain/Transportation';
import InventoryManagement from './SupplyChain/InventoryManagement';
import WarehouseManagement from './SupplyChain/WarehouseManagement';
import StockTransfers from './SupplyChain/StockTransfers';
import PhysicalInventory from './SupplyChain/PhysicalInventory';
import DemandPlanning from './SupplyChain/DemandPlanning';
import SupplyPlanning from './SupplyChain/SupplyPlanning';
import DistributionPlanning from './SupplyChain/DistributionPlanning';
import VendorManagedInventory from './SupplyChain/VendorManagedInventory';

const SupplyChainRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<SupplyChain />} />
      <Route path="purchase-orders" element={<PurchaseOrders />} />
      <Route path="requisitions" element={<Requisitions />} />
      <Route path="supplier-management" element={<SupplierManagement />} />
      <Route path="inbound-deliveries" element={<InboundDeliveries />} />
      <Route path="outbound-deliveries" element={<OutboundDeliveries />} />
      <Route path="transportation" element={<Transportation />} />
      <Route path="inventory" element={<InventoryManagement />} />
      <Route path="warehouse" element={<WarehouseManagement />} />
      <Route path="stock-transfers" element={<StockTransfers />} />
      <Route path="physical-inventory" element={<PhysicalInventory />} />
      <Route path="demand-planning" element={<DemandPlanning />} />
      <Route path="supply-planning" element={<SupplyPlanning />} />
      <Route path="distribution-planning" element={<DistributionPlanning />} />
      <Route path="vmi" element={<VendorManagedInventory />} />
    </Routes>
  );
};

export default SupplyChainRoutes;
