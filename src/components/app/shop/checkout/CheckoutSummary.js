import { Box, Card, CardContent, CardHeader, Stack, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { fCurrency } from '../../../../utils/formatNumber';
import { useSelector } from '../../../../redux/store';
import axios from '../../../../utils/axios';

export default function CheckoutSummary() {
  const [allProduct, setAllProduct] = useState({});
  const { checkout } = useSelector((state) => state.product);
  const { cart } = checkout;

  useEffect(() => {
    (async () => {
      const response = await axios.get('/api/product/list');
      const t = {};

      response.data.forEach((product) => {
        t[product.id] = product;
      });

      setAllProduct(t);
    })();
  }, []);

  let price = 0;

  cart.forEach((product) => {
    const prod = allProduct[product.id];

    if (prod?.price) price += prod.price * product.quantity;
  });

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="결제" />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">총 결제 금액</Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1">{fCurrency(price)}</Typography>
              <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                (부가세 포함)
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
