import React, { useState } from 'react';
import axios from 'axios';
import { IonToast } from '@ionic/react';
import { useLanguage } from '../../contexts/LanguageContext';

const Newsletter: React.FC = () => {
    const { t, isRTL } = useLanguage();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            const response = await axios.post('/api/newsletter/subscribe', { email });
            setToastMessage(response.data.userMessage || 'Thank you for subscribing!');
            setShowToast(true);
            setEmail('');
        } catch (error: any) {
            setToastMessage(error.response?.data?.userMessage || 'Subscription failed. Please try again.');
            setShowToast(true);
        } finally {
            setLoading(true); // Small delay before allowing next attempt
            setTimeout(() => setLoading(false), 1000);
        }
    };

    return (
        <section className="mb-12 px-4">
            <div className="bg-primary rounded-[2rem] p-8 lg:p-16 text-white text-center relative overflow-hidden shadow-2xl shadow-primary/20">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-2xl"></div>
                <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-accent-gold/20 rounded-full blur-sm"></div>
                <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-accent-gold/10 rounded-full blur-md"></div>

                <div className="relative z-10">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-accent-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-white/5">
                        {t('newsletter_badge')}
                    </span>
                    <h2 className="text-3xl lg:text-5xl font-bold mb-6 font-chillax leading-tight">
                        {t('newsletter_title').split(' ').map((word, i) => i === 2 ? <span key={i} className="text-accent-gold">{word} </span> : word + ' ')}
                    </h2>
                    <p className="mb-10 max-w-xl mx-auto text-white/70 font-inter text-base lg:text-lg leading-relaxed">
                        {t('newsletter_desc')}
                    </p>

                    <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row max-w-md mx-auto gap-3">
                        <div className="relative flex-grow group">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('newsletter_placeholder')}
                                className={`w-full px-6 py-4 rounded-2xl focus:outline-none text-black font-inter text-sm shadow-inner bg-white/95 focus:bg-white transition-all border-2 border-transparent focus:border-accent-gold/30 ${isRTL ? 'text-right' : 'text-left'}`}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-accent-gold text-white px-10 py-4 rounded-2xl font-bold font-dmsans text-sm uppercase tracking-widest hover:bg-opacity-95 active:scale-95 transition-all shadow-xl shadow-black/20 disabled:opacity-50 flex-shrink-0"
                        >
                            {loading ? t('newsletter_sending') : t('newsletter_btn')}
                        </button>
                    </form>

                    <p className="mt-8 text-[10px] text-white/40 font-inter uppercase tracking-widest">
                        {t('newsletter_privacy')}
                    </p>
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
        </section>
    );
};

export default Newsletter;
