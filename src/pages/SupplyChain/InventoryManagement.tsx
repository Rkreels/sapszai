
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Package, AlertTriangle, TrendingUp, Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useForm } from 'react-hook-form';

interface InventoryItem {
  id: string;
  material: string;
  description: string;
  currentStock: number;
  reorderPoint: number;
  maxStock: number;
  unit: string;
  value: string;
  status: string;
}

interface Movement {
  id: string;
  type: string;
  material: string;
  quantity: string;
  date: string;
  reference: string;
}

interface MaterialFormData {
  material: string;
  description: string;
  currentStock: string;
  reorderPoint: string;
  maxStock: string;
  unit: string;
}

interface MovementFormData {
  type: string;
  material: string;
  quantity: string;
  reference: string;
}

const InventoryManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddMaterialDialogOpen, setIsAddMaterialDialogOpen] = useState(false);
  const [isRecordMovementDialogOpen, setIsRecordMovementDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const materialForm = useForm<MaterialFormData>({
    defaultValues: {
      material: '',
      description: '',
      currentStock: '',
      reorderPoint: '',
      maxStock: '',
      unit: ''
    }
  });

  const movementForm = useForm<MovementFormData>({
    defaultValues: {
      type: '',
      material: '',
      quantity: '',
      reference: ''
    }
  });

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Inventory Management. Here you can manage stock levels, track inventory movements, and optimize warehouse operations.');
    }
  }, [isEnabled, speak]);

  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([
    { id: 'INV-001', material: 'Steel Pipes', description: 'Carbon Steel Pipes 20mm', currentStock: 2500, reorderPoint: 500, maxStock: 5000, unit: 'PCS', value: '125,000', status: 'Normal' },
    { id: 'INV-002', material: 'Copper Wire', description: 'Electrical Copper Wire 2.5mm', currentStock: 150, reorderPoint: 200, maxStock: 1000, unit: 'M', value: '45,000', status: 'Below Reorder' },
    { id: 'INV-003', material: 'Aluminum Sheets', description: 'Aluminum Sheets 1.5mm Thick', currentStock: 800, reorderPoint: 100, maxStock: 1200, unit: 'SQM', value: '96,000', status: 'Normal' },
    { id: 'INV-004', material: 'Fasteners', description: 'Stainless Steel Bolts M8', currentStock: 50, reorderPoint: 100, maxStock: 500, unit: 'PCS', value: '8,500', status: 'Critical' },
  ]);

  const [movementData, setMovementData] = useState<Movement[]>([
    { id: 'MOV-001', type: 'Goods Receipt', material: 'Steel Pipes', quantity: '+500', date: '2025-05-20', reference: 'PO-4500012765' },
    { id: 'MOV-002', type: 'Goods Issue', material: 'Copper Wire', quantity: '-75', date: '2025-05-19', reference: 'SO-3000045632' },
    { id: 'MOV-003', type: 'Transfer', material: 'Aluminum Sheets', quantity: '-200', date: '2025-05-18', reference: 'TR-2000012345' },
    { id: 'MOV-004', type: 'Physical Count', material: 'Fasteners', quantity: '-5', date: '2025-05-17', reference: 'PC-1000067890' },
  ]);

  const updateInventoryStatus = (item: InventoryItem): InventoryItem => {
    let status = 'Normal';
    if (item.currentStock <= item.reorderPoint * 0.5) {
      status = 'Critical';
    } else if (item.currentStock <= item.reorderPoint) {
      status = 'Below Reorder';
    }
    return { ...item, status };
  };

  const handleAddMaterial = (data: MaterialFormData) => {
    const newItem: InventoryItem = {
      id: `INV-${String(inventoryData.length + 1).padStart(3, '0')}`,
      material: data.material,
      description: data.description,
      currentStock: parseInt(data.currentStock),
      reorderPoint: parseInt(data.reorderPoint),
      maxStock: parseInt(data.maxStock),
      unit: data.unit,
      value: '0',
      status: 'Normal'
    };
    
    const updatedItem = updateInventoryStatus(newItem);
    setInventoryData([...inventoryData, updatedItem]);
    setIsAddMaterialDialogOpen(false);
    materialForm.reset();
  };

  const handleRecordMovement = (data: MovementFormData) => {
    const quantity = parseInt(data.quantity);
    const quantityStr = quantity >= 0 ? `+${quantity}` : `${quantity}`;
    
    const newMovement: Movement = {
      id: `MOV-${String(movementData.length + 1).padStart(3, '0')}`,
      type: data.type,
      material: data.material,
      quantity: quantityStr,
      date: new Date().toISOString().split('T')[0],
      reference: data.reference
    };
    
    setMovementData([...movementData, newMovement]);
    
    // Update inventory stock
    setInventoryData(inventoryData.map(item => {
      if (item.material === data.material) {
        const updatedItem = { ...item, currentStock: item.currentStock + quantity };
        return updateInventoryStatus(updatedItem);
      }
      return item;
    }));
    
    setIsRecordMovementDialogOpen(false);
    movementForm.reset();
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    materialForm.reset({
      material: item.material,
      description: item.description,
      currentStock: item.currentStock.toString(),
      reorderPoint: item.reorderPoint.toString(),
      maxStock: item.maxStock.toString(),
      unit: item.unit
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateItem = (data: MaterialFormData) => {
    if (!selectedItem) return;
    
    setInventoryData(inventoryData.map(item => {
      if (item.id === selectedItem.id) {
        const updatedItem: InventoryItem = {
          ...item,
          material: data.material,
          description: data.description,
          currentStock: parseInt(data.currentStock),
          reorderPoint: parseInt(data.reorderPoint),
          maxStock: parseInt(data.maxStock),
          unit: data.unit
        };
        return updateInventoryStatus(updatedItem);
      }
      return item;
    }));
    
    setIsEditDialogOpen(false);
    setSelectedItem(null);
    materialForm.reset();
  };

  const handleDeleteItem = (id: string) => {
    setInventoryData(inventoryData.filter(item => item.id !== id));
  };

  const inventoryColumns = [
    { key: 'material', header: 'Material' },
    { key: 'description', header: 'Description' },
    { key: 'currentStock', header: 'Current Stock' },
    { key: 'reorderPoint', header: 'Reorder Point' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        if (value === 'Critical') variant = 'destructive';
        if (value === 'Below Reorder') variant = 'secondary';
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
    { key: 'value', header: 'Value ($)' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_: string, row: any) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => alert(`Viewing details for ${row.material}`)}>
            <Eye className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleEditItem(row)}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDeleteItem(row.id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )
    }
  ];

  const movementColumns = [
    { key: 'type', header: 'Movement Type' },
    { key: 'material', header: 'Material' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'date', header: 'Date' },
    { key: 'reference', header: 'Reference' },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/supply-chain')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Inventory Management"
          description="Manage stock levels, track movements, and optimize inventory"
          voiceIntroduction="Welcome to Inventory Management. Track and optimize your inventory levels."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">2,847</h3>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">23</h3>
              <p className="text-sm text-gray-600">Below Reorder</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">$2.8M</h3>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">156</h3>
              <p className="text-sm text-gray-600">Movements Today</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stock">Stock Levels</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Inventory Overview</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Dialog open={isAddMaterialDialogOpen} onOpenChange={setIsAddMaterialDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Material
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Material</DialogTitle>
                  </DialogHeader>
                  <Form {...materialForm}>
                    <form onSubmit={materialForm.handleSubmit(handleAddMaterial)} className="space-y-4">
                      <FormField
                        control={materialForm.control}
                        name="material"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Material Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={materialForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={materialForm.control}
                          name="currentStock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Stock</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={materialForm.control}
                          name="reorderPoint"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reorder Point</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={materialForm.control}
                          name="maxStock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Stock</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={materialForm.control}
                          name="unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select unit" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="PCS">Pieces</SelectItem>
                                  <SelectItem value="KG">Kilograms</SelectItem>
                                  <SelectItem value="M">Meters</SelectItem>
                                  <SelectItem value="SQM">Square Meters</SelectItem>
                                  <SelectItem value="L">Liters</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddMaterialDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Add Material</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Card className="p-6">
            <DataTable columns={inventoryColumns} data={inventoryData} />
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Stock Level Analysis</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-green-700">Normal Stock</h4>
                  <p className="text-2xl font-bold">2,785</p>
                  <p className="text-sm text-gray-600">Items in normal range</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-orange-700">Below Reorder</h4>
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-sm text-gray-600">Items need reordering</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-red-700">Critical Level</h4>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-gray-600">Items at critical level</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Inventory Movements</h2>
            <Dialog open={isRecordMovementDialogOpen} onOpenChange={setIsRecordMovementDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Record Movement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record Inventory Movement</DialogTitle>
                </DialogHeader>
                <Form {...movementForm}>
                  <form onSubmit={movementForm.handleSubmit(handleRecordMovement)} className="space-y-4">
                    <FormField
                      control={movementForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Movement Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select movement type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Goods Receipt">Goods Receipt</SelectItem>
                              <SelectItem value="Goods Issue">Goods Issue</SelectItem>
                              <SelectItem value="Transfer">Transfer</SelectItem>
                              <SelectItem value="Physical Count">Physical Count</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={movementForm.control}
                      name="material"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select material" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {inventoryData.map((item) => (
                                <SelectItem key={item.id} value={item.material}>
                                  {item.material}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={movementForm.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity (use negative for issues)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={movementForm.control}
                        name="reference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reference</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsRecordMovementDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Record Movement</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card className="p-6">
            <DataTable columns={movementColumns} data={movementData} />
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Inventory Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Top Moving Items</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 border-b">
                    <span>Steel Pipes</span>
                    <span className="font-medium">245 movements</span>
                  </div>
                  <div className="flex justify-between p-2 border-b">
                    <span>Copper Wire</span>
                    <span className="font-medium">198 movements</span>
                  </div>
                  <div className="flex justify-between p-2 border-b">
                    <span>Aluminum Sheets</span>
                    <span className="font-medium">156 movements</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Slow Moving Items</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 border-b">
                    <span>Special Gaskets</span>
                    <span className="font-medium">2 movements</span>
                  </div>
                  <div className="flex justify-between p-2 border-b">
                    <span>Rare Earth Elements</span>
                    <span className="font-medium">1 movement</span>
                  </div>
                  <div className="flex justify-between p-2 border-b">
                    <span>Custom Components</span>
                    <span className="font-medium">0 movements</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Material Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
          </DialogHeader>
          <Form {...materialForm}>
            <form onSubmit={materialForm.handleSubmit(handleUpdateItem)} className="space-y-4">
              <FormField
                control={materialForm.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={materialForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={materialForm.control}
                  name="currentStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Stock</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={materialForm.control}
                  name="reorderPoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reorder Point</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={materialForm.control}
                  name="maxStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Stock</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={materialForm.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PCS">Pieces</SelectItem>
                          <SelectItem value="KG">Kilograms</SelectItem>
                          <SelectItem value="M">Meters</SelectItem>
                          <SelectItem value="SQM">Square Meters</SelectItem>
                          <SelectItem value="L">Liters</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Material</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManagement;
