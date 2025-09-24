
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Star, Package, Truck, Clock, DollarSign, BarChart } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useToast } from '../../hooks/use-toast';

const ProductDetail: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    // Simulate API call to fetch product details
    const timer = setTimeout(() => {
      // Find the product with matching ID from sample data
      const foundProduct = {
        id: productId,
        name: "Professional Server Rack",
        description: "High-quality server rack for enterprise data centers. Features adjustable mounting rails, ventilated design for optimal airflow, and lockable front and rear doors.",
        category: "Hardware",
        price: "€2,450.00",
        stock: 24,
        status: "Active",
        sku: "HW-RACK-PRO",
        weight: "45kg",
        dimensions: "800mm x 1000mm x 2000mm",
        manufacturer: "DataTech Solutions",
        warranty: "5 years",
        salesLastMonth: 5,
        rating: 4.8,
        images: [
          "https://placehold.co/600x400/e2e8f0/1e293b?text=Server+Rack+Image",
          "https://placehold.co/600x400/e2e8f0/1e293b?text=Rack+Detail"
        ]
      };
      
      setProduct(foundProduct);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [productId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    toast({
      title: "Edit Product",
      description: `Opening edit form for ${product.name}`,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/sales/products')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Products
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div className="flex gap-2">
            {product.images.map((img: string, i: number) => (
              <div 
                key={i}
                className={`border rounded w-20 h-20 overflow-hidden cursor-pointer ${i === 0 ? 'ring-2 ring-blue-500' : ''}`}
              >
                <img src={img} alt={`${product.name} ${i+1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-1/2 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant={product.status === 'Active' ? 'default' : 'outline'}>
                  {product.status}
                </Badge>
                <div className="flex items-center">
                  {Array(5).fill(0).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-sm ml-1">{product.rating}</span>
                </div>
              </div>
            </div>
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
          </div>

          <div className="text-3xl font-bold text-gray-800">{product.price}</div>
          
          <div className="flex items-center gap-2">
            <Badge variant={
              product.stock > 20 ? 'outline' : 
              product.stock > 0 ? 'secondary' : 
              'destructive'
            }>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </Badge>
            <span className="text-sm text-gray-500">SKU: {product.sku}</span>
          </div>
          
          <p className="text-gray-600">{product.description}</p>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Category</div>
                <div>{product.category}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Manufacturer</div>
                <div>{product.manufacturer}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Warranty</div>
                <div>{product.warranty}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Sales (Last Month)</div>
                <div>{product.salesLastMonth} units</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Dimensions</div>
                <div>{product.dimensions}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Weight</div>
                <div>{product.weight}</div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-6">
            <Button className="w-full">Add to Order</Button>
            <Button variant="outline" className="w-full">Add to Quote</Button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="specifications">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Discounts</TabsTrigger>
            <TabsTrigger value="related">Related Products</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="specifications" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Technical Specifications</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Height</span>
                        <span>2000mm (42U)</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Width</span>
                        <span>800mm</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Depth</span>
                        <span>1000mm</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Weight Capacity</span>
                        <span>1500kg</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Color</span>
                        <span>Black</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Features</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Adjustable mounting rails</li>
                      <li>Ventilated design for optimal airflow</li>
                      <li>Lockable front and rear doors</li>
                      <li>Cable management system</li>
                      <li>Removable side panels</li>
                      <li>Leveling feet and castors included</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pricing" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-3">Pricing Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <h4 className="font-medium">Standard Price</h4>
                      <div className="text-xl mt-1">€2,450.00</div>
                      <div className="text-sm text-gray-500 mt-2">List price</div>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-medium">Volume Discount</h4>
                      <div className="text-xl mt-1">€2,205.00</div>
                      <div className="text-sm text-gray-500 mt-2">10% off for 5+ units</div>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-medium">Partner Price</h4>
                      <div className="text-xl mt-1">€1,960.00</div>
                      <div className="text-sm text-gray-500 mt-2">20% partner discount</div>
                    </Card>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Custom Pricing</h4>
                    <p className="text-sm text-gray-600">
                      Custom pricing options are available for enterprise customers.
                      Contact sales for more information on bulk orders and special pricing arrangements.
                    </p>
                    <Button variant="outline" className="mt-3">Contact Sales</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="related" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <img 
                    src="https://placehold.co/300x200/e2e8f0/1e293b?text=Related+Product" 
                    alt="Related product" 
                    className="w-full h-auto mb-3 rounded"
                  />
                  <h4 className="font-medium">Server Rack PDU</h4>
                  <p className="text-sm text-gray-600 mt-1">Power distribution unit for server racks</p>
                  <div className="mt-2 font-medium">€350.00</div>
                  <Button variant="outline" className="w-full mt-3">View Details</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <img 
                    src="https://placehold.co/300x200/e2e8f0/1e293b?text=Related+Product" 
                    alt="Related product" 
                    className="w-full h-auto mb-3 rounded"
                  />
                  <h4 className="font-medium">Cable Management Kit</h4>
                  <p className="text-sm text-gray-600 mt-1">Professional cable management solution</p>
                  <div className="mt-2 font-medium">€120.00</div>
                  <Button variant="outline" className="w-full mt-3">View Details</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <img 
                    src="https://placehold.co/300x200/e2e8f0/1e293b?text=Related+Product" 
                    alt="Related product" 
                    className="w-full h-auto mb-3 rounded"
                  />
                  <h4 className="font-medium">Rack Cooling System</h4>
                  <p className="text-sm text-gray-600 mt-1">Active cooling for server racks</p>
                  <div className="mt-2 font-medium">€850.00</div>
                  <Button variant="outline" className="w-full mt-3">View Details</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-3">Order History</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Order #</th>
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Customer</th>
                        <th className="text-left py-2">Quantity</th>
                        <th className="text-left py-2">Price</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3">SO-10285</td>
                        <td>Apr 10, 2025</td>
                        <td>Tech Solutions Inc</td>
                        <td>2</td>
                        <td>€4,900.00</td>
                        <td><Badge>Delivered</Badge></td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">SO-10252</td>
                        <td>Mar 22, 2025</td>
                        <td>Global Data Systems</td>
                        <td>1</td>
                        <td>€2,450.00</td>
                        <td><Badge>Delivered</Badge></td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">SO-10218</td>
                        <td>Mar 05, 2025</td>
                        <td>InfraTech Solutions</td>
                        <td>3</td>
                        <td>€7,350.00</td>
                        <td><Badge>Delivered</Badge></td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">SO-10189</td>
                        <td>Feb 18, 2025</td>
                        <td>ServerPro Ltd</td>
                        <td>1</td>
                        <td>€2,450.00</td>
                        <td><Badge>Delivered</Badge></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;
