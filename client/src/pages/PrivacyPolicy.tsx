import React from 'react';
import { } from '@ionic/react';
import Layout from '../components/common/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import SEO from '../components/SEO';

const PrivacyPolicy: React.FC = () => {
    const { t, isRTL } = useLanguage();

    return (
        <Layout>
            <SEO
                title={t('privacy_title')}
                description="Our privacy policy explains how we collect, use, and protect your personal information when you use iGrab."
            />
            <div className={`bg-muted min-h-screen pb-20 px-4 lg:px-8 pt-24 lg:pt-28 ${isRTL ? 'rtl' : 'ltr'}`}>
                <div className={`max-w-4xl mx-auto bg-white rounded-[2rem] p-8 lg:p-12 shadow-sm border border-gray-50 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                        {t('legal_doc')}
                    </span>
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4 font-chillax text-text-black">{t('privacy_title')}</h1>
                    <p className="text-gray-400 font-inter text-sm mb-10">{t('last_updated')}</p>

                    <div className="prose prose-sm max-w-none text-gray-600 font-inter space-y-8">
                        <section>
                            <p className="text-base leading-relaxed">
                                {t('privacy_welcome')}
                            </p>
                        </section>

                        <section>
                            <h2 className={`text-xl font-bold text-text-black font-chillax mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary text-sm flex-shrink-0">1</span>
                                {t('info_collect_title')}
                            </h2>
                            <p className="mb-4">{t('info_collect_desc')}</p>
                            <ul className="space-y-3 list-none pl-0 pr-0">
                                <li className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <i className={`fas fa-check text-xs text-accent-gold mt-1.5 ${isRTL ? 'transform rotate-y-180' : ''}`}></i>
                                    <span><strong>{t('personal_data_label')}</strong> {t('personal_data_val')}</span>
                                </li>
                                <li className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <i className={`fas fa-check text-xs text-accent-gold mt-1.5 ${isRTL ? 'transform rotate-y-180' : ''}`}></i>
                                    <span><strong>{t('delivery_info_label')}</strong> {t('delivery_info_val')}</span>
                                </li>
                                <li className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <i className={`fas fa-check text-xs text-accent-gold mt-1.5 ${isRTL ? 'transform rotate-y-180' : ''}`}></i>
                                    <span><strong>{t('transaction_data_label')}</strong> {t('transaction_data_val')}</span>
                                </li>
                                <li className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <i className={`fas fa-check text-xs text-accent-gold mt-1.5 ${isRTL ? 'transform rotate-y-180' : ''}`}></i>
                                    <span><strong>{t('device_info_label')}</strong> {t('device_info_val')}</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className={`text-xl font-bold text-text-black font-chillax mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary text-sm flex-shrink-0">2</span>
                                {t('how_we_use_title')}
                            </h2>
                            <p className="mb-4">{t('how_we_use_desc')}</p>
                            <ul className="space-y-3 list-none pl-0 pr-0">
                                <li className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <i className={`fas fa-check text-xs text-accent-gold mt-1.5 ${isRTL ? 'transform rotate-y-180' : ''}`}></i>
                                    <span>{t('how_we_use_point1')}</span>
                                </li>
                                <li className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <i className={`fas fa-check text-xs text-accent-gold mt-1.5 ${isRTL ? 'transform rotate-y-180' : ''}`}></i>
                                    <span>{t('how_we_use_point2')}</span>
                                </li>
                                <li className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <i className={`fas fa-check text-xs text-accent-gold mt-1.5 ${isRTL ? 'transform rotate-y-180' : ''}`}></i>
                                    <span>{t('how_we_use_point3')}</span>
                                </li>
                                <li className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <i className={`fas fa-check text-xs text-accent-gold mt-1.5 ${isRTL ? 'transform rotate-y-180' : ''}`}></i>
                                    <span>{t('how_we_use_point4')}</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className={`text-xl font-bold text-text-black font-chillax mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary text-sm flex-shrink-0">3</span>
                                {t('data_sharing_title')}
                            </h2>
                            <p className="mb-4">{t('data_sharing_desc')}</p>
                            <ul className="space-y-3 list-none pl-0 pr-0">
                                <li className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <i className={`fas fa-check text-xs text-accent-gold mt-1.5 ${isRTL ? 'transform rotate-y-180' : ''}`}></i>
                                    <span><strong>{t('payment_processors_label')}</strong> {t('payment_processors_val')}</span>
                                </li>
                                <li className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <i className={`fas fa-check text-xs text-accent-gold mt-1.5 ${isRTL ? 'transform rotate-y-180' : ''}`}></i>
                                    <span><strong>{t('delivery_partners_label')}</strong> {t('delivery_partners_val')}</span>
                                </li>
                            </ul>
                            <p className="mt-4">{t('security_note')}</p>
                        </section>

                        <section>
                            <h2 className={`text-xl font-bold text-text-black font-chillax mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary text-sm flex-shrink-0">4</span>
                                {t('rights_title')}
                            </h2>
                            <p className="mb-4">{t('rights_desc')}</p>
                            <ul className="space-y-3 list-none pl-0 pr-0">
                                <li className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <i className={`fas fa-check text-xs text-accent-gold mt-1.5 ${isRTL ? 'transform rotate-y-180' : ''}`}></i>
                                    <span>{t('rights_point1')}</span>
                                </li>
                                <li className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <i className={`fas fa-check text-xs text-accent-gold mt-1.5 ${isRTL ? 'transform rotate-y-180' : ''}`}></i>
                                    <span>{t('rights_point2')}</span>
                                </li>
                            </ul>
                        </section>

                        <section className="bg-muted p-8 rounded-2xl border border-gray-100 mt-12">
                            <h2 className="text-xl font-bold text-text-black font-chillax mb-4">{t('contact_us')}</h2>
                            <div className="space-y-4 text-sm">
                                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                                        <i className="fas fa-envelope"></i>
                                    </div>
                                    <a href="mailto:hello@igrabstory.com" className="hover:text-primary transition-colors font-medium">hello@igrabstory.com</a>
                                </div>
                                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                                        <i className="fas fa-phone"></i>
                                    </div>
                                    <a href="tel:+971543915551" className="hover:text-primary transition-colors font-medium" dir="ltr">+971 54 391 5551</a>
                                </div>
                                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                                        <i className="fas fa-map-marker-alt"></i>
                                    </div>
                                    <span className="font-medium">{t('legal_address_val')}</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PrivacyPolicy;
