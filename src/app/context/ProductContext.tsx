import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "../data/products";

interface ProductContextType {
  products: Product[];
  addProduct: (p: Product) => void;
  removeProduct: (id: string) => void;
  updateProduct: (p: Product) => void;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  addProduct: () => {},
  removeProduct: () => {},
  updateProduct: () => {},
});

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  // 🔥 LOAD FROM BACKEND
  useEffect(() => {
    fetch("http://localhost:8080/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Product fetch error:", err));
  }, []);

  const addProduct = async (product: Product) => {
    setProducts((prev) => [product, ...prev]);
    // optional: POST to backend later
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProduct = (product: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? product : p))
    );
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, removeProduct, updateProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}