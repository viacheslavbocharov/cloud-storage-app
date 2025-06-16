// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { useState } from 'react';
// import api from '../utils/axios';
// import { useNavigate } from 'react-router-dom';

// const RegisterSchema = Yup.object().shape({
//   email: Yup.string().email('Invalid email').required('Email is required'),
//   password: Yup.string()
//     .min(8, 'Must be at least 8 characters')
//     .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
//     .matches(/[a-z]/, 'Must contain at least one lowercase letter')
//     .matches(/\d/, 'Must contain at least one number')
//     .required('Password is required'),
//   firstName: Yup.string(),
//   lastName: Yup.string(),
// });

// export default function RegisterPage() {
//   const [serverError, setServerError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (
//     values: {
//       email: string;
//       password: string;
//       firstName?: string;
//       lastName?: string;
//     },
//     { setSubmitting, resetForm }: any
//   ) => {
//     setServerError('');
//     setSuccessMessage('');

//     try {
//       await api.post('/auth/pre-register', values);
//       setSuccessMessage('Check your email to verify your account.');
//       resetForm();
//       navigate('/registration/success');
//     } catch (error: any) {
//       const message =
//         error?.response?.data?.message || 'Something went wrong during registration.';
//       setServerError(Array.isArray(message) ? message.join(', ') : message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-base-200">
//       <div className="bg-base-100 shadow-xl rounded-xl p-10 w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-2">Register</h1>
//         <p className="mb-6 text-sm text-base-content">to create your account</p>

//         <Formik
//           initialValues={{
//             email: '',
//             password: '',
//             firstName: '',
//             lastName: '',
//           }}
//           validationSchema={RegisterSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting }) => (
//             <Form className="flex flex-col gap-4">
//               <div>
//                 <Field
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   className="input input-bordered w-full"
//                 />
//                 <ErrorMessage name="email" component="div" className="text-error text-sm mt-1" />
//               </div>

//               <div>
//                 <Field
//                   type="password"
//                   name="password"
//                   placeholder="Password"
//                   className="input input-bordered w-full"
//                 />
//                 <ErrorMessage name="password" component="div" className="text-error text-sm mt-1" />
//               </div>

//               <div>
//                 <Field
//                   type="text"
//                   name="firstName"
//                   placeholder="First Name (optional)"
//                   className="input input-bordered w-full"
//                 />
//                 <ErrorMessage name="firstName" component="div" className="text-error text-sm mt-1" />
//               </div>

//               <div>
//                 <Field
//                   type="text"
//                   name="lastName"
//                   placeholder="Last Name (optional)"
//                   className="input input-bordered w-full"
//                 />
//                 <ErrorMessage name="lastName" component="div" className="text-error text-sm mt-1" />
//               </div>

//               {serverError && <div className="text-error text-sm">{serverError}</div>}
//               {successMessage && <div className="text-success text-sm">{successMessage}</div>}

//               <button
//                 type="submit"
//                 className="btn bg-blue-600 text-white w-full mt-4"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? 'Registering...' : 'Register'}
//               </button>

//               <p className="text-sm text-center">
//                 Already have an account?{' '}
//                 <a href="/login" className="link link-primary">
//                   Sign in
//                 </a>
//               </p>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// }

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { Button } from '@/components/ui/login-01-button';
import { Input } from '@/components/ui/login-01-input';
import { Label } from '@/components/ui/login-01-label';
import { Card, CardContent, CardHeader } from '@/components/ui/login-01-card';

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
    { setSubmitting, resetForm }: any,
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
        error?.response?.data?.message ||
        'Something went wrong during registration.';
      setServerError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Register</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Create your new account below
            </p>
          </div>
        </CardHeader>
        <CardContent>
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
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Field
                    as={Input}
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Field
                    as={Input}
                    type="password"
                    name="password"
                    placeholder="********"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Field
                    as={Input}
                    type="text"
                    name="firstName"
                    placeholder="John (optional)"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Field
                    as={Input}
                    type="text"
                    name="lastName"
                    placeholder="Doe (optional)"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {serverError && (
                  <div className="text-red-600 text-sm">{serverError}</div>
                )}
                {successMessage && (
                  <div className="text-green-600 text-sm">{successMessage}</div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
                </Button>

                <p className="text-sm text-center mt-2">
                  Already have an account?{' '}
                  <a
                    href="/login"
                    className="underline underline-offset-4 text-primary"
                  >
                    Sign in
                  </a>
                </p>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
