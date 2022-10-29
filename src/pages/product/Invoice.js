import {
  Box,
  Grid,
  Card,
  Table,
  TableRow,
  Container,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { PATH_APP } from '../../routes/paths';
import { fCurrency } from '../../utils/formatNumber';
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { MHidden } from '../../components/@material-extend';
import axios from '../../utils/axios';
import LoadingScreen from '../../components/LoadingScreen';

export default function Invoice() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState({});
  const [load, setLoad] = useState(false);

  useEffect(() => {
    (async () => {
      const response = (await axios.post('/api/order', { orderId: id })).data;

      setInvoice(response);
      setLoad(true);
    })();
  }, [id]);

  return (
    <>
      {load && (
        <Page title="하쿠나 마타타 | 주문 명세서">
          <Container>
            <HeaderBreadcrumbs
              heading="주문 명세서"
              links={[
                { name: '하쿠나 마타타', href: PATH_APP.root },
                { name: '내 주문', href: PATH_APP.product.myOrder },
                { name: '주문 명세서' }
              ]}
            />

            <Card sx={{ pt: 5, px: 5 }}>
              <Grid container>
                <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
                  <Box component="img" alt="logo" src="/static/logo.svg" sx={{ height: 64 }} />
                </Grid>

                <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
                  <Box sx={{ textAlign: { sm: 'right' } }}>
                    {invoice.status === 'DONE' && (
                      <Label color="success" sx={{ fontSize: 13, mb: 1 }}>
                        결제 완료
                      </Label>
                    )}

                    {invoice.status === 'WAITING_FOR_DEPOSIT' && (
                      <Label color="warning" sx={{ fontSize: 13, mb: 1 }}>
                        입금 대기중
                      </Label>
                    )}

                    {invoice.status === 'CANCELED' && (
                      <Label color="error" sx={{ fontSize: 13, mb: 1 }}>
                        결제 취소
                      </Label>
                    )}

                    <Typography variant="h6">결제 명세서</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
                  <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                    주문자 정보
                  </Typography>
                  <Typography variant="body2">이름: {invoice.user.name}</Typography>
                  <Typography variant="body2">학교: {invoice.user.school}</Typography>
                  <Typography variant="body2">
                    학번: {invoice.user.grade}학년 {invoice.user.clazz}반 {invoice.user.stdId}번
                  </Typography>
                  <Typography variant="body2">전화번호: {invoice.user.phoneNumber}</Typography>
                </Grid>

                <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
                  <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                    결제 정보
                  </Typography>
                  {invoice.payment.method === '카드' && (
                    <>
                      <Typography variant="body2">결제수단: {invoice.payment.method}</Typography>
                      <Typography variant="body2">
                        카드번호: {invoice.payment.company} {invoice.payment.number}
                      </Typography>
                    </>
                  )}

                  {invoice.payment.method === '간편결제' && (
                    <>
                      <Typography variant="body2">
                        결제수단: {invoice.payment.method} ({invoice.payment.provider})
                      </Typography>
                    </>
                  )}

                  {invoice.payment.method === '가상계좌' && (
                    <>
                      <Typography variant="body2">결제수단: {invoice.payment.method}</Typography>
                      {invoice.status === 'WAITING_FOR_DEPOSIT' && (
                        <>
                          <Typography variant="body2">
                            계좌번호: {invoice.payment.bank} {invoice.payment.accountNumber} (예금주:{' '}
                            {invoice.payment.customerName})
                          </Typography>

                          <Typography variant="body2">
                            입금기한: {format(new Date(invoice.payment.dueDate), 'yyyy년 MM월 dd일 HH시 mm분 ss초')}
                          </Typography>
                        </>
                      )}
                    </>
                  )}
                </Grid>
              </Grid>

              <Grid item xs={12} sm={12} sx={{ mb: 5 }}>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  주문 정보
                </Typography>
                <Typography variant="body2">주문 ID: {invoice.orderId}</Typography>
                <Typography variant="body2">
                  주문 날짜: {format(new Date(invoice.completeDate), 'yyyy년 MM월 dd일 HH시 mm분 ss초')}
                </Typography>
              </Grid>

              <MHidden width="smUp">
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  (상세 상품 내역을 좌우로 움직여보세요.)
                </Typography>
              </MHidden>

              <Scrollbar>
                <TableContainer sx={{ minWidth: 500 }}>
                  <Table>
                    <TableHead
                      sx={{
                        borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                        '& th': { backgroundColor: 'transparent' }
                      }}
                    >
                      <TableRow>
                        <TableCell>상품 이름</TableCell>
                        <TableCell width={75}>수량</TableCell>
                        <TableCell width={125}>개당 가격</TableCell>
                        <TableCell width={125}>총 가격</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {invoice.products.map(({ id, name, price, quantity, color, size }) => (
                        <TableRow
                          key={id}
                          sx={{
                            borderBottom: (theme) => `solid 1px ${theme.palette.divider}`
                          }}
                        >
                          <TableCell>
                            <Typography variant="subtitle2">{name}</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                              {color} {size}
                            </Typography>
                          </TableCell>

                          <TableCell>{quantity}개</TableCell>

                          <TableCell>{fCurrency(price)}</TableCell>
                          <TableCell>{fCurrency(price * quantity)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>

              <Typography variant="h6" my={2} ml={8}>
                총 결제 금액: {fCurrency(invoice.price)}
              </Typography>
            </Card>
          </Container>
        </Page>
      )}

      {!load && <LoadingScreen />}
    </>
  );
}
