import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const FactsSection: React.FC = () => {
    const { t, isRTL } = useLanguage();

    const facts = [
        t('fact1'),
        t('fact2'),
        t('fact3'),
        t('fact4'),
        t('fact5'),
        t('fact6'),
        t('fact7'),
        t('fact8'),
        t('fact9'),
        t('fact10')
    ];

    return (
        <section className="mb-12 bg-accent rounded-3xl overflow-hidden shadow-sm">
            <div className={`flex flex-col lg:flex-row ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
                <div className={`p-8 lg:p-12 lg:w-1/2 flex flex-col justify-center ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-primary">{t('facts_title')}</h2>
                    <ul className="mb-10 space-y-4">
                        {facts.map((fact, index) => (
                            <li key={index} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <i className="fas fa-check-circle text-primary text-lg mt-1"></i>
                                <span className={`font-inter text-text-black text-sm lg:text-base leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>{fact}</span>
                            </li>
                        ))}
                    </ul>
                    <button className="btn-primary self-start px-10 py-4 rounded-xl text-lg font-bold shadow-lg active:scale-95 transition-transform">
                        {t('see_our_items')}
                    </button>
                </div>
                <div className="lg:w-1/2 h-80 lg:h-auto">
                    <img
                        src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
                        alt="Facts Image"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </section>
    );
};

export default FactsSection;
