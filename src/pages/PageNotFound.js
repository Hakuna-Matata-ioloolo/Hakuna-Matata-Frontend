import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import { Box, Button, Typography, Container } from '@material-ui/core';
import { MotionContainer, varBounceIn } from '../components/@animate';
import Page from '../components/Page';

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

export default function PageNotFound() {
  return (
    <RootStyle title="하쿠나 마타타 | 404">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                페이지를 찾을 수 없습니다.
              </Typography>
            </motion.div>

            <Button to="/" size="large" variant="contained" component={RouterLink}>
              홈으로 이동
            </Button>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}
