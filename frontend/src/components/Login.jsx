import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Mail, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'react-toastify';

// Google OAuth Client ID
// In production, use environment variable: process.env.REACT_APP_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '816200019374-11u1tnvprc7tpbc5ttsu7os0et9qp7jf.apps.googleusercontent.com';

/**
 * Login Component with Google OAuth
 */
const Login = ({ onLogin }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    // Wait for Google Identity Services to load
    const checkGoogle = setInterval(() => {
      if (window.google && window.google.accounts) {
        setGoogleLoaded(true);
        clearInterval(checkGoogle);
        
        // Initialize Google Identity Services
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });
      }
    }, 100);

    // Cleanup
    return () => clearInterval(checkGoogle);
  }, []);

  const handleCredentialResponse = async (response) => {
    setIsLoading(true);
    try {
      // Decode the JWT token (basic decode, full verification should be on backend)
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      // Extract user information
      const userData = {
        email: payload.email,
        name: payload.name || payload.given_name || 'User',
        picture: payload.picture,
        googleId: payload.sub,
        token: response.credential
      };

      // In production, send token to backend for verification
      // const backendResponse = await fetch('/api/auth/google', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token: response.credential })
      // });
      // const verifiedUser = await backendResponse.json();

      // Store token for API requests
      localStorage.setItem('authToken', response.credential);
      
      // Call onLogin callback
      if (onLogin) {
        onLogin(userData);
      }
      
      toast.success(`Welcome, ${userData.name}!`);
    } catch (error) {
      console.error('Error processing Google login:', error);
      toast.error('Failed to sign in. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!googleLoaded) {
      toast.info('Loading Google Sign-In...');
      return;
    }

    setIsLoading(true);
    try {
      // Trigger Google Sign-In popup
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback: render button manually
          window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'email profile',
            callback: (tokenResponse) => {
              // Handle token response
              fetchUserInfo(tokenResponse.access_token);
            },
          }).requestAccessToken();
        }
      });
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to initialize Google Sign-In');
      setIsLoading(false);
    }
  };

  const fetchUserInfo = async (accessToken) => {
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
      const userData = await response.json();
      
      const userInfo = {
        email: userData.email,
        name: userData.name || userData.given_name || 'User',
        picture: userData.picture,
        googleId: userData.id
      };

      localStorage.setItem('authToken', accessToken);
      if (onLogin) {
        onLogin(userInfo);
      }
      toast.success(`Welcome, ${userInfo.name}!`);
    } catch (error) {
      console.error('Error fetching user info:', error);
      toast.error('Failed to fetch user information');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Demo login for development
    if (onLogin) {
      onLogin({ 
        email: 'demo@kisanai.com', 
        name: 'Demo User',
        picture: null,
        isDemo: true 
      });
      toast.success('Welcome, Demo User!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(1200px 520px at 12% 18%, rgba(16,185,129,0.12), transparent 65%), radial-gradient(980px 500px at 85% 25%, rgba(14,165,233,0.12), transparent 60%)`
        }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400 rounded-full opacity-20"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 12}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg"
            >
              <Sprout className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to KisanAI</h1>
            <p className="text-gray-600">Sign in to access your agricultural intelligence dashboard</p>
          </div>

          {/* Google Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={isLoading || !googleLoaded}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-gray-300 hover:shadow-lg transition-all duration-200 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
                <ArrowRight className="w-5 h-5 ml-auto" />
              </>
            )}
          </motion.button>

          {/* Google Sign-In Button (Alternative - One Tap) */}
          {googleLoaded && (
            <div id="g_id_onload" className="mb-4" style={{ display: 'none' }}>
              <div
                id="g_id_signin"
                data-type="standard"
                data-theme="outline"
                data-size="large"
                data-text="signin_with"
                data-shape="rectangular"
                data-logo_alignment="left"
                data-width="100%"
              />
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Demo Login Button (for development) */}
          {process.env.NODE_ENV === 'development' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              <Mail className="w-5 h-5" />
              <span>Continue as Demo User</span>
              <ArrowRight className="w-5 h-5 ml-auto" />
            </motion.button>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to KisanAI's{' '}
              <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-teal-400/20 to-transparent rounded-full blur-3xl" />
      </motion.div>
    </div>
  );
};

export default Login;
