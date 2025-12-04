/**
 * AuthForm Component - Production Ready
 * Login and Signup forms with validation
 * 
 * Features:
 * - Login and Signup modes
 * - Form validation
 * - Password visibility toggle
 * - Loading states
 * - Error handling
 * - Accessibility compliant
 */

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';

export interface AuthFormProps {
  mode?: 'login' | 'signup';
  onSubmit: (data: AuthData) => Promise<void>;
  onModeChange?: (mode: 'login' | 'signup') => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

export interface AuthData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode = 'login',
  onSubmit,
  onModeChange,
  loading = false,
  error: externalError,
  className = '',
}) => {
  const [formData, setFormData] = useState<AuthData>({
    email: '',
    password: '',
    name: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AuthData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof AuthData, boolean>>>({});

  const isLogin = mode === 'login';

  // Validation rules
  const validateField = (field: keyof AuthData, value: string): string => {
    switch (field) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return '';
      case 'name':
        if (!isLogin && !value) return 'Name is required';
        if (!isLogin && value.length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'phone':
        if (!isLogin && value && !/^\d{10}$/.test(value)) return 'Phone must be 10 digits';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (field: keyof AuthData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Validate on change if field was touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof AuthData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field] || '');
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AuthData, string>> = {};
    
    newErrors.email = validateField('email', formData.email);
    newErrors.password = validateField('password', formData.password);
    
    if (!isLogin) {
      newErrors.name = validateField('name', formData.name || '');
      if (formData.phone) {
        newErrors.phone = validateField('phone', formData.phone);
      }
    }

    setErrors(newErrors);
    setTouched({
      email: true,
      password: true,
      name: !isLogin,
      phone: !isLogin && !!formData.phone,
    });

    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || loading) return;

    try {
      await onSubmit(formData);
    } catch (err) {
      // Error handled by parent
    }
  };

  return (
    <div className={`w-full max-w-md ${className}`}>
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary-700" aria-hidden="true" />
          </div>
          <h1 className="text-h2 font-bold text-neutral-800 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-body-sm text-neutral-600">
            {isLogin 
              ? 'Sign in to access your dashboard' 
              : 'Get started with EPICS'
            }
          </p>
        </div>

        {/* External Error */}
        {externalError && (
          <div 
            role="alert"
            className="
              flex items-start gap-3 p-4 mb-6
              bg-error-50 border border-error-200 rounded-lg
              text-error-800
            "
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm">{externalError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Name (Signup only) */}
          {!isLogin && (
            <div className="mb-5">
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" aria-hidden="true" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  disabled={loading}
                  className={`
                    w-full pl-11 pr-4 py-3 rounded-lg
                    border ${errors.name && touched.name ? 'border-error-600' : 'border-neutral-300'}
                    focus:outline-none focus:ring-2 
                    ${errors.name && touched.name 
                      ? 'focus:ring-error-600 focus:border-error-600' 
                      : 'focus:ring-primary-600 focus:border-primary-600'
                    }
                    disabled:bg-neutral-50 disabled:text-neutral-500
                  `}
                  placeholder="Enter your full name"
                  aria-invalid={!!(errors.name && touched.name)}
                  aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
                />
              </div>
              {errors.name && touched.name && (
                <p id="name-error" className="mt-1.5 text-sm text-error-600" role="alert">
                  {errors.name}
                </p>
              )}
            </div>
          )}

          {/* Email */}
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" aria-hidden="true" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                disabled={loading}
                autoComplete="email"
                className={`
                  w-full pl-11 pr-4 py-3 rounded-lg
                  border ${errors.email && touched.email ? 'border-error-600' : 'border-neutral-300'}
                  focus:outline-none focus:ring-2 
                  ${errors.email && touched.email 
                    ? 'focus:ring-error-600 focus:border-error-600' 
                    : 'focus:ring-primary-600 focus:border-primary-600'
                  }
                  disabled:bg-neutral-50 disabled:text-neutral-500
                `}
                placeholder="you@example.com"
                aria-invalid={!!(errors.email && touched.email)}
                aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && touched.email && (
              <p id="email-error" className="mt-1.5 text-sm text-error-600" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-5">
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" aria-hidden="true" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                disabled={loading}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                className={`
                  w-full pl-11 pr-12 py-3 rounded-lg
                  border ${errors.password && touched.password ? 'border-error-600' : 'border-neutral-300'}
                  focus:outline-none focus:ring-2 
                  ${errors.password && touched.password 
                    ? 'focus:ring-error-600 focus:border-error-600' 
                    : 'focus:ring-primary-600 focus:border-primary-600'
                  }
                  disabled:bg-neutral-50 disabled:text-neutral-500
                `}
                placeholder="••••••••"
                aria-invalid={!!(errors.password && touched.password)}
                aria-describedby={errors.password && touched.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute right-3 top-1/2 -translate-y-1/2
                  text-neutral-400 hover:text-neutral-600
                  focus:outline-none
                "
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Eye className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password && touched.password && (
              <p id="password-error" className="mt-1.5 text-sm text-error-600" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          {/* Phone (Signup only, optional) */}
          {!isLogin && (
            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                disabled={loading}
                className={`
                  w-full px-4 py-3 rounded-lg
                  border ${errors.phone && touched.phone ? 'border-error-600' : 'border-neutral-300'}
                  focus:outline-none focus:ring-2 
                  ${errors.phone && touched.phone 
                    ? 'focus:ring-error-600 focus:border-error-600' 
                    : 'focus:ring-primary-600 focus:border-primary-600'
                  }
                  disabled:bg-neutral-50 disabled:text-neutral-500
                `}
                placeholder="10-digit mobile number"
                aria-invalid={!!(errors.phone && touched.phone)}
                aria-describedby={errors.phone && touched.phone ? 'phone-error' : undefined}
              />
              {errors.phone && touched.phone && (
                <p id="phone-error" className="mt-1.5 text-sm text-error-600" role="alert">
                  {errors.phone}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-lg
              bg-accent-600 text-white font-semibold
              hover:bg-accent-700
              focus:outline-none focus:ring-4 focus:ring-accent-300
              disabled:bg-neutral-300 disabled:cursor-not-allowed
              transition-colors duration-150
              flex items-center justify-center gap-2
              touch-target
            "
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              <>{isLogin ? 'Sign In' : 'Create Account'}</>
            )}
          </button>
        </form>

        {/* Mode Toggle */}
        {onModeChange && (
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => onModeChange(isLogin ? 'signup' : 'login')}
                disabled={loading}
                className="
                  font-semibold text-primary-700
                  hover:text-primary-800 hover:underline
                  focus:outline-none focus:underline
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
