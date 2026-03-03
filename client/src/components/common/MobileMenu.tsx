import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenBranch: () => void;
    onOpenProfile: () => void;
    onOpenLanguage: () => void;
}

interface MenuItem {
    label: string;
    icon: string;
    path?: string;
    onClick?: () => void;
    color?: string;
}

interface MenuSection {
    title: string;
    items: MenuItem[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onOpenBranch, onOpenProfile, onOpenLanguage }) => {
    const history = useHistory();
    const { isAuthenticated, user, logout } = useAuth();
    const { t, isRTL } = useLanguage();

    const menuSections: MenuSection[] = [
        {
            title: t('quick_actions'),
            items: [
                {
                    label: t('select_language'),
                    icon: 'fas fa-globe',
                    onClick: () => {
                        onOpenLanguage();
                        onClose();
                    }
                },
                {
                    label: t('select_branch'),
                    icon: 'fas fa-store',
                    onClick: () => {
                        onOpenBranch();
                        onClose();
                    }
                },
            ]
        },
        {
            title: t('help_info'),
            items: [
                { label: t('see_profile'), icon: 'fas fa-home', path: '/company-profile' },
                { label: t('contact_us'), icon: 'fas fa-envelope', path: '/contact' },
            ]
        },
        {
            title: t('legal_extras'),
            items: [
                { label: t('privacy_policy'), icon: 'fas fa-shield-alt', path: '/privacy-policy' },
                { label: t('terms_service'), icon: 'fas fa-balance-scale', path: '/terms-and-conditions' },
            ]
        }
    ];

    const handleNavigate = (path: string) => {
        history.push(path);
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-[120] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={onClose}
            />

            {/* Menu Drawer */}
            <div className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-[300px] bg-white z-[130] shadow-2xl transition-transform duration-300 transform overflow-y-auto no-scrollbar ${isOpen ? 'translate-x-0' : isRTL ? '-translate-x-full' : 'translate-x-full'}`}>
                <div className={`flex justify-between items-center p-6 border-b border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <h2 className="text-xl font-chillax font-bold text-text-black">{t('menu')}</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-800 active:scale-90 transition-transform"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <div className="p-6">
                    {menuSections.map((section, idx) => (
                        <div key={idx} className="mb-8 last:mb-0">
                            <h3 className={`text-xs uppercase text-gray-400 font-bold tracking-widest mb-4 font-inter ${isRTL ? 'text-right' : ''}`}>
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.items.map((item, itemIdx) => (
                                    <li key={itemIdx}>
                                        <button
                                            onClick={() => item.path ? handleNavigate(item.path) : item.onClick?.()}
                                            className={`w-full flex items-center p-3 rounded-2xl hover:bg-gray-50 transition-colors group ${isRTL ? 'flex-row-reverse' : ''}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary group-hover:bg-white transition-colors ${isRTL ? 'ml-3' : 'mr-3'}`}>
                                                <i className={`${item.icon} text-lg`}></i>
                                            </div>
                                            <span className={`font-bold text-gray-700 font-inter ${item.color || ''}`}>{item.label}</span>
                                            <i className={`fas ${isRTL ? 'fa-chevron-left mr-auto' : 'fa-chevron-right ml-auto'} text-gray-300 text-xs`}></i>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-xs text-center text-gray-400 font-inter">
                        Version 1.0.2<br />
                        © 2024 iGrab Story Cafe
                    </p>
                </div>
            </div>
        </>
    );
};

export default MobileMenu;
