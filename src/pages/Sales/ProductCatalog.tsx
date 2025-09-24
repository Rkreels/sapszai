
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/page/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Search, Filter, Plus, Edit, Archive, Eye, Trash2, Settings, Upload, Download } from 'lucide-react';
import DataTable from '../../components/data/DataTable';
import { useToast } from '../../hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useForm } from 'react-hook-form';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: 'Active' | 'Low Stock' | 'Out of Stock' | 'Discontinued';
  description?: string;
  sku?: string;
  weight?: string;
  dimensions?: string;
  supplier?: string;
  cost?: string;
  margin?: string;
}

interface ProductFormData {
  name: string;
  category: string;
  price: string;
  stock: string;
  sku?: string;
  description?: string;
  weight?: string;
  dimensions?: string;
  supplier?: string;
  cost?: string;
}

const ProductCatalog: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const form = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      category: '',
      price: '',
      stock: '',
      sku: '',
      description: '',
      weight: '',
      dimensions: '',
      supplier: '',
      cost: ''
    }
  });

  // Sample product data
  const initialProducts: Product[] = [
    { 
      id: "PROD-10001", 
      name: "Professional Server Rack", 
      category: "Hardware", 
      price: "€2,450.00", 
      stock: 24,
      status: "Active",
      sku: "HW-SR-001",
      description: "42U server rack with cable management",
      weight: "45 kg",
      dimensions: "2000x600x1000 mm",
      supplier: "TechSupplier Inc",
      cost: "€1,850.00"
    },
    { 
      id: "PROD-10002", 
      name: "Enterprise Database License", 
      category: "Software", 
      price: "€12,850.00", 
      stock: 150,
      status: "Active",
      sku: "SW-DBL-001",
      description: "Enterprise database license for 100 users",
      supplier: "Software Corp",
      cost: "€8,500.00"
    },
    { 
      id: "PROD-10003", 
      name: "Network Security Firewall", 
      category: "Security", 
      price: "€8,750.00", 
      stock: 12,
      status: "Active",
      sku: "SEC-FW-001",
      description: "Next-generation firewall with UTM",
      weight: "5 kg",
      dimensions: "440x350x45 mm",
      supplier: "Security Solutions Ltd",
      cost: "€6,200.00"
    }
  ];

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setProducts(initialProducts);
      setFilteredProducts(initialProducts);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const updateProductStatus = (product: Product): Product => {
    let status: Product['status'] = 'Active';
    if (product.stock === 0) {
      status = 'Out of Stock';
    } else if (product.stock < 10) {
      status = 'Low Stock';
    }
    return { ...product, status };
  };

  const handleCreateProduct = (data: ProductFormData) => {
    const newProduct: Product = {
      id: `PROD-${String(products.length + 1).padStart(5, '0')}`,
      name: data.name,
      category: data.category,
      price: data.price,
      stock: parseInt(data.stock),
      status: 'Active',
      sku: data.sku,
      description: data.description,
      weight: data.weight,
      dimensions: data.dimensions,
      supplier: data.supplier,
      cost: data.cost,
      margin: data.cost && data.price ? 
        `${Math.round((parseFloat(data.price.replace('€', '').replace(',', '')) - parseFloat(data.cost.replace('€', '').replace(',', ''))) / parseFloat(data.cost.replace('€', '').replace(',', '')) * 100)}%` : 
        undefined
    };

    const updatedProduct = updateProductStatus(newProduct);
    setProducts([...products, updatedProduct]);
    setIsCreateDialogOpen(false);
    form.reset();
    
    toast({
      title: "Product Created",
      description: `${data.name} has been added to the catalog.`,
    });
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    form.reset({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock.toString(),
      sku: product.sku || '',
      description: product.description || '',
      weight: product.weight || '',
      dimensions: product.dimensions || '',
      supplier: product.supplier || '',
      cost: product.cost || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = (data: ProductFormData) => {
    if (!selectedProduct) return;
    
    const updatedProduct: Product = {
      ...selectedProduct,
      name: data.name,
      category: data.category,
      price: data.price,
      stock: parseInt(data.stock),
      sku: data.sku,
      description: data.description,
      weight: data.weight,
      dimensions: data.dimensions,
      supplier: data.supplier,
      cost: data.cost,
      margin: data.cost && data.price ? 
        `${Math.round((parseFloat(data.price.replace('€', '').replace(',', '')) - parseFloat(data.cost.replace('€', '').replace(',', ''))) / parseFloat(data.cost.replace('€', '').replace(',', '')) * 100)}%` : 
        selectedProduct.margin
    };

    const finalProduct = updateProductStatus(updatedProduct);
    setProducts(products.map(p => p.id === selectedProduct.id ? finalProduct : p));
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
    form.reset();
    
    toast({
      title: "Product Updated",
      description: `${data.name} has been updated.`,
    });
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: "Product Deleted",
        description: "Product has been removed from the catalog.",
      });
    }
  };

  const handleArchiveProduct = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, status: 'Discontinued' as const } : p
    ));
    toast({
      title: "Product Archived",
      description: "Product has been archived.",
    });
  };

  const handleImportProducts = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({ 
          title: 'Import Started', 
          description: `Importing products from ${file.name}` 
        });
      }
    };
    input.click();
  };

  const handleExportProducts = () => {
    const csvData = [
      ['Product ID', 'Name', 'Category', 'Price', 'Stock', 'Status', 'SKU', 'Supplier'],
      ...products.map(p => [p.id, p.name, p.category, p.price, p.stock, p.status, p.sku || '', p.supplier || ''])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast({ 
      title: 'Export Complete', 
      description: 'Product catalog exported successfully' 
    });
  };

  // Product columns configuration
  const productColumns = [
    { key: "id", header: "Product ID" },
    { key: "name", header: "Product Name" },
    { key: "category", header: "Category" },
    { key: "price", header: "Price" },
    { 
      key: "stock", 
      header: "Stock",
      render: (value: number) => (
        <span className={value === 0 ? 'text-red-500 font-medium' : value < 10 ? 'text-amber-500 font-medium' : ''}>
          {value}
        </span>
      )
    },
    { 
      key: "status", 
      header: "Status",
      render: (value: string) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        if (value === 'Out of Stock') variant = 'destructive';
        if (value === 'Low Stock') variant = 'secondary';
        if (value === 'Discontinued') variant = 'outline';
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
    { 
      key: "actions", 
      header: "Actions",
      render: (_, row: any) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              toast({
                title: "Product Details",
                description: `Viewing details for ${row.name}`,
              });
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleEditProduct(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleArchiveProduct(row.id)}
          >
            <Archive className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleDeleteProduct(row.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        title="Product Catalog" 
        description="Manage your products and services catalog"
        voiceIntroduction="Welcome to the Product Catalog. Here you can manage all your products and services offered to customers."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center w-full max-w-md relative">
                <Search className="h-4 w-4 absolute left-3 text-gray-400" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleImportProducts}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" onClick={handleExportProducts}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleCreateProduct)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>SKU</FormLabel>
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
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Hardware">Hardware</SelectItem>
                                    <SelectItem value="Software">Software</SelectItem>
                                    <SelectItem value="Services">Services</SelectItem>
                                    <SelectItem value="Security">Security</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="supplier"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Supplier</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price (€)</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="cost"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cost (€)</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stock</FormLabel>
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
                            name="weight"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Weight</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dimensions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Dimensions</FormLabel>
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
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Create Product</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <DataTable 
                columns={productColumns}
                data={filteredProducts}
                className="border rounded-md"
              />
            )}

            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredProducts.length} of {productsData.length} products
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
              <div className="space-y-3">
                {['Hardware', 'Software', 'Services', 'Security'].map((category) => (
                  <div key={category} className="flex justify-between items-center">
                    <span>{category}</span>
                    <Badge variant="outline">
                      {productsData.filter(p => p.category === category).length} items
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">Manage Categories</Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Inventory Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>In Stock</span>
                  <Badge variant="outline">
                    {productsData.filter(p => p.stock > 0).length} items
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Low Stock</span>
                  <Badge variant="secondary">
                    {productsData.filter(p => p.stock > 0 && p.stock < 10).length} items
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Out of Stock</span>
                  <Badge variant="destructive">
                    {productsData.filter(p => p.stock === 0).length} items
                  </Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">View Inventory Report</Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Import Products
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Export Catalog
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Price Updates
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Product Media
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your product categories and hierarchies.
            </p>
            
            <div className="border rounded-md p-6 text-center">
              <p>Category management interface would be implemented here in a real application</p>
              <p className="text-sm mt-2">Including category hierarchy, attributes, and assignment tools</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="pricing">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Pricing Management</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your pricing strategies, customer price lists, and discounts.
            </p>
            
            <div className="border rounded-md p-6 text-center">
              <p>Pricing management interface would be implemented here in a real application</p>
              <p className="text-sm mt-2">Including price lists, discount structures, and pricing conditions</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductCatalog;
