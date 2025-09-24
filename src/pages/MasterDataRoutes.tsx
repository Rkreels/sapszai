
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MasterData from './MasterData';
import MaterialMaster from './MasterData/MaterialMaster';
import CustomerMaster from './MasterData/CustomerMaster';
import VendorMaster from './MasterData/VendorMaster';
import AssetMaster from './MasterData/AssetMaster';
import CostCenter from './MasterData/CostCenter';
import ProfitCenter from './MasterData/ProfitCenter';
import ChartOfAccounts from './MasterData/ChartOfAccounts';
import BusinessPartner from './MasterData/BusinessPartner';
import BankMaster from './MasterData/BankMaster';
import PlantMaster from './MasterData/PlantMaster';

const MasterDataRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<MasterData />} />
      <Route path="material" element={<MaterialMaster />} />
      <Route path="customer" element={<CustomerMaster />} />
      <Route path="vendor" element={<VendorMaster />} />
      <Route path="asset" element={<AssetMaster />} />
      <Route path="cost-center" element={<CostCenter />} />
      <Route path="profit-center" element={<ProfitCenter />} />
      <Route path="chart-accounts" element={<ChartOfAccounts />} />
      <Route path="business-partner" element={<BusinessPartner />} />
      <Route path="bank" element={<BankMaster />} />
      <Route path="plant" element={<PlantMaster />} />
    </Routes>
  );
};

export default MasterDataRoutes;
