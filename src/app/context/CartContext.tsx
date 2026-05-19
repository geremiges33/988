import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

import { Product } from "../data/products";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];

  addToCart: (product: Product) => Promise<void>;

  removeFromCart: (productId: string) => void;

  updateQuantity: (
    productId: string,
    quantity: number
  ) => void;

  clearCart: () => void;

  getCartTotal: () => number;

  getCartCount: () => number;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],

  addToCart: async () => {},

  removeFromCart: () => {},

  updateQuantity: () => {},

  clearCart: () => {},

  getCartTotal: () => 0,

  getCartCount: () => 0,
});

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // =========================
  // LOAD CART FROM DB
  // =========================
  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (user) {
      fetch(
        `http://localhost:8080/cart/${user._id}`
      )
        .then((res) => res.json())
        .then((data) => {
          const formatted = data.map((item: any) => ({
            ...item.product,
            quantity: item.quantity,
          }));

          setCartItems(formatted);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  // =========================
  // ADD TO CART (DB + LOCAL)
  // =========================
  const addToCart = async (product: Product) => {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    // guest mode
    if (!user) {
      setCartItems((prev) => {
        const exists = prev.find(
          (p) => p.id === product.id
        );

        if (exists) {
          return prev.map((p) =>
            p.id === product.id
              ? {
                  ...p,
                  quantity: p.quantity + 1,
                }
              : p
          );
        }

        return [
          ...prev,
          { ...product, quantity: 1 },
        ];
      });

      return;
    }

    // DEBUG (чухал!)
    console.log("ADD TO CART:", {
      userId: user._id,
      productId: product.id,
    });

    // DB SAVE
    await fetch("http://localhost:8080/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,

        // ⚠️ хамгийн чухал FIX
        productId: product.id,
      }),
    });

    // refresh cart
    const res = await fetch(
      `http://localhost:8080/cart/${user._id}`
    );

    const data = await res.json();

    const formatted = data.map((item: any) => ({
      ...item.product,
      quantity: item.quantity,
    }));

    setCartItems(formatted);
  };

  // =========================
  // REMOVE
  // =========================
  const removeFromCart = (productId: string) => {
    setCartItems((prev) =>
      prev.filter((p) => p.id !== productId)
    );
  };

  // =========================
  // UPDATE QTY
  // =========================
  const updateQuantity = (
    productId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, quantity }
          : p
      )
    );
  };

  // =========================
  // CLEAR
  // =========================
  const clearCart = () => {
    setCartItems([]);
  };

  // =========================
  // TOTAL
  // =========================
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );
  };

  // =========================
  // COUNT
  // =========================
  const getCartCount = () => {
    return cartItems.reduce(
      (count, item) => count + item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}