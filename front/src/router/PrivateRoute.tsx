import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authGetMe } from '../utils/auth';
import { Loader2 } from 'lucide-react';

const PrivateRoute = () => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('[PrivateRoute] 🔐 Check authoterization...');
        const user = await authGetMe();
        console.log('[PrivateRoute] ✅ Authorization succsessful:', user);
        setIsValid(true);
      } catch (err) {
        console.warn('[PrivateRoute] ❌ Не авторизован. Редирект на /login');
        localStorage.removeItem('accessToken');
        setIsValid(false);
      }
    };

    checkAuth();
  }, []);

  if (isValid === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-lg text-base-content">Authorization checking...</p>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      </div>
    );
  }

  return isValid ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
