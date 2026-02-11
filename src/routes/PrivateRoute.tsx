import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from 'app/hooks';

interface Props {
  roles?: ('ADMIN' | 'USER')[];
}

export const PrivateRoute = ({ roles }: Props) => {
  const { user, token } = useAppSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" replace />;

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};