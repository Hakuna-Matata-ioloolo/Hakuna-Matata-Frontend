// hooks
import useAuth from '../hooks/useAuth';
//
import { MAvatar } from './@material-extend';

// ----------------------------------------------------------------------

export default function MyAvatar() {
  const { user } = useAuth();

  return <MAvatar sx={{ fontSize: 16 }}>{user.name.substring(1, 3)}</MAvatar>;
}
