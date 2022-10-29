import {
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
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import Label from '../../components/Label';
import axios from '../../utils/axios';
import LoadingScreen from '../../components/LoadingScreen';
import { PATH_APP } from '../../routes/paths';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = (await axios.get('/api/order/list')).data;

      setOrders(response);
      setLoad(true);
    })();
  }, []);

  return (
    <>
      {load && (
        <Page title="하쿠나 마타타 | 결제 기록">
          <Container maxWidth="xl">
            <Grid item xs={12}>
              <Card>
                <CardHeader title="주문 목록" />
                <Scrollbar>
                  <TableContainer sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>결제 고유 번호</TableCell>
                          <TableCell>구매자</TableCell>
                          <TableCell>구매 날짜</TableCell>
                          <TableCell>결제 상태</TableCell>
                          <TableCell />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map(({ completeDate, orderId, status, user }) => (
                          <TableRow key={orderId}>
                            <TableCell>
                              <Button
                                onClick={() => {
                                  navigate(`${PATH_APP.product.invoice}/${orderId}`);
                                }}
                              >
                                {orderId}
                              </Button>
                            </TableCell>

                            <TableCell>
                              <Typography variant="subtitle2">
                                {user.name} ({user.school} {user.grade}학년 {user.clazz}반 {user.stdId}번)
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography variant="subtitle2">
                                {format(new Date(completeDate), 'yyyy년 MM월 dd일')}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {format(new Date(completeDate), 'HH시 mm분 ss초')}
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
