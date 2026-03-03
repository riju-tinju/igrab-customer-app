import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { useLanguage } from '../../contexts/LanguageContext';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HeroSlider: React.FC = () => {
    const { t, isRTL, language } = useLanguage();

    const slides = [
        {
            title: t('hero_slide1_title'),
            subtitle: t('hero_slide1_subtitle'),
            buttonText: t('hero_slide1_btn'),
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
            type: 'image' // Changed to image to ensure background loads correctly
        },
        {
            title: t('hero_slide2_title'),
            subtitle: t('hero_slide2_subtitle'),
            buttonText: t('hero_slide2_btn'),
            image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1200&q=80',
            type: 'image'
        },
        {
            title: t('hero_slide3_title'),
            subtitle: t('hero_slide3_subtitle'),
            buttonText: t('hero_slide3_btn'),
            image: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?auto=format&fit=crop&w=1200&q=80',
            type: 'image'
        }
    ];

    return (
        <section className="hero-slider rounded-[24px] overflow-hidden mb-8 lg:mb-12 shadow-sm">
            <Swiper
                key={language}
                dir={isRTL ? "rtl" : "ltr"}
                modules={[Autoplay, Pagination, EffectFade]}
                pagination={{
                    clickable: true,
                    dynamicBullets: false
                }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop={true}
                className="w-full h-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="slide-inner"
                            style={{
                                backgroundImage: slide.type === 'image' ? `url(${slide.image})` : 'none',
                                backgroundColor: slide.type === 'green' ? 'var(--primary-green)' : '#000',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            <div className="slide-content animate-fade-in">
                                <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">{slide.title}</h1>
                                <p className="mb-8 text-sm lg:text-lg font-inter font-light max-w-2xl opacity-90 leading-relaxed">
                                    {slide.subtitle}
                                </p>
                                <button className="btn-secondary px-10 py-3 text-base inline-flex items-center justify-center transition-all">
                                    {slide.buttonText}
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default HeroSlider;
