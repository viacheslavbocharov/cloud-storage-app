import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '@/utils/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/login-01-label';
import { Card, CardContent, CardHeader } from '@/components/ui/login-01-card';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing token');
    }
  }, [token]);

  const handleResetPasswordSubmit = async (
    values: { newPassword: string },
    { setSubmitting }: any,
  ) => {
    setError('');
    setMessage('');
    try {
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword: values.newPassword,
      });
      setMessage(res.data.message);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted px-4">
        <div className="text-center text-red-500 text-lg">Invalid or missing token</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Reset Password</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter a new password for your account
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{ newPassword: '' }}
              validationSchema={Yup.object({
                newPassword: Yup.string()
                  .min(6, 'Password must be at least 6 characters')
                  .required('New password is required'),
              })}
              onSubmit={handleResetPasswordSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Field
                      as={Input}
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      placeholder="********"
                    />
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {error && <div className="text-sm text-red-500">{error}</div>}
                  {message && <div className="text-sm text-green-600">{message}</div>}

                  <div className="flex flex-col gap-3 mt-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Reset Password'}
                    </Button>
                    <Button variant="outline" type="button" onClick={() => navigate('/login')}>
                      Back to Login
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
