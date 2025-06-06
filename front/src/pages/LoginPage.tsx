import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', values);
      const { accessToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid login or password.');
      // alert('Unvalid login or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center p-3">
      <div className="bg-base-100 p-10 rounded-2xl shadow-lg w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Левая часть — заголовок */}
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2">Sign in</h2>
          <p className="text-sm text-base-content">to continue</p>
        </div>

        {/* Правая часть — форма */}
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email('Invalid email')
              .required('Email is required'),
            password: Yup.string().required('Password is required'),
          })}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            {/* Email */}
            <label className="input validator flex items-center gap-2">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </g>
              </svg>
              <Field
                name="email"
                type="email"
                placeholder="mail@site.com"
                className="grow"
              />
            </label>
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm"
            />

            {/* Password */}
            <label className="input validator flex items-center gap-2">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                </g>
              </svg>
              <Field
                name="password"
                type="password"
                placeholder="Password"
                className="grow"
              />
            </label>
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm"
            />

            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}

            <div className="flex justify-between text-sm mt-2">
              <a className="link link-hover text-blue-600 font-semibold">
                Forgot?
              </a>
            </div>

            {/* Кнопки */}
            <div className="mt-4 text-right">
              <a
                href="/registration"
                className="btn btn-ghost shadow-none hover:bg-transparent hover:shadow-none bg-transparent border-transparent text-blue-600 mr-4"
              >
                Register
              </a>
              <button type="submit" className="btn bg-blue-600 text-white">
                Sign in
              </button>
            </div>
          </Form>
        </Formik>
      </div>
      {/* refreshToken check */}
      {/* <button
        onClick={async () => {
          try {
            const response = await api.get('/users/me');
            console.log('Данные пользователя:', response.data);
            alert('Успешный ответ: ' + JSON.stringify(response.data));
          } catch (error) {
            console.error('Ошибка запроса:', error);
            alert('Ошибка запроса (см. консоль)');
          }
        }}
        className="btn mt-4 bg-green-500 text-white"
      >
        Проверить GET /user
      </button> */}
    </div>
  );
};

export default LoginPage;
