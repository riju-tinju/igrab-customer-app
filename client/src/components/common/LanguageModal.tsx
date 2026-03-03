import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../contexts/LanguageContext';

interface LanguageModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
    const { language, setLanguage, t, isRTL } = useLanguage();
    const [tempLanguage, setTempLanguage] = useState<'en' | 'ar'>(language);

    useEffect(() => {
        if (isOpen) {
            setTempLanguage(language);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen, language]);

    const handleApply = () => {
        setLanguage(tempLanguage);
        onClose();
    };

    if (!isOpen) return null;

    const languages = [
        { id: 'en', label: 'English', subLabel: 'LTR Layout', icon: '🇺🇸', font: 'font-inter' },
        { id: 'ar', label: 'العربية', subLabel: 'تخطيط RTL', icon: '🇦🇪', font: 'font-inter' }
    ];

    return createPortal(
        <>
            <div
                className="fixed inset-0 bg-black/60 z-[3000] transition-opacity duration-300 flex items-end justify-center md:items-center p-0 md:p-4"
                onClick={onClose}
            >
                <div
                    className="bg-white w-full rounded-t-[32px] md:rounded-[32px] md:max-w-[450px] p-8 animate-slide-up-modal md:animate-scale-in shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    <div className={`flex justify-between items-center pb-6 border-b border-gray-100 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                            <h2 className="text-2xl font-bold font-chillax text-text-black">{t('select_language')}</h2>
                            <p className="text-xs text-gray-400 font-inter mt-1">Choose your preferred experience</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {languages.map((lang) => (
                            <div
                                key={lang.id}
                                onClick={() => setTempLanguage(lang.id as 'en' | 'ar')}
                                className={`flex items-center p-5 rounded-[24px] cursor-pointer transition-all border-2 ${isRTL ? 'flex-row-reverse' : ''} ${tempLanguage === lang.id
                                    ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                                    : 'border-transparent bg-muted hover:border-gray-100 hover:bg-gray-100/50'
                                    }`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${isRTL ? 'ml-4' : 'mr-4'} ${tempLanguage === lang.id ? 'bg-primary text-white' : 'bg-white text-gray-400'
                                    }`}>
                                    <span className="text-2xl">{lang.icon}</span>
                                </div>
                                <div className={`flex-grow min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <h3 className={`font-bold text-text-black text-lg ${lang.font}`}>{lang.label}</h3>
                                    <p className="text-xs text-gray-500 font-inter mt-0.5">{lang.subLabel}</p>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isRTL ? 'mr-2' : 'ml-2'} ${tempLanguage === lang.id ? 'border-primary bg-primary' : 'border-gray-300'
                                    }`}>
                                    {tempLanguage === lang.id && <i className="fas fa-check text-[10px] text-white"></i>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleApply}
                        className="w-full mt-8 py-5 bg-primary text-white rounded-[24px] font-bold font-dmsans text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all"
                    >
                        {t('apply')}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slide-up-modal {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-slide-up-modal {
                    animation: slide-up-modal 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .animate-scale-in {
                    animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </>,
        document.body
    );
};

export default LanguageModal;
