import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { styled } from '@material-ui/core/styles';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import Label from '../../components/Label';
import axios from '../../utils/axios';
import LoadingScreen from '../../components/LoadingScreen';
import { fCurrency } from '../../utils/formatNumber';
import { MHidden } from '../../components/@material-extend';
import { PATH_APP } from '../../routes/paths';

const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadiusSm
}));

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = (await axios.get('/api/order')).data;

      setOrders(response);
      setLoad(true);
    })();
  }, []);

  return (
    <>
      {load && (
        <Page title="하쿠나 마타타 | 내 주문">
          <Container maxWidth="xl">
            <Grid item xs={12}>
              <Card>
                <CardHeader title="내 주문" />
                <Scrollbar>
                  <TableContainer sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>상품 이름</TableCell>
                          <TableCell>결제 금액</TableCell>
                          <TableCell>결제 상태</TableCell>
                          <TableCell />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map(({ _id, name, products, price, status }) => (
                          <TableRow key={_id}>
                            <TableCell>
                              <Box
                                sx={{
                                  ml: -1,
                                  py: 2,
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <MHidden width="smDown">
                                  <ThumbImgStyle src={products[0].photoUrl} />
                                </MHidden>
                                <Button
                                  onClick={() => {
                                    navigate(`${PATH_APP.product.invoice}/${_id}`);
                                  }}
                                >
                                  {name}
                                </Button>
                              </Box>
                            </TableCell>

                            <TableCell>
                              <Typography variant="subtitle2" noWrap>
                                {fCurrency(price)}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Label
                                variant="ghost"
                                color={
                                  (status === 'DONE' && 'success') ||
                                  (status === 'WAITING_FOR_DEPOSIT' && 'warning') ||
                                  'error'
                                }
                              >
                                {(status === 'DONE' && '결제 완료') ||
                                  (status === 'WAITING_FOR_DEPOSIT' && '입금 대기중') ||
                                  '결제 취소'}
                              </Label>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
              </Card>
            </Grid>
          </Container>
        </Page>
      )}

      {!load && <LoadingScreen />}
    </>
  );
}
