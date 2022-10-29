import { Form, FormikProvider, useFormik } from 'formik';
import { Grid } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from '../../../../redux/store';
import CheckoutSummary from './CheckoutSummary';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';
import tossClientKey from '../../../../utils/tossClientKey';
import axios from '../../../../utils/axios';
import useAuth from '../../../../hooks/useAuth';
import { PATH_APP } from '../../../../routes/paths';

const PAYMENT_OPTIONS = [
  {
    value: 'card',
    title: '카드 결제'
  },
  {
    value: 'account',
    title: '무통장 입금'
  },
  {
    value: 'toss_pay',
    title: '토스페이',
    icon: '/static/icons/payments/toss.svg'
  },
  {
    value: 'naver_pay',
    title: '네이버페이',
    icon: '/static/icons/payments/naver.svg'
  },
  {
    value: 'kakao_pay',
    title: '카카오페이',
    icon: '/static/icons/payments/kakao.svg'
  }
];

export default function CheckoutPayment() {
  const [allProduct, setAllProduct] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();
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
  let cnt = 0;

  cart.forEach((product) => {
    const prod = allProduct[product.id];

    if (prod?.price) {
      price += prod.price * product.quantity;
      cnt += 1;
    }
  });

  const formik = useFormik({
    initialValues: {
      payment: ''
    },
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        const tossPayments = await loadTossPayments(tossClientKey);

        const path = window.location.href;
        const host = path.substring(0, path.indexOf('/checkout'));

        const { billingId } = (await axios.put('/api/billing', { products: cart })).data;

        if (values.payment === 'account') {
          await axios.put('/api/billing/virtualAccount', { billingId });

          navigate(`${PATH_APP.payment.success}?orderId=${billingId}`);
        } else if (values.payment === 'card') {
          await tossPayments.requestPayment('카드', {
            amount: price,
            orderId: billingId,
            orderName: `${allProduct[cart[0].id].name}${cnt > 1 ? ` 외 ${cnt - 1}건` : ''}`,
            customerName: user.name,
            maxCardInstallmentPlan: 0,
            successUrl: `${host}/payment/success`,
            failUrl: `${host}/payment/fail`
          });
        } else if (values.payment === 'toss_pay') {
          await tossPayments.requestPayment('카드', {
            amount: price,
            orderId: billingId,
            orderName: `${allProduct[cart[0].id].name}${cnt > 1 ? ` 외 ${cnt - 1}건` : ''}`,
            customerName: user.name,
            flowMode: 'DIRECT',
            easyPay: '토스페이',
            successUrl: `${host}/payment/success`,
            failUrl: `${host}/payment/fail`
          });
        } else if (values.payment === 'naver_pay') {
          await tossPayments.requestPayment('카드', {
            amount: price,
            orderId: billingId,
            orderName: `${allProduct[cart[0].id].name}${cnt > 1 ? ` 외 ${cnt - 1}건` : ''}`,
            customerName: user.name,
            flowMode: 'DIRECT',
            easyPay: '네이버페이',
            successUrl: `${host}/payment/success`,
            failUrl: `${host}/payment/fail`
          });
        } else if (values.payment === 'kakao_pay') {
          await tossPayments.requestPayment('카드', {
            amount: price,
            orderId: billingId,
            orderName: `${allProduct[cart[0].id].name}${cnt > 1 ? ` 외 ${cnt - 1}건` : ''}`,
            customerName: user.name,
            flowMode: 'DIRECT',
            easyPay: '카카오페이',
            successUrl: `${host}/payment/success`,
            failUrl: `${host}/payment/fail`
          });
        }
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error.message);
      }
    }
  });

  const { isSubmitting, handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <CheckoutPaymentMethods formik={formik} paymentOptions={PAYMENT_OPTIONS} />
          </Grid>

          <Grid item xs={12} md={4}>
            <CheckoutSummary />
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              결제하기
            </LoadingButton>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
