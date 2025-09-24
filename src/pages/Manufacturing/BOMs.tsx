
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';
import { ArrowLeft, Plus, Edit, Copy, FileText, Eye, Trash2, Download } from 'lucide-react';
import { listEntities, upsertEntity, removeEntity, generateId } from '../../lib/localCrud';

interface BOM {
  id: string;
  bomId: string;
  material: string;
  materialDescription: string;
  version: string;
  status: 'Active' | 'Draft' | 'Inactive' | 'Expired';
  validFrom: string;
  validTo: string;
  plant: string;
  baseQuantity: number;
  baseUnit: string;
  bomUsage: string;
  bomCategory: string;
  components: Component[];
  createdBy: string;
  createdDate: string;
  lastModified: string;
}

interface Component {
  id: string;
  itemNumber: number;
  componentMaterial: string;
  componentDescription: string;
  quantity: number;
  unit: string;
  scrapPercentage: number;
  validFrom: string;
  validTo: string;
  componentType: 'Material' | 'Text' | 'Document';
  procurementType: 'Buy' | 'Make' | 'Transfer';
}

const BOMs: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('boms');
  const [boms, setBOMs] = useState<BOM[]>([]);
  const [selectedBOM, setSelectedBOM] = useState<BOM | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Bill of Materials Management. Create and manage BOMs, component structures, and manufacturing specifications with comprehensive version control.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    loadBOMs();
  }, []);

  const loadBOMs = () => {
    const existingBOMs = listEntities<BOM>('boms');
    if (existingBOMs.length === 0) {
      const sampleBOMs: BOM[] = [
        {
          id: generateId('bom'),
          bomId: 'BOM-001',
          material: 'MAT-WIDGET-A',
          materialDescription: 'Widget A - Premium Model',
          version: '1.2',
          status: 'Active',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          plant: 'Plant 1000',
          baseQuantity: 1,
          baseUnit: 'EA',
          bomUsage: 'Production',
          bomCategory: 'Material BOM',
          components: [
            {
              id: generateId('comp'),
              itemNumber: 10,
              componentMaterial: 'MAT-BASE-001',
              componentDescription: 'Base Component Steel',
              quantity: 2,
              unit: 'KG',
              scrapPercentage: 5,
              validFrom: '2025-01-01',
              validTo: '2025-12-31',
              componentType: 'Material',
              procurementType: 'Buy'
            },
            {
              id: generateId('comp'),
              itemNumber: 20,
              componentMaterial: 'MAT-SCREW-001',
              componentDescription: 'Stainless Steel Screws M6x20',
              quantity: 8,
              unit: 'PC',
              scrapPercentage: 2,
              validFrom: '2025-01-01',
              validTo: '2025-12-31',
              componentType: 'Material',
              procurementType: 'Buy'
            }
          ],
          createdBy: 'Manufacturing Engineer',
          createdDate: '2025-01-15',
          lastModified: '2025-01-28'
        }
      ];
      
      sampleBOMs.forEach(bom => upsertEntity('boms', bom));
      setBOMs(sampleBOMs);
    } else {
      setBOMs(existingBOMs);
    }
  };

  const handleCreateBOM = () => {
    setSelectedBOM(null);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditBOM = (bom: BOM) => {
    setSelectedBOM(bom);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteBOM = (bomId: string) => {
    removeEntity('boms', bomId);
    setBOMs(prev => prev.filter(b => b.id !== bomId));
    toast({
      title: 'BOM Deleted',
      description: 'Bill of Materials has been successfully deleted.',
    });
  };

  const handleSaveBOM = (bomData: Partial<BOM>) => {
    if (isEditing && selectedBOM) {
      const updatedBOM = { ...selectedBOM, ...bomData };
      upsertEntity('boms', updatedBOM);
      setBOMs(prev => prev.map(b => b.id === selectedBOM.id ? updatedBOM : b));
      toast({
        title: 'BOM Updated',
        description: 'Bill of Materials has been successfully updated.',
      });
    } else {
      const newBOM: BOM = {
        id: generateId('bom'),
        bomId: `BOM-${String(boms.length + 1).padStart(3, '0')}`,
        components: [],
        createdBy: 'Current User',
        createdDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        ...bomData as BOM
      };
      upsertEntity('boms', newBOM);
      setBOMs(prev => [...prev, newBOM]);
      toast({
        title: 'BOM Created',
        description: 'New Bill of Materials has been successfully created.',
      });
    }
    setIsDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Draft': 'bg-yellow-100 text-yellow-800',
      'Inactive': 'bg-gray-100 text-gray-800',
      'Expired': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: EnhancedColumn[] = [
    { key: 'bomId', header: 'BOM ID', sortable: true, searchable: true },
    { key: 'material', header: 'Material', searchable: true },
    { key: 'materialDescription', header: 'Description', searchable: true },
    { key: 'version', header: 'Version', sortable: true },
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Active', value: 'Active' },
        { label: 'Draft', value: 'Draft' },
        { label: 'Inactive', value: 'Inactive' },
        { label: 'Expired', value: 'Expired' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    { key: 'plant', header: 'Plant', searchable: true },
    { 
      key: 'baseQuantity', 
      header: 'Base Qty',
      render: (value: number, row: BOM) => `${value} ${row.baseUnit}`
    },
    { 
      key: 'components', 
      header: 'Components',
      render: (_, row: BOM) => row.components.length
    },
    { key: 'validFrom', header: 'Valid From', sortable: true },
    { key: 'validTo', header: 'Valid To', sortable: true }
  ];

  const actions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: BOM) => {
        setSelectedBOM(row);
        setActiveTab('details');
      },
      variant: 'ghost'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: BOM) => handleEditBOM(row),
      variant: 'ghost'
    },
    {
      label: 'Copy',
      icon: <Copy className="h-4 w-4" />,
      onClick: (row: BOM) => {
        const copiedBOM = {
          ...row,
          id: generateId('bom'),
          bomId: `BOM-${String(boms.length + 1).padStart(3, '0')}`,
          version: '1.0',
          status: 'Draft' as const
        };
        handleSaveBOM(copiedBOM);
      },
      variant: 'ghost'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row: BOM) => handleDeleteBOM(row.id),
      variant: 'ghost'
    }
  ];

  const componentColumns: EnhancedColumn[] = [
    { key: 'itemNumber', header: 'Item', sortable: true },
    { key: 'componentMaterial', header: 'Component', searchable: true },
    { key: 'componentDescription', header: 'Description', searchable: true },
    { 
      key: 'quantity', 
      header: 'Quantity',
      render: (value: number, row: Component) => `${value} ${row.unit}`
    },
    { 
      key: 'scrapPercentage', 
      header: 'Scrap %',
      render: (value: number) => `${value}%`
    },
    { key: 'componentType', header: 'Type' },
    { key: 'procurementType', header: 'Procurement' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/manufacturing')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Bill of Materials Management"
          description="Create and manage BOMs, component structures, and manufacturing specifications"
          voiceIntroduction="Welcome to comprehensive Bill of Materials Management with version control."
        />
      </div>

      <VoiceTrainingComponent 
        module="manufacturing"
        topic="Bill of Materials Management"
        examples={[
          "Creating multi-level BOMs with component specifications, routing information, and material master data integration",
          "Managing BOM versions and change control with engineering change management and approval workflows",
          "Processing BOM explosions and where-used analysis for manufacturing planning and cost calculation"
        ]}
        detailLevel="advanced"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{boms.length}</div>
            <div className="text-sm text-muted-foreground">Total BOMs</div>
            <div className="text-sm text-blue-600">All versions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {boms.filter(b => b.status === 'Active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active BOMs</div>
            <div className="text-sm text-green-600">Currently used</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {boms.filter(b => b.status === 'Draft').length}
            </div>
            <div className="text-sm text-muted-foreground">Draft BOMs</div>
            <div className="text-sm text-yellow-600">Pending approval</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {boms.length > 0 ? Math.round(boms.reduce((sum, b) => sum + b.components.length, 0) / boms.length * 10) / 10 : 0}
            </div>
            <div className="text-sm text-muted-foreground">Avg Components</div>
            <div className="text-sm text-purple-600">Per BOM</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="boms">BOMs</TabsTrigger>
          <TabsTrigger value="create">Create BOM</TabsTrigger>
          <TabsTrigger value="details">BOM Details</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="boms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Bill of Materials
                <Button onClick={handleCreateBOM}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create BOM
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={columns}
                data={boms}
                actions={actions}
                searchPlaceholder="Search BOMs..."
                exportable={true}
                refreshable={true}
                onRefresh={loadBOMs}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <BOMForm 
            bom={selectedBOM}
            onSave={handleSaveBOM}
            onCancel={() => setActiveTab('boms')}
          />
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedBOM ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>BOM Details: {selectedBOM.bomId}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Material</Label>
                      <div className="font-medium">{selectedBOM.material}</div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <div>{selectedBOM.materialDescription}</div>
                    </div>
                    <div>
                      <Label>Version</Label>
                      <div>{selectedBOM.version}</div>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge className={getStatusColor(selectedBOM.status)}>
                        {selectedBOM.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Components ({selectedBOM.components.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <EnhancedDataTable 
                    columns={componentColumns}
                    data={selectedBOM.components}
                    searchPlaceholder="Search components..."
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Select a BOM to view details</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>BOM Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Active', 'Draft', 'Inactive', 'Expired'].map((status) => {
                    const count = boms.filter(b => b.status === status).length;
                    return (
                      <div key={status} className="flex justify-between">
                        <span>{status}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Component Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Components</span>
                    <span className="font-medium">
                      {boms.reduce((sum, b) => sum + b.components.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unique Materials</span>
                    <span className="font-medium">{boms.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Complex BOMs (&gt;10 components)</span>
                    <span className="font-medium">
                      {boms.filter(b => b.components.length > 10).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit BOM' : 'Create New BOM'}</DialogTitle>
          </DialogHeader>
          <BOMForm 
            bom={selectedBOM}
            onSave={handleSaveBOM}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const BOMForm: React.FC<{
  bom: BOM | null;
  onSave: (data: Partial<BOM>) => void;
  onCancel: () => void;
}> = ({ bom, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    material: bom?.material || '',
    materialDescription: bom?.materialDescription || '',
    version: bom?.version || '1.0',
    status: bom?.status || 'Draft',
    plant: bom?.plant || 'Plant 1000',
    baseQuantity: bom?.baseQuantity || 1,
    baseUnit: bom?.baseUnit || 'EA',
    bomUsage: bom?.bomUsage || 'Production',
    bomCategory: bom?.bomCategory || 'Material BOM',
    validFrom: bom?.validFrom || new Date().toISOString().split('T')[0],
    validTo: bom?.validTo || '2025-12-31'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="material">Material</Label>
          <Input
            id="material"
            value={formData.material}
            onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="materialDescription">Description</Label>
          <Input
            id="materialDescription"
            value={formData.materialDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, materialDescription: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            value={formData.version}
            onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: 'Active' | 'Draft' | 'Inactive' | 'Expired') => setFormData(prev => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="plant">Plant</Label>
          <Input
            id="plant"
            value={formData.plant}
            onChange={(e) => setFormData(prev => ({ ...prev, plant: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {bom ? 'Update' : 'Create'} BOM
        </Button>
      </div>
    </form>
  );
};

export default BOMs;
