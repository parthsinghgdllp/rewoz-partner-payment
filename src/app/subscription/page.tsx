'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    ChevronRight,
    CreditCard,
    Zap,
    ShieldCheck,
    X,
    AlertCircle,
    LogOut,
    ArrowRight,
    Gift,
    Clock,
    DollarSign,
    Database,
    User,
    ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchSubscription, cancelSubscription, createPaymentLink, subscriptionStatus, fetchPaymentHistory } from '@/redux/slices/subscriptionSlice';
import { logout } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { formatUSD } from '@/utils/currency';
import Image from 'next/image';
import AuthGuard from '@/components/AuthGuard';

export default function SubscriptionPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FFF8F6] flex items-center justify-center">Loading...</div>}>
            <AuthGuard requireAuth={true}>
                <SubscriptionContent />
            </AuthGuard>
        </Suspense>
    );
}

function SubscriptionContent() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { subscriptionList, isLoading, doesUserCancelled, subscriptionEndsOn, isTrialing, trialEndsOn, paymentHistory } = useSelector(
        (state: RootState) => state.subscription
    );
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [upgradingPriceId, setUpgradingPriceId] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchSubscription());
        dispatch(subscriptionStatus());
        dispatch(fetchPaymentHistory());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    const handleCancel = async () => {
        if (confirm('Are you sure you want to cancel your subscription?')) {
            await dispatch(cancelSubscription());
            dispatch(fetchSubscription());
            dispatch(subscriptionStatus());
        }
    };

    const handleUpgrade = async (priceId: string) => {
        setUpgradingPriceId(priceId);
        try {
            const baseUrl = window.location.origin;
            const result = await dispatch(createPaymentLink({
                stripePriceId: priceId,
                redirectUrl: `${baseUrl}/subscription/success`,
                successUrl: `${baseUrl}/subscription/success`,
                cancelUrl: `${baseUrl}/subscription/cancel`
            })).unwrap();

            if (result.succeeded && result.data) {
                window.location.href = result.data;
            } else {
                alert(result.message || 'Failed to generate payment link');
                setUpgradingPriceId(null);
            }
        } catch (error: any) {
            alert(error || 'An error occurred');
            setUpgradingPriceId(null);
        }
    };

    const getIcon = (iconName: string) => {
        const props = { className: "w-5 h-5 text-[#fc6957] flex-shrink-0 mt-0.5" };
        switch (iconName) {
            case 'gift': return <Gift {...props} />;
            case 'clock': return <Clock {...props} />;
            case 'dollar-sign': return <DollarSign {...props} />;
            case 'credit-card': return <CreditCard {...props} />;
            case 'zap': return <Zap {...props} />;
            case 'database': return <Database {...props} />;
            default: return <CheckCircle2 {...props} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF8F6] pb-20">
            {/* Header */}
            <header className="bg-white border-b border-[#DFE2E5] px-6 py-4 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12">
                            <Image
                                src="/images/rewoz_partner_transparent.png"
                                alt="RewOz Logo"
                                fill
                                sizes="48px"
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[#333333]">Subscriptions</h1>
                            <p className="text-xs text-gray-500">Manage your partner plan</p>
                        </div>
                    </div>

                    <div className="relative">
                        {user && (
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition-colors border border-gray-200 shadow-sm pr-2"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#fc6957]/10 flex items-center justify-center text-[#fc6957] overflow-hidden relative">
                                    {user?.profileUrl ? (
                                        <Image
                                            src={user.profileUrl}
                                            alt="Profile"
                                            fill
                                            sizes="32px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <User className="w-5 h-5" />
                                    )}
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                        )}

                        <AnimatePresence>
                            {isMenuOpen && (
                                <>
                                    {/* Backdrop to close menu */}
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsMenuOpen(false)}
                                    />

                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden"
                                    >
                                        <div className="px-5 py-4 border-b border-gray-50 mb-1 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-[#fc6957]/10 flex items-center justify-center text-[#fc6957] overflow-hidden relative flex-shrink-0">
                                                {user?.profileUrl ? (
                                                    <Image
                                                        src={user.profileUrl}
                                                        alt="Profile"
                                                        fill
                                                        sizes="48px"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-6 h-6" />
                                                )}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-bold text-[#333333] truncate">
                                                    {user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Partner User'}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate mt-0.5">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                handleLogout();
                                            }}
                                            className="w-full flex items-center gap-3 px-5 py-3 text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log Out
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                {/* Status Alert */}
                {(doesUserCancelled || isTrialing) && (
                    <div className={`mb-8 p-6 rounded-2xl flex items-start gap-4 shadow-sm border ${isTrialing ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'
                        }`}>
                        {isTrialing ? (
                            <Clock className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                        ) : (
                            <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                        )}
                        <div>
                            <h3 className={`font-bold ${isTrialing ? 'text-blue-900' : 'text-amber-900'}`}>
                                {isTrialing ? 'Free Trial Active' : 'Subscription Cancelled'}
                            </h3>
                            <p className={`${isTrialing ? 'text-blue-800' : 'text-amber-800'} text-sm mt-1`}>
                                {isTrialing ? (
                                    <>Your trial will expire on <strong>{trialEndsOn ? new Date(trialEndsOn).toLocaleDateString() : 'the end of the period'}</strong>.</>
                                ) : (
                                    <>Your access will remain active until <strong>{subscriptionEndsOn ? new Date(subscriptionEndsOn).toLocaleDateString() : 'the next billing cycle'}</strong>.</>
                                )}
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap justify-center items-start gap-8 mb-20">
                    {isLoading ? (
                        // Skeleton Loader
                        Array(2).fill(0).map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-pulse h-[500px] w-full max-w-sm" />
                        ))
                    ) : (
                        subscriptionList.map((plan, index) => (
                            <div
                                key={plan.priceId}
                                className={`relative bg-white rounded-3xl p-8 shadow-xl border-2 w-full max-w-sm ${(plan.isActive || (isTrialing && plan.isTrial))
                                    ? ((isTrialing && plan.isTrial) ? 'border-blue-400 ring-4 ring-blue-400/10' : 'border-[#fc6957] ring-4 ring-[#fc6957]/5')
                                    : 'border-transparent hover:border-[#fc6957]/30'
                                    }`}
                            >
                                {(plan.isActive || (isTrialing && plan.isTrial)) && (
                                    <div className={`absolute top-0 right-8 -translate-y-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${(isTrialing && plan.isTrial)
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-[#fc6957] text-white'
                                        }`}>
                                        {(isTrialing && plan.isTrial) ? 'Active (Trial)' : 'Current Plan'}
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-[#333333] mb-1">{plan.name}</h2>
                                    {plan.description && (
                                        <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                                    )}
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-[#333333]">{formatUSD(plan.amount)}</span>
                                        <span className="text-gray-500 font-medium">/month</span>
                                    </div>
                                    {plan.amount > 0 && (
                                        <div className="mt-4 p-2 bg-[#FFF0EE] text-[#fc6957] text-xs font-bold rounded-lg inline-flex items-center gap-2">
                                            <Zap className="w-3 h-3 fill-current" />
                                            {plan.trailDays ? `${plan.trailDays} DAYS COMPLETELY FREE!` : 'LIMITED TIME OFFER!'}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">What&#39;s Included</h3>
                                        <button
                                            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                                            className="text-xs font-bold text-[#fc6957] hover:bg-[#FFF0EE] px-2 py-1 rounded transition-colors"
                                        >
                                            {expandedIndex === index ? 'Hide' : 'Show All'}
                                        </button>
                                    </div>

                                    <ul className="space-y-4">
                                        {plan.features.slice(0, expandedIndex === index ? undefined : 3).map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                {getIcon(feature.value.icon)}
                                                <div>
                                                    <span className="text-sm font-bold text-gray-800 block">{feature.value.title}</span>
                                                    <span className="text-xs text-gray-600 line-clamp-2">{feature.value.description}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-auto">
                                    {plan.isActive ? (
                                        <Button
                                            variant="outline"
                                            className="w-full h-12 border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-red-500 hover:border-red-200"
                                            onClick={handleCancel}
                                            disabled={doesUserCancelled}
                                        >
                                            {doesUserCancelled ? 'Plan Expiring Soon' : 'Cancel Subscription'}
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full h-12 shadow-lg group"
                                            onClick={() => handleUpgrade(plan.priceId)}
                                            isLoading={upgradingPriceId === plan.priceId}
                                        >
                                            Upgrade Now
                                            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Payment History Section */}
                {paymentHistory && paymentHistory.length > 0 && (
                    <div className="mt-16 border-t border-gray-200 pt-16">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[#333333]">Payment History</h2>
                                <p className="text-sm text-gray-500">View your past transactions and invoices</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50/50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Invoice ID</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Amount</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Method</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {paymentHistory.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    #{payment.invoiceId?.slice(-8) || payment.id}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {new Date(payment.paidAt).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {new Intl.NumberFormat('en-AU', {
                                                        style: 'currency',
                                                        currency: payment.currency || 'AUD'
                                                    }).format(payment.amountPaid)}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 capitalize">
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard className="w-4 h-4 text-gray-400" />
                                                        {payment.paymentMethod}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                        ${payment.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                                                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'}`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
