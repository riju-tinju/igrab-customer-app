import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const HowItWorks: React.FC = () => {
    const { t } = useLanguage();

    const steps = [
        {
            icon: 'fas fa-search',
            title: t('step1_title'),
            desc: t('step1_desc')
        },
        {
            icon: 'fas fa-shopping-bag',
            title: t('step2_title'),
            desc: t('step2_desc')
        },
        {
            icon: 'fas fa-credit-card',
            title: t('step3_title'),
            desc: t('step3_desc')
        },
        {
            icon: 'fas fa-mug-hot',
            title: t('step4_title'),
            desc: t('step4_desc')
        }
    ];

    return (
        <section className="mb-16 mt-8">
            <h2 className="text-2xl lg:text-3xl font-bold mb-10 text-center text-primary">{t('how_it_works_title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((step, index) => (
                    <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-50 flex flex-col items-center">
                        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl mb-6 shadow-md">
                            <i className={step.icon}></i>
                        </div>
                        <h3 className="text-xl lg:text-2xl font-bold mb-3 text-text-black">{step.title}</h3>
                        <p className="font-inter text-gray-500 text-[15px] leading-relaxed max-w-[250px]">{step.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
