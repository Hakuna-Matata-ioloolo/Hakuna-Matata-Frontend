import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import {
  Box,
  Button,
  Divider,
  Typography,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { styled } from '@material-ui/core/styles';
import { format } from 'date-fns';
import { useDispatch } from '../../redux/store';
import { resetCart } from '../../redux/slices/product';
import { PATH_APP } from '../../routes/paths';
import { fCurrency } from '../../utils/formatNumber';
import axios from '../../utils/axios';
import LoadingScreen from '../../components/LoadingScreen';

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  }
}));

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [response, setResponse] = useState({});
  const [load, setLoad] = useState(false);

  useEffect(() => {
    (async () => {
      dispatch(resetCart());

      const params = new URLSearchParams(window.location.search);

      const orderId = params.get('orderId');
      const paymentKey = params.get('paymentKey');
      const amount = params.get('amount');

      if (paymentKey && amount) {
        await axios.post('/api/billing/card', {
          orderId,
          paymentKey,
          amount
        });
      }

      const response = (
        await axios.post('/api/billing', {
          billingId: orderId
        })
      ).data;

      setResponse(response);
      setLoad(true);
    })();
  }, [dispatch]);

  return (
    <>
      {!load && <LoadingScreen />}

      {load && response.products && (
        <Box sx={{ p: 4, maxWidth: 1000, margin: 'auto' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" paragraph>
              구매해주셔서 감사합니다.
            </Typography>

            <Card sx={{ mt: 5, pt: 1, px: 2 }}>
              <TableContainer sx={{ mb: 1 }}>
                <Table>
                  <TableHead
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                      '& th': { backgroundColor: 'transparent' }
                    }}
                  >
                    <TableRow>
                      <TableCell width={10}>#</TableCell>
                      <TableCell width={300}>상품</TableCell>
                      <TableCell align="right">수량</TableCell>
                      <TableCell align="right">가격</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {response.products &&
                      response.products.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            borderBottom: (theme) => `solid 1px ${theme.palette.divider}`
                          }}
                        >
                          <TableCell>{index + 1}</TableCell>

                          <TableCell align="left">
                            <Box>
                              <Typography variant="subtitle2">{row.name}</Typography>

                              <Stack direction="row" alignItems="center">
                                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                  사이즈: {row.size} &ensp; | &ensp; 색상:
                                </Typography>
                                <Typography
                                  noWrap
                                  color={row.color}
                                  variant="body1"
                                  sx={{ fontSize: 18, maxWidth: 150 }}
                                >
                                  ⦁
                                </Typography>
                              </Stack>
                            </Box>
                          </TableCell>

                          <TableCell align="right">{row.quantity}개</TableCell>

                          <TableCell align="right">{fCurrency(row.price * row.quantity)}</TableCell>
                        </TableRow>
                      ))}

                    <RowResultStyle>
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell align="right" width={140}>
                        <Typography variant="subtitle1">{fCurrency(response.price)}</Typography>
                      </TableCell>
                    </RowResultStyle>
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

            {response.status === 'WAITING_FOR_DEPOSIT' && (
              <>
                <Typography sx={{ mt: 10 }} variant="body1" align="left">
                  계좌번호: {response.bank} {response.accountNumber} (예금주: {response.customerName})
                </Typography>
                <Typography variant="body1" align="left">
                  금액: {response.price}
                </Typography>
                <Stack sx={{ mt: 5 }} direction="row">
                  <Typography variant="subtitle1" align="left">
                    {format(new Date(response.dueDate), 'yyyy년 MM월 dd일 HH시 mm분 ss초')}
                  </Typography>
                  <Typography variant="body1" align="left">
                    까지 입금해주세요.
                  </Typography>
                </Stack>
              </>
            )}

            {response.status === 'DONE' && (
              <Typography sx={{ mt: 2 }} variant="subtitle1" align="left">
                결제가 완료되었습니다.
              </Typography>
            )}
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
      )}
    </>
  );
}
