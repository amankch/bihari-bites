"use client";

import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/products/ProductCard";
import { useCart } from "@/hooks/useCart";
import { Product } from "@prisma/client";

export default function Home() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      return res.json();
    },
  });

  const cart = useCart();

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading products...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Authentic Bihari Flavors</h1>
        <p className="text-lg text-gray-600">
          Taste the tradition with our homemade Thekua, Sattu, Aachar, and Ghee.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={cart.addItem} />
        ))}
        {products?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No products available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
