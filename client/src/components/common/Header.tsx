import React, { useState } from 'react';
import MobileMenu from './MobileMenu';
import BranchModal from './BranchModal';
import CartModal from './CartModal';
import WishlistModal from './WishlistModal';
import ProfileModal from './ProfileModal';
import LanguageModal from './LanguageModal';
import { useBranch } from '../../contexts/BranchContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const { selectedBranch } = useBranch();
    const { language, isRTL, t } = useLanguage();
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { isAuthenticated, user } = useAuth();

    return (
        <header className="fixed top-0 left-0 w-full h-[70px] bg-white flex items-center justify-between px-4 lg:px-8 z-[1000] shadow-sm">
            {/* Logo */}
            <div className="flex items-center">
                <img
                    src="/assets/logo.svg"
                    alt="iGrab Story Cafe"
                    className="h-[48px] w-auto"
                    onError={(e) => {
                        e.currentTarget.src = 'https://igrab.ae/assets/logo.svg';
                    }}
                />
            </div>

            {/* Desktop Navigation */}
            <nav className={`hidden lg:flex items-center space-x-8 ml-12 mr-auto ${isRTL ? 'space-x-reverse ml-auto mr-12' : ''}`}>
                <a href="/home" className="text-primary font-bold hover:opacity-80 transition-opacity font-dmsans">{t('home')}</a>
                <a href="/shop" className="text-gray-500 font-bold hover:text-primary transition-colors font-dmsans">{t('shop')}</a>
                <a href="/brands" className="text-gray-500 font-bold hover:text-primary transition-colors font-dmsans">{t('brands')}</a>
            </nav>

            {/* Search Bar (Desktop Only) */}
            <div className={`hidden lg:block relative max-w-sm w-full mx-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                <i className={`fas fa-search absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`}></i>
                <input
                    type="text"
                    placeholder={t('search_placeholder')}
                    className={`w-full ${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'} py-2 bg-gray-50 border border-gray-100 rounded-full focus:outline-none focus:border-accent-gold transition-all font-inter text-sm`}
                />
            </div>

            {/* Actions (Desktop Only) */}
            <div className="hidden lg:flex items-center space-x-4">
                {/* Language Display (Desktop) */}
                <div
                    className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setIsLanguageOpen(true)}
                >
                    <i className="fas fa-globe text-primary text-sm"></i>
                    <span className="text-xs font-bold text-gray-600 font-inter uppercase">
                        {language}
                    </span>
                    <i className="fas fa-chevron-down text-[10px] text-gray-400"></i>
                </div>

                {/* Branch Display */}
                <div
                    className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setIsBranchModalOpen(true)}
                >
                    <i className="fas fa-store text-primary text-sm"></i>
                    <span className="text-xs font-bold text-gray-600 font-inter">
                        {selectedBranch ? selectedBranch.name : t('select_branch')}
                    </span>
                    <i className="fas fa-chevron-down text-[10px] text-gray-400"></i>
                </div>

                {/* Wishlist */}
                <button
                    onClick={() => setIsWishlistOpen(true)}
                    className="relative p-2 cursor-pointer text-text-black hover:text-accent-gold transition-colors"
                    title="Wishlist"
                >
                    <i className="far fa-heart text-2xl"></i>
                    {wishlistCount > 0 && (
                        <span className="badge">{wishlistCount}</span>
                    )}
                </button>

                {/* Cart */}
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 cursor-pointer text-text-black hover:text-accent-gold transition-colors"
                    title="Cart"
                >
                    <i className="fas fa-shopping-bag text-2xl"></i>
                    {cartCount > 0 && (
                        <span className="badge">{cartCount}</span>
                    )}
                </button>

                <button
                    onClick={() => setIsProfileOpen(true)}
                    className="p-2 cursor-pointer text-text-black hover:text-accent-gold transition-colors flex items-center gap-2"
                >
                    <i className="far fa-user-circle text-2xl"></i>
                    {isAuthenticated && user && (
                        <span className="text-xs font-bold text-gray-600 font-inter">
                            {user.firstName}
                        </span>
                    )}
                </button>
            </div>

            {/* Mobile: Cart + Hamburger */}
            <div className="lg:hidden flex items-center space-x-1">
                {/* Branch Search (Mobile) */}
                <button
                    onClick={() => setIsBranchModalOpen(true)}
                    className="p-2 text-text-black"
                >
                    <i className="fas fa-store text-xl"></i>
                </button>
                {/* Language Switcher (Mobile) */}
                <button
                    className="p-2 text-text-black"
                    onClick={() => setIsLanguageOpen(true)}
                >
                    <i className="fas fa-globe text-xl"></i>
                </button>
                <button
                    className="p-2 text-text-black focus:outline-none active:scale-95 transition-transform"
                    onClick={() => setIsMenuOpen(true)}
                >
                    <i className="fas fa-bars text-2xl"></i>
                </button>
            </div>

            {/* Modals */}
            <MobileMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onOpenBranch={() => setIsBranchModalOpen(true)}
                onOpenProfile={() => setIsProfileOpen(true)}
                onOpenLanguage={() => setIsLanguageOpen(true)}
            />
            <BranchModal isOpen={isBranchModalOpen} onClose={() => setIsBranchModalOpen(false)} />
            <LanguageModal isOpen={isLanguageOpen} onClose={() => setIsLanguageOpen(false)} />
            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </header>
    );
};

export default Header;
