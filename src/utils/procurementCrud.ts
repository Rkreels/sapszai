
// Generic CRUD operations for procurement entities
export interface BaseEntity {
  id: string;
  created?: string;
  updated?: string;
}

export interface CrudOperations<T extends BaseEntity> {
  create: (data: Omit<T, 'id' | 'created' | 'updated'>) => T;
  read: (id: string) => T | null;
  update: (id: string, data: Partial<Omit<T, 'id' | 'created' | 'updated'>>) => T | null;
  delete: (id: string) => boolean;
  list: (filters?: Record<string, any>) => T[];
  search: (query: string, fields: (keyof T)[]) => T[];
  export: (format: 'json' | 'csv') => string;
  import: (data: string, format: 'json' | 'csv') => T[];
}

// In-memory storage for demonstration
const storage = new Map<string, Map<string, any>>();

const getStorage = <T extends BaseEntity>(entityType: string): Map<string, T> => {
  if (!storage.has(entityType)) {
    storage.set(entityType, new Map());
  }
  return storage.get(entityType) as Map<string, T>;
};

export const createCrudOperations = <T extends BaseEntity>(entityType: string): CrudOperations<T> => {
  const entityStorage = getStorage<T>(entityType);

  return {
    create: (data: Omit<T, 'id' | 'created' | 'updated'>): T => {
      const id = `${entityType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = new Date().toISOString();
      
      const newEntity = {
        ...data,
        id,
        created: timestamp,
        updated: timestamp
      } as T;
      
      entityStorage.set(id, newEntity);
      return newEntity;
    },

    read: (id: string): T | null => {
      return entityStorage.get(id) || null;
    },

    update: (id: string, data: Partial<Omit<T, 'id' | 'created' | 'updated'>>): T | null => {
      const existing = entityStorage.get(id);
      if (!existing) return null;

      const updated = {
        ...existing,
        ...data,
        updated: new Date().toISOString()
      } as T;

      entityStorage.set(id, updated);
      return updated;
    },

    delete: (id: string): boolean => {
      return entityStorage.delete(id);
    },

    list: (filters?: Record<string, any>): T[] => {
      let entities = Array.from(entityStorage.values());

      if (filters) {
        entities = entities.filter(entity => {
          return Object.entries(filters).every(([key, value]) => {
            if (value === null || value === undefined || value === '') return true;
            const entityValue = (entity as any)[key];
            
            if (typeof value === 'string') {
              return entityValue?.toString().toLowerCase().includes(value.toLowerCase());
            }
            return entityValue === value;
          });
        });
      }

      return entities;
    },

    search: (query: string, fields: (keyof T)[]): T[] => {
      if (!query.trim()) return Array.from(entityStorage.values());

      const searchTerm = query.toLowerCase();
      return Array.from(entityStorage.values()).filter(entity => {
        return fields.some(field => {
          const value = entity[field];
          return value?.toString().toLowerCase().includes(searchTerm);
        });
      });
    },

    export: (format: 'json' | 'csv'): string => {
      const entities = Array.from(entityStorage.values());
      
      if (format === 'json') {
        return JSON.stringify(entities, null, 2);
      } else {
        if (entities.length === 0) return '';
        
        const headers = Object.keys(entities[0]).join(',');
        const rows = entities.map(entity => 
          Object.values(entity).map(value => 
            typeof value === 'string' && value.includes(',') ? `"${value}"` : value
          ).join(',')
        );
        
        return [headers, ...rows].join('\n');
      }
    },

    import: (data: string, format: 'json' | 'csv'): T[] => {
      try {
        let importedData: any[];
        
        if (format === 'json') {
          importedData = JSON.parse(data);
        } else {
          const lines = data.trim().split('\n');
          if (lines.length < 2) return [];
          
          const headers = lines[0].split(',');
          importedData = lines.slice(1).map(line => {
            const values = line.split(',');
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = values[index]?.replace(/^"|"$/g, ''); // Remove quotes
            });
            return obj;
          });
        }

        const createdEntities: T[] = [];
        importedData.forEach(item => {
          if (item && typeof item === 'object') {
            // Remove id, created, updated to let create method handle them
            const { id, created, updated, ...cleanData } = item;
            const newEntity = createCrudOperations<T>(entityType).create(cleanData);
            createdEntities.push(newEntity);
          }
        });

        return createdEntities;
      } catch (error) {
        console.error('Import failed:', error);
        return [];
      }
    }
  };
};

// Utility functions for common operations
export const validateEntity = <T extends BaseEntity>(
  entity: Partial<T>, 
  requiredFields: (keyof T)[]
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  requiredFields.forEach(field => {
    if (!entity[field]) {
      errors.push(`${String(field)} is required`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};

// Pre-defined entity interfaces for procurement
export interface Supplier extends BaseEntity {
  name: string;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  email: string;
  phone: string;
  address: string;
  rating: number;
  totalOrders: number;
  totalSpend: number;
}

export interface PurchaseOrder extends BaseEntity {
  orderNumber: string;
  supplier: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled';
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  deliveryDate: string;
  requestedBy: string;
}

export interface RFQ extends BaseEntity {
  rfqNumber: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'closed' | 'awarded';
  suppliers: string[];
  responses: number;
  deadline: string;
  estimatedValue: number;
  category: string;
}

// Create instances for each entity type
export const supplierCrud = createCrudOperations<Supplier>('supplier');
export const purchaseOrderCrud = createCrudOperations<PurchaseOrder>('purchaseOrder');
export const rfqCrud = createCrudOperations<RFQ>('rfq');
