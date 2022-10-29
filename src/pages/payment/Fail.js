import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import { Box, Button, Divider, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { PATH_APP } from '../../routes/paths';

export default function PaymentFail() {
  const navigate = useNavigate();

  const [code, setCode] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setCode(params.get('code'));
  }, []);

  return (
    <>
      <Box sx={{ p: 4, maxWidth: 1000, margin: 'auto' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" paragraph>
            결제에 실패했습니다.
          </Typography>

          <Typography sx={{ mt: 2 }} variant="h6">
            {code === 'PAY_PROCESS_CANCELED' && '사용자에 의해 결제가 취소되었습니다.'}
            {code === 'PAY_PROCESS_ABORTED' && '결제 진행 중 승인에 실패하여 결제가 중단되었습니다.'}
            {code === 'REJECT_CARD_COMPANY' && '결제 승인이 거절되었습니다.'}
          </Typography>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Button
          color="inherit"
          startIcon={<Icon icon={arrowIosBackFill} />}
          onClick={() => {
            navigate(PATH_APP.root);
          }}
        >
          홈으로 이동
        </Button>
      </Box>
    </>
  );
}
