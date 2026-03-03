import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { useLanguage } from '../contexts/LanguageContext';

const NotFound: React.FC = () => {
    const history = useHistory();
    const { t, isRTL } = useLanguage();

    return (
        <IonPage>
            <Layout showFooter={false}>
                <div className={`bg-white min-h-full flex items-center justify-center px-6 py-24 sm:py-32 lg:px-8 relative overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
                    <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl -z-10"></div>

                    <div className={`text-center max-w-2xl mx-auto relative z-10 animate-fade-in-up ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className="mb-8 relative inline-block">
                            <span className="text-[120px] lg:text-[180px] font-bold leading-none select-none text-primary/10 font-chillax tracking-tighter">
                                404
                            </span>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className={`w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center transform ${isRTL ? '-rotate-12 hover:rotate-0' : 'rotate-12 hover:rotate-0'} transition-transform duration-500 border border-gray-50`}>
                                    <i className="fas fa-coffee text-primary text-4xl lg:text-5xl"></i>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-text-black sm:text-5xl font-chillax mb-6">
                            {t('404_title')}
                        </h1>

                        <p className="text-lg leading-7 text-gray-400 font-inter mb-12 max-w-md mx-auto">
                            {t('404_desc')}
                        </p>

                        <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                            <button
                                onClick={() => history.push('/home')}
                                className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
                            >
                                {t('back_to_home')}
                            </button>
                            <button
                                onClick={() => history.push('/shop')}
                                className="w-full sm:w-auto px-10 py-4 bg-transparent text-primary hover:bg-primary/5 border border-primary/20 rounded-2xl font-bold transition-all text-sm uppercase tracking-widest"
                            >
                                {t('browse_menu')}
                            </button>
                        </div>

                        <div className="mt-20 pt-10 border-t border-gray-100/50">
                            <p className="text-xs text-gray-300 font-inter uppercase tracking-[0.3em] font-medium text-center">
                                iGrab Story Cafe • Sharjah, UAE
                            </p>
                        </div>
                    </div>
                </div>
            </Layout>
        </IonPage>
    );
};

export default NotFound;
