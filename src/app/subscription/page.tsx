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
    ArrowRight
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

        // Redirect if not authenticated (mock check)
        // if (!isAuthenticated) {
        //   router.push('/login');
        // }
    }, [dispatch, isAuthenticated, router]);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel your subscription?')) {
            dispatch(cancelSubscription());
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
                <AnimatePresence>
                    {doesUserCancelled && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4 shadow-sm"
                        >
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
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        // Skeleton Loader
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-pulse h-96" />
                        ))
                    ) : (
                        subscriptionList.map((plan, index) => (
                            <motion.div
                                key={plan.priceId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className={`relative bg-white rounded-3xl p-8 shadow-xl border-2 transition-all duration-300 ${plan.isActive
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

                                    <ul className="space-y-3">
                                        {plan.features.slice(0, expandedIndex === index ? undefined : 4).map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-[#fc6957] flex-shrink-0 mt-0.5" />
                                                <span className="text-sm text-gray-600 leading-tight">{feature}</span>
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
                            </motion.div>
                        ))
                    )}

                    {/* Bonus Card (from native app concept) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col justify-center p-8 rounded-3xl bg-gradient-to-br from-[#fc6957] to-[#ff7d6b] text-white shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

                        <ShieldCheck className="w-12 h-12 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Partner Bonus</h3>
                        <p className="text-white/80 text-sm mb-6 leading-relaxed">
                            Unlock exclusive rewards and higher commission rates by maintaining a Pro subscription.
                        </p>
                        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                            <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">Current Reward Status</p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold">Standard Tier</span>
                                <span className="text-white/60 text-xs text-right">3 sales to next tier</span>
                            </div>
                            <div className="w-full bg-black/20 h-2 rounded-full mt-2 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '60%' }}
                                    className="bg-white h-full"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Sticky Bottom CTA for Mobile (Optional, but good for responsiveness) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                <Button className="w-full h-14">View All Plans</Button>
            </div>
        </div>
    );
}
