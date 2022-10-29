import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// material
import { Avatar } from '@material-ui/core';

// ----------------------------------------------------------------------

const MAvatar = forwardRef(({ sx, children }, ref) => (
  <Avatar ref={ref} sx={sx}>
    {children}
  </Avatar>
));

MAvatar.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object
};

export default MAvatar;
