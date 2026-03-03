import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import Layout from '../components/common/Layout';
import { useLanguage } from '../contexts/LanguageContext';

const TermsConditions: React.FC = () => {
    const { t, isRTL } = useLanguage();

    return (
        <IonPage>
            <Layout>
                <div className={`bg-muted min-h-screen pb-20 px-4 lg:px-8 pt-24 lg:pt-28 ${isRTL ? 'rtl' : 'ltr'}`}>
                    <div className={`max-w-4xl mx-auto bg-white rounded-[2rem] p-8 lg:p-12 shadow-sm border border-gray-50 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                            {t('legal_doc')}
                        </span>
                        <h1 className="text-3xl lg:text-4xl font-bold mb-4 font-chillax text-text-black">{t('terms_title')}</h1>
                        <p className="text-gray-400 font-inter text-sm mb-10">{t('last_updated')}</p>

                        <div className="prose prose-sm max-w-none text-gray-600 font-inter space-y-8">
                            <section>
                                <p className="text-base leading-relaxed">
                                    {t('terms_welcome')}
                                </p>
                            </section>

                            <section>
                                <h2 className={`text-xl font-bold text-text-black font-chillax mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary text-sm flex-shrink-0">1</span>
                                    {t('eligibility_title')}
                                </h2>
                                <p className="mb-4">{t('eligibility_desc')}</p>
                            </section>

                            <section>
                                <h2 className={`text-xl font-bold text-text-black font-chillax mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary text-sm flex-shrink-0">2</span>
                                    {t('orders_payments_title')}
                                </h2>
                                <p className="mb-4">{t('orders_payments_desc')}</p>
                                <ul className="space-y-3 list-none pl-0 pr-0">
                                    <li className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <i className={`fas fa-check text-xs text-accent-gold mt-1.5 ${isRTL ? 'transform rotate-y-180' : ''}`}></i>
                                        <span><strong>{t('payments_point_label')}</strong> {t('payments_point_val')}</span>
                                    </li>
                                    <li className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <i className={`fas fa-check text-xs text-accent-gold mt-1.5 ${isRTL ? 'transform rotate-y-180' : ''}`}></i>
                                        <span><strong>{t('cancellations_point_label')}</strong> {t('cancellations_point_val')}</span>
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className={`text-xl font-bold text-text-black font-chillax mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary text-sm flex-shrink-0">3</span>
                                    {t('delivery_terms_title')}
                                </h2>
                                <p className="mb-4">{t('delivery_terms_desc')}</p>
                                <ul className="space-y-3 list-none pl-0 pr-0">
                                    <li className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <i className={`fas fa-check text-xs text-accent-gold mt-1.5 ${isRTL ? 'transform rotate-y-180' : ''}`}></i>
                                        <span>{t('delivery_point1')}</span>
                                    </li>
                                    <li className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <i className={`fas fa-check text-xs text-accent-gold mt-1.5 ${isRTL ? 'transform rotate-y-180' : ''}`}></i>
                                        <span>{t('delivery_point2')}</span>
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className={`text-xl font-bold text-text-black font-chillax mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary text-sm flex-shrink-0">4</span>
                                    {t('refund_policy_title')}
                                </h2>
                                <p className="mb-4">{t('refund_policy_desc')}</p>
                                <ul className="space-y-3 list-none pl-0 pr-0">
                                    <li className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <i className={`fas fa-check text-xs text-accent-gold mt-1.5 ${isRTL ? 'transform rotate-y-180' : ''}`}></i>
                                        <span>{t('refund_point1')}</span>
                                    </li>
                                    <li className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <i className={`fas fa-check text-xs text-accent-gold mt-1.5 ${isRTL ? 'transform rotate-y-180' : ''}`}></i>
                                        <span>{t('refund_point2')}</span>
                                    </li>
                                </ul>
                                <p className="mt-4 text-sm italic">{t('report_issue_note')}</p>
                            </section>

                            <section>
                                <h2 className={`text-xl font-bold text-text-black font-chillax mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary text-sm flex-shrink-0">5</span>
                                    {t('intellectual_property_title')}
                                </h2>
                                <p>{t('intellectual_property_desc')}</p>
                            </section>

                            <section>
                                <h2 className={`text-xl font-bold text-text-black font-chillax mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary text-sm flex-shrink-0">6</span>
                                    {t('governing_law_title')}
                                </h2>
                                <p>{t('governing_law_desc')}</p>
                            </section>

                            <section className="bg-primary/5 p-8 rounded-2xl border border-primary/10 mt-12 text-center">
                                <h2 className="text-xl font-bold text-text-black font-chillax mb-4 text-primary">{t('need_help_title')}</h2>
                                <p className="text-sm mb-6">{t('need_help_desc')}</p>
                                <div className={`flex flex-wrap justify-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <a href="mailto:hello@igrabstory.com" className="text-primary font-bold hover:underline">hello@igrabstory.com</a>
                                    <span className="text-gray-300">|</span>
                                    <a href="tel:+971543915551" className="text-primary font-bold hover:underline" dir="ltr">+971 54 391 5551</a>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </Layout>
        </IonPage>
    );
};

export default TermsConditions;
