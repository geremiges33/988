import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

import { Product } from "../data/products";

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  getFavoritesCount: () => number;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addToFavorites: async () => {},
  removeFromFavorites: async () => {},
  isFavorite: () => false,
  getFavoritesCount: () => 0,
  clearFavorites: () => {},
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);

  // LOAD
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (user) {
      fetch(`http://localhost:8080/favorites/${user.id}`)
        .then((res) => res.json())
        .then((data) => setFavorites(data));
    }
  }, []);

  // ADD / TOGGLE FAVORITE
  const addToFavorites = async (product: Product) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return;

    await fetch("http://localhost:8080/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        productId: product.id,
      }),
    });

    const res = await fetch(
      `http://localhost:8080/favorites/${user.id}`
    );

    const data = await res.json();
    setFavorites(data);
  };

  // REMOVE (same toggle endpoint)
  const removeFromFavorites = async (productId: string) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return;

    await fetch("http://localhost:8080/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        productId,
      }),
    });

    const res = await fetch(
      `http://localhost:8080/favorites/${user.id}`
    );

    const data = await res.json();
    setFavorites(data);
  };

  const isFavorite = (productId: string) => {
    return favorites.some((p) => p.id === productId);
  };

  const getFavoritesCount = () => favorites.length;

  const clearFavorites = () => setFavorites([]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        getFavoritesCount,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}