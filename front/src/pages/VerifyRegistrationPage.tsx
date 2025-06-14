import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';

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
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold text-red-600">
                ⚠️ Invalid Link
              </h1>
              <p className="text-muted-foreground text-sm text-balance">
                The verification link is invalid or has expired.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate('/registration')}
              className="w-full mt-4"
            >
              Back to Registration
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
