import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@prisma/client";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="flex flex-col justify-between overflow-hidden">
      <div className="aspect-square bg-muted relative">
        {product.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gray-100">
            No Image
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description || "No description available."}
        </p>
        <p className="font-bold mt-2 text-lg">₹{product.price}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" onClick={() => onAddToCart(product)}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
