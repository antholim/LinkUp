import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';

const AdminOnly = ({ children, fallback = null }) => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return fallback;
  }

  return children;
};

AdminOnly.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

export default AdminOnly;
