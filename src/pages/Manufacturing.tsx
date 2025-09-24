
import { Routes, Route } from 'react-router-dom';
import ManufacturingDashboard from './Manufacturing/index';
import ProductionPage from './Manufacturing/Production';
import WarehousePage from './Manufacturing/Warehouse';
import QualityPage from './Manufacturing/Quality';
import ServicePage from './Manufacturing/Service';
import Maintenance from './Manufacturing/Maintenance';
import ManufacturingKPIs from './Manufacturing/ManufacturingKPIs';
import ProductionScheduling from './Manufacturing/ProductionScheduling';
import CapacityPlanning from './Manufacturing/CapacityPlanning';
import MaterialRequirements from './Manufacturing/MaterialRequirements';
import ProductionReports from './Manufacturing/ProductionReports';
import QualityAnalysis from './Manufacturing/QualityAnalysis';
import CostAnalysis from './Manufacturing/CostAnalysis';
import ProductionPlanning from './Manufacturing/ProductionPlanning';
import WorkCenters from './Manufacturing/WorkCenters';
import BOMs from './Manufacturing/BOMs';
import Routings from './Manufacturing/Routings';
import PerformanceAnalytics from './Manufacturing/PerformanceAnalytics';

const Manufacturing = () => {
  return (
    <Routes>
      <Route index element={<ManufacturingDashboard />} />
      <Route path="production" element={<ProductionPage />} />
      <Route path="warehouse" element={<WarehousePage />} />
      <Route path="quality" element={<QualityPage />} />
      <Route path="service" element={<ServicePage />} />
      <Route path="maintenance" element={<Maintenance />} />
      <Route path="kpis" element={<ManufacturingKPIs />} />
      <Route path="production-scheduling" element={<ProductionScheduling />} />
      <Route path="production-planning" element={<ProductionPlanning />} />
      <Route path="capacity-planning" element={<CapacityPlanning />} />
      <Route path="material-requirements" element={<MaterialRequirements />} />
      <Route path="production-reports" element={<ProductionReports />} />
      <Route path="quality-analysis" element={<QualityAnalysis />} />
      <Route path="cost-analysis" element={<CostAnalysis />} />
      <Route path="work-centers" element={<WorkCenters />} />
      <Route path="boms" element={<BOMs />} />
      <Route path="routings" element={<Routings />} />
      <Route path="performance-analytics" element={<PerformanceAnalytics />} />
    </Routes>
  );
};

export default Manufacturing;
