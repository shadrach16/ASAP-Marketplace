// src/pages/ResetPasswordPage.jsx

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, CheckCircle } from 'lucide-react';
import PasswordInput from '../components/common/PasswordInput';
import Button from '../components/common/Button';
import { toast } from 'sonner';
import authService from '../services/authService'; 

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isComplete, setIsComplete] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword(token, password, confirmPassword);
            setIsComplete(true);
            toast.success('Your password has been successfully reset!');
            // Redirect after a short delay
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            console.error(err);
            setError(err.message || 'The token is invalid or has expired.');
        } finally {
            setLoading(false);
        }
    };

    if (isComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
                <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-lg text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <h2 className="text-3xl font-bold text-text-primary">
                        Password Updated!
                    </h2>
                    <p className="text-text-secondary">
                        You can now log in with your new password. Redirecting to login...
                    </p>
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        Log in now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-lg">
                <div>
                    <h2 className="mt-6 text-3xl font-bold text-text-primary text-center">
                        Set a New Password
                    </h2>
                    <p className="mt-2 text-text-secondary text-center text-sm">
                        Enter your new secure password.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="text-red-600 text-sm font-medium p-3 bg-red-50 rounded-md border border-red-200">
                            {error}
                        </div>
                    )}
                    <PasswordInput
                        id="password"
                        label="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        disabled={loading}
                    />
                    <PasswordInput
                        id="confirmPassword"
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        disabled={loading}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={loading}
                        className='bg-blue-600 text-white'
                    >
                        {loading ? (
                            <span className='flex space-x-2 items-center justify-center'>
                                Resetting... <Loader2 className="h-5 w-5 animate-spin" />
                            </span>
                        ) : (
                            'Reset Password'
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;