'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft, ExternalLink, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SuccessPage() {
    const [timeLeft, setTimeLeft] = useState(10);
    const router = useRouter();

    useEffect(() => {
        if (timeLeft <= 0) {
            handleBackToApp();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleBackToApp = () => {
        // Deep link to the mobile app
        window.location.href = 'rewoz://membership';
    };

    return (
        <div className="min-h-screen bg-[#FFF8F6] flex flex-col items-center justify-center px-6 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-2xl border border-orange-50 text-center relative overflow-hidden"
            >
                {/* Background Sparkles */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#fc6957] to-[#ffb3a7]" />

                <div className="mb-8 relative inline-block">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                        className="w-24 h-24 bg-[#FFF0EE] rounded-full flex items-center justify-center mx-auto"
                    >
                        <CheckCircle2 className="w-12 h-12 text-[#fc6957]" />
                    </motion.div>
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 10, -10, 0]
                        }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute -top-2 -right-2 bg-white p-2 rounded-full shadow-lg"
                    >
                        <PartyPopper className="w-5 h-5 text-amber-500" />
                    </motion.div>
                </div>

                <h1 className="text-3xl font-black text-[#333333] mb-4">Payment Successful!</h1>
                <p className="text-gray-600 mb-10 leading-relaxed">
                    Thank you for upgrading! Your subscription is now active. You'll be redirected back to the app in
                    <span className="font-bold text-[#fc6957] mx-1">{timeLeft} seconds</span>.
                </p>

                <div className="space-y-4">
                    <Button
                        className="w-full h-14 text-lg shadow-lg group bg-[#fc6957] hover:bg-[#e55a4a]"
                        onClick={handleBackToApp}
                    >
                        Return to App Now
                        <ExternalLink className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>

                    <button
                        onClick={() => router.push('/subscription')}
                        className="text-gray-400 text-sm font-medium hover:text-[#fc6957] transition-colors flex items-center justify-center w-full"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go to Subscriptions Portal
                    </button>
                </div>

                {/* Logo Footer */}
                <div className="mt-12 flex items-center justify-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
                    <div className="relative w-6 h-6">
                        <Image
                            src="/images/rewoz_partner_transparent.png"
                            alt="RewOz Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase">Verified by RewOz</span>
                </div>
            </motion.div>
        </div>
    );
}
