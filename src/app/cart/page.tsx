"use client";

import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const cart = useCart();
  const router = useRouter();
  const [shippingAddress, setShippingAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [upiTransactionId, setUpiTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.items.length === 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "anonymous", 
          totalAmount: cart.total(),
          upiTransactionId,
          shippingAddress,
          contactNumber,
          items: cart.items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      if (response.ok) {
        cart.clearCart();
        alert("Order placed successfully! We will verify the payment and ship your order.");
        router.push("/");
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      console.error(error);
      alert("Error placing order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => router.push("/")} className="bg-orange-600 hover:bg-orange-700">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} x ₹{item.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">₹{item.price * item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => cart.removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="pt-4 flex justify-between items-center text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₹{cart.total()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment & Shipping Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-orange-50 p-4 rounded-md border border-orange-200">
                  <h4 className="font-bold text-orange-800 mb-2">Payment Instructions</h4>
                  <p className="text-sm text-orange-700 mb-2">
                    Please transfer exactly <strong>₹{cart.total()}</strong> via UPI to:
                  </p>
                  <p className="text-lg font-bold text-gray-900 mb-2">+91 7281991952</p>
                  <p className="text-sm text-orange-700">
                    After payment, enter the UPI Transaction ID below.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upi">UPI Transaction ID *</Label>
                  <Input
                    id="upi"
                    required
                    value={upiTransactionId}
                    onChange={(e) => setUpiTransactionId(e.target.value)}
                    placeholder="e.g. 123456789012"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number *</Label>
                  <Input
                    id="contact"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="+91..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Full Shipping Address *</Label>
                  <textarea
                    id="address"
                    required
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter your complete delivery address"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
