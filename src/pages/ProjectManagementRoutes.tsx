
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProjectManagement from './ProjectManagement';
import ProjectDetail from './ProjectManagement/ProjectDetail';
import ProjectPlanning from './ProjectManagement/ProjectPlanning';
import ProjectExecution from './ProjectManagement/ProjectExecution';
import ResourceManagement from './ProjectManagement/ResourceManagement';
import TimeRecording from './ProjectManagement/TimeRecording';
import CostManagement from './ProjectManagement/CostManagement';
import RiskManagement from './ProjectManagement/RiskManagement';
import DocumentManagement from './ProjectManagement/DocumentManagement';
import PortfolioManagement from './ProjectManagement/PortfolioManagement';
import Collaboration from './ProjectManagement/Collaboration';
import ProjectAnalytics from './ProjectManagement/ProjectAnalytics';

const ProjectManagementRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ProjectManagement />} />
      <Route path="project/:projectId" element={<ProjectDetail />} />
      <Route path="planning" element={<ProjectPlanning />} />
      <Route path="execution" element={<ProjectExecution />} />
      <Route path="resources" element={<ResourceManagement />} />
      <Route path="time-recording" element={<TimeRecording />} />
      <Route path="cost-management" element={<CostManagement />} />
      <Route path="risk-management" element={<RiskManagement />} />
      <Route path="documents" element={<DocumentManagement />} />
      <Route path="portfolio" element={<PortfolioManagement />} />
      <Route path="collaboration" element={<Collaboration />} />
      <Route path="analytics" element={<ProjectAnalytics />} />
    </Routes>
  );
};

export default ProjectManagementRoutes;
