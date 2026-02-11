'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', isLoading, children, ...props }, ref) => {
        const variants = {
            primary: 'bg-primary text-white hover:bg-primary/90 shadow-md',
            secondary: 'bg-secondary text-white hover:bg-secondary/90',
            outline: 'border-2 border-primary text-primary hover:bg-primary/5',
            ghost: 'text-primary hover:bg-primary/5',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'relative flex items-center justify-center rounded-xl px-6 py-3 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
                    variants[variant],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
