
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Plus, Edit, Eye, Package, Search, Filter, Tag } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';

interface CatalogItem {
  id: string;
  itemCode: string;
  description: string;
  category: string;
  supplier: string;
  unitPrice: number;
  currency: string;
  uom: string;
  status: 'Active' | 'Inactive' | 'Discontinued';
  lastUpdated: string;
  specifications: string;
}

const CatalogManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('catalog');
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Catalog Management. Manage product catalogs, pricing, and supplier catalogs for streamlined procurement.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    const sampleItems: CatalogItem[] = [
      {
        id: 'cat-001',
        itemCode: 'LAP-DEL-001',
        description: 'Dell Latitude 7420 Laptop',
        category: 'IT Equipment',
        supplier: 'Dell Technologies',
        unitPrice: 1250.00,
        currency: 'USD',
        uom: 'Each',
        status: 'Active',
        lastUpdated: '2025-01-20',
        specifications: '14" Display, Intel i7, 16GB RAM, 512GB SSD'
      },
      {
        id: 'cat-002',
        itemCode: 'OFF-PEN-001',
        description: 'Blue Ballpoint Pen',
        category: 'Office Supplies',
        supplier: 'Office Depot',
        unitPrice: 1.25,
        currency: 'USD',
        uom: 'Each',
        status: 'Active',
        lastUpdated: '2025-01-18',
        specifications: 'Blue ink, retractable, medium point'
      }
    ];
    setCatalogItems(sampleItems);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-yellow-100 text-yellow-800',
      'Discontinued': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: EnhancedColumn[] = [
    { key: 'itemCode', header: 'Item Code', sortable: true, searchable: true },
    { key: 'description', header: 'Description', searchable: true },
    { key: 'category', header: 'Category', filterable: true, filterOptions: [
      { label: 'IT Equipment', value: 'IT Equipment' },
      { label: 'Office Supplies', value: 'Office Supplies' },
      { label: 'Furniture', value: 'Furniture' },
      { label: 'Services', value: 'Services' }
    ]},
    { key: 'supplier', header: 'Supplier', searchable: true },
    { 
      key: 'unitPrice', 
      header: 'Unit Price',
      sortable: true,
      render: (value: number, row: CatalogItem) => `${row.currency} ${value.toFixed(2)}`
    },
    { key: 'uom', header: 'UOM' },
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
        { label: 'Discontinued', value: 'Discontinued' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    { key: 'lastUpdated', header: 'Last Updated', sortable: true }
  ];

  const actions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: CatalogItem) => {
        toast({
          title: 'View Item',
          description: `Opening details for ${row.itemCode}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: CatalogItem) => {
        toast({
          title: 'Edit Item',
          description: `Editing ${row.itemCode}`,
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
          title="Catalog Management"
          description="Manage product catalogs, pricing, and supplier catalogs"
          voiceIntroduction="Welcome to Catalog Management for comprehensive catalog administration."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{catalogItems.length}</div>
            <div className="text-sm text-muted-foreground">Total Items</div>
            <div className="text-sm text-blue-600">In catalog</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {catalogItems.filter(item => item.status === 'Active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active Items</div>
            <div className="text-sm text-green-600">Available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">15</div>
            <div className="text-sm text-muted-foreground">Categories</div>
            <div className="text-sm text-purple-600">Well organized</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">45</div>
            <div className="text-sm text-muted-foreground">Suppliers</div>
            <div className="text-sm text-orange-600">Contributing</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="catalog">Catalog Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Catalog Items
                <Button onClick={() => toast({ title: 'Add Item', description: 'Opening item creation form' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={columns}
                data={catalogItems}
                actions={actions}
                searchPlaceholder="Search catalog items..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['IT Equipment', 'Office Supplies', 'Furniture', 'Services', 'Manufacturing', 'Maintenance'].map((category) => (
                  <div key={category} className="p-4 border rounded">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{category}</h4>
                      <Badge variant="outline">
                        {catalogItems.filter(item => item.category === category).length} items
                      </Badge>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded">
                    <h4 className="font-semibold mb-2">Price Updates</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Pending Updates:</span>
                        <span className="font-medium">8</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Scheduled Updates:</span>
                        <span className="font-medium">3</span>
                      </div>
                      <Button size="sm" className="w-full mt-2">
                        Bulk Price Update
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 border rounded">
                    <h4 className="font-semibold mb-2">Price Analytics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Avg. Price Change:</span>
                        <span className="font-medium text-green-600">+2.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price Stability:</span>
                        <span className="font-medium">High</span>
                      </div>
                      <Button size="sm" className="w-full mt-2" variant="outline">
                        View Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Catalog Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded">
                    <h4 className="font-semibold mb-2">Usage Statistics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Most Ordered Category:</span>
                        <span className="font-medium">IT Equipment</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Catalog Utilization:</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg. Order Value:</span>
                        <span className="font-medium">$1,245</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['IT Equipment', 'Office Supplies', 'Furniture', 'Services'].map((category) => {
                    const count = catalogItems.filter(item => item.category === category).length;
                    const percentage = catalogItems.length > 0 ? Math.round((count / catalogItems.length) * 100) : 0;
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{category}</span>
                          <span>{count} items ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
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

export default CatalogManagement;
