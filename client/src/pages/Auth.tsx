import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import Layout from '../components/common/Layout';
import { useLanguage } from '../contexts/LanguageContext';

const Auth: React.FC = () => {
    const history = useHistory();
    const { login } = useAuth();
    const { cartItems } = useCart();
    const { wishlistItems } = useWishlist();
    const { t, isRTL } = useLanguage();
    const query = new URLSearchParams(window.location.search);
    const redirectPath = query.get('redirect') || '/shop';

    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [step, setStep] = useState<'login' | 'otp'>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(60);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [form, setForm] = useState({
        name: '',
        countryCode: '+971',
        phone: ''
    });

    // Timer for Resend OTP
    useEffect(() => {
        let interval: any;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    // Web OTP API - Automatic Detection
    useEffect(() => {
        if (step === 'otp' && 'OTPCredential' in window) {
            const ac = new AbortController();
            navigator.credentials.get({
                // @ts-ignore
                otp: { transport: ['sms'] },
                signal: ac.signal
            }).then((otpCredential: any) => {
                const code = otpCredential.code;
                if (code) {
                    const digits = code.split('').slice(0, 6);
                    setOtp(digits);
                    // Automatically verify if full 6-digits detected
                    if (digits.length === 6) {
                        handleVerify(digits.join(''));
                    }
                }
            }).catch(err => {
                // Ignore errors
            });

            return () => ac.abort();
        }
    }, [step]);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (authMode === 'signup' && !form.name) return setError(t('error_name_req'));
        if (!form.phone) return setError(t('error_phone_req'));

        const phoneClean = form.phone.replace(/\s+/g, '');
        if (!/^\d+$/.test(phoneClean)) return setError(t('error_invalid_phone'));
        if (phoneClean.length < 7 || phoneClean.length > 15) return setError(t('error_invalid_length'));

        setLoading(true);
        setError('');

        try {
            await api.post('/api/auth/signup', {
                ...form,
                authMode
            });
            setStep('otp');
            setTimer(60);
        } catch (err: any) {
            setError(err.response?.data?.error || t('error_otp_send'));
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (val: string, index: number) => {
        if (!/^\d*$/.test(val)) return;
        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);

        if (val && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }

        // If all 6 digits are filled, verify automatically
        const code = newOtp.join('');
        if (code.length === 6) {
            handleVerify(code);
        }
    };

    const handleBackspace = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (codeOverride?: string) => {
        const code = codeOverride || otp.join('');
        if (code.length < 6) return;

        setLoading(true);
        setError('');

        try {
            // guest items from contexts are passed to login for merging on server
            await login(form.phone, form.countryCode, code, cartItems, wishlistItems);
            // After login, redirect to the intended path
            history.replace(redirectPath);
            if (redirectPath === '/') {
                window.location.reload(); // Traditional reload for home if needed
            }
        } catch (err: any) {
            setError(err.message || t('error_otp_invalid'));
            setOtp(['', '', '', '', '', '']);
            otpRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout showHeader={false} showFooter={false} hidePadding>
            <div className="relative min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-dm">
                {/* Back Button */}
                <button
                    onClick={() => history.goBack()}
                    className={`fixed top-6 ${isRTL ? 'right-6' : 'left-6'} z-50 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-800 active:scale-95 transition-all border border-gray-100`}
                >
                    <i className={`fas fa-arrow-${isRTL ? 'right' : 'left'} text-lg`}></i>
                </button>

                <div className="max-w-md w-full mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden relative min-h-[600px] flex items-center">

                    {/* CARD FLIP SYSTEM */}
                    <div className={`w-full transition-all duration-700 transform ${step === 'otp' ? 'rotate-y-180' : ''}`} style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>

                        {/* FRONT: Login/Signup */}
                        <div className={`w-full px-8 py-10 backface-hidden ${step === 'otp' ? 'hidden' : 'block'}`}>
                            <div className="text-center mb-10">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-primary">
                                    <i className="fas fa-coffee"></i>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {authMode === 'login' ? t('welcome_back') : t('create_account')}
                                </h1>
                                <p className="text-gray-500">
                                    {authMode === 'login' ? t('login_subtitle') : t('signup_subtitle')}
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm flex items-center animate-shake">
                                    <i className="fas fa-exclamation-circle mr-2"></i>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSendOTP} className="space-y-6">
                                {authMode === 'signup' && (
                                    <div className={isRTL ? 'text-right' : 'text-left'}>
                                        <label className={`block text-sm font-bold text-gray-700 mb-2 ${isRTL ? 'mr-1' : 'ml-1'}`}>{t('full_name')}</label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            className={`w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl transition-all outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                                            placeholder={t('name_placeholder')}
                                        />
                                    </div>
                                )}

                                <div className={isRTL ? 'text-right' : 'text-left'}>
                                    <label className={`block text-sm font-bold text-gray-700 mb-2 ${isRTL ? 'mr-1' : 'ml-1'}`}>{t('mobile_number')}</label>
                                    <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <select
                                            value={form.countryCode}
                                            onChange={e => setForm({ ...form, countryCode: e.target.value })}
                                            className="px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl transition-all outline-none"
                                        >
                                            <option value="+971">🇦🇪 +971</option>
                                            <option value="+91">🇮🇳 +91</option>
                                            <option value="+1">🇺🇸 +1</option>
                                            <option value="+44">🇬🇧 +44</option>
                                            <option value="+966">🇸🇦 +966</option>
                                        </select>
                                        <input
                                            type="tel"
                                            dir="ltr"
                                            value={form.phone}
                                            onChange={e => setForm({ ...form, phone: e.target.value })}
                                            className={`flex-1 px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl transition-all outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                                            placeholder={t('phone_placeholder')}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-primary text-white py-5 rounded-[24px] font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                                >
                                    {loading ? <i className="fas fa-spinner fa-spin"></i> : (
                                        <>
                                            {authMode === 'login' ? t('login_btn') : t('signup_btn')}
                                            <i className={`fas fa-arrow-${isRTL ? 'left' : 'right'}`}></i>
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className={`text-sm text-gray-600 ${isRTL ? 'text-center' : ''}`}>
                                    {authMode === 'login' ? t('no_account') : t('has_account')}
                                    <button
                                        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                        className={`text-primary font-bold underline underline-offset-4 ${isRTL ? 'mr-2' : 'ml-2'}`}
                                    >
                                        {authMode === 'login' ? t('signup_btn') : t('login_btn')}
                                    </button>
                                </p>
                            </div>
                        </div>

                        {/* BACK: OTP Verification */}
                        <div className={`w-full px-8 py-10 backface-hidden ${step === 'otp' ? 'block' : 'hidden'} transform rotate-y-180`}>
                            <button
                                onClick={() => setStep('login')}
                                className={`absolute top-8 ${isRTL ? 'right-8' : 'left-8'} text-gray-400 hover:text-gray-900 transition-colors`}
                            >
                                <i className={`fas fa-arrow-${isRTL ? 'right' : 'left'} text-xl`}></i>
                            </button>

                            <div className="text-center mb-10 mt-6">
                                <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-yellow-600">
                                    <i className="fas fa-lock"></i>
                                </div>
                                <h2 className="text-2xl font-bold mb-2">{t('verify_phone')}</h2>
                                <p className="text-gray-500 text-sm">
                                    {t('code_sent_to')} <span className="font-bold text-gray-900" dir="ltr">{form.countryCode} {form.phone}</span>
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm flex items-center justify-center">
                                    <i className="fas fa-exclamation-circle mr-2"></i>
                                    {error}
                                </div>
                            )}

                            <div className={`flex justify-center gap-2 mb-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        type="tel"
                                        maxLength={1}
                                        ref={el => otpRefs.current[idx] = el}
                                        value={digit}
                                        onChange={e => handleOtpChange(e.target.value, idx)}
                                        onKeyDown={e => handleBackspace(e, idx)}
                                        autoComplete="one-time-code"
                                        className="w-12 h-16 text-center text-2xl font-bold bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl outline-none transition-all"
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => handleVerify()}
                                disabled={loading || otp.join('').length < 6}
                                className="w-full bg-primary text-white py-5 rounded-[24px] font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? <i className="fas fa-spinner fa-spin"></i> : t('verify_continue')}
                            </button>

                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-500 mb-2">{t('no_code')}</p>
                                <button
                                    onClick={handleSendOTP}
                                    disabled={timer > 0}
                                    className={`text-primary font-bold text-sm ${timer > 0 ? 'opacity-50 cursor-not-allowed' : 'underline underline-offset-4'}`}
                                >
                                    {timer > 0 ? `${t('resend_in')} ${timer}s` : t('resend_sms')}
                                </button>
                            </div>
                        </div>

                    </div>

                </div>

                <style>{`
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.2s ease-in-out 0s 2;
                }
            `}</style>
            </div>
        </Layout>
    );
};

export default Auth;
