'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { setToken, validateToken, logout } from '@/redux/slices/authSlice';
import Image from 'next/image';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const searchParams = useSearchParams();
    const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

    const [isValidating, setIsValidating] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.has('token')) return true;
        }
        return requireAuth && !isAuthenticated;
    });
    const [tokenFromUrl, setTokenFromUrl] = useState<string | null>(null);

    useEffect(() => {
        const urlToken = searchParams.get('token');
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

        if (urlToken) {
            // If we have a new token from URL, and it's different from the stored one,
            // or if we just want to ensure we're using the URL token's session, 
            // we should clear the current state first.
            if (urlToken !== storedToken) {
                dispatch(logout());
            }
            setIsValidating(true);
            setTokenFromUrl(urlToken);
            handleTokenFromUrl(urlToken);
        } else {
            if (requireAuth && !isAuthenticated) {
                checkAuthentication();
            } else if (!requireAuth && !isAuthenticated) {
                checkAuthentication();
            }
        }
    }, [searchParams, requireAuth]);

    const handleTokenFromUrl = async (token: string) => {
        try {
            setIsValidating(true);

            dispatch(setToken(token));

            const result = await dispatch(validateToken(token));

            if (validateToken.fulfilled.match(result)) {
                const url = new URL(window.location.href);
                url.searchParams.delete('token');
                router.replace(url.pathname + url.search);
            } else {
                if (requireAuth) {
                    router.push('/login');
                }
            }
        } catch (error) {
            console.error('Token validation error:', error);
            if (requireAuth) {
                router.push('/login');
            }
        } finally {
            setIsValidating(false);
        }
    };

    const checkAuthentication = async () => {
        try {
            setIsValidating(true);

            if (typeof window !== 'undefined') {
                const storedToken = localStorage.getItem('accessToken');

                if (storedToken) {
                    const result = await dispatch(validateToken(storedToken));

                    if (validateToken.rejected.match(result)) {
                        if (requireAuth) {
                            router.push('/login');
                        }
                    }
                } else if (requireAuth) {
                    router.push('/login');
                }
            }
        } catch (error) {
            console.error('Authentication check error:', error);
            if (requireAuth) {
                router.push('/login');
            }
        } finally {
            setIsValidating(false);
        }
    };

    const hasTokenInUrl = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('token');

    if ((isValidating && (requireAuth || hasTokenInUrl)) || (requireAuth && loading)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FFF8F6]">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-20 h-20 animate-bounce">
                        <Image
                            src="/images/rewoz_partner_transparent.png"
                            alt="RewOz Logo"
                            fill
                            sizes="80px"
                            className="object-contain"
                            priority
                        />
                    </div>
                    <p className="text-[#333333] font-medium animate-pulse">
                        {tokenFromUrl ? 'Validating your credentials...' : 'Loading...'}
                    </p>
                </div>
            </div>
        );
    }


    if (requireAuth && !isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
