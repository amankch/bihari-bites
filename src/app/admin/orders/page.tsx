"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Order, OrderItem, Product, OrderStatus } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";

type OrderWithItems = Order & {
  orderItems: (OrderItem & { product: Product })[];
};

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);

  const { data: orders, isLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await fetch("/api/orders");
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "PAID": return "bg-blue-100 text-blue-800";
      case "SHIPPED": return "bg-purple-100 text-purple-800";
      case "DELIVERED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Orders</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>UPI Txn ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : orders?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">No orders found.</TableCell></TableRow>
            ) : (
              orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="font-bold">₹{order.totalAmount}</TableCell>
                  <TableCell>
                    <Select defaultValue={order.status} onValueChange={(val) => handleStatusChange(order.id, val || "")}>
                      <SelectTrigger className={`w-[130px] h-8 text-xs ${getStatusColor(order.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(OrderStatus).map((status) => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-600">{order.upiTransactionId || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                          <Eye className="w-4 h-4 text-gray-600" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Order ID</p>
                                <p className="font-mono">{selectedOrder.id}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Date</p>
                                <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Contact</p>
                                <p>{selectedOrder.contactNumber}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">UPI Transaction ID</p>
                                <p className="font-mono">{selectedOrder.upiTransactionId}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-gray-500">Shipping Address</p>
                                <p className="whitespace-pre-wrap bg-gray-50 p-2 rounded mt-1 border">{selectedOrder.shippingAddress}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-bold mb-2">Items</h3>
                              <div className="border rounded-md divide-y">
                                {selectedOrder.orderItems.map((item) => (
                                  <div key={item.id} className="flex justify-between items-center p-3 text-sm">
                                    <div className="flex items-center gap-3">
                                      {item.product.imageUrl ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={item.product.imageUrl} alt={item.product.name} className="w-10 h-10 rounded object-cover" />
                                      ) : (
                                        <div className="w-10 h-10 bg-gray-200 rounded" />
                                      )}
                                      <div>
                                        <p className="font-medium">{item.product.name}</p>
                                        <p className="text-gray-500">Qty: {item.quantity} x ₹{item.price}</p>
                                      </div>
                                    </div>
                                    <p className="font-bold">₹{item.quantity * item.price}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-between items-center mt-4 p-3 bg-gray-50 rounded-md font-bold">
                                <span>Total Amount</span>
                                <span>₹{selectedOrder.totalAmount}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
