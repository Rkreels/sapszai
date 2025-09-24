
import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Edit, Eye } from 'lucide-react';

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

interface CatalogItemFormProps {
  items: CatalogItem[];
  onEdit: (item: CatalogItem) => void;
  onView: (item: CatalogItem) => void;
}

const CatalogItemForm: React.FC<CatalogItemFormProps> = ({ items, onEdit, onView }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-yellow-100 text-yellow-800',
      'Discontinued': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{item.itemCode}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <p className="text-sm">
                  {item.supplier} | {item.currency} {item.unitPrice.toFixed(2)} per {item.uom}
                </p>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => onView(item)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CatalogItemForm;
