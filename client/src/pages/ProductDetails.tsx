import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { IonSkeletonText } from '@ionic/react';
import api from '../services/api';
import Layout from '../components/common/Layout';
import CartModal from '../components/common/CartModal';
import WishlistModal from '../components/common/WishlistModal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useBranch } from '../contexts/BranchContext';
import SEO from '../components/SEO';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const ProductDetails: React.FC = () => {
    const { t, isRTL, language } = useLanguage();
    const { slug } = useParams<{ slug: string }>();
    const history = useHistory();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);

    const { addToCart, removeFromCart, updateQuantity, isInCart: isInCartFn, getQuantity, cartCount } = useCart();
    const { toggleWishlist, isWishlisted: isWishlistedFn, wishlistCount } = useWishlist();

    const fetchProduct = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/products/${slug}`);
            const data = response.data;
            setProduct(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching product:', err);
            setError(t('failed_product_details'));
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        if (slug) {
            fetchProduct();
        }
    }, [slug, fetchProduct]);

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!product) return;
        toggleWishlist({
            id: product._id,
            name: product.name[language] || product.name.en,
            price: product.pricing.price,
            currency: product.pricing.currency,
            image: product.images?.[0] || '',
            category: product.categoryId?.name?.[language] || product.categoryId?.name?.en,
            slug: product.meta?.slug,
        });
    };

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({
            id: product._id,
            name: product.name[language] || product.name.en,
            price: product.pricing.price,
            currency: product.pricing.currency,
            image: product.images?.[0] || '',
            category: product.categoryId?.name?.[language] || product.categoryId?.name?.en,
            slug: product.meta?.slug,
        });
    };

    const handleUpdateQuantity = (newQty: number) => {
        if (!product) return;
        updateQuantity(product._id, newQty);
    };

    const handleShare = (type: string) => {
        const url = window.location.href;
        const text = `Check out this product: ${product.name.en}`;

        switch (type) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(t('share_text') + ' ' + (product.name[language] || product.name.en) + ' ' + url)}`, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                alert(t('link_copied'));
                break;
        }
        setShowShareMenu(false);
    };

    if (loading) {
        return (
            <Layout showHeader={false}>
                <div className="p-4 space-y-4">
                    <IonSkeletonText animated style={{ width: '100%', height: '400px', borderRadius: '24px' }} />
                    <IonSkeletonText animated style={{ width: '60%', height: '32px' }} />
                    <IonSkeletonText animated style={{ width: '40%', height: '24px' }} />
                    <div className="space-y-2">
                        <IonSkeletonText animated style={{ width: '100%', height: '16px' }} />
                        <IonSkeletonText animated style={{ width: '100%', height: '16px' }} />
                        <IonSkeletonText animated style={{ width: '80%', height: '16px' }} />
                    </div>
                </div>
            </Layout>
        );
    }

    if (error || !product) {
        return (
            <Layout showHeader={false}>
                <div className="p-8 text-center py-20 bg-white min-h-screen flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                        <i className="fas fa-exclamation-triangle text-red-500 text-4xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{error || t('product_not_found')}</h3>
                    <p className="text-gray-500 mb-8 max-w-xs">{t('product_load_error_desc')}</p>
                    <button onClick={() => history.goBack()} className="btn-primary w-full max-w-xs py-4 rounded-2xl">
                        {t('go_back')}
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <>
            <SEO
                title={product.name[language] || product.name.en}
                description={product.description[language] || product.description.en}
                ogImage={product.images?.[0] ?
                    (product.images[0].startsWith('http') ? product.images[0] : `${import.meta.env.VITE_API_URL}/uploads/products/${product.images[0]}`)
                    : undefined}
            />
            <Layout
                showHeader={false}
                showFooter={false}
                hidePadding={true}
                customFooter={
                    <div className="fixed bottom-0 left-0 right-0 p-6 z-[100] bg-white/60 backdrop-blur-xl border-t border-gray-100/50 lg:hidden">
                        <div className="max-w-md mx-auto">
                            {product && isInCartFn(product._id) ? (
                                <div className={`flex items-center justify-between bg-white rounded-3xl p-2 shadow-2xl border border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className={`flex items-center gap-4 ${isRTL ? 'mr-4 flex-row-reverse' : 'ml-4'}`}>
                                        <button
                                            onClick={() => handleUpdateQuantity(getQuantity(product._id) - 1)}
                                            className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary active:scale-95 transition-transform"
                                        >
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <span className="font-chillax font-bold text-xl min-w-[30px] text-center text-text-black">{getQuantity(product._id)}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(getQuantity(product._id) + 1)}
                                            className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary active:scale-95 transition-transform"
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                    <div className={isRTL ? 'ml-2' : 'mr-2'}>
                                        <button
                                            onClick={() => setIsCartOpen(true)}
                                            className={`px-6 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-3 shadow-xl active:scale-95 transition-transform ${isRTL ? 'flex-row-reverse' : ''}`}
                                        >
                                            <i className="fas fa-shopping-bag"></i>
                                            {t('view_cart')}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    className={`group w-full bg-primary text-white py-5 rounded-[28px] font-bold shadow-[0_20px_40px_rgba(0,63,46,0.25)] active:scale-[0.98] transition-all flex items-center justify-center gap-4 overflow-hidden relative ${isRTL ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <i className="fas fa-shopping-bag text-xl"></i>
                                    <span className="text-lg">{t('add_to_basket')}</span>
                                    <div className="mx-2 lg:mx-4 h-6 w-[1px] bg-white/20" />
                                    <span className="text-lg font-chillax">
                                        {product.pricing.currency} {product.pricing.price.toFixed(2)}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                }
            >
                {/* Sticky Header */}
                <header className={`fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md z-[100] flex items-center justify-between px-4 border-b border-gray-100/50 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button
                        onClick={() => history.goBack()}
                        className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-800 active:scale-90 transition-transform"
                    >
                        <i className={`fas fa-arrow-${isRTL ? 'right' : 'left'}`}></i>
                    </button>

                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="relative">
                            <button
                                onClick={() => setShowShareMenu(!showShareMenu)}
                                className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-800 active:scale-90 transition-transform"
                            >
                                <i className="fas fa-share-alt"></i>
                            </button>
                            {showShareMenu && (
                                <div className={`absolute top-12 ${isRTL ? 'left-0' : 'right-0'} bg-white rounded-2xl shadow-2xl p-4 z-[110] min-w-[180px] animate-fade-in border border-gray-50`}>
                                    <button onClick={() => handleShare('whatsapp')} className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                        <i className="fab fa-whatsapp text-green-500 text-xl"></i>
                                        <span className="text-sm font-bold">{t('whatsapp')}</span>
                                    </button>
                                    <button onClick={() => handleShare('copy')} className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                        <i className="fas fa-link text-blue-500 text-xl"></i>
                                        <span className="text-sm font-bold">{t('copy_link')}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setIsWishlistOpen(true)}
                            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center active:scale-90 transition-transform relative"
                        >
                            <i className={`fas fa-heart ${product && isWishlistedFn(product._id) ? 'text-red-500' : 'text-gray-400'}`}></i>
                            {wishlistCount > 0 && (
                                <span className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} bg-accent-gold text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white`}>
                                    {wishlistCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-800 active:scale-90 transition-transform relative"
                        >
                            <i className="fas fa-shopping-bag"></i>
                            {cartCount > 0 && (
                                <span className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} bg-accent-gold text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white`}>
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </header>

                <div className="product-details-content pt-16 pb-20">
                    {/* Image Slider */}
                    <div className="relative bg-white rounded-b-[40px] overflow-hidden shadow-sm">
                        <Swiper
                            key={language}
                            dir={isRTL ? "rtl" : "ltr"}
                            modules={[Pagination, Autoplay]}
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            className="h-[450px] lg:h-[600px]"
                        >
                            {product.images?.map((img: string, idx: number) => {
                                const imageUrl = img.startsWith('http')
                                    ? img
                                    : `${import.meta.env.VITE_API_URL}/uploads/products/${img.startsWith('/') ? img.substring(1) : img}`;
                                return (
                                    <SwiperSlide key={idx}>
                                        <img
                                            src={imageUrl}
                                            alt={`${product.name[language] || product.name.en} - ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.log('Image load error for:', imageUrl);
                                                e.currentTarget.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80';
                                            }}
                                        />
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>

                    {/* Product Info */}
                    <div className={`px-6 mt-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className={`flex items-center mb-2 ${isRTL ? 'justify-end' : 'justify-between'}`}>
                            {product.categoryId && (
                                <span className="text-primary font-bold text-xs uppercase tracking-[0.2em]">
                                    {product.categoryId.name[language] || product.categoryId.name.en}
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl font-chillax font-bold text-text-black mb-4 leading-tight">
                            {product.name[language] || product.name.en}
                        </h1>

                        <div className={`flex items-baseline gap-2 mb-8 ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
                            <span className="text-2xl font-bold text-text-black">
                                {product.pricing.currency} {product.pricing.price.toFixed(2)}
                            </span>
                        </div>

                        {/* Brand Info */}
                        {product.brandId && (
                            <div className={`bg-white p-5 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center mb-8 border border-gray-50/50 gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 p-2 border border-gray-100 overflow-hidden flex-shrink-0 text-center flex items-center justify-center">
                                    <img
                                        src={product.brandId.logo.startsWith('http')
                                            ? product.brandId.logo
                                            : `${import.meta.env.VITE_API_URL}/uploads/brands/${product.brandId.logo.startsWith('/') ? product.brandId.logo.substring(1) : product.brandId.logo}`}
                                        alt={product.brandId.name[language] || product.brandId.name.en}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(product.brandId.name.en) + '&background=random&color=fff&size=128';
                                        }}
                                    />
                                </div>
                                <div className={`flex-grow ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <h4 className="font-bold text-gray-900 text-lg">{product.brandId.name[language] || product.brandId.name.en}</h4>
                                    <p className="text-xs text-gray-400 font-inter">{product.brandId.tagline?.[language] || product.brandId.tagline?.en}</p>
                                </div>
                                <button className={`${isRTL ? 'rotate-180' : ''} w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0`}>
                                    <i className="fas fa-chevron-right text-xs"></i>
                                </button>
                            </div>
                        )}

                        {/* Description Section */}
                        <div className="mb-10">
                            <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <h3 className="text-xl font-chillax font-bold text-text-black">{t('product_details_title')}</h3>
                            </div>
                            <div className="relative">
                                <p className={`text-gray-500 font-inter leading-relaxed transition-all duration-300 ${!showFullDescription ? 'line-clamp-3' : ''} ${isRTL ? 'text-right' : 'text-left'}`}>
                                    {product.description[language] || product.description.en}
                                </p>
                                {(product.description[language] || product.description.en).length > 150 && (
                                    <button
                                        onClick={() => setShowFullDescription(!showFullDescription)}
                                        className={`text-primary font-bold text-sm mt-3 flex items-center gap-2 ${isRTL ? 'flex-row-reverse float-right' : ''}`}
                                    >
                                        {showFullDescription ? t('show_less') : t('read_full_desc')}
                                        <i className={`fas fa-chevron-${showFullDescription ? 'up' : 'down'} text-[10px]`}></i>
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </Layout>
            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
        </>
    );
};

export default ProductDetails;
