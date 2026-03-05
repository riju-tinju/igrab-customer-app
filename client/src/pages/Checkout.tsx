import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../services/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../contexts/CartContext';
import { useBranch } from '../contexts/BranchContext';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';
import MapModal from '../components/common/MapModal';
import { useLanguage } from '../contexts/LanguageContext';

const StripeForm = ({ totalAmount, orderId, onSuccess, onError }: any) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        try {
            const { data } = await api.post('/api/orders/stripe-intent', { totalAmount, orderId });
            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                }
            });

            if (result.error) {
                onError(result.error.message);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    onSuccess();
                }
            }
        } catch (err: any) {
            onError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const { t, isRTL } = useLanguage();

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className={`p-4 bg-gray-50 rounded-xl border-2 border-transparent focus-within:border-primary transition-all ${isRTL ? 'text-right' : 'text-left'}`}>
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#212121',
                            textAlign: isRTL ? 'right' : 'left',
                            '::placeholder': { color: '#aab7c4' },
                            fontFamily: 'Inter, sans-serif'
                        }
                    }
                }} />
            </div>
            <button
                type="submit"
                disabled={!stripe || loading}
                className={`w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-lock"></i> {t('pay_securely')}</>}
            </button>
        </form>
    );
};

const Checkout: React.FC = () => {
    const history = useHistory();
    const { cartItems, subTotal, clearCart } = useCart();
    const { selectedBranch } = useBranch();
    const { user } = useAuth();
    const { t, isRTL, language } = useLanguage();

    const [loading, setLoading] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [stripePromise, setStripePromise] = useState<any>(null);
    const [orderStatus, setOrderStatus] = useState<'idle' | 'success' | 'failed'>('idle');
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        fullName: user?.firstName || '',
        phone: user?.phone || '',
        address: '',
        city: '',
        latitude: 0,
        longitude: 0,
        paymentMethod: 'COD' as 'COD' | 'Online',
        deliveryCharge: 0,
        distance: 0,
        orderId: '',
        totalAmount: 0
    });

    const [summaryInfo, setSummaryInfo] = useState<{ charges: any[]; isDeliveryAvailable: boolean; allowedEmirates: string[] }>({
        charges: [],
        isDeliveryAvailable: true,
        allowedEmirates: []
    });

    useEffect(() => {
        if (cartItems.length === 0 && orderStatus === 'idle') {
            history.push('/shop');
        }
    }, [cartItems, history, orderStatus]);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const { data } = await api.get('/api/orders/config/payment');
                if (data.stripe?.isEnabled && data.stripe.publishableKey) {
                    setStripePromise(loadStripe(data.stripe.publishableKey));
                }
            } catch (err) {
                console.error("Failed to load payment config", err);
            }
        };

        const fetchSummaryInfo = async () => {
            try {
                const { data } = await api.get('/api/orders/summary-info');
                setSummaryInfo(data);
            } catch (err) {
                console.error("Failed to load summary info", err);
            }
        };

        fetchConfig();
        fetchSummaryInfo();
    }, []);

    const calculateDeliveryCharge = useCallback(async (lat: number, lng: number, city: string) => {
        if (!selectedBranch) return;
        try {
            const { data } = await api.post('/api/orders/delivery-charge', {
                latitude: lat,
                longitude: lng,
                emirate: city,
                branchId: selectedBranch._id
            });
            setFormData(prev => ({
                ...prev,
                deliveryCharge: data.deliveryCharge,
                distance: data.distance
            }));
        } catch (err) {
            console.error("Failed to calculate delivery charge", err);
            setFormData(prev => ({ ...prev, deliveryCharge: 0, distance: 0 }));
        }
    }, [selectedBranch]);

    const handleLocationSelect = (loc: { address: string; city: string; lat: number; lng: number }) => {
        setFormData(prev => ({
            ...prev,
            address: loc.address,
            city: loc.city,
            latitude: loc.lat,
            longitude: loc.lng
        }));
        setShowMap(false);
        calculateDeliveryCharge(loc.lat, loc.lng, loc.city);
    };

    const handlePlaceOrder = async () => {
        if (!formData.address || !formData.fullName || !formData.phone) {
            setError(t('error_fill_fields'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const orderPayload = {
                orderItems: cartItems.map(i => ({
                    productId: i.id,
                    name: i.name,
                    image: i.image,
                    qty: i.quantity,
                    unitPrice: i.price,
                    total: i.price * i.quantity
                })),
                subTotal,
                totalAmount: subTotal + formData.deliveryCharge + summaryInfo.charges.reduce((acc, c) => acc + (c.type === 'percentage' ? (subTotal * c.value) / 100 : c.value), 0),
                paymentMethod: formData.paymentMethod,
                deliveryCharge: formData.deliveryCharge,
                address: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    city: formData.city,
                    address: formData.address,
                    latitude: formData.latitude,
                    longitude: formData.longitude
                },
                storeId: selectedBranch?._id
            };

            const { data: savedOrder } = await api.post('/api/orders', orderPayload);

            if (formData.paymentMethod === 'COD') {
                setOrderStatus('success');
                clearCart();
            } else {
                setFormData(prev => ({ ...prev, orderId: savedOrder.orderId, totalAmount: savedOrder.totalAmount }));
            }
        } catch (err: any) {
            setError(err.response?.data?.message || t('error_place_order'));
        } finally {
            setLoading(false);
        }
    };

    if (orderStatus === 'success') {
        return (
            <Layout showHeader={false} showFooter={false}>
                <div className="min-h-screen flex items-center justify-center p-6 bg-white">
                    <div className="text-center animate-fade-in">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-check text-4xl text-primary"></i>
                        </div>
                        <h1 className="text-3xl font-bold font-chillax mb-2">{t('order_confirmed')}</h1>
                        <p className="text-gray-500 mb-8">{t('order_success_desc')}</p>
                        <button
                            onClick={() => history.push('/')}
                            className="px-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl"
                        >
                            {t('return_home')}
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout showHeader={false} showFooter={false}>
            <div className={`max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12 min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
                {/* Simplified Header with Back Button */}
                <div className={`flex items-center gap-6 mb-12 animate-fade-in ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button
                        onClick={() => history.goBack()}
                        className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-900 border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        <i className={`fas ${isRTL ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
                    </button>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h1 className="text-3xl font-bold font-chillax text-gray-900">{t('checkout_title')}</h1>
                        <p className="text-sm text-gray-400 font-inter">{t('checkout_subtitle')}</p>
                    </div>
                </div>

                <div className={`flex flex-col lg:flex-row gap-12 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Left Column: Form */}
                    <div className="flex-1 space-y-8 animate-fade-in">
                        <section className="bg-white rounded-[32px] p-8 shadow-sm">
                            <h2 className={`text-2xl font-bold font-chillax mb-8 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">1</span>
                                {t('delivery_details')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={isRTL ? 'text-right' : 'text-left'}>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t('full_name')}</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                        className={`w-full px-6 py-4 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                                        placeholder={t('name_placeholder')}
                                    />
                                </div>
                                <div className={isRTL ? 'text-right' : 'text-left'}>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t('mobile_number')}</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        className={`w-full px-6 py-4 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                                        placeholder={t('phone_placeholder')}
                                        dir="ltr"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-[32px] p-8 shadow-sm">
                            <h2 className={`text-2xl font-bold font-chillax mb-8 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">2</span>
                                {t('delivery_location')}
                            </h2>
                            <button
                                onClick={() => setShowMap(true)}
                                className={`w-full p-6 border-2 border-dashed border-gray-200 rounded-[24px] hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-4 active:scale-[0.99] ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <i className="fas fa-map-marked-alt text-xl"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 line-clamp-1">{formData.address || t('select_location_map')}</p>
                                    <p className="text-sm text-gray-400 font-inter">{formData.city || t('requires_gmaps')}</p>
                                </div>
                                <i className={`fas ${isRTL ? 'fa-chevron-left' : 'fa-chevron-right'} text-gray-300`}></i>
                            </button>
                        </section>

                        <section className="bg-white rounded-[32px] p-8 shadow-sm">
                            <h2 className={`text-2xl font-bold font-chillax mb-8 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">3</span>
                                {t('payment_method')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'COD' }))}
                                    className={`p-6 rounded-[24px] border-2 transition-all flex items-center gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''} ${formData.paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-gray-50 bg-gray-50/50'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.paymentMethod === 'COD' ? 'bg-primary text-white' : 'bg-white text-gray-400 shadow-sm'}`}>
                                        <i className="fas fa-money-bill-wave"></i>
                                    </div>
                                    <div className={isRTL ? 'text-right' : 'text-left'}>
                                        <p className="font-bold text-gray-900">{t('cash_on_delivery')}</p>
                                        <p className="text-xs text-gray-400">{t('pay_on_receive')}</p>
                                    </div>
                                </button>
                                {stripePromise && (
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'Online' }))}
                                        className={`p-6 rounded-[24px] border-2 transition-all flex items-center gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''} ${formData.paymentMethod === 'Online' ? 'border-primary bg-primary/5' : 'border-gray-50 bg-gray-50/50'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.paymentMethod === 'Online' ? 'bg-primary text-white' : 'bg-white text-gray-400 shadow-sm'}`}>
                                            <i className="fas fa-credit-card"></i>
                                        </div>
                                        <div className={isRTL ? 'text-right' : 'text-left'}>
                                            <p className="font-bold text-gray-900">{t('credit_debit_card')}</p>
                                            <p className="text-xs text-gray-400">{t('secure_online_payment')}</p>
                                        </div>
                                    </button>
                                )}
                            </div>

                            {formData.paymentMethod === 'Online' && stripePromise && (
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <Elements stripe={stripePromise}>
                                        <StripeForm
                                            totalAmount={
                                                subTotal +
                                                formData.deliveryCharge +
                                                summaryInfo.charges.reduce((acc, c) => acc + (c.type === 'percentage' ? (subTotal * c.value) / 100 : c.value), 0)
                                            }
                                            orderId={formData.orderId}
                                            onSuccess={() => {
                                                setOrderStatus('success');
                                                clearCart();
                                            }}
                                            onError={(msg: string) => setError(msg)}
                                        />
                                    </Elements>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:w-[400px]">
                        <div className="sticky top-32 space-y-6">
                            <div className="bg-white rounded-[32px] p-8 shadow-sm">
                                <h3 className={`text-xl font-bold font-chillax mb-6 ${isRTL ? 'text-right' : ''}`}>{t('order_summary')}</h3>
                                <div className="space-y-4 mb-6">
                                    {cartItems.map(item => (
                                        <div key={item.id} className={`flex justify-between items-start gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                            <div className="flex-1">
                                                <p className="font-bold text-sm text-gray-800 line-clamp-1">{item.name[language] || item.name.en}</p>
                                                <p className="text-xs text-gray-400">{t('qty_label')} {item.quantity}</p>
                                            </div>
                                            <p className="font-bold text-sm text-gray-900" dir="ltr">AED {(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3 pt-6 border-t border-gray-50">
                                    <div className={`flex justify-between text-sm text-gray-500 font-inter ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                        <span>{t('subtotal')}</span>
                                        <span className="font-bold text-text-black" dir="ltr">AED {subTotal.toFixed(2)}</span>
                                    </div>

                                    {(summaryInfo.charges || []).map((charge, idx) => {
                                        let amount = 0;
                                        const value = Number(charge.value) || 0;
                                        if (charge.type === 'percentage') {
                                            amount = (subTotal * value) / 100;
                                        } else {
                                            amount = value;
                                        }
                                        return (
                                            <div key={idx} className={`flex justify-between text-sm text-gray-500 font-inter ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                                <span>{charge.name}</span>
                                                <span className="font-bold text-text-black" dir="ltr">AED {amount.toFixed(2)}</span>
                                            </div>
                                        );
                                    })}

                                    <div className={`flex justify-between text-sm text-gray-500 font-inter ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                        <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            {t('delivery_charge')}
                                            {Number(formData.distance) > 0 && (
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full font-bold" dir="ltr">
                                                    {formData.distance} km
                                                </span>
                                            )}
                                        </span>
                                        <span className="font-bold text-text-black" dir="ltr">AED {(Number(formData.deliveryCharge) || 0).toFixed(2)}</span>
                                    </div>

                                    <div className={`flex justify-between text-xl text-primary pt-6 border-t border-gray-100 mt-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                        <span className="font-bold font-chillax text-gray-900">{t('total')}</span>
                                        <span className="font-bold font-chillax" dir="ltr">
                                            AED {(
                                                subTotal +
                                                (Number(formData.deliveryCharge) || 0) +
                                                (summaryInfo.charges || []).reduce((acc, c) => {
                                                    const val = Number(c.value) || 0;
                                                    return acc + (c.type === 'percentage' ? (subTotal * val) / 100 : val);
                                                }, 0)
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {formData.paymentMethod === 'COD' && (
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className={`w-full mt-8 py-5 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                                    >
                                        {loading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-check-circle"></i> {t('place_order')}</>}
                                    </button>
                                )}

                                {error && (
                                    <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2">
                                        <i className="fas fa-exclamation-circle"></i>
                                        {error}
                                    </div>
                                )}
                            </div>

                            <div className="bg-primary/5 p-6 rounded-[24px] border border-primary/10">
                                <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <i className="fas fa-shield-halved"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{t('secure_checkout')}</p>
                                        <p className="text-xs text-gray-500 font-inter">{t('secure_data_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <MapModal
                isOpen={showMap}
                onClose={() => setShowMap(false)}
                onSelectLocation={handleLocationSelect}
                initialCenter={formData.latitude ? { lat: formData.latitude, lng: formData.longitude } : undefined}
                allowedEmirates={summaryInfo.allowedEmirates}
            />
        </Layout >
    );
};

export default Checkout;
