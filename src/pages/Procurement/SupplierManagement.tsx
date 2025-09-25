
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Plus, Users, TrendingUp, Award, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import { useToast } from '../../hooks/use-toast';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';
import SupplierCard from '../../components/procurement/SupplierCard';

interface Supplier {
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Blocked';
  rating: number;
  contactPerson: string;
  totalValue: number;
  onTimeDelivery: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  certifications: string[];
}

const SupplierManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('suppliers');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Supplier Management. Manage vendor relationships, evaluate performance, and maintain supplier master data for optimal procurement outcomes.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    const sampleSuppliers: Supplier[] = [
      {
        id: 'sup-001',
        name: 'Dell Technologies',
        category: 'Technology Hardware',
        status: 'Active',
        rating: 4.5,
        contactPerson: 'John Smith',
        totalValue: 1250000,
        onTimeDelivery: 95,
        riskLevel: 'Low',
        certifications: ['ISO 9001', 'ISO 14001', 'SOC 2']
      },
      {
        id: 'sup-002',
        name: 'Office Depot Inc.',
        category: 'Office Supplies',
        status: 'Active',
        rating: 4.2,
        contactPerson: 'Sarah Wilson',
        totalValue: 85000,
        onTimeDelivery: 88,
        riskLevel: 'Low',
        certifications: ['ISO 9001', 'Green Certified']
      },
      {
        id: 'sup-003',
        name: 'Global Services Ltd',
        category: 'Professional Services',
        status: 'Pending',
        rating: 3.8,
        contactPerson: 'Mike Brown',
        totalValue: 0,
        onTimeDelivery: 0,
        riskLevel: 'Medium',
        certifications: ['ISO 27001']
      }
    ];
    setSuppliers(sampleSuppliers);
  }, []);

  const handleSupplierView = (supplier: Supplier) => {
    navigate(`/procurement/supplier-management/${supplier.id}`);
  };

  const handleSupplierEdit = (supplier: Supplier) => {
    // In a real implementation, this would open an edit form
    toast({
      title: 'Edit Supplier',
      description: `Opening edit form for ${supplier.name}`,
    });
    // Placeholder for edit functionality
    console.log('Edit supplier:', supplier);
  };

  const handleSupplierPerformance = (supplier: Supplier) => {
    // Navigate to performance details or show performance modal
    toast({
      title: 'Supplier Performance',
      description: `Viewing performance metrics for ${supplier.name}`,
    });
    // Placeholder for performance viewing functionality
    console.log('View performance for:', supplier);
  };

  const handleAddSupplier = () => {
    // In a real implementation, this would open a supplier creation form
    toast({
      title: 'Add Supplier',
      description: 'Opening supplier registration form',
    });
    // Placeholder for add supplier functionality
    console.log('Add new supplier');
  };

  const handleReviewDocuments = (supplier: Supplier) => {
    // In a real implementation, this would open document review interface
    toast({
      title: 'Review Documents',
      description: `Opening documents for ${supplier.name}`,
    });
    // Placeholder for document review functionality
    console.log('Review documents for:', supplier);
  };

  const handleApproveSupplier = (supplier: Supplier) => {
    // Update supplier status to Active
    const updatedSuppliers = suppliers.map(s => 
      s.id === supplier.id ? { ...s, status: 'Active' as const } : s
    );
    setSuppliers(updatedSuppliers);
    
    toast({
      title: 'Supplier Approved',
      description: `${supplier.name} has been approved and activated`,
    });
    // Placeholder for approval functionality
    console.log('Approved supplier:', supplier);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/procurement')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Supplier Management"
          description="Manage vendor relationships, evaluate performance, and maintain supplier data"
          voiceIntroduction="Welcome to Supplier Management for comprehensive vendor relationship management."
        />
      </div>

      <VoiceTrainingComponent 
        module="Supplier Management"
        topic="Vendor Relationship Management"
        examples={[
          "Managing supplier master data including qualifications, certifications, and performance metrics",
          "Evaluating vendor performance through scorecards, delivery metrics, and quality assessments",
          "Conducting supplier risk assessments and maintaining compliance with procurement policies"
        ]}
        detailLevel="advanced"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <div className="text-sm text-muted-foreground">Total Suppliers</div>
            <div className="text-sm text-blue-600">Active network</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {suppliers.filter(s => s.status === 'Active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active Suppliers</div>
            <div className="text-sm text-green-600">Qualified</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {(suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
            <div className="text-sm text-yellow-600">Quality score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {suppliers.filter(s => s.riskLevel === 'High').length}
            </div>
            <div className="text-sm text-muted-foreground">High Risk</div>
            <div className="text-sm text-red-600">Needs attention</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Supplier Directory
                <Button onClick={handleAddSupplier}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map((supplier) => (
                  <SupplierCard
                    key={supplier.id}
                    supplier={supplier}
                    onView={handleSupplierView}
                    onEdit={handleSupplierEdit}
                    onPerformance={handleSupplierPerformance}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Performance Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suppliers.filter(s => s.status === 'Active').map((supplier) => (
                  <div key={supplier.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">{supplier.name}</h4>
                      <Badge className={supplier.riskLevel === 'Low' ? 'bg-green-100 text-green-800' : 
                                      supplier.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                      'bg-red-100 text-red-800'}>
                        {supplier.riskLevel} Risk
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Rating:</span>
                        <div className="font-medium">{supplier.rating}/5.0</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">On-Time Delivery:</span>
                        <div className="font-medium">{supplier.onTimeDelivery}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Value:</span>
                        <div className="font-medium">${supplier.totalValue.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Onboarding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suppliers.filter(s => s.status === 'Pending').map((supplier) => (
                  <div key={supplier.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{supplier.name}</h4>
                        <p className="text-sm text-muted-foreground">{supplier.category}</p>
                        <p className="text-sm">Contact: {supplier.contactPerson}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleReviewDocuments(supplier)}
                        >
                          Review Documents
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleApproveSupplier(supplier)}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Technology Hardware', 'Office Supplies', 'Professional Services', 'Manufacturing'].map((category) => {
                    const count = suppliers.filter(s => s.category === category).length;
                    return (
                      <div key={category} className="flex justify-between">
                        <span>{category}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Low', 'Medium', 'High'].map((risk) => {
                    const count = suppliers.filter(s => s.riskLevel === risk).length;
                    const percentage = suppliers.length > 0 ? Math.round((count / suppliers.length) * 100) : 0;
                    return (
                      <div key={risk} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{risk} Risk</span>
                          <span>{count} suppliers ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              risk === 'Low' ? 'bg-green-600' : 
                              risk === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierManagement;
