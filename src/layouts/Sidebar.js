import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { alpha, styled } from '@material-ui/core/styles';
import { Box, Drawer, Stack, Typography } from '@material-ui/core';
import useAuth from '../hooks/useAuth';
import useCollapseDrawer from '../hooks/useCollapseDrawer';
import Logo from '../components/Logo';
import MyAvatar from '../components/MyAvatar';
import Scrollbar from '../components/Scrollbar';
import NavSection from '../components/NavSection';
import { MHidden } from '../components/@material-extend';
import sidebarUserConfig from './sidebarConfig/user';
import sidebarAdminConfig from './sidebarConfig/admin';

const DRAWER_WIDTH = 280;
const COLLAPSE_WIDTH = 102;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.complex
    })
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[500_12]
}));

Sidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function Sidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const { isCollapse, collapseClick, collapseHover, onHoverEnter, onHoverLeave } = useCollapseDrawer();

  useEffect(() => {
    if (isOpenSidebar) onCloseSidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <Stack
        spacing={3}
        sx={{
          mt: 2.5,
          px: 2.5,
          pt: 3,
          pb: 2,
          ...(isCollapse && {
            alignItems: 'center'
          })
        }}
      >
        {isCollapse ? (
          <MyAvatar sx={{ mx: 'auto', mb: 2 }} />
        ) : (
          <AccountStyle>
            <MyAvatar />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {user.isAdmin ? `[관리자] ${user.name}` : user.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user.school}
              </Typography>
            </Box>
          </AccountStyle>
        )}
      </Stack>

      <NavSection navConfig={user.isAdmin ? sidebarAdminConfig : sidebarUserConfig} isShow={!isCollapse} />

      {!isCollapse && (
        <Stack spacing={3} alignItems="center" sx={{ pb: 5, mt: 10, width: 1, textAlign: 'center' }}>
          <div>
            <Stack spacing={0} alignItems="center">
              <Logo sx={{ width: 128, height: 128 }} />
              <Typography gutterBottom variant="subtitle1">
                하쿠나 마타타
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ fontSize: 12, color: 'text.secondary' }}>
              사업자등록번호: 000-00-00000
              <br />
              통신판매업신고:2022-XX-0000
              <br />
              <br />
            </Typography>
            <Typography variant="subtitle2" sx={{ fontSize: 8, color: 'text.secondary' }}>
              Copyright © 2022 Hakuna Matata. All Rights Reserved.
            </Typography>
          </div>
        </Stack>
      )}
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? COLLAPSE_WIDTH : DRAWER_WIDTH
        },
        ...(collapseClick && {
          position: 'absolute'
        })
      }}
    >
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              ...(isCollapse && {
                width: COLLAPSE_WIDTH
              }),
              ...(collapseHover && {
                borderRight: 0,
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
                boxShadow: (theme) => theme.customShadows.z20,
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.88)
              })
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
