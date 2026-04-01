import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export const CartContext = createContext();
export function CartProvider({ children }) {

  const location = useLocation();
  const [products, setProducts] = useState([]);
 const getUserCartKey = () => {
  const email = localStorage.getItem("email");
  return email ? `cart_${email}` : "cart_guest";
};

const [cart, setCart] = useState(() => {
  const key = getUserCartKey();
  const savedCart = localStorage.getItem(key);
  return savedCart ? JSON.parse(savedCart) : [];
});

  function clearCart() {
  const key = getUserCartKey();
  setCart([]);
  localStorage.removeItem(key);
}

  const [isCartOpen, setIsCartOpen] = useState(false);
  useEffect(() => {
  const key = getUserCartKey();

  if (cart.length > 0) {
    localStorage.setItem(key, JSON.stringify(cart));
  } else {
    localStorage.removeItem(key);
  }
}, [cart]);

  function addToCart(product) {
  setCart((prev) => {
    const item = prev.find((i) => i.id === product.id);

    if (item) {
      return prev.map((i) =>
        i.id === product.id ? { ...i, qty: i.qty + 1 } : i
      );
    }
    return [...prev, { id: product.id, qty: 1 }];
  });
}

  function increaseQty(id) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  }

  function decreaseQty(id) {
    setCart((prev) =>
      prev.map((item) =>item.id === id ? { ...item, qty: item.qty - 1 } : item).filter((item) => item.qty > 0)
    );
  }

  function closeCart() {
    setIsCartOpen(false);
  }

  function openCart() {
    setIsCartOpen(true);
  }

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const ids = cart.map(item => item.id);
      if (ids.length === 0) {
        setProducts([]);
        return;
      }
      const res = await axios.post("https://bighaat-clone.onrender.com/cart-products",ids);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchProducts();
}, [cart]);

useEffect(() => {
  const key = getUserCartKey();
  const savedCart = localStorage.getItem(key);
  setCart(savedCart ? JSON.parse(savedCart) : []);
}, [location]);

const cartWithDetails = cart.map((cartItem) => {
  const product = products.find((p) => String(p.id) === String(cartItem.id));
  return product
    ? { ...product, qty: cartItem.qty }
    : null;
}).filter(Boolean);

const total = cartWithDetails.reduce(
  (sum, item) => sum + Number(item.newPrice) * item.qty,0
);

  return (
   <CartContext.Provider value={{cart,cartWithDetails,total,addToCart,increaseQty,decreaseQty,isCartOpen,closeCart,openCart,clearCart}}>
      {children}
    </CartContext.Provider>
  );
}
