import { useEffect, useState } from "react";

// ✅ Type
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  condition: string;
  size?: string;
  imageUrl: string;
  featured?: boolean;
}

// ✅ Categories (keep your existing)
export const categories = [
  { id: "all", name: "All Items", color: "#FF6B6B" },
  { id: "women", name: "Women", color: "#F4A3A8" },
  { id: "men", name: "Men", color: "#4ECDC4" },
  { id: "clothing", name: "Vintage Clothing", color: "#A8DADC" },
];

// ✅ Hook to fetch products from backend
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
};