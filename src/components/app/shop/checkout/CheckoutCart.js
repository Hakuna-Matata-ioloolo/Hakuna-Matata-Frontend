import { sum } from 'lodash';
import { Form, FormikProvider, useFormik } from 'formik';
import { Button, Card, CardHeader, Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from '../../../../redux/store';
import { decreaseQuantity, deleteCart, increaseQuantity } from '../../../../redux/slices/product';
import Scrollbar from '../../../Scrollbar';
import EmptyContent from '../../../EmptyContent';
import CheckoutSummary from './CheckoutSummary';
import CheckoutProductList from './CheckoutProductList';

CheckoutCart.propTypes = {
  onNextStep: PropTypes.func
};

export default function CheckoutCart({ onNextStep }) {
  const dispatch = useDispatch();
  const { checkout } = useSelector((state) => state.product);
  const { cart, total, subtotal } = checkout;
  const isEmptyCart = cart.length === 0;

  const handleDeleteCart = (productId, color, size) => {
    dispatch(deleteCart({ productId, color, size }));
  };

  const handleIncreaseQuantity = (productId, color, size) => {
    dispatch(increaseQuantity({ productId, color, size }));
  };

  const handleDecreaseQuantity = (productId, color, size) => {
    dispatch(decreaseQuantity({ productId, color, size }));
  };

  const handleNextStep = () => {
    onNextStep();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { products: cart },
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        setSubmitting(true);
        handleNextStep();
      } catch (error) {
        console.error(error);
        setErrors(error.message);
      }
    }
  });

  const { values, handleSubmit } = formik;
  const totalItems = sum(values.products.map((item) => item.quantity));

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardHeader
                title={
                  <Typography variant="h6">
                    장바구니
                    <Typography component="span" sx={{ color: 'text.secondary' }}>
                      &nbsp;({totalItems}개)
                    </Typography>
                  </Typography>
                }
                sx={{ mb: 3 }}
              />

              {!isEmptyCart ? (
                <Scrollbar>
                  <CheckoutProductList
                    formik={formik}
                    onDelete={handleDeleteCart}
                    onDecreaseQuantity={handleDecreaseQuantity}
                    onIncreaseQuantity={handleIncreaseQuantity}
                  />
                </Scrollbar>
              ) : (
                <EmptyContent title="장바구니가 비었습니다." img="/static/illustrations/empty_cart.svg" />
              )}
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <CheckoutSummary total={total} subtotal={subtotal} />
            <Button fullWidth size="large" type="submit" variant="contained" disabled={values.products.length === 0}>
              배송지 설정하기
            </Button>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
