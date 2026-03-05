import React, { useState } from 'react';
import { IonContent, IonPage, IonToast } from '@ionic/react';
import api from '../services/api';
import Layout from '../components/common/Layout';
import { useBranch } from '../contexts/BranchContext';
import { useLanguage } from '../contexts/LanguageContext';

const Contact: React.FC = () => {
    const { selectedBranch } = useBranch();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'general',
        message: ''
    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { t, isRTL, language } = useLanguage();

    const inquiryOptions = [
        { id: 'general', label: t('general_inquiry'), icon: '💬' },
        { id: 'order', label: t('order_issue'), icon: '🛒' },
        { id: 'business', label: t('business_inquiry'), icon: '🤝' },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleInquiryChange = (id: string) => {
        setFormData(prev => ({ ...prev, inquiryType: id }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/api/contact/submit', {
                ...formData,
                inquiryType: formData.inquiryType, // Use aligned field name
                storeBranch: selectedBranch?._id // Use aligned field name
            });

            if (response.data.success) {
                setToastMessage(t('contact_success'));
                setShowToast(true);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    inquiryType: 'general',
                    message: ''
                });
            }
        } catch (error) {
            setToastMessage(t('contact_error'));
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    const copyAddress = () => {
        const address = t('store_address_val');
        navigator.clipboard.writeText(address).then(() => {
            setToastMessage(t('address_copied'));
            setShowToast(true);
        });
    };

    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterLoading, setNewsletterLoading] = useState(false);

    const handleNewsletterSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail) return;

        setNewsletterLoading(true);
        try {
            const response = await api.post('/api/newsletter/subscribe', { email: newsletterEmail });
            setToastMessage(language === 'ar' ? (response.data.userMessage ? t('newsletter_success') : t('newsletter_success')) : (response.data.userMessage || t('newsletter_success')));
            setShowToast(true);
            setNewsletterEmail('');
        } catch (error: any) {
            setToastMessage(language === 'ar' ? t('newsletter_error') : (error.response?.data?.userMessage || t('newsletter_error')));
            setShowToast(true);
        } finally {
            setNewsletterLoading(false);
        }
    };

    return (
        <IonPage>
            <Layout>
                <div className="bg-muted min-h-screen pb-20 lg:pb-10 px-4 lg:px-8 pt-24 lg:pt-28">
                    {/* Page Title */}
                    <div className={`max-w-7xl mx-auto mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <h1 className="text-3xl lg:text-4xl font-bold mb-2 font-chillax text-text-black">{t('contact_page_title')}</h1>
                        <p className="text-gray-600 font-inter">{t('contact_subtitle')}</p>
                    </div>

                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                        {/* Left side - Contact Info */}
                        <div className="space-y-6">
                            {/* Store Information Card */}
                            <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-50 transition-all hover:shadow-md ${isRTL ? 'text-right' : 'text-left'}`}>
                                <h3 className="text-xl font-bold mb-6 text-primary font-chillax">{t('visit_store')}</h3>

                                <div className="space-y-6">
                                    <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
                                            <i className="fas fa-map-marker-alt text-lg"></i>
                                        </div>
                                        <div>
                                            <p className="font-bold text-text-black mb-1 font-inter">{t('store_address_label')}</p>
                                            <p className="text-gray-600 text-sm font-inter" id="store-address">
                                                {t('store_address_val')}
                                            </p>
                                            <button
                                                onClick={copyAddress}
                                                className={`mt-3 text-xs text-accent-gold font-bold flex items-center gap-1.5 hover:opacity-80 transition-opacity uppercase tracking-wider ${isRTL ? 'flex-row-reverse' : ''}`}
                                            >
                                                <i className="fas fa-copy"></i> {t('copy_address')}
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
                                            <i className="fas fa-clock text-lg"></i>
                                        </div>
                                        <div>
                                            <p className="font-bold text-text-black mb-1 font-inter">{t('opening_hours')}</p>
                                            <div className="text-sm text-gray-600 space-y-1 font-inter">
                                                <p>{t('opening_hours_val')}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
                                            <i className="fas fa-phone-alt text-lg"></i>
                                        </div>
                                        <div>
                                            <p className="font-bold text-text-black mb-1 font-inter">{t('your_phone_label')}</p>
                                            <p className="text-gray-600 text-sm font-inter" dir="ltr">
                                                <a href="tel:+971543915551" className="hover:text-accent-gold transition-colors">+971 54 391 5551</a>
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-inter uppercase tracking-wide mt-1">{t('for_orders_inquiries')}</p>
                                        </div>
                                    </div>

                                    <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
                                            <i className="fas fa-envelope text-lg"></i>
                                        </div>
                                        <div>
                                            <p className="font-bold text-text-black mb-1 font-inter">{t('your_email_label')}</p>
                                            <p className="text-gray-600 text-sm font-inter">
                                                <a href="mailto:hello@igrabstory.com" className="hover:text-accent-gold transition-colors">hello@igrabstory.com</a>
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-inter uppercase tracking-wide mt-1">{t('respond_24h')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media Card */}
                            <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-50 ${isRTL ? 'text-right' : 'text-left'}`}>
                                <h3 className="text-xl font-bold mb-4 text-primary font-chillax">{t('connect_us')}</h3>
                                <div className={`flex flex-wrap gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <a
                                        href="https://www.instagram.com/igrabstory/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white transition-all hover:scale-110 hover:bg-accent-gold shadow-sm"
                                    >
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                    <a
                                        href="https://wa.me/971543915551"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white transition-all hover:scale-110 hover:bg-accent-gold shadow-sm"
                                    >
                                        <i className="fab fa-whatsapp"></i>
                                    </a>
                                </div>
                                <p className="text-xs text-gray-500 mt-4 font-inter">{t('social_desc')}</p>
                            </div>

                            {/* Map (Mobile Only) */}
                            <div className="lg:hidden mt-6">
                                <h3 className={`text-xl font-bold mb-4 text-primary font-chillax ${isRTL ? 'text-right' : 'text-left'}`}>{t('find_us')}</h3>
                                <div className="h-[250px] rounded-2xl overflow-hidden shadow-sm border border-white">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.979214719178!2d55.46998539999999!3d25.3049024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5f6cbaa7b041%3A0xe482c641ba18ec78!2siGrab%20Story%20Cafe%20Sharjah!5e0!3m2!1sen!2sin!4v1772119734355!5m2!1sen!2sin"
                                        width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy"
                                    ></iframe>
                                </div>
                            </div>
                        </div>

                        {/* Right side - Contact Form */}
                        <div>
                            <div className={`bg-white p-8 rounded-2xl shadow-sm border border-gray-50 sticky top-28 ${isRTL ? 'text-right' : 'text-left'}`}>
                                <h3 className="text-xl font-bold mb-6 text-primary font-chillax">{t('send_message_title')}</h3>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-bold text-text-black mb-2 font-inter">{t('your_name_label')}</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-accent-gold focus:bg-white transition-all font-inter text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                                            placeholder={t('name_placeholder')}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-bold text-text-black mb-2 font-inter">{t('your_email_label')}</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-accent-gold focus:bg-white transition-all font-inter text-sm ${isRTL ? 'text-right text-left' : 'text-left'}`}
                                            placeholder={t('newsletter_placeholder')}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-bold text-text-black mb-2 font-inter">{t('your_phone_label')}</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-accent-gold focus:bg-white transition-all font-inter text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                                            placeholder={t('phone_placeholder')}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-text-black mb-3 font-inter">{t('inquiry_type')}</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {inquiryOptions.map((option) => (
                                                <div
                                                    key={option.id}
                                                    onClick={() => handleInquiryChange(option.id)}
                                                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${isRTL ? 'flex-row-reverse' : ''} ${formData.inquiryType === option.id
                                                        ? 'border-primary bg-primary/5 shadow-sm'
                                                        : 'border-gray-100 hover:border-accent-gold bg-white'
                                                        }`}
                                                >
                                                    <span className="text-xl">{option.icon}</span>
                                                    <span className={`text-xs font-bold font-inter ${formData.inquiryType === option.id ? 'text-primary' : 'text-gray-600'
                                                        }`}>
                                                        {option.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-bold text-text-black mb-2 font-inter">{t('message_label')}</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-accent-gold focus:bg-white transition-all font-inter text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                                            placeholder={t('message_placeholder')}
                                            required
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-primary text-white py-4 rounded-xl font-bold font-dmsans text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-opacity-95 active:scale-[0.98] transition-all disabled:opacity-50"
                                    >
                                        {loading ? t('sending') : t('send_message_btn')}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Map Section (Desktop Only) */}
                    <div className="max-w-7xl mx-auto mb-16 hidden lg:block">
                        <h3 className={`text-2xl font-bold mb-6 text-primary font-chillax ${isRTL ? 'text-right' : 'text-left'}`}>{t('find_us')}</h3>
                        <div className="h-[400px] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.979214719178!2d55.46998539999999!3d25.3049024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5f6cbaa7b041%3A0xe482c641ba18ec78!2siGrab%20Story%20Cafe%20Sharjah!5e0!3m2!1sen!2sin!4v1772119734355!5m2!1sen!2sin"
                                width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy"
                            ></iframe>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-primary rounded-3xl p-8 lg:p-12 text-white text-center relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

                            <h2 className="text-2xl lg:text-3xl font-bold mb-4 font-chillax relative z-10">{t('stay_connected')}</h2>
                            <p className="mb-8 max-w-lg mx-auto text-white/70 font-inter relative z-10">{t('newsletter_desc')}</p>
                            <form onSubmit={handleNewsletterSubscribe} className={`flex flex-col md:flex-row max-w-md mx-auto gap-2 relative z-10 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                                <input
                                    type="email"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder={t('newsletter_placeholder')}
                                    className={`flex-grow px-6 py-4 rounded-xl focus:outline-none text-black font-inter text-sm shadow-inner bg-white ${isRTL ? 'text-right' : 'text-left'}`}
                                    required
                                    disabled={newsletterLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={newsletterLoading}
                                    className="bg-accent-gold text-white px-8 py-4 rounded-xl font-bold font-dmsans text-sm uppercase tracking-widest hover:bg-opacity-90 active:scale-95 transition-all shadow-lg shadow-black/10 disabled:opacity-50"
                                >
                                    {newsletterLoading ? t('subscribing') : t('subscribe_btn')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={3000}
                    position="bottom"
                    className="custom-toast"
                />
            </Layout>
        </IonPage >
    );
};

export default Contact;
