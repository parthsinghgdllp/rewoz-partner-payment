'use client';

import React, { useEffect, useState } from 'react';
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
    Database
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchSubscription, cancelSubscription } from '@/redux/slices/subscriptionSlice';
import { logout } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { formatUSD } from '@/utils/currency';

export default function SubscriptionPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { subscriptionList, isLoading, doesUserCancelled, subscriptionEndsOn } = useSelector(
        (state: RootState) => state.subscription
    );
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchSubscription());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    const handleCancel = async () => {
        if (confirm('Are you sure you want to cancel your subscription?')) {
            await dispatch(cancelSubscription());
            dispatch(fetchSubscription());
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
                        <div className="w-10 h-10 bg-[#fc6957] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            R
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[#333333]">Subscriptions</h1>
                            <p className="text-xs text-gray-500">Manage your partner plan</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-semibold">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors group"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                {/* Status Alert */}
                {doesUserCancelled && (
                    <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4 shadow-sm">
                        <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-amber-900">Subscription Cancelled</h3>
                            <p className="text-amber-800 text-sm mt-1">
                                Your access will remain active until <strong>{subscriptionEndsOn ? new Date(subscriptionEndsOn).toLocaleDateString() : 'the next billing cycle'}</strong>.
                                After this date, your account will be downgraded to the Lite plan.
                            </p>
                            <button className="mt-3 text-sm font-bold text-[#fc6957] hover:underline flex items-center gap-1">
                                Reactivate Plan <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap justify-center items-start gap-8">
                    {isLoading ? (
                        // Skeleton Loader
                        Array(2).fill(0).map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-pulse h-[500px] w-full max-w-sm" />
                        ))
                    ) : (
                        subscriptionList.map((plan, index) => (
                            <div
                                key={plan.priceId}
                                className={`relative bg-white rounded-3xl p-8 shadow-xl border-2 w-full max-w-sm ${plan.isActive
                                    ? 'border-[#fc6957] ring-4 ring-[#fc6957]/5'
                                    : 'border-transparent hover:border-[#fc6957]/30'
                                    }`}
                            >
                                {plan.isActive && (
                                    <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#fc6957] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                        Current Plan
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
                                            FIRST MONTH COMPLETELY FREE!
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">What's Included</h3>
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
                                        <Button className="w-full h-12 shadow-lg group">
                                            Upgrade Now
                                            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}

                </div>
            </main>
        </div>
    );
}
