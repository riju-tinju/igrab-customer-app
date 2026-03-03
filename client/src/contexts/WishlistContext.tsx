import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WishlistItem {
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
    slug?: string;
}

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    wishlistCount: number;
    toggleWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: string) => void;
    isWishlisted: (id: string) => boolean;
    clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'igrab_guest_wishlist';

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
        try {
            const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const wishlistCount = wishlistItems.length;

    const toggleWishlist = (item: WishlistItem) => {
        setWishlistItems(prev => {
            const exists = prev.find(i => i.id === item.id);
            return exists ? prev.filter(i => i.id !== item.id) : [...prev, item];
        });
    };

    const removeFromWishlist = (id: string) => {
        setWishlistItems(prev => prev.filter(i => i.id !== id));
    };

    const isWishlisted = (id: string) => wishlistItems.some(i => i.id === id);
    const clearWishlist = () => setWishlistItems([]);

    return (
        <WishlistContext.Provider value={{ wishlistItems, wishlistCount, toggleWishlist, removeFromWishlist, isWishlisted, clearWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
    return ctx;
};
