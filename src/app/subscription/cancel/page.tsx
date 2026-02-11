'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CancelPage() {
    const router = useRouter();

    const handleBackToApp = () => {
        window.location.href = 'rewoz://membership';
    };

    return (
        <div className="min-h-screen bg-[#FFF8F6] flex flex-col items-center justify-center px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-2xl border border-red-50 text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 to-amber-400" />

                <div className="mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10, stiffness: 150 }}
                        className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto"
                    >
                        <XCircle className="w-12 h-12 text-red-500" />
                    </motion.div>
                </div>

                <h1 className="text-3xl font-black text-[#333333] mb-4">Payment Cancelled</h1>
                <p className="text-gray-600 mb-10 leading-relaxed px-4">
                    The payment process was not completed. No charges were made to your account.
                </p>

                <div className="bg-amber-50 rounded-2xl p-4 mb-8 flex items-start gap-3 text-left">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 font-medium">
                        If you encountered an issue during checkout, please try again or contact support.
                    </p>
                </div>

                <div className="space-y-4">
                    <Button
                        className="w-full h-14 text-lg shadow-lg group bg-[#333333] hover:bg-black"
                        onClick={() => router.push('/subscription')}
                    >
                        Try Again
                        <RefreshCw className="w-5 h-5 ml-2 transition-transform group-hover:rotate-180 duration-500" />
                    </Button>

                    <button
                        onClick={handleBackToApp}
                        className="text-gray-400 text-sm font-medium hover:text-red-500 transition-colors flex items-center justify-center w-full"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back to Mobile App
                    </button>
                </div>

                <div className="mt-12 opacity-30 grayscale inline-flex items-center gap-2">
                    <div className="relative w-6 h-6">
                        <Image
                            src="/images/rewoz_partner_transparent.png"
                            alt="RewOz Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
