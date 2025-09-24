
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SAPLayout from './components/SAPLayout';
import Dashboard from './pages/Dashboard';
import FinanceRoutes from './pages/FinanceRoutes';
import Manufacturing from './pages/Manufacturing';
import SupplyChainRoutes from './pages/SupplyChainRoutes';
import ProjectManagementRoutes from './pages/ProjectManagementRoutes';
import ProcurementRoutes from './pages/ProcurementRoutes';
import SalesRoutes from './pages/SalesRoutes';
import HumanResourcesRoutes from './pages/HumanResourcesRoutes';
import MasterDataRoutes from './pages/MasterDataRoutes';
import BusinessIntelligenceRoutes from './pages/BusinessIntelligenceRoutes';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SAPLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="finance/*" element={<FinanceRoutes />} />
          <Route path="manufacturing/*" element={<Manufacturing />} />
          <Route path="sales/*" element={<SalesRoutes />} />
          <Route path="supply-chain/*" element={<SupplyChainRoutes />} />
          <Route path="procurement/*" element={<ProcurementRoutes />} />
          <Route path="project-management/*" element={<ProjectManagementRoutes />} />
          <Route path="human-resources/*" element={<HumanResourcesRoutes />} />
          <Route path="master-data/*" element={<MasterDataRoutes />} />
          <Route path="business-intelligence/*" element={<BusinessIntelligenceRoutes />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
