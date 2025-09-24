
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Plus, Target, Search, Filter, Star, TrendingUp } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';

interface SourceList {
  id: string;
  materialCode: string;
  materialDescription: string;
  category: string;
  preferredSuppliers: string[];
  alternativeSuppliers: string[];
  lastUpdated: string;
  status: 'Active' | 'Inactive' | 'Under Review';
  leadTime: number;
  minOrderQty: number;
  priceValidity: string;
}

const SourceDetermination: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('sources');
  const [sourceLists, setSourceLists] = useState<SourceList[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Source Determination. Manage supplier selection criteria and source lists for optimal procurement decisions.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    const sampleSourceLists: SourceList[] = [
      {
        id: 'sl-001',
        materialCode: 'LAP-001',
        materialDescription: 'Business Laptops',
        category: 'IT Equipment',
        preferredSuppliers: ['Dell Technologies', 'HP Inc.', 'Lenovo'],
        alternativeSuppliers: ['ASUS', 'Acer'],
        lastUpdated: '2025-01-20',
        status: 'Active',
        leadTime: 14,
        minOrderQty: 10,
        priceValidity: '2025-06-30'
      },
      {
        id: 'sl-002',
        materialCode: 'OFF-001',
        materialDescription: 'Office Supplies Bundle',
        category: 'Office Supplies',
        preferredSuppliers: ['Office Depot', 'Staples'],
        alternativeSuppliers: ['Amazon Business', 'Walmart Business'],
        lastUpdated: '2025-01-18',
        status: 'Active',
        leadTime: 3,
        minOrderQty: 1,
        priceValidity: '2025-12-31'
      }
    ];
    setSourceLists(sampleSourceLists);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-gray-100 text-gray-800',
      'Under Review': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: EnhancedColumn[] = [
    { key: 'materialCode', header: 'Material Code', sortable: true, searchable: true },
    { key: 'materialDescription', header: 'Description', searchable: true },
    { key: 'category', header: 'Category', filterable: true, filterOptions: [
      { label: 'IT Equipment', value: 'IT Equipment' },
      { label: 'Office Supplies', value: 'Office Supplies' },
      { label: 'Raw Materials', value: 'Raw Materials' },
      { label: 'Services', value: 'Services' }
    ]},
    { 
      key: 'preferredSuppliers', 
      header: 'Preferred Suppliers',
      render: (value: string[]) => `${value.length} suppliers`
    },
    { 
      key: 'alternativeSuppliers', 
      header: 'Alternatives',
      render: (value: string[]) => `${value.length} suppliers`
    },
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
        { label: 'Under Review', value: 'Under Review' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    { key: 'leadTime', header: 'Lead Time (days)', sortable: true },
    { key: 'lastUpdated', header: 'Last Updated', sortable: true }
  ];

  const actions: TableAction[] = [
    {
      label: 'View Details',
      icon: <Target className="h-4 w-4" />,
      onClick: (row: SourceList) => {
        toast({
          title: 'View Source List',
          description: `Opening details for ${row.materialCode}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Update Sources',
      icon: <Search className="h-4 w-4" />,
      onClick: (row: SourceList) => {
        toast({
          title: 'Update Sources',
          description: `Updating source list for ${row.materialCode}`,
        });
      },
      variant: 'ghost'
    }
  ];

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
          title="Source Determination"
          description="Determine optimal suppliers for materials and services based on criteria"
          voiceIntroduction="Welcome to Source Determination for optimal supplier selection."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{sourceLists.length}</div>
            <div className="text-sm text-muted-foreground">Source Lists</div>
            <div className="text-sm text-blue-600">Maintained</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {sourceLists.filter(s => s.status === 'Active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active Sources</div>
            <div className="text-sm text-green-600">Ready to use</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {sourceLists.reduce((sum, s) => sum + s.preferredSuppliers.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Preferred Suppliers</div>
            <div className="text-sm text-purple-600">Qualified</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {Math.round(sourceLists.reduce((sum, s) => sum + s.leadTime, 0) / sourceLists.length)}
            </div>
            <div className="text-sm text-muted-foreground">Avg Lead Time (days)</div>
            <div className="text-sm text-orange-600">Planning horizon</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sources">Source Lists</TabsTrigger>
          <TabsTrigger value="criteria">Selection Criteria</TabsTrigger>
          <TabsTrigger value="analysis">Source Analysis</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Material Source Lists
                <Button onClick={() => toast({ title: 'Create Source List', description: 'Opening new source list form' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Source List
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={columns}
                data={sourceLists}
                actions={actions}
                searchPlaceholder="Search materials and suppliers..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="criteria" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Selection Criteria Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Primary Criteria</h4>
                  <div className="space-y-3">
                    {['Price Competitiveness', 'Quality Rating', 'Delivery Performance', 'Financial Stability'].map((criteria) => (
                      <div key={criteria} className="flex justify-between items-center p-3 border rounded">
                        <span>{criteria}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Weight:</span>
                          <span className="font-medium">25%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Secondary Criteria</h4>
                  <div className="space-y-3">
                    {['Geographic Location', 'Sustainability Rating', 'Innovation Capability', 'Risk Assessment'].map((criteria) => (
                      <div key={criteria} className="flex justify-between items-center p-3 border rounded">
                        <span>{criteria}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Weight:</span>
                          <span className="font-medium">15%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Distribution by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['IT Equipment', 'Office Supplies', 'Raw Materials', 'Services'].map((category) => {
                    const sourceCount = sourceLists.filter(s => s.category === category).length;
                    const supplierCount = sourceLists
                      .filter(s => s.category === category)
                      .reduce((sum, s) => sum + s.preferredSuppliers.length + s.alternativeSuppliers.length, 0);
                    
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{category}</span>
                          <span className="font-medium">{sourceCount} materials | {supplierCount} suppliers</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (sourceCount / sourceLists.length) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded">
                    <div className="flex justify-between items-center">
                      <span>Average Supplier Options</span>
                      <span className="font-bold">
                        {Math.round(sourceLists.reduce((sum, s) => sum + s.preferredSuppliers.length + s.alternativeSuppliers.length, 0) / sourceLists.length)}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="flex justify-between items-center">
                      <span>Coverage Completeness</span>
                      <span className="font-bold text-green-600">95%</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="flex justify-between items-center">
                      <span>Source List Freshness</span>
                      <span className="font-bold text-blue-600">Good</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Source Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-800 mb-2">Consolidation Opportunity</h4>
                  <p className="text-sm">Consider consolidating Office Supplies suppliers to reduce management overhead and increase volume discounts.</p>
                  <Button size="sm" className="mt-2" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analyze Impact
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg bg-yellow-50">
                  <h4 className="font-semibold text-yellow-800 mb-2">Supplier Diversification</h4>
                  <p className="text-sm">IT Equipment category has limited supplier diversity. Consider adding more alternative suppliers to reduce risk.</p>
                  <Button size="sm" className="mt-2" variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Find Suppliers
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-800 mb-2">Lead Time Optimization</h4>
                  <p className="text-sm">Some materials have extended lead times. Consider sourcing from local suppliers to improve responsiveness.</p>
                  <Button size="sm" className="mt-2" variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter Local
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SourceDetermination;
