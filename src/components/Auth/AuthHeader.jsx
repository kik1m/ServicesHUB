import React from 'react';
import { LayoutGrid } from 'lucide-react';

const AuthHeader = ({ isLogin, forgotPasswordMode }) => {
    return (
        <div className="auth-header">
            <div className="auth-logo-box">
                <LayoutGrid size={32} color="black" />
            </div>
            <h1 className="auth-title">
                {forgotPasswordMode ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Join the Future')}
            </h1>
        </div>
    );
};

export default AuthHeader;
