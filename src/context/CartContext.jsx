import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], totalAmount: 0 });
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCart({ items: [], totalAmount: 0 });
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await api.get('/cart');
            setCart(response.data.data);
        } catch (err) {
            console.error('Failed to fetch cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            setLoading(true);
            const response = await api.post('/cart/add', { productId, quantity });
            console.log('AddToCart Response:', response.data);
            setCart(response.data.data);
            return response.data.data;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            setLoading(true);
            const response = await api.put('/cart/update', { productId, quantity });
            setCart(response.data.data);
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            setLoading(true);
            const response = await api.delete(`/cart/remove/${productId}`);
            setCart(response.data.data);
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        try {
            setLoading(true);
            await api.delete('/cart/clear');
            setCart({ items: [], totalAmount: 0 });
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    const value = {
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
        itemCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
