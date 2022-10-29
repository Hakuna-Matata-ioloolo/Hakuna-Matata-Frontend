import { useSnackbar } from 'notistack5';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@material-ui/core/styles';
import { Box, Button, Divider, Typography } from '@material-ui/core';
import useAuth from '../hooks/useAuth';
import useIsMountedRef from '../hooks/useIsMountedRef';
import { MIconButton } from '../components/@material-extend';
import MyAvatar from '../components/MyAvatar';
import MenuPopover from '../components/MenuPopover';

export default function AccountPop() {
  const anchorRef = useRef(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isMountedRef = useIsMountedRef();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      if (isMountedRef.current) {
        handleClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout', { variant: 'error' });
    }
  };

  return (
    <>
      <MIconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        <MyAvatar />
      </MIconButton>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ width: 220 }}>
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.school}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="inherit" variant="outlined" onClick={handleLogout}>
            로그아웃
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
