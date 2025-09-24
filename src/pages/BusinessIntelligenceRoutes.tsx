
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BusinessIntelligence from './BusinessIntelligence';
import ExecutiveDashboard from './BusinessIntelligence/ExecutiveDashboard';
import FinancialAnalytics from './BusinessIntelligence/FinancialAnalytics';
import SalesAnalytics from './BusinessIntelligence/SalesAnalytics';
import ProcurementAnalytics from './BusinessIntelligence/ProcurementAnalytics';
import ManufacturingAnalytics from './BusinessIntelligence/ManufacturingAnalytics';
import HRAnalytics from './BusinessIntelligence/HRAnalytics';
import PredictiveAnalytics from './BusinessIntelligence/PredictiveAnalytics';
import RealtimeAnalytics from './BusinessIntelligence/RealtimeAnalytics';
import DataVisualization from './BusinessIntelligence/DataVisualization';
import ReportBuilder from './BusinessIntelligence/ReportBuilder';

const BusinessIntelligenceRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<BusinessIntelligence />} />
      <Route path="executive" element={<ExecutiveDashboard />} />
      <Route path="financial" element={<FinancialAnalytics />} />
      <Route path="sales" element={<SalesAnalytics />} />
      <Route path="procurement" element={<ProcurementAnalytics />} />
      <Route path="manufacturing" element={<ManufacturingAnalytics />} />
      <Route path="hr" element={<HRAnalytics />} />
      <Route path="predictive" element={<PredictiveAnalytics />} />
      <Route path="realtime" element={<RealtimeAnalytics />} />
      <Route path="visualization" element={<DataVisualization />} />
      <Route path="report-builder" element={<ReportBuilder />} />
    </Routes>
  );
};

export default BusinessIntelligenceRoutes;
