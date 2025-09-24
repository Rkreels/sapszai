
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Plus, Package, Calculator, TrendingDown, Settings } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';

interface Asset {
  id: string;
  assetNumber: string;
  description: string;
  assetClass: string;
  acquisitionValue: number;
  accumulatedDepreciation: number;
  bookValue: number;
  acquisitionDate: string;
  usefulLife: number;
  depreciationMethod: 'Straight Line' | 'Declining Balance' | 'Units of Production';
  status: 'Active' | 'Retired' | 'Under Construction' | 'Sold';
  location: string;
  costCenter: string;
}

const FixedAssets: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('assets');
  const [assets, setAssets] = useState<Asset[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Fixed Assets Management. Manage asset lifecycle, depreciation calculations, and asset accounting with comprehensive tracking and reporting.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    const sampleAssets: Asset[] = [
      {
        id: 'asset-001',
        assetNumber: 'IT-001',
        description: 'Dell Laptop Computer',
        assetClass: 'Computer Equipment',
        acquisitionValue: 2500.00,
        accumulatedDepreciation: 500.00,
        bookValue: 2000.00,
        acquisitionDate: '2024-01-15',
        usefulLife: 5,
        depreciationMethod: 'Straight Line',
        status: 'Active',
        location: 'Office Building A',
        costCenter: 'IT Department'
      },
      {
        id: 'asset-002',
        assetNumber: 'VEH-001',
        description: 'Company Vehicle - Toyota Camry',
        assetClass: 'Vehicles',
        acquisitionValue: 35000.00,
        accumulatedDepreciation: 7000.00,
        bookValue: 28000.00,
        acquisitionDate: '2023-06-20',
        usefulLife: 10,
        depreciationMethod: 'Declining Balance',
        status: 'Active',
        location: 'Main Parking',
        costCenter: 'General Administration'
      }
    ];
    setAssets(sampleAssets);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Retired': 'bg-gray-100 text-gray-800',
      'Under Construction': 'bg-blue-100 text-blue-800',
      'Sold': 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: EnhancedColumn[] = [
    { key: 'assetNumber', header: 'Asset #', sortable: true, searchable: true },
    { key: 'description', header: 'Description', searchable: true },
    { key: 'assetClass', header: 'Asset Class', searchable: true },
    { 
      key: 'acquisitionValue', 
      header: 'Acquisition Value',
      sortable: true,
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'bookValue', 
      header: 'Book Value',
      sortable: true,
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Active', value: 'Active' },
        { label: 'Retired', value: 'Retired' },
        { label: 'Under Construction', value: 'Under Construction' },
        { label: 'Sold', value: 'Sold' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    { key: 'location', header: 'Location', searchable: true },
    { key: 'costCenter', header: 'Cost Center', searchable: true }
  ];

  const actions: TableAction[] = [
    {
      label: 'View Details',
      icon: <Package className="h-4 w-4" />,
      onClick: (row: Asset) => {
        toast({
          title: 'View Asset',
          description: `Opening details for ${row.assetNumber}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Calculate Depreciation',
      icon: <Calculator className="h-4 w-4" />,
      onClick: (row: Asset) => {
        toast({
          title: 'Calculate Depreciation',
          description: `Calculating depreciation for ${row.assetNumber}`,
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
          onClick={() => navigate('/finance')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Fixed Assets"
          description="Manage asset lifecycle, depreciation, and asset accounting"
          voiceIntroduction="Welcome to Fixed Assets Management for comprehensive asset lifecycle tracking."
        />
      </div>

      <VoiceTrainingComponent 
        module="finance"
        topic="Fixed Asset Accounting"
        examples={[
          "Managing asset master data with acquisition costs, useful life, and depreciation methods including straight-line and declining balance",
          "Processing asset acquisitions and retirements with proper accounting entries and tax implications",
          "Running periodic depreciation calculations with automatic posting to financial accounts and cost centers"
        ]}
        detailLevel="advanced"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{assets.length}</div>
            <div className="text-sm text-muted-foreground">Total Assets</div>
            <div className="text-sm text-blue-600">Active portfolio</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ${assets.reduce((sum, asset) => sum + asset.acquisitionValue, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Acquisition Value</div>
            <div className="text-sm text-green-600">Historical cost</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ${assets.reduce((sum, asset) => sum + asset.bookValue, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Net Book Value</div>
            <div className="text-sm text-purple-600">Current value</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ${assets.reduce((sum, asset) => sum + asset.accumulatedDepreciation, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Accumulated Depreciation</div>
            <div className="text-sm text-red-600">Total depreciated</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assets">Asset Register</TabsTrigger>
          <TabsTrigger value="depreciation">Depreciation</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Asset Register
                <Button onClick={() => toast({ title: 'Add Asset', description: 'Opening asset creation form' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={columns}
                data={assets}
                actions={actions}
                searchPlaceholder="Search assets..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="depreciation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Depreciation Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Straight Line', 'Declining Balance', 'Units of Production'].map((method) => {
                    const count = assets.filter(asset => asset.depreciationMethod === method).length;
                    return (
                      <div key={method} className="flex justify-between items-center p-3 border rounded">
                        <span>{method}</span>
                        <Badge variant="outline">{count} assets</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Depreciation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>January 2025</span>
                    <span className="font-medium text-red-600">$625</span>
                  </div>
                  <div className="flex justify-between">
                    <span>December 2024</span>
                    <span className="font-medium text-red-600">$625</span>
                  </div>
                  <div className="flex justify-between">
                    <span>November 2024</span>
                    <span className="font-medium text-red-600">$625</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Yearly Total</span>
                      <span className="text-red-600">$7,500</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: 'Acquisition', asset: 'IT-001', amount: 2500, date: '2024-01-15' },
                  { type: 'Depreciation', asset: 'IT-001', amount: -41.67, date: '2025-01-31' },
                  { type: 'Acquisition', asset: 'VEH-001', amount: 35000, date: '2023-06-20' },
                  { type: 'Depreciation', asset: 'VEH-001', amount: -583.33, date: '2025-01-31' }
                ].map((transaction, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <span className="font-medium">{transaction.type}</span>
                      <p className="text-sm text-muted-foreground">{transaction.asset} - {transaction.date}</p>
                    </div>
                    <span className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Math.abs(transaction.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Summary by Class</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Computer Equipment', 'Vehicles', 'Furniture', 'Machinery'].map((assetClass) => {
                    const classAssets = assets.filter(asset => asset.assetClass === assetClass);
                    const totalValue = classAssets.reduce((sum, asset) => sum + asset.bookValue, 0);
                    return (
                      <div key={assetClass} className="flex justify-between">
                        <span>{assetClass}</span>
                        <span className="font-medium">${totalValue.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Aging Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>0-2 years</span>
                    <span className="font-medium">1 asset</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2-5 years</span>
                    <span className="font-medium">1 asset</span>
                  </div>
                  <div className="flex justify-between">
                    <span>5+ years</span>
                    <span className="font-medium">0 assets</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FixedAssets;
