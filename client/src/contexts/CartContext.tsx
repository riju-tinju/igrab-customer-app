import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
    id: string;
    name: {
        en: string;
        ar?: string;
        [key: string]: string | undefined;
    };
    price: number;
    currency: string;
    image: string;
    category?: {
        en: string;
        ar?: string;
        [key: string]: string | undefined;
    };
    quantity: number;
    slug?: string;
}

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    subTotal: number;
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    isInCart: (id: string) => boolean;
    getQuantity: (id: string) => number;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'igrab_guest_cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const addToCart = (product: Omit<CartItem, 'quantity'>) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCartItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }
        setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    };

    const isInCart = (id: string) => cartItems.some(i => i.id === id);
    const getQuantity = (id: string) => cartItems.find(i => i.id === id)?.quantity ?? 0;
    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider value={{ cartItems, cartCount, subTotal, addToCart, removeFromCart, updateQuantity, isInCart, getQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};
