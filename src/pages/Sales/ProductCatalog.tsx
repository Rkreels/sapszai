
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/page/PageHeader';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Search, Filter, Plus, Edit, Archive } from 'lucide-react';
import DataTable from '../../components/data/DataTable';
import { useToast } from '../../hooks/use-toast';

// Sample product data
const productsData = [
  { 
    id: "PROD-10001", 
    name: "Professional Server Rack", 
    category: "Hardware", 
    price: "€2,450.00", 
    stock: 24,
    status: "Active"
  },
  { 
    id: "PROD-10002", 
    name: "Enterprise Database License", 
    category: "Software", 
    price: "€12,850.00", 
    stock: 150,
    status: "Active"
  },
  { 
    id: "PROD-10003", 
    name: "Network Security Firewall", 
    category: "Security", 
    price: "€8,750.00", 
    stock: 12,
    status: "Active"
  },
  { 
    id: "PROD-10004", 
    name: "Cloud Storage Subscription (Monthly)", 
    category: "Services", 
    price: "€350.00", 
    stock: 999,
    status: "Active"
  },
  { 
    id: "PROD-10005", 
    name: "Professional IT Support (Hours)", 
    category: "Services", 
    price: "€125.00", 
    stock: 500,
    status: "Active"
  },
  { 
    id: "PROD-10006", 
    name: "High Performance Workstation", 
    category: "Hardware", 
    price: "€3,850.00", 
    stock: 8,
    status: "Low Stock"
  },
  { 
    id: "PROD-10007", 
    name: "Office Productivity Suite", 
    category: "Software", 
    price: "€450.00", 
    stock: 200,
    status: "Active"
  },
  { 
    id: "PROD-10008", 
    name: "Server Maintenance Package", 
    category: "Services", 
    price: "€1,800.00", 
    stock: 30,
    status: "Active"
  },
  { 
    id: "PROD-10009", 
    name: "Network Switch 24-Port", 
    category: "Hardware", 
    price: "€950.00", 
    stock: 0,
    status: "Out of Stock"
  },
  { 
    id: "PROD-10010", 
    name: "Data Analytics Platform License", 
    category: "Software", 
    price: "€5,250.00", 
    stock: 25,
    status: "Active"
  }
];

const ProductCatalog: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(productsData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredProducts(productsData);
    } else {
      const filtered = productsData.filter(
        product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm]);

  const handleCreateProduct = () => {
    toast({
      title: "Create Product",
      description: "Product creation form has been opened.",
    });
    // In a real application, this would open a form or modal
  };

  const handleEditProduct = (productId: string) => {
    toast({
      description: `Editing product ${productId}`,
    });
    // In a real application, this would open a form or modal
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
      render: (value: string) => (
        <Badge variant={
          value === 'Active' ? 'outline' : 
          value === 'Low Stock' ? 'secondary' : 
          'destructive'
        }>
          {value}
        </Badge>
      )
    },
    { 
      key: "actions", 
      header: "Actions",
      render: (_, row: any) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleEditProduct(row.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Archive className="h-4 w-4" />
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
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button onClick={handleCreateProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
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
