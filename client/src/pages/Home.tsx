import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/common/Layout';
import HeroSlider from '../components/home/HeroSlider';
import ProductCard from '../components/home/ProductCard';
import FactsSection from '../components/home/FactsSection';
import HowItWorks from '../components/home/HowItWorks';
import Newsletter from '../components/home/Newsletter';
import { useBranch } from '../contexts/BranchContext';
import { useLanguage } from '../contexts/LanguageContext';

const Home: React.FC = () => {
  const history = useHistory();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedBranch } = useBranch();
  const { t, isRTL, language } = useLanguage();

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('/api/categories');
      if (response.data && response.data.length > 0) {
        setCategories(response.data);
        localStorage.setItem('cached_categories', JSON.stringify(response.data));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      const cached = localStorage.getItem('cached_categories');
      if (cached) {
        setCategories(JSON.parse(cached));
      }
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Home: Fetching products for branch:', selectedBranch?._id);
      const params = selectedBranch ? { params: { branchId: selectedBranch._id } } : {};
      const response = await axios.get('/api/products', params);
      const fetchedProducts = response.data.products || response.data;

      if (fetchedProducts && fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
        // Persist to local storage
        localStorage.setItem(`cached_products_${selectedBranch?._id || 'all'}`, JSON.stringify(fetchedProducts));
      } else {
        setProducts([]); // Clear products if none found for branch
        if (selectedBranch) {
          setError('No products found for this branch');
        }
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      // Ensure we don't show "No products found" error if we have cached data
      const cached = localStorage.getItem(`cached_products_${selectedBranch?._id || 'all'}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.length > 0) {
          setProducts(parsed);
          setError('Offline Mode: Showing previously loaded products');
        } else {
          setError('Network Error: Please check your connection');
        }
      } else {
        setError('Network Error: Please check your connection');
      }
    } finally {
      setLoading(false);
    }
  }, [selectedBranch]);

  useEffect(() => {
    // Initial load from cache to prevent blank screen
    const cachedProducts = localStorage.getItem(`cached_products_${selectedBranch?._id || 'all'}`);
    if (cachedProducts) {
      setProducts(JSON.parse(cachedProducts));
      setLoading(false);
    }

    const cachedCats = localStorage.getItem('cached_categories');
    if (cachedCats) {
      setCategories(JSON.parse(cachedCats));
    }

    fetchProducts();
    fetchCategories();
  }, [selectedBranch, fetchProducts, fetchCategories]);

  try {
    return (
      <Layout>
        <div className="bg-muted min-h-screen">
          <HeroSlider />

          {/* Categories Scrollable Section */}
          {categories.length > 0 && (
            <section className="mb-10 mt-8">
              <div className={`flex justify-between items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h2 className="text-2xl lg:text-3xl font-bold text-text-black font-chillax">{t('categories')}</h2>
                <button
                  onClick={() => history.push('/shop')}
                  className="text-accent font-medium hover:underline transition-all font-inter flex items-center gap-1"
                >
                  {isRTL && <i className="fas fa-arrow-left text-xs"></i>}
                  {t('view_all')}
                  {!isRTL && <i className="fas fa-arrow-right text-xs"></i>}
                </button>
              </div>
              <div className={`flex overflow-x-auto space-x-3 pb-2 no-scrollbar ${isRTL ? 'space-x-reverse' : ''}`}>
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="category-pill active:scale-95 transition-transform whitespace-nowrap"
                    onClick={() => history.push(`/shop?category=${encodeURIComponent(cat.name.en)}`)}
                  >
                    {cat.name[language] || cat.name.en}
                  </div>
                ))}
              </div>
            </section>
          )}

          {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

          {/* Popular Products Grid */}
          <section className="mb-12">
            <div className={`flex justify-between items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h2 className="text-2xl lg:text-3xl font-bold text-text-black font-chillax">{t('popular_now')}</h2>
              <button
                onClick={() => history.push('/shop')}
                className="text-accent font-medium hover:underline transition-all font-inter flex items-center gap-1"
              >
                {isRTL && <i className="fas fa-arrow-left text-xs"></i>}
                {t('see_all')}
                {!isRTL && <i className="fas fa-arrow-right text-xs"></i>}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="product-card h-64 animate-pulse bg-gray-50 rounded-2xl"></div>
                ))
              ) : (
                products.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    category={product.categoryId?.name || product.category?.name}
                    price={product.pricing?.price || 0}
                    currency={product.pricing?.currency || 'AED'}
                    image={product.images?.[0] || ''}
                    rating={product.sales?.starRating || 0}
                    reviews={product.sales?.totalReviews || 0}
                    slug={product.meta?.slug}
                  />
                ))
              )}
            </div>
          </section>

          <FactsSection />
          <HowItWorks />
          <Newsletter />
        </div>
      </Layout>
    );
  } catch (renderError: any) {
    console.error('CRITICAL RENDER ERROR:', renderError);
    return (
      <div className="p-10 bg-white text-black min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Critical Render Error</h1>
        <pre className="p-4 bg-gray-100 rounded overflow-auto">{renderError.stack || renderError.message}</pre>
      </div>
    );
  }
};

export default Home;
