import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { PATH_APP } from '../routes/paths';

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default function GuestGuard({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to={PATH_APP.root} />;

  return <>{children}</>;
}
