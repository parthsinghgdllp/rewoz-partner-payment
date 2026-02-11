'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="flex w-full flex-col gap-1.5">
                {label && (
                    <label className="text-sm font-medium text-secondary">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'flex h-12 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
                        error && 'border-error focus-visible:ring-error',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <span className="text-xs font-medium text-red-500 italic">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
