import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

export default function VerifyRegistrationPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    'verifying',
  );
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      setStatus('error');
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await api.get(`/auth/verify-registration?token=${token}`);
        const { accessToken } = res.data;

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          setStatus('success');
          navigate('/dashboard');
        } else {
          setStatus('error');
        }
      } catch (err) {
        console.error('Verification failed:', err);
        setStatus('error');
      }
    };

    verifyEmail();
  }, [navigate]);

  if (status === 'verifying') {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-lg text-base-content">Verifying your email...</p>
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-red-600 text-lg">
          Invalid or expired verification link
        </p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate('/registration')}
        >
          Back to Registration
        </button>
      </div>
    );
  }

  return null; // Success case: already redirected
}
