import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "../ui/button";

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl text-orange-600">
          BIHARI BITES
        </Link>
        <div className="hidden md:flex text-sm text-gray-500 font-medium tracking-wider">
          SWAD ASLI CRUNCH DESI
        </div>
        <div className="flex items-center gap-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
