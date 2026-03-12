import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) return <Navigate to="/" replace />;
  if (role && userRole !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;