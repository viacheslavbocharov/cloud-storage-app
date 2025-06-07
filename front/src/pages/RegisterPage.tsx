import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/\d/, 'Must contain at least one number')
    .required('Password is required'),
  firstName: Yup.string(),
  lastName: Yup.string(),
});

export default function RegisterPage() {
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (
    values: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    },
    { setSubmitting, resetForm }: any
  ) => {
    setServerError('');
    setSuccessMessage('');

    try {
      await api.post('/auth/pre-register', values);
      setSuccessMessage('Check your email to verify your account.');
      resetForm();
      navigate('/registration/success');
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Something went wrong during registration.';
      setServerError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="bg-base-100 shadow-xl rounded-xl p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Register</h1>
        <p className="mb-6 text-sm text-base-content">to create your account</p>

        <Formik
          initialValues={{
            email: '',
            password: '',
            firstName: '',
            lastName: '',
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="input input-bordered w-full"
                />
                <ErrorMessage name="email" component="div" className="text-error text-sm mt-1" />
              </div>

              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="input input-bordered w-full"
                />
                <ErrorMessage name="password" component="div" className="text-error text-sm mt-1" />
              </div>

              <div>
                <Field
                  type="text"
                  name="firstName"
                  placeholder="First Name (optional)"
                  className="input input-bordered w-full"
                />
                <ErrorMessage name="firstName" component="div" className="text-error text-sm mt-1" />
              </div>

              <div>
                <Field
                  type="text"
                  name="lastName"
                  placeholder="Last Name (optional)"
                  className="input input-bordered w-full"
                />
                <ErrorMessage name="lastName" component="div" className="text-error text-sm mt-1" />
              </div>

              {serverError && <div className="text-error text-sm">{serverError}</div>}
              {successMessage && <div className="text-success text-sm">{successMessage}</div>}

              <button
                type="submit"
                className="btn bg-blue-600 text-white w-full mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>

              <p className="text-sm text-center">
                Already have an account?{' '}
                <a href="/login" className="link link-primary">
                  Sign in
                </a>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
