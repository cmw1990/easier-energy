
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/AuthProvider"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export function InventoryManager() {
  const { session } = useAuth();
  const { toast } = useToast();

  const { data: inventory, isLoading, refetch } = useQuery({
    queryKey: ['vendor-inventory', session?.user?.id],
    queryFn: async () => {
      const { data: vendorData } = await supabase
        .from('vendors')
        .select('id')
        .eq('claimed_by', session?.user?.id)
        .single();

      if (!vendorData) return [];

      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          stock,
          inventory_logs(
            quantity_change,
            reason,
            created_at
          )
        `)
        .eq('vendor_id', vendorData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const updateStock = async (productId: string, quantity: number) => {
    try {
      // First update the product stock
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: quantity })
        .eq('id', productId);

      if (updateError) throw updateError;

      // Then create an inventory log entry
      const { error: logError } = await supabase
        .from('inventory_logs')
        .insert({
          product_id: productId,
          quantity_change: quantity,
          reason: 'Manual stock update'
        });

      if (logError) throw logError;

      toast({
        title: "Success",
        description: "Stock updated successfully"
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive"
      });
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Product Name",
    },
    {
      accessorKey: "stock",
      header: "Current Stock",
      cell: ({ row }) => (
        <Input
          type="number"
          defaultValue={row.getValue("stock")}
          onChange={(e) => updateStock(row.original.id, parseInt(e.target.value))}
          className="w-24"
        />
      )
    },
    {
      accessorKey: "inventory_logs",
      header: "Recent Changes",
      cell: ({ row }) => {
        const logs = row.getValue("inventory_logs") as any[];
        return logs?.length > 0 ? (
          <div className="text-sm">
            Last change: {logs[0].quantity_change} units
            <br />
            <span className="text-muted-foreground">
              {new Date(logs[0].created_at).toLocaleDateString()}
            </span>
          </div>
        ) : null;
      }
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Open history modal
          }}
        >
          View History
        </Button>
      )
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Management</CardTitle>
        <CardDescription>Track and update your product stock levels</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading inventory...</div>
        ) : (
          <DataTable 
            columns={columns}
            data={inventory || []}
          />
        )}
      </CardContent>
    </Card>
  );
}
