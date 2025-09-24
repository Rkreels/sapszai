
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HumanResources from './HumanResources';
import EmployeeCentral from './HumanResources/EmployeeCentral';
import TimeManagement from './HumanResources/TimeManagement';
import Payroll from './HumanResources/Payroll';
import TalentManagement from './HumanResources/TalentManagement';
import LearningManagement from './HumanResources/LearningManagement';
import PerformanceManagement from './HumanResources/PerformanceManagement';
import SuccessionPlanning from './HumanResources/SuccessionPlanning';
import Recruitment from './HumanResources/Recruitment';
import CompensationManagement from './HumanResources/CompensationManagement';
import BenefitsAdministration from './HumanResources/BenefitsAdministration';

const HumanResourcesRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<HumanResources />} />
      <Route path="employee-central" element={<EmployeeCentral />} />
      <Route path="time-management" element={<TimeManagement />} />
      <Route path="payroll" element={<Payroll />} />
      <Route path="talent-management" element={<TalentManagement />} />
      <Route path="learning" element={<LearningManagement />} />
      <Route path="performance" element={<PerformanceManagement />} />
      <Route path="succession" element={<SuccessionPlanning />} />
      <Route path="recruitment" element={<Recruitment />} />
      <Route path="compensation" element={<CompensationManagement />} />
      <Route path="benefits" element={<BenefitsAdministration />} />
    </Routes>
  );
};

export default HumanResourcesRoutes;
