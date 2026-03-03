import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
    const { cartItems, subTotal, removeFromCart, updateQuantity } = useCart();
    const { toggleWishlist } = useWishlist();
    const { isAuthenticated } = useAuth();
    const { t, isRTL, language } = useLanguage();
    const history = useHistory();

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const getImageUrl = (image: string) =>
        image?.startsWith('http') ? image : `${import.meta.env.VITE_API_URL}/${image?.startsWith('/') ? image.substring(1) : image}`;

    return createPortal(
        <div
            className={`fixed inset-0 bg-black/60 z-[2000] flex items-end lg:items-stretch ${isRTL ? 'lg:justify-start' : 'lg:justify-end'} animate-fade-in`}
            onClick={onClose}
        >
            <div
                className={`bg-white w-full lg:w-[480px] h-[92vh] lg:h-screen rounded-t-[40px] lg:rounded-none flex flex-col animate-slide-up-modal lg:animate-slide-in-right relative shadow-2xl ${isRTL ? 'lg:rounded-r-[40px] lg:animate-slide-in-left' : 'lg:rounded-l-[40px]'}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-6 border-b border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h2 className="text-2xl font-bold text-text-black font-chillax">{t('cart_title')}</h2>
                        {cartItems.length > 0 && (
                            <p className="text-xs text-gray-400 font-inter mt-1">
                                {cartItems.length} {t(cartItems.length === 1 ? 'item' : 'items')}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-primary transition-all active:scale-90"
                    >
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 no-scrollbar">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                                <i className="fas fa-shopping-bag text-gray-200 text-4xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('cart_empty')}</h3>
                            <p className="text-sm text-gray-400 font-inter mb-8 max-w-[240px]">{t('cart_empty_desc')}</p>
                            <Link
                                to="/shop"
                                onClick={onClose}
                                className="px-10 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 active:scale-95 transition-all"
                            >
                                {t('start_shopping')}
                            </Link>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className={`flex items-center gap-4 py-2 group ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="w-[84px] h-[84px] rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                                    <img
                                        src={getImageUrl(item.image)}
                                        alt={item.name[language] || item.name.en}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=200&q=80'; }}
                                    />
                                </div>
                                <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold font-inter mb-1">{item.category?.[language] || item.category?.en}</p>
                                    <h4 className="font-bold text-base text-text-black line-clamp-1 mb-1">{item.name[language] || item.name.en}</h4>
                                    <p className="font-bold text-primary text-base" dir="ltr">{item.currency} {(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <div className={`flex flex-col items-end gap-3 ${isRTL ? 'items-start' : 'items-end'}`}>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                    >
                                        <i className="fas fa-trash-alt text-xs"></i>
                                    </button>
                                    <div className={`flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-all font-bold"
                                        >-</button>
                                        <span className="text-sm font-bold w-6 text-center text-text-black">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-all font-bold"
                                        >+</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="border-t border-gray-100 px-6 py-6 bg-gray-50/30 space-y-4">
                        <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-gray-500 font-medium">{t('subtotal')}</span>
                            <span className="text-xl font-bold text-text-black" dir="ltr">AED {subTotal.toFixed(2)}</span>
                        </div>
                        <p className={`text-xs text-gray-400 font-inter ${isRTL ? 'text-right' : ''}`}>
                            {t('delivery_calc')}
                        </p>
                        <button
                            onClick={() => {
                                onClose();
                                if (isAuthenticated) {
                                    history.push('/checkout');
                                } else {
                                    history.push('/auth?redirect=/checkout');
                                }
                            }}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mb-2"
                        >
                            {t('proceed_checkout')}
                            <i className={`fas ${isRTL ? 'fa-arrow-left' : 'fa-arrow-right'} text-sm opacity-70`}></i>
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes slide-in-right {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .lg\\:animate-slide-in-right {
                    animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes slide-in-left {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                .lg\\:animate-slide-in-left {
                    animation: slide-in-left 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes slide-up-modal {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up-modal {
                    animation: slide-up-modal 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>,
        document.body
    );
};

export default CartModal;
