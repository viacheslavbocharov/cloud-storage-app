import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../utils/axios';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className={cn('w-full max-w-md')}>
        <Card>
          <CardHeader>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Login to your account</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your email and password to access your account
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .email('Invalid email')
                  .required('Email is required'),
                password: Yup.string().required('Password is required'),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                setError('');
                try {
                  const res = await api.post('/auth/login', values);
                  localStorage.setItem('accessToken', res.data.accessToken);
                  navigate('/dashboard');
                } catch (err: any) {
                  const message =
                    err.response?.data?.message || 'Something went wrong';
                  setError(message);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="flex flex-col gap-6">
                  {/* Email */}
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="mail@example.com"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Password */}
                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type="password"
                      placeholder="********"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {error && <div className="text-sm text-red-500">{error}</div>}

                  {/* Buttons */}
                  <div className="flex flex-col gap-3 mt-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>
                  </div>

                  <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{' '}
                    <a
                      href="/registration"
                      className="underline underline-offset-4"
                    >
                      Register
                    </a>
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

export default LoginPage;
