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

  addProduct: (p: Product) => Promise<void>;

  removeProduct: (id: string) => Promise<void>;

  updateProduct: (p: Product) => Promise<void>;
}

const ProductContext = createContext<ProductContextType>({
  products: [],

  addProduct: async () => {},

  removeProduct: async () => {},

  updateProduct: async () => {},
});

export function ProductProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  /* ─────────────────────────────
     LOAD PRODUCTS FROM BACKEND
  ───────────────────────────── */
  useEffect(() => {
    fetch("http://localhost:8080/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) =>
        console.error("Product fetch error:", err)
      );
  }, []);

  /* ─────────────────────────────
     ADD PRODUCT
  ───────────────────────────── */
  const addProduct = async (product: Product) => {
    try {
      const res = await fetch(
        "http://localhost:8080/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );

      const data = await res.json();

      setProducts((prev) => [data, ...prev]);
    } catch (err) {
      console.error("Add product error:", err);
    }
  };

  /* ─────────────────────────────
     DELETE PRODUCT
  ───────────────────────────── */
  const removeProduct = async (id: string) => {
    try {
      await fetch(
        `http://localhost:8080/products/${id}`,
        {
          method: "DELETE",
        }
      );

      setProducts((prev) =>
        prev.filter((p) => p.id !== id)
      );
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  /* ─────────────────────────────
     UPDATE PRODUCT
  ───────────────────────────── */
  const updateProduct = async (product: Product) => {
    try {
      const res = await fetch(
        `http://localhost:8080/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );

      const updated = await res.json();

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? updated : p
        )
      );
    } catch (err) {
      console.error("Update product error:", err);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        removeProduct,
        updateProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}