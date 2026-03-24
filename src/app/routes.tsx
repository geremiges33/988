import { createBrowserRouter } from "react-router";
import { ProvidersLayout } from "./layouts/ProvidersLayout";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Payment } from "./pages/Payment";
import { Favorites } from "./pages/Favorites";
import { Admin } from "./pages/Admin";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { FAQ } from "./pages/FAQ";
import { Contact } from "./pages/Contact";
import { Returns } from "./pages/Returns";
import { ShippingInfo } from "./pages/ShippingInfo";
import { SizeGuide } from "./pages/SizeGuide";

export const router = createBrowserRouter([
  {
    element: <ProvidersLayout />,
    children: [
      {
        path: "/",
        Component: Root,
        children: [
          { index: true, Component: Home },
          { path: "shop", Component: Shop },
          { path: "shop/:category", Component: Shop },
          { path: "product/:id", Component: ProductDetail },
          { path: "cart", Component: Cart },
          { path: "payment", Component: Payment },
          { path: "favorites", Component: Favorites },
          { path: "admin", Component: Admin },
          /* Customer Service Pages */
          { path: "faq", Component: FAQ },
          { path: "contact", Component: Contact },
          { path: "returns", Component: Returns },
          { path: "shipping", Component: ShippingInfo },
          { path: "size-guide", Component: SizeGuide },
        ],
      },
      /* Auth pages — outside Root so they have no Navbar/Footer */
      { path: "/login", Component: Login },
      { path: "/signup", Component: Signup },
    ],
  },
]);
