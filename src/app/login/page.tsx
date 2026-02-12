'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { loginUser, logout, clearError } from '@/redux/slices/authSlice';
import { AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import AuthGuard from '@/components/AuthGuard';

const validationSchema = Yup.object({
    emailOrMobile: Yup.string()
        .required('Email or mobile is required')
        .test(
            'is-valid-phone-or-email',
            'Phone no. must start with 4 and be a maximum of 9 digits or a valid email',
            (value) => {
                if (!value) return false;
                const phoneRegex = /^4\d{0,8}$/;
                const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
                return phoneRegex.test(value) || emailRegex.test(value);
            }
        ),
    password: Yup.string().required('PIN is required'),
});

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const { error, loading, isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        // Redirect if already authenticated
        if (isAuthenticated) {
            router.replace('/subscription');
        }
        // Clear any stale errors on mount
        dispatch(clearError());
    }, [dispatch, isAuthenticated, router]);

    const formik = useFormik({
        initialValues: {
            emailOrMobile: '',
            password: '',
            remember: true,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const resultAction = await dispatch(loginUser({
                emailOrMobile: values.emailOrMobile,
                password: values.password,
                remember: values.remember,
            }) as any);

            if (loginUser.fulfilled.match(resultAction)) {
                // Check if user has business set up, etc. (similar to mobile logic if needed)
                router.push('/subscription');
            }
        },
    });

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue } = formik;

    return (
        <AuthGuard requireAuth={false}>
            <div className="min-h-screen bg-[#FFF8F6] flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#fc6957] rounded-full filter blur-[100px] opacity-10 -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#fc6957] rounded-full filter blur-[100px] opacity-10 -ml-48 -mb-48" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                        {/* Header */}
                        <div className="bg-[#fc6957] p-8 text-white text-center relative">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                className="inline-block p-4 bg-white rounded-2xl relative w-20 h-20 mx-auto shadow-xl mb-4"
                            >
                                <Image
                                    src="/images/rewoz_partner_transparent.png"
                                    alt="RewOz Logo"
                                    fill
                                    className="object-contain p-2"
                                    priority
                                />
                            </motion.div>
                            <h1 className="text-2xl font-bold">Partner Login</h1>
                            <p className="text-white/80 mt-2 text-sm">Welcome back! Please login to your account.</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="relative">
                                <Input
                                    label="Email or Mobile"
                                    name="emailOrMobile"
                                    type="text"
                                    placeholder="Email or Mobile Number"
                                    value={values.emailOrMobile}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.emailOrMobile ? errors.emailOrMobile : undefined}
                                    className="pl-10"
                                />
                                <Mail className="absolute left-3 top-[38px] w-5 h-5 text-gray-400" />
                            </div>

                            <div className="relative">
                                <Input
                                    label="PIN"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.password ? errors.password : undefined}
                                    className="pl-10"
                                />
                                <Lock className="absolute left-3 top-[38px] w-5 h-5 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[38px] text-gray-400 hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-2">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-800 font-medium">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-14 text-lg"
                                isLoading={isSubmitting || loading}
                            >
                                Sign In
                            </Button>
                        </form>
                    </div>

                    {/* Footer Credit */}
                    <p className="text-center mt-8 text-gray-400 text-xs">
                        © 2026 RewOz Partner Portal. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </AuthGuard>
    );
}
