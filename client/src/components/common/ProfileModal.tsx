import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface OrderItem {
    productId: string;
    name: string;
    image: string;
    qty: number;
    unitPrice: number;
    total: number;
}

interface Order {
    _id: string;
    orderId: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    orderDate: string;
    orderItems: OrderItem[];
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
    const history = useHistory();
    const { user, isAuthenticated, logout, loading: authLoading, updateProfile } = useAuth();
    const { t, isRTL, language } = useLanguage();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && isAuthenticated) {
            fetchOrders(1, true);
        }
    }, [isOpen, isAuthenticated]);

    const fetchOrders = async (pageNum: number, isInitial: boolean = false) => {
        setLoadingOrders(true);
        try {
            const res = await axios.get(`/api/orders?page=${pageNum}&limit=5`);
            if (isInitial) {
                setOrders(res.data.orders || []);
            } else {
                setOrders(prev => [...prev, ...(res.data.orders || [])]);
            }
            setHasMore(res.data.hasMore);
            setPage(pageNum);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleViewMore = (e: React.MouseEvent) => {
        e.stopPropagation();
        fetchOrders(page + 1);
    };

    if (!isOpen) return null;

    const handleLogout = async () => {
        await logout();
        onClose();
    };

    const handleAction = (path: string) => {
        onClose();
        history.push(path);
    };

    const handleEditName = async () => {
        const newName = prompt("Enter your name:", user?.firstName || "");
        if (newName && newName !== user?.firstName) {
            try {
                await updateProfile(newName);
            } catch (err: any) {
                alert(err.message);
            }
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: date.toLocaleTimeString(language === 'ar' ? 'ar-AE' : 'en-US', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const getImageUrl = (image: string) =>
        image?.startsWith('http') ? image : `http://localhost:5000/${image?.startsWith('/') ? image.substring(1) : image}`;

    return createPortal(
        <div
            className={`fixed inset-0 bg-black/60 z-[2000] flex items-end lg:items-stretch ${isRTL ? 'lg:justify-start' : 'lg:justify-end'} animate-fade-in`}
            onClick={onClose}
        >
            <div
                className={`bg-white w-full lg:w-[420px] h-full lg:h-screen flex flex-col relative shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.3)] ${isRTL ? 'lg:rounded-r-[40px] animate-slide-in-left' : 'lg:rounded-l-[40px] animate-slide-in-right'}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Header Profile Section */}
                <div className={`bg-primary pt-16 pb-12 px-8 ${isRTL ? 'rounded-br-[60px]' : 'rounded-bl-[60px]'} relative overflow-hidden`}>
                    <div className={`absolute top-8 ${isRTL ? 'left-8' : 'right-8'} z-50`}>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full border-4 border-white/30 bg-white/10 flex items-center justify-center mb-4 overflow-hidden shadow-2xl">
                            {isAuthenticated ? (
                                <i className="fas fa-user-circle text-white text-6xl"></i>
                            ) : (
                                <i className="fas fa-user-secret text-white/50 text-5xl"></i>
                            )}
                        </div>
                        {authLoading ? (
                            <div className="animate-pulse flex flex-col items-center">
                                <div className="h-8 w-32 bg-white/20 rounded-lg mb-2"></div>
                                <div className="h-4 w-24 bg-white/20 rounded-md"></div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-white font-chillax mb-1">
                                    {isAuthenticated ? (user?.firstName || "Guest") : t('guest_user')}
                                </h2>
                                <p className="text-white/70 text-sm font-inter flex items-center justify-center gap-1.5" dir="ltr">
                                    {isAuthenticated ? (
                                        <>
                                            <span className="opacity-60">{user?.countryCode}</span>
                                            {user?.phone}
                                        </>
                                    ) : (
                                        <span>{t('login_track')}</span>
                                    )}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-accent-gold/20 rounded-full blur-2xl pointer-events-none"></div>
                </div>

                {/* Content Actions */}
                <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 flex flex-col no-scrollbar">
                    {!isAuthenticated ? (
                        <div className="space-y-4">
                            <button
                                onClick={() => handleAction('/auth')}
                                className="w-full flex items-center gap-4 p-5 bg-primary/5 rounded-[24px] border border-primary/10 hover:bg-primary/10 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                                    <i className="fas fa-sign-in-alt"></i>
                                </div>
                                <div className="text-left">
                                    <h4 className={`font-bold text-primary ${isRTL ? 'text-right' : 'text-left'}`}>{t('login_signup_btn')}</h4>
                                    <p className={`text-xs text-primary/60 ${isRTL ? 'text-right' : 'text-left'}`}>{t('access_saved')}</p>
                                </div>
                                <i className={`fas ${isRTL ? 'fa-chevron-left mr-auto' : 'fa-chevron-right ml-auto'} text-primary/30 group-hover:translate-x-1 transition-transform`}></i>
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Order History Container */}
                            <div className="space-y-4">
                                <h3 className={`text-xs uppercase text-gray-400 font-bold tracking-widest px-2 py-1 flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span>{t('recent_orders')}</span>
                                    {orders.length > 0 && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[10px]">{orders.length} {t('orders_loaded')}</span>}
                                </h3>

                                <div
                                    className="bg-gray-50/50 rounded-[32px] p-2 space-y-3 overflow-y-auto no-scrollbar"
                                    style={{ height: '420px' }}
                                >
                                    {orders.length === 0 && !loadingOrders ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                                                <i className="fas fa-box-open text-gray-200 text-2xl"></i>
                                            </div>
                                            <p className="text-sm text-gray-400 font-inter">{t('no_orders')}</p>
                                        </div>
                                    ) : (
                                        <>
                                            {orders.map(order => {
                                                const dateTime = formatDate(order.orderDate);
                                                const isExpanded = expandedOrderId === order._id;

                                                return (
                                                    <div
                                                        key={order._id}
                                                        className={`bg-white rounded-2xl transition-all duration-300 border border-gray-100/50 hover:shadow-md overflow-hidden cursor-pointer ${isExpanded ? 'ring-2 ring-primary/20 scale-[1.01]' : ''}`}
                                                        onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                                                    >
                                                        {/* Order Minimal View */}
                                                        <div className={`p-4 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                                                                <p className="text-[10px] uppercase text-gray-400 font-bold font-inter tracking-tighter">{t('order_id')}</p>
                                                                <h4 className="text-xs font-bold text-gray-800 font-inter">{order.orderId}</h4>
                                                                <div className={`flex items-center gap-2 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                                    <span className="text-xs font-bold text-primary" dir="ltr">AED {order.totalAmount.toFixed(2)}</span>
                                                                    <span className="text-[8px] text-gray-300">•</span>
                                                                    <span className="text-[10px] text-gray-400">{dateTime.date}</span>
                                                                </div>
                                                            </div>
                                                            <div className={`flex flex-col items-end gap-2 ${isRTL ? 'items-start' : 'items-end'}`}>
                                                                <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                                                                    order.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                                                        'bg-accent-gold/10 text-accent-gold'
                                                                    }`}>
                                                                    {t(`status_${order.status.toLowerCase()}`) || order.status}
                                                                </span>
                                                                <i className={`fas fa-chevron-down text-xs text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}></i>
                                                            </div>
                                                        </div>

                                                        {/* Expanded Details */}
                                                        <div className={`transition-all duration-300 ${isExpanded ? 'max-h-[500px] border-t border-gray-50' : 'max-h-0'}`}>
                                                            <div className="p-4 bg-gray-50/30">
                                                                <div className="space-y-3">
                                                                    <div className={`flex justify-between items-center text-[10px] ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                                        <span className="text-gray-400 font-bold">{t('items_label')}</span>
                                                                        <span className="text-gray-400 font-bold">{dateTime.time}</span>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        {order.orderItems.map((item, idx) => (
                                                                            <div key={idx} className="flex items-center gap-3">
                                                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                                                                                    <img src={getImageUrl(item.image)} alt="" className="w-full h-full object-cover" />
                                                                                </div>
                                                                                <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                                                                                    <p className="text-[11px] font-bold text-gray-700 truncate">{item.name}</p>
                                                                                    <p className="text-[10px] text-gray-400">{t('item')} {item.qty}</p>
                                                                                </div>
                                                                                <p className="text-[11px] font-bold text-gray-800" dir="ltr">AED {item.total.toFixed(2)}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <div className={`pt-3 border-t border-gray-100 flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                                        <div className={isRTL ? 'text-right' : 'text-left'}>
                                                                            <p className="text-[9px] text-gray-400 uppercase font-black">{t('payment_status')}</p>
                                                                            <p className={`text-[10px] font-bold ${order.paymentStatus === 'Paid' ? 'text-green-500' : 'text-red-400'}`}>
                                                                                {t(order.paymentStatus.toLowerCase()) || order.paymentStatus}
                                                                            </p>
                                                                        </div>
                                                                        <button className="text-[10px] font-bold text-primary underline">{t('download_receipt')}</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {hasMore && (
                                                <div className="pt-2 text-center">
                                                    <button
                                                        onClick={handleViewMore}
                                                        className="px-6 py-2 bg-white rounded-full text-[10px] font-bold text-primary shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center gap-2 mx-auto"
                                                    >
                                                        {loadingOrders ? <i className="fas fa-spinner fa-spin"></i> : <i className={`fas ${isRTL ? 'fa-chevron-down' : 'fa-plus'}`}></i>}
                                                        {t('view_more_orders')}
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Support Section */}
                            <div className="space-y-2">
                                <h3 className={`text-xs uppercase text-gray-400 font-bold tracking-widest px-2 py-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('support')}</h3>

                                <button
                                    onClick={() => handleAction('/contact')}
                                    className={`w-full flex items-center gap-4 p-4 rounded-[20px] hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <i className="fas fa-headset"></i>
                                    </div>
                                    <span className={`font-bold text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>{t('contact_support')}</span>
                                    <i className={`fas ${isRTL ? 'fa-chevron-left mr-auto' : 'fa-chevron-right ml-auto'} text-gray-300 text-sm`}></i>
                                </button>
                            </div>

                            {/* Temporarily Hidden Quick Access */}
                            {/* 
                            <div className="space-y-2">
                                <h3 className="text-xs uppercase text-gray-400 font-bold tracking-widest ml-2 py-2">Quick Access</h3>

                                <button
                                    onClick={handleEditName}
                                    className="w-full flex items-center gap-4 p-4 rounded-[20px] hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <i className="fas fa-user-edit"></i>
                                    </div>
                                    <span className="font-bold text-gray-700">Edit Profile</span>
                                    <i className="fas fa-chevron-right ml-auto text-gray-300 text-sm"></i>
                                </button>
                                <button className="w-full flex items-center gap-4 p-4 rounded-[20px] hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100">
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <i className="fas fa-map-marker-alt"></i>
                                    </div>
                                    <span className="font-bold text-gray-700">My Addresses</span>
                                    <i className="fas fa-chevron-right ml-auto text-gray-300 text-sm"></i>
                                </button>

                                <button className="w-full flex items-center gap-4 p-4 rounded-[20px] hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100">
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <i className="fas fa-cog"></i>
                                    </div>
                                    <span className="font-bold text-gray-700">Settings</span>
                                    <i className="fas fa-chevron-right ml-auto text-gray-300 text-sm"></i>
                                </button>
                            </div>
                            */}
                        </>
                    )}
                </div>

                {/* Footer Logout */}
                {isAuthenticated && (
                    <div className="p-8 border-t border-gray-100 bg-gray-50/30">
                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center justify-center gap-3 py-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all active:scale-95 ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                            <i className="fas fa-sign-out-alt"></i>
                            {t('logout')}
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes slide-in-right {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out forwards;
                }
                @keyframes slide-in-left {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-left {
                    animation: slide-in-left 0.3s ease-out forwards;
                }
                @keyframes slide-down {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-down {
                    animation: slide-down 0.2s ease-out forwards;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>,
        document.body
    );
};

export default ProfileModal;
