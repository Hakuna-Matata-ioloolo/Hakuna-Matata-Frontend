import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import { Box, Link, Container, Typography } from '@material-ui/core';
import { PATH_AUTH } from '../../routes/paths';
import AuthLayout from '../../layouts/AuthLayout';
import Page from '../../components/Page';
import { MHidden } from '../../components/@material-extend';
import { RegisterForm } from '../../components/app/auth/register';

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

export default function Register() {
  return (
    <RootStyle title="하쿠나 마타타 | 가입하기">
      <AuthLayout>
        이미 계정이 있으신가요?&nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to={PATH_AUTH.login}>
          로그인하기
        </Link>
      </AuthLayout>

      <Container>
        <ContentStyle>
          <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                하쿠나 마타타에 가입하기
              </Typography>
            </Box>
          </Box>

          <RegisterForm />

          <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
            가입과 동시에 &nbsp;
            <Link underline="always" color="text.primary" to="#">
              서비스 이용약관
            </Link>
            &nbsp;과&nbsp;
            <Link underline="always" color="text.primary" to="#">
              개인정보처리방침
            </Link>
            에 동의하는 것 입니다.
          </Typography>

          <MHidden width="smUp">
            <Typography variant="subtitle2" sx={{ mt: 3, textAlign: 'center' }}>
              이미 계정이 있으신가요?&nbsp;
              <Link to={PATH_AUTH.login} component={RouterLink}>
                로그인하기
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
