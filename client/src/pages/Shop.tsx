import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import api, { validateProductsResponse, validateCategoriesResponse } from '../services/api';
import Layout from '../components/common/Layout';
import ProductCard from '../components/home/ProductCard';
import { useBranch } from '../contexts/BranchContext';
import { useLanguage } from '../contexts/LanguageContext';

const Shop: React.FC = () => {
    const { selectedBranch } = useBranch();
    const { t, isRTL, language } = useLanguage();
    const location = useLocation();

    // Parse category from URL
    const getQueryCategory = () => {
        const params = new URLSearchParams(location.search);
        return params.get('category');
    };

    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>(['All']);
    const [rawCategories, setRawCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(getQueryCategory() || 'All');
    const [selectedSort, setSelectedSort] = useState('new');
    const [showSortModal, setShowSortModal] = useState(false);
    const [showBrandModal, setShowBrandModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalProducts, setTotalProducts] = useState(0);
    const [page, setPage] = useState(1);
    const [brands, setBrands] = useState<any[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [brandSearchQuery, setBrandSearchQuery] = useState('');

    // Update category when URL changes
    useEffect(() => {
        const cat = getQueryCategory();
        if (cat) {
            setSelectedCategory(cat);
        }
    }, [location.search]);

    // Fetch categories and brands
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, brandsRes] = await Promise.all([
                    api.get('/api/categories'),
                    api.get('/api/brands')
                ]);

                const validatedCategories = validateCategoriesResponse(categoriesRes.data);
                setRawCategories(validatedCategories);
                const catNames = validatedCategories.map((c: any) => c.name.en);
                setCategories(['All', 'Best Selling', ...catNames]);

                if (Array.isArray(brandsRes.data)) {
                    setBrands(brandsRes.data);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                // Fallback categories
                setCategories(['All', 'Best Selling', 'Coffee', 'Cold Drinks', 'Pastries', 'Breakfast']);
            }
        };
        fetchData();
    }, []);

    // Fetch products with filters
    const fetchProducts = useCallback(async (isLoadMore = false) => {
        if (!isLoadMore) setLoading(true);
        setError(null);
        try {
            const currentPage = isLoadMore ? page + 1 : 1;
            const response = await api.post('/api/products/search', {
                search: searchQuery || 'NOTHING',
                category: selectedCategory,
                brand: selectedBrand || 'NOTHING',
                sort: selectedSort,
                branchId: selectedBranch?._id,
                page: currentPage,
                limit: 12
            });

            const validatedProducts = validateProductsResponse(response.data);
            if (isLoadMore) {
                setProducts(prev => [...prev, ...validatedProducts]);
                setPage(currentPage);
            } else {
                setProducts(validatedProducts);
                setPage(1);
            }
            setTotalProducts(response.data.totalProducts || 0);
        } catch (err: any) {
            console.error('Error fetching products:', err);
            setError(t('failed_products'));
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedCategory, selectedSort, selectedBrand, page, selectedBranch]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);



    const handleSortChange = (sort: string) => {
        setSelectedSort(sort);
        setShowSortModal(false);
    };

    return (
        <Layout>
            <div className="bg-muted min-h-screen">
                {/* Page Title */}
                <div className={`py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h1 className="text-2xl lg:text-3xl font-bold text-text-black">{t('our_products')}</h1>
                    <p className="text-sm text-gray-500 font-inter">{t('shop_subtitle')}</p>
                </div>

                {/* Search and Filter Bar */}
                <div className={`flex items-center mb-6 rounded-2xl bg-white p-2 shadow-sm border border-gray-50 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="relative flex-grow">
                        <i className={`fas fa-search absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`}></i>
                        <input
                            type="text"
                            className={`w-full ${isRTL ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'} py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-all font-inter text-sm`}
                            placeholder={t('search_products')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className={`flex items-center ${isRTL ? 'mr-2' : 'ml-2'}`}>
                        <button
                            onClick={() => setShowBrandModal(true)}
                            className={`p-3 rounded-xl transition-colors ${selectedBrand ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-100 text-gray-600'}`}
                        >
                            <i className="fas fa-crown"></i>
                        </button>
                        <button
                            onClick={() => setShowSortModal(true)}
                            className={`${isRTL ? 'mr-1' : 'ml-1'} p-3 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors`}
                        >
                            <i className="fas fa-sort"></i>
                        </button>
                    </div>
                </div>

                {/* Categories Scrollable Tabs */}
                <div className={`mb-8 overflow-x-auto no-scrollbar ${isRTL ? 'dir-rtl' : ''}`}>
                    <div className={`flex ${isRTL ? 'space-x-reverse' : ''} space-x-3 py-1`}>
                        {categories.map((cat) => {
                            let label = cat;
                            if (cat === 'All') label = t('all');
                            else if (cat === 'Best Selling') label = t('best_selling');
                            else {
                                const rawCat = rawCategories.find(rc => rc.name.en === cat);
                                if (rawCat) label = rawCat.name[language] || rawCat.name.en;
                            }

                            return (
                                <div
                                    key={cat}
                                    className={`category-pill ${selectedCategory === cat ? 'active' : ''} whitespace-nowrap`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {label}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Filter Status Pills */}
                <div className={`flex flex-wrap items-center mb-4 gap-3 animate-fade-in ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {searchQuery && (
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-sm font-semibold text-gray-500">{t('search_label')}</span>
                            <span className={`bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                {searchQuery}
                                <i className="fas fa-times cursor-pointer text-xs" onClick={() => setSearchQuery('')}></i>
                            </span>
                        </div>
                    )}
                    {selectedBrand && (
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-sm font-semibold text-gray-500">{t('brand_label')}</span>
                            <span className={`bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                {selectedBrand}
                                <i className="fas fa-times cursor-pointer text-xs" onClick={() => setSelectedBrand(null)}></i>
                            </span>
                        </div>
                    )}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6 mb-12 min-h-[400px]">
                    {loading ? (
                        [...Array(12)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 animate-pulse">
                                <div className="h-48 bg-gray-100"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-3 bg-gray-50 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                    <div className="flex justify-between items-center">
                                        <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                                        <div className="h-8 w-8 bg-gray-50 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : error ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                            <i className="fas fa-exclamation-triangle text-red-400 text-5xl mb-4"></i>
                            <h3 className="text-xl font-bold mb-2">{error}</h3>
                            <button onClick={() => fetchProducts()} className="btn-primary px-6 py-2">{t('retry')}</button>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center animate-fade-in">
                            <div className="w-32 h-32 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <i className="fas fa-search text-gray-400 text-5xl"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('no_results')}</h3>
                            <p className="text-gray-600 mb-8 max-w-xs font-inter">{t('no_results_desc')}</p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                className="btn-primary px-8 py-3 rounded-xl shadow-lg"
                            >
                                {t('clear_filters')}
                            </button>
                        </div>
                    ) : (
                        products.map((product) => (
                            <ProductCard
                                key={product._id}
                                id={product._id}
                                name={product.name}
                                category={product.categoryId?.name || product.category?.name}
                                price={product.pricing.price}
                                currency={product.pricing.currency}
                                image={product.images[0]}
                                rating={product.sales?.starRating || 0}
                                reviews={product.sales?.totalReviews || 0}
                                slug={product.meta?.slug}
                            />
                        ))
                    )}
                </div>

                {/* Load More Button */}
                {!loading && products.length < totalProducts && (
                    <div className="flex justify-center pb-12">
                        <button
                            onClick={() => fetchProducts(true)}
                            className="btn-secondary px-8 py-3 flex items-center shadow-lg active:scale-95 transition-transform"
                        >
                            {t('load_more')}
                            <i className={`fas fa-chevron-down ${isRTL ? 'mr-2' : 'ml-2'}`}></i>
                        </button>
                    </div>
                )}
            </div>

            {/* Sort Modal Backdrop */}
            {showSortModal && createPortal(
                <div
                    className="fixed inset-0 bg-black/50 z-[1000] animate-fade-in"
                    onClick={() => setShowSortModal(false)}
                >
                    <div
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-8 pb-10 z-[1001] animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`flex justify-between items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <h3 className="text-xl font-bold text-text-black">{t('sort')}</h3>
                            <button onClick={() => setShowSortModal(false)} className="text-gray-400 hover:text-black">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <div className="space-y-2">
                            {[
                                { id: 'new', label: t('sort_new') },
                                { id: 'price-high', label: t('sort_price_high') },
                                { id: 'price-low', label: t('sort_price_low') },
                                { id: 'name-az', label: t('sort_name_az') },
                                { id: 'name-za', label: t('sort_name_za') }
                            ].map((option) => (
                                <div
                                    key={option.id}
                                    className={`flex items-center justify-between py-4 border-b border-gray-50 last:border-0 cursor-pointer group ${isRTL ? 'flex-row-reverse' : ''}`}
                                    onClick={() => handleSortChange(option.id)}
                                >
                                    <span className={`font-inter ${selectedSort === option.id ? 'text-primary font-bold' : 'text-gray-700 group-hover:text-black'} ${isRTL ? 'text-right' : 'text-left'}`}>
                                        {option.label}
                                    </span>
                                    {selectedSort === option.id && <i className="fas fa-check text-primary"></i>}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowSortModal(false)}
                            className="w-full mt-6 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-transform"
                        >
                            {t('apply')}
                        </button>
                    </div>
                </div>,
                document.body
            )}

            {/* Brand Modal Backdrop */}
            {showBrandModal && createPortal(
                <div
                    className="fixed inset-0 bg-black/50 z-[1000] animate-fade-in flex items-end lg:items-center lg:justify-center"
                    onClick={() => setShowBrandModal(false)}
                >
                    <div
                        className="bg-white w-full lg:w-[450px] rounded-t-[32px] lg:rounded-[32px] p-6 lg:p-8 pb-10 lg:pb-8 z-[1001] animate-slide-up lg:animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`flex justify-between items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <h3 className="text-xl font-bold text-text-black">{t('filter_brand')}</h3>
                            <button onClick={() => setShowBrandModal(false)} className="text-gray-400 hover:text-black">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <div className="relative mb-6">
                            <i className={`fas fa-search absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`}></i>
                            <input
                                type="text"
                                className={`w-full ${isRTL ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'} py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-inter text-sm`}
                                placeholder={t('search_brands')}
                                value={brandSearchQuery}
                                onChange={(e) => setBrandSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto no-scrollbar pb-4 px-1">
                            {brands.filter(b => b.name.en.toLowerCase().includes(brandSearchQuery.toLowerCase())).map((brand) => (
                                <div
                                    key={brand._id}
                                    className={`brand-option-card p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${selectedBrand === brand.name.en ? 'border-primary bg-primary/5' : 'border-gray-50 hover:bg-gray-50'}`}
                                    onClick={() => setSelectedBrand(selectedBrand === brand.name.en ? null : brand.name.en)}
                                >
                                    <img
                                        src={brand.logo.startsWith('http')
                                            ? brand.logo
                                            : `${import.meta.env.VITE_API_URL}/uploads/brands/${brand.logo.startsWith('/') ? brand.logo.substring(1) : brand.logo}`}
                                        alt={brand.name[language] || brand.name.en}
                                        className="w-12 h-12 object-contain mb-3 bg-white p-2 rounded-full shadow-sm"
                                        onError={(e) => {
                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${brand.name.en}&background=random&color=fff&size=48`;
                                        }}
                                    />
                                    <span className={`text-xs font-bold font-inter ${selectedBrand === brand.name.en ? 'text-primary' : 'text-gray-700'}`}>
                                        {brand.name[language] || brand.name.en}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowBrandModal(false)}
                            className="w-full mt-6 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-transform"
                        >
                            {t('apply_filter')}
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </Layout>
    );
};

export default Shop;
