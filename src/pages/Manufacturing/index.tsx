
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { BarChart2, Box, Calendar, ChevronRight, Clipboard, ClipboardCheck, FileText, HardDrive, LayoutDashboard, Monitor, Package, Users, Wrench, Settings, TrendingUp } from 'lucide-react';
import styles from './Manufacturing.module.css';
import { toast } from '../../components/ui/use-toast';
import PageHeader from '../../components/page/PageHeader';
import ProductionMetrics from './components/ProductionMetrics';

interface ManufacturingCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  value?: string | number;
  onClick?: () => void;
}

const ManufacturingCard: React.FC<ManufacturingCardProps> = ({ title, subtitle, icon, value, onClick }) => (
  <div className={styles.card} onClick={onClick}>
    <div className="flex items-start space-x-4">
      <div className={styles.iconWrapper}>
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        {value && <p className="text-2xl font-semibold mt-2">{value}</p>}
      </div>
    </div>
  </div>
);

const ManufacturingDashboard: React.FC = () => {
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Manufacturing. Here you can manage production operations, planning, quality control, and maintenance activities.');
    }
  }, [isEnabled, speak]);

  const handleCardClick = (area: string, action: string, path: string) => {
    console.log(`${area} - ${action} clicked`);
    toast({
      title: `${action}`,
      description: `You selected ${action} in the ${area} area`,
    });
    navigate(`/manufacturing/${path}`);
  };

  const handleSectionNav = (path: string) => {
    navigate(`/manufacturing/${path}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <PageHeader 
        title="Manufacturing"
        description="Manage your production operations, planning, quality control, and maintenance activities"
        voiceIntroduction="Welcome to Manufacturing. Here you can manage production operations, planning, quality control, and maintenance activities."
      />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Manufacturing</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="text-xs">
            Personalize Page
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            Share Page
          </Button>
        </div>
      </div>

      <ProductionMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="col-span-1 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <LayoutDashboard className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">Overview</h2>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between" 
                    onClick={() => handleCardClick('Overview', 'Production Dashboard', '')}>
              <span>Production Dashboard</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleCardClick('Overview', 'Manufacturing KPIs', 'kpis')}>
              <span>Manufacturing KPIs</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleCardClick('Overview', 'Cost Analysis', 'cost-analysis')}>
              <span>Cost Analysis</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </Card>

        <Card className="col-span-1 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold">Planning</h2>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleCardClick('Planning', 'Production Scheduling', 'production-scheduling')}>
              <span>Production Scheduling</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleCardClick('Planning', 'Capacity Planning', 'capacity-planning')}>
              <span>Capacity Planning</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleCardClick('Planning', 'Material Requirements', 'material-requirements')}>
              <span>Material Requirements</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </Card>

        <Card className="col-span-1 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <BarChart2 className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold">Analytics</h2>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleCardClick('Analytics', 'Production Reports', 'production-reports')}>
              <span>Production Reports</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleCardClick('Analytics', 'Quality Analysis', 'quality-analysis')}>
              <span>Quality Analysis</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleCardClick('Analytics', 'Performance Analytics', 'performance-analytics')}>
              <span>Performance Analytics</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </Card>

        <Card className="col-span-1 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-orange-100 p-3 rounded-lg mr-4">
              <Settings className="h-6 w-6 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold">Configuration</h2>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleCardClick('Configuration', 'Work Centers', 'work-centers')}>
              <span>Work Centers</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleCardClick('Configuration', 'BOMs', 'boms')}>
              <span>Bill of Materials</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleCardClick('Configuration', 'Routings', 'routings')}>
              <span>Routings</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="production" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="production" onClick={() => handleSectionNav('production')}>Production</TabsTrigger>
          <TabsTrigger value="warehouse" onClick={() => handleSectionNav('warehouse')}>Warehouse Management</TabsTrigger>
          <TabsTrigger value="quality" onClick={() => handleSectionNav('quality')}>Quality Management</TabsTrigger>
          <TabsTrigger value="maintenance" onClick={() => handleSectionNav('service')}>Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="production">
          <section>
            <h2 className={styles.sectionTitle}>Production</h2>
            <div className={styles.cardGrid}>
              <ManufacturingCard
                title="Production Orders"
                subtitle="Create and Manage"
                icon={<ClipboardCheck className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Production', 'Production Orders', 'production')}
              />
              <ManufacturingCard
                title="Production Planning"
                subtitle="MRP and Scheduling"
                icon={<Calendar className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Production', 'Production Planning', 'production-planning')}
              />
              <ManufacturingCard
                title="Monitor Material Coverage"
                subtitle="Net / Individual Seg."
                icon={<Monitor className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Production', 'Monitor Material Coverage', 'production')}
              />
              <ManufacturingCard
                title="Confirm Production Operation"
                icon={<Wrench className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Production', 'Confirm Production Operation', 'production')}
              />
              <ManufacturingCard
                title="Work Center Management"
                icon={<Settings className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Production', 'Work Center Management', 'work-centers')}
              />
              <ManufacturingCard
                title="Production Reports"
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Production', 'Production Reports', 'production-reports')}
              />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="warehouse">
          <section>
            <h2 className={styles.sectionTitle}>Warehouse Management</h2>
            <div className={styles.cardGrid}>
              <ManufacturingCard
                title="Inventory Management"
                subtitle="Stock Overview"
                icon={<Box className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Warehouse', 'Inventory Management', 'warehouse')}
              />
              <ManufacturingCard
                title="Goods Receipt"
                icon={<Package className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Warehouse', 'Goods Receipt', 'warehouse')}
              />
              <ManufacturingCard
                title="Goods Issue"
                icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Warehouse', 'Goods Issue', 'warehouse')}
              />
              <ManufacturingCard
                title="Stock Transfers"
                icon={<Clipboard className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Warehouse', 'Stock Transfers', 'warehouse')}
              />
              <ManufacturingCard
                title="Physical Inventory"
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Warehouse', 'Physical Inventory', 'warehouse')}
              />
              <ManufacturingCard
                title="Warehouse Reports"
                icon={<BarChart2 className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Warehouse', 'Warehouse Reports', 'warehouse')}
              />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="quality">
          <section>
            <h2 className={styles.sectionTitle}>Quality Management</h2>
            <div className={styles.cardGrid}>
              <ManufacturingCard
                title="Quality Control"
                icon={<ClipboardCheck className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Quality', 'Quality Control', 'quality')}
              />
              <ManufacturingCard
                title="Inspection Planning"
                icon={<Calendar className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Quality', 'Inspection Planning', 'quality')}
              />
              <ManufacturingCard
                title="Quality Technician Overview"
                icon={<Users className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Quality', 'Quality Technician Overview', 'quality')}
              />
              <ManufacturingCard
                title="Record Inspection Results"
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                value="161"
                onClick={() => handleCardClick('Quality', 'Record Inspection Results', 'quality')}
              />
              <ManufacturingCard
                title="Quality Notifications"
                icon={<Monitor className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Quality', 'Quality Notifications', 'quality')}
              />
              <ManufacturingCard
                title="Certificate Management"
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Quality', 'Certificate Management', 'quality')}
              />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="maintenance">
          <section>
            <h2 className={styles.sectionTitle}>Maintenance Management</h2>
            <div className={styles.cardGrid}>
              <ManufacturingCard
                title="Create Maintenance Request"
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Maintenance', 'Create Maintenance Request', 'service')}
              />
              <ManufacturingCard
                title="Maintenance Orders"
                icon={<ClipboardCheck className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Maintenance', 'Maintenance Orders', 'service')}
              />
              <ManufacturingCard
                title="Preventive Maintenance"
                icon={<Calendar className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Maintenance', 'Preventive Maintenance', 'service')}
              />
              <ManufacturingCard
                title="Equipment Management"
                icon={<Settings className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Maintenance', 'Equipment Management', 'service')}
              />
              <ManufacturingCard
                title="Maintenance Reports"
                icon={<BarChart2 className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Maintenance', 'Maintenance Reports', 'service')}
              />
              <ManufacturingCard
                title="Work Order Management"
                icon={<Wrench className="h-5 w-5 text-blue-600" />}
                onClick={() => handleCardClick('Maintenance', 'Work Order Management', 'service')}
              />
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManufacturingDashboard;
