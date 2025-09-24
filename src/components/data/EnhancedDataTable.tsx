
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  RefreshCw
} from 'lucide-react';

export interface EnhancedColumn<T = Record<string, unknown>> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  width?: string;
  render?: (value: unknown, row?: T, index?: number) => React.ReactNode;
  filterOptions?: { label: string; value: unknown }[];
  exportFormatter?: (value: unknown) => string;
}

export interface TableAction<T = Record<string, unknown>> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T, index: number) => void;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  condition?: (row: T) => boolean;
}

interface EnhancedDataTableProps<T = Record<string, unknown>> {
  columns: EnhancedColumn<T>[];
  data: T[];
  actions?: TableAction<T>[];
  bulkActions?: TableAction<T>[];
  searchPlaceholder?: string;
  pageSize?: number;
  exportable?: boolean;
  importable?: boolean;
  refreshable?: boolean;
  onRefresh?: () => void;
  onExport?: (data: T[], format: string) => void;
  onImport?: (data: T[]) => void;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
}

const EnhancedDataTable = <T extends Record<string, unknown>>({
  columns,
  data,
  actions = [],
  bulkActions = [],
  searchPlaceholder = "Search...",
  pageSize = 10,
  exportable = true,
  importable = false,
  refreshable = false,
  onRefresh,
  onExport,
  onImport,
  className = "",
  emptyMessage = "No data available",
  loading = false
}: EnhancedDataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const { toast } = useToast();

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm) {
      const searchableColumns = columns.filter(col => col.searchable !== false);
      result = result.filter(row =>
        searchableColumns.some(col => {
          const value = (row as Record<string, unknown>)[col.key as string];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        result = result.filter(row => {
          const rowValue = (row as Record<string, unknown>)[key];
          if (Array.isArray(value)) {
            return value.includes(rowValue);
          }
          return rowValue === value;
        });
      }
    });

    return result;
  }, [data, searchTerm, filters, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortConfig.key];
      const bValue = (b as Record<string, unknown>)[sortConfig.key];

      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const handleSelectRow = (index: number, checked: boolean) => {
    setSelectedRows(current => {
      if (checked) {
        return [...current, index];
      }
      return current.filter(i => i !== index);
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedData.map((_, index) => index));
    } else {
      setSelectedRows([]);
    }
  };

  const handleExport = () => {
    if (onExport) {
      const exportData = selectedRows.length > 0 
        ? selectedRows.map(index => paginatedData[index])
        : sortedData;
      onExport(exportData, exportFormat);
    } else {
      // Default export logic
      const csvContent = generateCSV(sortedData);
      downloadFile(csvContent, `export.${exportFormat}`, 'text/csv');
    }
    setIsExportDialogOpen(false);
    toast({
      title: 'Export Successful',
      description: `Data exported as ${exportFormat.toUpperCase()}`,
    });
  };

  const generateCSV = (exportData: T[]) => {
    if (exportData.length === 0) return '';
    
    const headers = columns.map(col => col.header).join(',');
    const rows = exportData.map(row => 
      columns.map(col => {
        const value = col.exportFormatter 
          ? col.exportFormatter((row as Record<string, unknown>)[col.key as string])
          : (row as Record<string, unknown>)[col.key as string];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    );
    
    return [headers, ...rows].join('\n');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getSortIcon = (columnKey: string) => {
    if (sortConfig?.key !== columnKey) return null;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-2 flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {/* Filters */}
          {columns.filter(col => col.filterable).map(column => (
            <Select
              key={column.key}
              value={filters[column.key] || ''}
              onValueChange={(value) => setFilters(prev => ({ ...prev, [column.key]: value }))}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder={`Filter ${column.header}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {column.header}</SelectItem>
                {column.filterOptions?.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          {refreshable && onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
          
          {exportable && (
            <Button variant="outline" size="sm" onClick={() => setIsExportDialogOpen(true)}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
          
          {importable && onImport && (
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedRows.length > 0 && bulkActions.length > 0 && (
        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border">
          <span className="text-sm font-medium">
            {selectedRows.length} row(s) selected
          </span>
          {bulkActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={() => {
                const selectedData = selectedRows.map(index => paginatedData[index]);
                action.onClick(selectedData, -1);
                setSelectedRows([]);
              }}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {(bulkActions.length > 0 || actions.some(a => a.label === 'Select')) && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={`${column.sortable ? 'cursor-pointer hover:bg-muted/50' : ''} ${column.width || ''}`}
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.header}</span>
                      {getSortIcon(column.key)}
                    </div>
                  </TableHead>
                ))}
                {actions.length > 0 && (
                  <TableHead className="w-32">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (actions.length > 0 ? 1 : 0) + (bulkActions.length > 0 ? 1 : 0)}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    {(bulkActions.length > 0 || actions.some(a => a.label === 'Select')) && (
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(index)}
                          onCheckedChange={(checked) => handleSelectRow(index, checked as boolean)}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.render 
                          ? column.render((row as Record<string, unknown>)[column.key as string], row, index) 
                          : (row as Record<string, unknown>)[column.key as string]}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell>
                        <div className="flex space-x-1">
                          {actions
                            .filter(action => !action.condition || action.condition(row))
                            .map((action, actionIndex) => (
                              <Button
                                key={actionIndex}
                                variant={action.variant || 'ghost'}
                                size="sm"
                                onClick={() => action.onClick(row, index)}
                              >
                                {action.icon}
                                {action.label}
                              </Button>
                            ))}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(current => Math.max(1, current - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(current => Math.min(totalPages, current + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Export Format</label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedRows.length > 0 
                ? `Exporting ${selectedRows.length} selected rows`
                : `Exporting all ${sortedData.length} rows`
              }
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport}>
                Export
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedDataTable;
