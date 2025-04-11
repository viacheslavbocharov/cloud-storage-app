// export default function LandingPage() {
//   return (
//     <div className="flex items-center justify-center h-screen">
//       <h1 className="text-2xl font-bold">Login Page</h1>
//     </div>
//   );
// }

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', values);
      const { accessToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={Yup.object({
            email: Yup.string().email('Invalid email').required('Required'),
            password: Yup.string().required('Required'),
          })}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            <div>
              <label htmlFor="email">Email</label>
              <Field name="email" type="email" className="input" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" className="input" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
              Sign In
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;

