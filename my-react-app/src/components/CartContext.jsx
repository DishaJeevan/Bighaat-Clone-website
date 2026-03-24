import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();
export function CartProvider({ children }) {

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  function clearCart() {
    setCart([]);                       
    localStorage.removeItem("cart");   
  }

  const [isCartOpen, setIsCartOpen] = useState(false);
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");  
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