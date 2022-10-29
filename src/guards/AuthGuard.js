import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';
import Login from '../pages/auth/Login';

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default function AuthGuard({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Login />;

  return <>{children}</>;
}
