import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import { Box, Stack, Link, Container, Typography } from '@material-ui/core';
import { PATH_AUTH } from '../../routes/paths';
import AuthLayout from '../../layouts/AuthLayout';
import Page from '../../components/Page';
import { MHidden } from '../../components/@material-extend';
import { LoginForm } from '../../components/app/auth/login';

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

export default function Login() {
  return (
    <RootStyle title="하쿠나 마타타 | 로그인">
      <AuthLayout>
        계정이 없으신가요?&nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
          계정 만들기
        </Link>
      </AuthLayout>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                하쿠나 마타타에 로그인
              </Typography>
            </Box>
          </Stack>

          <LoginForm />

          <MHidden width="smUp">
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              계정이 없으신가요?&nbsp;
              <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                계정 만들기
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
