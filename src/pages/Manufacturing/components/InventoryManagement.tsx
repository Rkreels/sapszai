import React, { useState } from 'react';
import { Box, Package, TrendingUp, BarChart2, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import DataTable from '../../../components/data/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { useForm } from 'react-hook-form';
import { Badge } from '../../../components/ui/badge';

interface InventoryItem {
  id: string;
  material: string;
  description: string;
  stockQuantity: number;
  unit: string;
  warehouse: string;
  location: string;
  reorderPoint: number;
  status: string;
}

interface MaterialFormData {
  material: string;
  description: string;
  stockQuantity: string;
  unit: string;
  warehouse: string;
  location: string;
  reorderPoint: string;
}

const InventoryManagement = () => {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([
    { 
      material: '1000234', 
      description: 'Widget A', 
      stockQuantity: 2450, 
      unit: 'EA',
      warehouse: 'WH-001',
      location: 'A-01-02',
      reorderPoint: 500,
      status: 'In Stock'
    },
    { 
      material: '1000235', 
      description: 'Widget B', 
      stockQuantity: 180, 
      unit: 'EA',
      warehouse: 'WH-001',
      location: 'A-02-03',
      reorderPoint: 200,
      status: 'Low Stock'
    },
    { 
      material: '1000236', 
      description: 'Component C', 
      stockQuantity: 5200, 
      unit: 'EA',
      warehouse: 'WH-002',
      location: 'B-03-01',
      reorderPoint: 1000,
      status: 'In Stock'
    },
    { 
      material: '1000237', 
      description: 'Raw Material D', 
      stockQuantity: 850, 
      unit: 'KG',
      warehouse: 'WH-003',
      location: 'C-01-04',
      reorderPoint: 400,
      status: 'In Stock'
    }
  ]);

  const [isAddMaterialDialogOpen, setIsAddMaterialDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const form = useForm<MaterialFormData>({
    defaultValues: {
      material: '',
      description: '',
      stockQuantity: '',
      unit: '',
      warehouse: '',
      location: '',
      reorderPoint: ''
    }
  });

  const updateInventoryStatus = (item: InventoryItem): InventoryItem => {
    let status = 'In Stock';
    if (item.stockQuantity <= item.reorderPoint * 0.5) {
      status = 'Critical';
    } else if (item.stockQuantity <= item.reorderPoint) {
      status = 'Low Stock';
    }
    return { ...item, status };
  };

  const handleAddMaterial = (data: MaterialFormData) => {
    const newItem: InventoryItem = {
      id: `MAT-${String(inventoryData.length + 1).padStart(3, '0')}`,
      material: data.material,
      description: data.description,
      stockQuantity: parseInt(data.stockQuantity),
      unit: data.unit,
      warehouse: data.warehouse,
      location: data.location,
      reorderPoint: parseInt(data.reorderPoint),
      status: 'In Stock'
    };
    
    const updatedItem = updateInventoryStatus(newItem);
    setInventoryData([...inventoryData, updatedItem]);
    setIsAddMaterialDialogOpen(false);
    form.reset();
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    form.reset({
      material: item.material,
      description: item.description,
      stockQuantity: item.stockQuantity.toString(),
      unit: item.unit,
      warehouse: item.warehouse,
      location: item.location,
      reorderPoint: item.reorderPoint.toString()
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
          stockQuantity: parseInt(data.stockQuantity),
          unit: data.unit,
          warehouse: data.warehouse,
          location: data.location,
          reorderPoint: parseInt(data.reorderPoint)
        };
        return updateInventoryStatus(updatedItem);
      }
      return item;
    }));
    
    setIsEditDialogOpen(false);
    setSelectedItem(null);
    form.reset();
  };

  const handleDeleteItem = (id: string) => {
    setInventoryData(inventoryData.filter(item => item.id !== id));
  };

  // Column definitions for the inventory table
  const columns = [
    { key: 'material', header: 'Material' },
    { key: 'description', header: 'Description' },
    { key: 'stockQuantity', header: 'Quantity' },
    { key: 'unit', header: 'Unit' },
    { key: 'warehouse', header: 'Warehouse' },
    { key: 'location', header: 'Storage Location' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        if (value === 'Critical') variant = 'destructive';
        if (value === 'Low Stock') variant = 'secondary';
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Inventory Items</h3>
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddMaterial)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="material"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="stockQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                            <SelectItem value="EA">Each</SelectItem>
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
                  <FormField
                    control={form.control}
                    name="warehouse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Warehouse</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Storage Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center mb-2">
            <Box className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium">Material Master</h3>
          </div>
          <p className="text-xs text-gray-500">View and manage material data</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center mb-2">
            <Package className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium">Stock Overview</h3>
          </div>
          <p className="text-xs text-gray-500">Check inventory levels across warehouses</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium">Stock Movements</h3>
          </div>
          <p className="text-xs text-gray-500">Track and process inventory transactions</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center mb-2">
            <BarChart2 className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium">Inventory Reports</h3>
          </div>
          <p className="text-xs text-gray-500">Access inventory analytics and reports</p>
        </div>
      </div>
      
      <DataTable columns={columns} data={inventoryData} className="w-full" />

      {/* Edit Material Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateItem)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stockQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                          <SelectItem value="EA">Each</SelectItem>
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
                <FormField
                  control={form.control}
                  name="warehouse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warehouse</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
