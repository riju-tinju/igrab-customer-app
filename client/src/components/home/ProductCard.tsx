import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProductCardProps {
    id: string;
    name: {
        en: string;
        ar?: string;
        [key: string]: string | undefined;
    };
    category?: {
        en: string;
        ar?: string;
        [key: string]: string | undefined;
    };
    price: number;
    currency: string;
    image: string;
    rating: number;
    reviews: number;
    slug?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
    id, name, category, price, currency, image, slug
}) => {
    const { addToCart, isInCart, cartItems } = useCart();
    const { toggleWishlist, isWishlisted } = useWishlist();
    const { t, isRTL } = useLanguage();

    const imageUrl = image?.startsWith('http') ? image : `${import.meta.env.VITE_API_URL}/${image?.startsWith('/') ? image.substring(1) : image}`;
    const wishlisted = isWishlisted(id);
    const inCart = isInCart(id);
    const { language } = useLanguage();

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist({ id, name, price, currency, image, category, slug });
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({ id, name, price, currency, image, category, slug });
    };

    return (
        <div className="product-card">
            <div className="relative">
                <img
                    src={imageUrl}
                    alt={name[language] || name.en}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80';
                    }}
                />
                <button
                    onClick={handleWishlist}
                    className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} bg-white p-2 rounded-full shadow-md flex items-center justify-center transition-all active:scale-90`}
                    title={wishlisted ? t('remove_wishlist') : t('add_wishlist')}
                >
                    <i className={`${wishlisted ? 'fas fa-heart text-red-500' : 'far fa-heart text-gray-600'} text-lg transition-colors`}></i>
                </button>
            </div>

            <div className="p-4">
                {category && (
                    <div className={`text-sm text-gray-500 mb-1 font-inter ${isRTL ? 'text-right' : 'text-left'}`}>
                        {category[language] || category.en}
                    </div>
                )}

                <Link to={slug ? `/product/${slug}` : `/product/${id}`} className="block">
                    <h3 className={`font-bold mb-1 text-text-black line-clamp-1 h-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {name[language] || name.en}
                    </h3>
                </Link>

                <div className={`flex items-center justify-between mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="font-bold text-text-black text-lg" dir="ltr">
                        {currency} {price}
                    </span>
                    <button
                        onClick={handleAddToCart}
                        className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all shadow-md ${inCart
                            ? 'bg-green-100 text-green-600 border-2 border-green-300'
                            : 'bg-primary text-white hover:bg-opacity-90'
                            }`}
                    >
                        <i className={`fas ${inCart ? 'fa-check' : 'fa-plus'} ${isRTL ? 'transform-none' : ''}`}></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
