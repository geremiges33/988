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

  addToFavorites: (product: Product) => void;

  removeFromFavorites: (productId: string) => void;

  isFavorite: (productId: string) => boolean;

  getFavoritesCount: () => number;

  clearFavorites: () => void;
}

const FavoritesContext =
  createContext<FavoritesContextType>({
    favorites: [],

    addToFavorites: () => {},

    removeFromFavorites: () => {},

    isFavorite: () => false,

    getFavoritesCount: () => 0,

    clearFavorites: () => {},
  });

export function FavoritesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [favorites, setFavorites] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const stored =
        localStorage.getItem("thrift-favorites");

      return stored ? JSON.parse(stored) : [];
    }

    return [];
  });

  // SAVE TO LOCAL STORAGE
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "thrift-favorites",
        JSON.stringify(favorites)
      );
    }
  }, [favorites]);

  // ADD
  const addToFavorites = (product: Product) => {
    setFavorites((prev) => {
      const exists = prev.find(
        (p) => p.id === product.id
      );

      if (exists) return prev;

      return [...prev, product];
    });
  };

  // REMOVE
  const removeFromFavorites = (
    productId: string
  ) => {
    setFavorites((prev) =>
      prev.filter((p) => p.id !== productId)
    );
  };

  // CHECK
  const isFavorite = (productId: string) => {
    return favorites.some(
      (p) => p.id === productId
    );
  };

  // COUNT
  const getFavoritesCount = () => {
    return favorites.length;
  };

  // CLEAR ALL
  const clearFavorites = () => {
    setFavorites([]);

    localStorage.removeItem(
      "thrift-favorites"
    );
  };

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