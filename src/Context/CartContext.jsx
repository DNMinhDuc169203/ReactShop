import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

// Hàm helper để lấy giỏ hàng từ localStorage
const getStoredCart = (key) => {
  try {
    const storedCart = localStorage.getItem(key);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

// Hàm helper để lưu giỏ hàng vào localStorage
const storeCart = (key, cart) => {
  try {
    localStorage.setItem(key, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Hàm helper để lấy sản phẩm chờ từ localStorage
const getPendingProduct = () => {
  try {
    const pendingProductStr = localStorage.getItem('pending_product');
    if (pendingProductStr) {
      return JSON.parse(pendingProductStr);
    }
    return null;
  } catch (error) {
    console.error('Error loading pending product:', error);
    return null;
  }
};

// Khóa cho giỏ hàng tạm thời (khi chưa đăng nhập)
const TEMP_CART_KEY = 'temp_cart';
// Lưu đường dẫn hiện tại cho redirect
const REDIRECT_PATH_KEY = 'cart_redirect_path';

export const CartProvider = ({ children }) => {
  const { isLoggedIn, user } = useAuth();
  
  // Khởi tạo state với dữ liệu từ localStorage
  const [cartItems, setCartItems] = useState(() => {
    if (isLoggedIn && user?.id) {
      // Nếu đã đăng nhập, load giỏ hàng của user
      return getStoredCart(`cart_${user.id}`);
    } else {
      // Nếu chưa đăng nhập, load giỏ hàng tạm
      return getStoredCart(TEMP_CART_KEY);
    }
  });

  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Xử lý khi đăng nhập/đăng xuất
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      // Khi đăng nhập
      const userCart = getStoredCart(`cart_${user.id}`);
      const tempCart = getStoredCart(TEMP_CART_KEY);
      
      // Nếu có sản phẩm trong giỏ hàng tạm, hợp nhất với giỏ hàng user
      if (tempCart.length > 0) {
        const mergedCart = [...userCart];
        
        tempCart.forEach(tempItem => {
          const existingItemIndex = mergedCart.findIndex(item => item.id === tempItem.id);
          
          if (existingItemIndex >= 0) {
            // Cập nhật số lượng nếu sản phẩm đã tồn tại
            mergedCart[existingItemIndex].quantity += tempItem.quantity;
          } else {
            // Thêm sản phẩm mới
            mergedCart.push(tempItem);
          }
        });
        
        setCartItems(mergedCart);
        storeCart(`cart_${user.id}`, mergedCart);
        localStorage.removeItem(TEMP_CART_KEY); // Xóa giỏ hàng tạm
      } else {
        setCartItems(userCart);
      }
      
      // Xử lý sản phẩm đang chờ thêm vào giỏ (nếu có)
      const pendingProduct = getPendingProduct();
      if (pendingProduct && pendingProduct.product) {
        addToCartInternal(pendingProduct.product, pendingProduct.quantity);
        localStorage.removeItem('pending_product');
      }
    } else {
      // Khi đăng xuất, load giỏ hàng tạm
      setCartItems(getStoredCart(TEMP_CART_KEY));
    }
  }, [isLoggedIn, user]);

  // Cập nhật totals và lưu vào localStorage khi cartItems thay đổi
  useEffect(() => {
    const updateCartTotals = () => {
      const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
      const price = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      setTotalItems(itemCount);
      setTotalPrice(price);
      
      // Lưu vào localStorage
      if (isLoggedIn && user?.id) {
        storeCart(`cart_${user.id}`, cartItems);
      } else {
        storeCart(TEMP_CART_KEY, cartItems);
      }
    };

    updateCartTotals();
  }, [cartItems, isLoggedIn, user]);

  // Hàm nội bộ để thêm sản phẩm vào giỏ hàng
  const addToCartInternal = (product, quantity = 1) => {
    if (!product) return;
    
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      let updatedItems;
      
      if (existingItemIndex >= 0) {
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
      } else {
        updatedItems = [...prevItems, {
          ...product,
          quantity: quantity
        }];
      }

      // Lưu vào localStorage
      if (isLoggedIn && user?.id) {
        storeCart(`cart_${user.id}`, updatedItems);
      } else {
        storeCart(TEMP_CART_KEY, updatedItems);
      }
      
      return updatedItems;
    });

    toast.success('Sản phẩm đã được thêm vào giỏ hàng!');
  };

  // Hàm public để thêm sản phẩm vào giỏ hàng
  const addToCart = (product, quantity = 1) => {
    if (!isLoggedIn) {
      // Lưu thông tin sản phẩm để thêm sau khi đăng nhập
      localStorage.setItem('pending_product', JSON.stringify({ product, quantity }));
      // Lưu đường dẫn hiện tại để redirect sau khi đăng nhập
      localStorage.setItem(REDIRECT_PATH_KEY, window.location.pathname);
      // Chuyển hướng đến trang đăng nhập bằng window.location thay vì useNavigate
      window.location.href = '/login';
      return;
    }

    addToCartInternal(product, quantity);
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== productId);
      
      if (isLoggedIn && user?.id) {
        storeCart(`cart_${user.id}`, updatedItems);
      } else {
        storeCart(TEMP_CART_KEY, updatedItems);
      }
      
      return updatedItems;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      
      if (isLoggedIn && user?.id) {
        storeCart(`cart_${user.id}`, updatedItems);
      } else {
        storeCart(TEMP_CART_KEY, updatedItems);
      }
      
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    
    if (isLoggedIn && user?.id) {
      localStorage.removeItem(`cart_${user.id}`);
    } else {
      localStorage.removeItem(TEMP_CART_KEY);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isLoggedIn
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 