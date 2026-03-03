import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import axios from 'axios';
import Layout from '../components/common/Layout';
import { useLanguage } from '../contexts/LanguageContext';

interface Brand {
    _id: string;
    name: {
        en: string;
        ar: string;
    };
    logo: string;
    tagline?: {
        en: string;
        ar: string;
    };
}

const CompanyProfile: React.FC = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const { t, isRTL, language } = useLanguage();

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await axios.get('/api/brands');
                setBrands(response.data);
            } catch (error) {
                console.error('Error fetching brands:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    return (
        <IonPage>
            <Layout>
                <div className="bg-muted min-h-screen pb-20">
                    {/* Hero Banner Section */}
                    <section className="relative h-64 lg:h-96 overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 transform hover:scale-105"
                            style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1601759226705-cf16b1553f6c?w=1600&auto=format&fit=crop&q=80')` }}
                        ></div>
                        <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
                            <div className="animate-fade-in-up">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-accent-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-white/10">
                                    {t('profile_established')}
                                </span>
                                <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-white font-chillax">{t('profile_hero_title')}</h1>
                                <p className="text-white/80 text-lg lg:text-xl font-inter max-w-2xl mx-auto">
                                    {t('profile_hero_desc')}
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="max-w-7xl mx-auto px-4 lg:px-12 -mt-10 relative z-20">
                        {/* Who We Are & Our Story */}
                        <section className="bg-white rounded-[2.5rem] p-8 lg:p-16 shadow-2xl shadow-primary/5 mb-16 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>

                            <div className="flex flex-col lg:flex-row gap-16 relative z-10">
                                <div className={`lg:w-1/2 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <span className="text-accent-gold font-bold uppercase tracking-widest text-[10px] mb-4 block">{t('profile_identity')}</span>
                                    <h2 className="text-3xl lg:text-4xl font-bold mb-8 font-chillax text-text-black">
                                        {language === 'ar' ? (
                                            <>من <span className="text-primary italic">نحن؟</span></>
                                        ) : (
                                            <>Who We <span className="text-primary italic">Are?</span></>
                                        )}
                                    </h2>
                                    <p className="mb-8 text-gray-600 leading-relaxed font-inter text-lg">
                                        {t('who_we_are_p1')}
                                    </p>

                                    <div className={`space-y-8 ${isRTL ? 'border-r-4 border-l-0 pr-6 pl-0' : 'border-l-4 pr-0 pl-6'} border-accent-gold`}>
                                        <h3 className="text-xl font-bold mb-4 text-primary font-chillax">{t('profile_our_story')}</h3>
                                        <p className="text-gray-600 leading-relaxed font-inter mb-4">
                                            {t('our_story_p1')}
                                        </p>
                                        <p className="text-gray-600 leading-relaxed font-inter">
                                            {t('our_story_p2')}
                                        </p>
                                    </div>
                                </div>

                                <div className="lg:w-1/2 flex flex-col gap-8">
                                    <div className={`bg-muted rounded-3xl p-8 lg:p-10 border border-gray-100 h-full flex flex-col justify-center ${isRTL ? 'text-right' : 'text-left'}`}>
                                        <div className="mb-8">
                                            <h3 className={`text-xl font-bold mb-4 text-primary font-chillax flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                <i className="fas fa-bullseye text-accent-gold"></i> {t('profile_mission')}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed font-inter">
                                                {t('mission_desc')}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-bold mb-4 text-primary font-chillax flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                <i className="fas fa-eye text-accent-gold"></i> {t('profile_vision')}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed font-inter">
                                                {t('vision_desc')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="rounded-3xl overflow-hidden shadow-xl aspect-video group">
                                        <img
                                            src="https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=800&auto=format&fit=crop&q=80"
                                            alt="iGrab Story Cafe Atmosphere"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Our Values Section */}
                        <section className="mb-20">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-chillax text-text-black">
                                    {language === 'ar' ? (
                                        <>قيمنا <span className="text-accent-gold">الأساسية</span></>
                                    ) : (
                                        <>Our Core <span className="text-accent-gold">Values</span></>
                                    )}
                                </h2>
                                <p className="text-gray-500 max-w-2xl mx-auto font-inter">{t('profile_values_desc')}</p>
                            </div>

                            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${isRTL ? 'rtl' : 'ltr'}`}>
                                {[
                                    { title: t('value_perfection'), icon: 'fas fa-check-circle', desc: t('value_perfection_desc') },
                                    { title: t('value_joy'), icon: 'fas fa-heart', desc: t('value_joy_desc') },
                                    { title: t('value_growth'), icon: 'fas fa-chart-line', desc: t('value_growth_desc') },
                                    { title: t('value_experience'), icon: 'fas fa-star', desc: t('value_experience_desc') }
                                ].map((value, i) => (
                                    <div key={i} className={`bg-white rounded-3xl p-8 shadow-xl shadow-primary/5 border border-gray-50 transition-all hover:shadow-2xl hover:-translate-y-2 group ${isRTL ? 'text-right' : 'text-left'}`}>
                                        <div className={`w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-primary text-2xl mb-6 transition-colors group-hover:bg-primary group-hover:text-white ${isRTL ? 'mr-0 ml-auto' : 'ml-0 mr-auto'}`}>
                                            <i className={value.icon}></i>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-text-black font-chillax">{value.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed font-inter">{value.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Cultural Meaning Section */}
                        <section className="mb-20 bg-primary rounded-[2.5rem] p-8 lg:p-16 text-white relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-40 -mb-40"></div>
                            <div className={`relative z-10 flex flex-col lg:flex-row items-center gap-12 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
                                <div className={`lg:w-2/3 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <h3 className="text-2xl lg:text-3xl font-bold mb-6 font-chillax text-accent-gold">{t('profile_meaning_title')}</h3>
                                    <p className="mb-6 text-white/80 leading-relaxed font-inter text-lg">
                                        {t('profile_meaning_p1')}
                                    </p>
                                    <p className="text-white/80 leading-relaxed font-inter text-lg">
                                        {t('profile_meaning_p2')}
                                    </p>
                                </div>
                                <div className="lg:w-1/3 flex justify-center">
                                    <div className="w-48 h-48 rounded-full border-4 border-white/20 flex items-center justify-center backdrop-blur-sm p-8 text-center animate-pulse">
                                        <span className="font-chillax font-bold text-2xl text-accent-gold leading-tight">
                                            {language === 'ar' ? (
                                                <>فن<br />العطاء</>
                                            ) : (
                                                <>Art of<br />Giving</>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Brands Section */}
                        <section className="mb-10">
                            <div className={`flex flex-col md:flex-row justify-between items-end mb-10 gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                                <div className={`max-w-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-chillax text-text-black">
                                        {language === 'ar' ? (
                                            <>نحن <span className="text-primary italic">شركاء مع</span></>
                                        ) : (
                                            <>Brands We <span className="text-primary italic">Partner With</span></>
                                        )}
                                    </h2>
                                    <p className="text-gray-500 font-inter">{t('brands_subtitle')}</p>
                                </div>
                                <div className={`bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-primary font-bold">{brands.length}</span>
                                    <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">{t('active_partners')}</span>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <IonSpinner name="crescent" color="primary" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                    {brands.map((brand) => (
                                        <div
                                            key={brand._id}
                                            className="bg-white rounded-[2rem] p-6 shadow-xl shadow-primary/5 border border-gray-50 flex flex-col items-center justify-center aspect-square transition-all hover:shadow-2xl hover:scale-105 group"
                                        >
                                            <div className="w-full grow relative overflow-hidden rounded-2xl mb-2 flex items-center justify-center">
                                                {brand.logo ? (
                                                    <img
                                                        src={brand.logo.startsWith('http') ? brand.logo : `http://localhost:5000/${brand.logo}`}
                                                        alt={language === 'ar' ? brand.name.ar : brand.name.en}
                                                        className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                                                        onError={(e) => {
                                                            (e.target as any).src = 'https://via.placeholder.com/150?text=Brand';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold bg-muted rounded-2xl text-2xl">
                                                        {(language === 'ar' ? brand.name.ar : brand.name.en).charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                {language === 'ar' ? brand.name.ar : brand.name.en}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </Layout>
        </IonPage>
    );
};

export default CompanyProfile;
