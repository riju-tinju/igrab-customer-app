import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useLanguage } from '../../contexts/LanguageContext';
import CartModal from './CartModal';
import WishlistModal from './WishlistModal';
import ProfileModal from './ProfileModal';

const Footer: React.FC = () => {
    const location = useLocation();
    const activePath = location.pathname;
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { t, isRTL } = useLanguage();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const isActive = (path: string) => activePath === path || (path === '/home' && activePath === '/');

    return (
        <>
            <nav className={`fixed bottom-0 left-0 w-full h-[70px] bg-white flex justify-around items-center lg:hidden z-[1100] border-t border-gray-100 pb-safe ${isRTL ? 'flex-row-reverse' : ''}`}>
                {/* Home */}
                <a href="/home" className={`flex flex-col items-center p-2 transition-colors ${isActive('/home') ? 'text-primary' : 'text-gray-400'}`}>
                    <i className={`fas fa-home text-xl ${isActive('/home') ? '' : 'text-gray-400'}`}></i>
                    <span className="text-[10px] font-medium mt-1 uppercase tracking-tighter">{t('home')}</span>
                </a>

                {/* Shop */}
                <a href="/shop" className={`flex flex-col items-center p-2 transition-colors ${isActive('/shop') ? 'text-primary' : 'text-gray-400'}`}>
                    <i className="fas fa-store text-xl"></i>
                    <span className="text-[10px] font-medium mt-1 uppercase tracking-tighter">{t('shop')}</span>
                </a>

                {/* Cart Button (Central) */}
                <div className="relative -mt-10">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="bg-primary w-16 h-16 rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(0,63,46,0.3)] border-4 border-white active:scale-95 transition-transform"
                    >
                        <i className="fas fa-shopping-bag text-2xl"></i>
                    </button>
                    {cartCount > 0 && (
                        <span className={`absolute -top-1 bg-accent-gold text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${isRTL ? '-left-1' : '-right-1'}`}>
                            {cartCount > 99 ? '99+' : cartCount}
                        </span>
                    )}
                </div>

                {/* Wishlist */}
                <button
                    onClick={() => setIsWishlistOpen(true)}
                    className={`flex flex-col items-center p-2 relative transition-colors ${isActive('/wishlist') ? 'text-primary' : 'text-gray-400'}`}
                >
                    <i className={`fas fa-heart text-xl ${wishlistCount > 0 ? 'text-red-400' : ''}`}></i>
                    <span className="text-[10px] font-medium mt-1 uppercase tracking-tighter">{t('wishlist')}</span>
                    {wishlistCount > 0 && (
                        <span className={`absolute top-1 bg-accent-gold text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${isRTL ? 'left-1' : 'right-1'}`}>
                            {wishlistCount}
                        </span>
                    )}
                </button>

                {/* Profile */}
                <button
                    onClick={() => setIsProfileOpen(true)}
                    className={`flex flex-col items-center p-2 transition-colors ${isActive('/profile') ? 'text-primary' : 'text-gray-400'}`}
                >
                    <i className="fas fa-user text-xl"></i>
                    <span className="text-[10px] font-medium mt-1 uppercase tracking-tighter">{t('profile')}</span>
                </button>
            </nav>

            {/* Modals */}
            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </>
    );
};

export default Footer;
