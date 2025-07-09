import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '@/utils/axios';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/login-01-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/login-01-label';
import { Button } from '@/components/ui/button';

const ForgotPasswordPage = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleForgotPasswordSubmit = async (values: { email: string }, { setSubmitting }: any) => {
    setError('');
    setMessage('');
    try {
      const res = await api.post('/auth/forgot-password', values);
      setMessage(res.data.message);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Forgot Password</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your email to receive a reset link
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{ email: '' }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .email('Invalid email')
                  .required('Email is required'),
              })}
              onSubmit={handleForgotPasswordSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="mail@example.com"
                    />
                    <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
                  </div>

                  {error && <div className="text-sm text-red-500">{error}</div>}
                  {message && <div className="text-sm text-green-600">{message}</div>}

                  <div className="flex flex-col gap-3 mt-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Send Reset Link'}
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

export default ForgotPasswordPage;
