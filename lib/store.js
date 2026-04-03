// Cart context using localStorage + Supabase (merged)
'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user session - wrapped in try/catch so site works without Supabase
  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    let subscription;
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      subscription = data.subscription;
    } catch {}

    return () => { try { subscription?.unsubscribe(); } catch {} };
  }, []);

  // Read true cart from Supabase if logged in
  useEffect(() => {
    if (!user) {
      setCart([]);
      setWishlist([]);
      return;
    }
    const loadData = async () => {
      // Load Cart
      const { data: cartData } = await supabase.from('cart').select('id, product_id, quantity');
      if (cartData) {
        import('./data').then((mod) => {
          const mapping = cartData.map(row => {
            const staticProd = mod.PRODUCTS.find(p => p.id === row.product_id);
            return staticProd ? { ...staticProd, quantity: row.quantity } : null;
          }).filter(Boolean);
          setCart(mapping);
        });
      }
      
      // Load Wishlist
      const { data: wishData } = await supabase.from('wishlist').select('product_id');
      if (wishData) {
         setWishlist(wishData.map(w => w.product_id));
      }
    };
    loadData();
  }, [user]);

  // We still keep a small mirror of local state for incredibly fast UI rendering.
  // Instead of persisting to localStorage, we broadcast writes directly to Supabase.

  const syncCartToSupabase = async (newCart) => {
     if (!user) return;
     try {
       // Fastest way to ensure 100% database match without complex diffing:
       // Delete all old & Reinsert new.
       await supabase.from('cart').delete().eq('user_id', user.id);
       const payloads = newCart.map(item => ({
          user_id: user.id,
          product_id: item.id,
          quantity: item.quantity
       }));
       if(payloads.length > 0) {
          await supabase.from('cart').insert(payloads);
       }
     } catch (e) {
       console.error("Cart sync failed", e);
     }
  };

  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      let newCart;
      if (existing) {
        newCart = prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        newCart = [...prev, { ...product, quantity }];
      }
      syncCartToSupabase(newCart);
      return newCart;
    });
  }, [user]);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => {
       const newCart = prev.filter(item => item.id !== productId);
       syncCartToSupabase(newCart);
       return newCart;
    });
  }, [user]);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => {
      const newCart = prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      syncCartToSupabase(newCart);
      return newCart;
    });
  }, [removeFromCart, user]);

  const clearCart = useCallback(() => {
    setCart([]);
    async function runClear() {
       if (user) await supabase.from('cart').delete().eq('user_id', user.id);
    }
    runClear();
  }, [user]);

  const toggleWishlist = useCallback(async (productId) => {
    if (!user) {
       alert("Please log in to add items to your wishlist.");
       return;
    }
    setWishlist(prev => {
       const exists = prev.includes(productId);
       if (exists) {
          supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId).then();
          return prev.filter(id => id !== productId);
       } else {
          supabase.from('wishlist').insert({ user_id: user.id, product_id: productId }).then();
          return [...prev, productId];
       }
    });
  }, [user]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, wishlist, user, loading,
      addToCart, removeFromCart, updateQuantity, clearCart, toggleWishlist,
      cartTotal, cartCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

export function useAuth() {
  const { user, loading } = useCart();
  return { user, loading };
}
