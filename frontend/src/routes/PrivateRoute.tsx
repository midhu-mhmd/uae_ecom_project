import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks';

interface Props {
  roles?: ('admin' | 'user')[];
}

export const PrivateRoute = ({ roles }: Props) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};