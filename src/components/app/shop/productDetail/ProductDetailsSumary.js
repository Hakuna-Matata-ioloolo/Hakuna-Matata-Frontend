import { Icon } from '@iconify/react';
import { useLocation } from 'react-router-dom';
import roundAddShoppingCart from '@iconify/icons-ic/round-add-shopping-cart';
import { Form, FormikProvider, useField, useFormik } from 'formik';
import { styled } from '@material-ui/core/styles';
import { Box, Button, Divider, FormHelperText, Stack, TextField, Typography } from '@material-ui/core';
import minusFill from '@iconify/icons-eva/minus-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useSnackbar } from 'notistack5';
import { useDispatch, useSelector } from '../../../../redux/store';
import { addCart } from '../../../../redux/slices/product';
import { fCurrency } from '../../../../utils/formatNumber';
import ColorSinglePicker from '../../../ColorSinglePicker';
import { MIconButton } from '../../../@material-extend';

const Incrementer = (props) => {
  const [field, , helpers] = useField(props);
  // eslint-disable-next-line react/prop-types
  const { available } = props;
  const { value } = field;
  const { setValue } = helpers;

  const incrementQuantity = () => {
    setValue(value + 1);
  };
  const decrementQuantity = () => {
    setValue(value - 1);
  };

  return (
    <Box
      sx={{
        py: 0.5,
        px: 0.75,
        border: 1,
        lineHeight: 0,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        borderColor: 'grey.50032'
      }}
    >
      <MIconButton size="small" color="inherit" disabled={value <= 1} onClick={decrementQuantity}>
        <Icon icon={minusFill} width={16} height={16} />
      </MIconButton>
      <Typography
        variant="body2"
        component="span"
        sx={{
          width: 40,
          textAlign: 'center',
          display: 'inline-block'
        }}
      >
        {value}
      </Typography>
      <MIconButton size="small" color="inherit" disabled={value >= available} onClick={incrementQuantity}>
        <Icon icon={plusFill} width={16} height={16} />
      </MIconButton>
    </Box>
  );
};

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8)
  }
}));

export default function ProductDetailsSumary() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { product, checkout } = useSelector((state) => state.product);
  const { name, description, price, colors, sizes } = product;

  const onAddCart = (product) => {
    dispatch(addCart(product));

    if (
      checkout.cart.filter((o) => o.id === product.id && o.color === product.color && o.size === product.size)
        .length === 0
    )
      enqueueSnackbar(`[${name}] 장바구니에 담았습니다.`, { variant: 'success' });
    else enqueueSnackbar(`[${name}] 이미 장바구니에 담겨있습니다.`, { variant: 'warning' });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: pathname.split('/')[2],
      quantity: 1,
      color: colors[0],
      size: sizes[0]
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        onAddCart({ ...values });
        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
      }
    }
  });

  const { touched, errors, handleSubmit, setFieldValue, getFieldProps } = formik;

  return (
    <RootStyle>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Typography variant="h4" paragraph>
            {name}
          </Typography>

          <Typography variant="h5" sx={{ mb: 3 }}>
            {fCurrency(price)}
          </Typography>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack spacing={3} sx={{ my: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                색상
              </Typography>
              <ColorSinglePicker
                colors={colors}
                onChange={(e) => {
                  setFieldValue('color', e.target.value);
                }}
                sx={{
                  ...(colors.length > 4 && {
                    maxWidth: 144,
                    justifyContent: 'flex-end'
                  })
                }}
              />
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                사이즈
              </Typography>
              <TextField
                select
                size="small"
                {...getFieldProps('size')}
                SelectProps={{ native: true }}
                FormHelperTextProps={{
                  sx: {
                    textAlign: 'right',
                    margin: 0,
                    mt: 1
                  }
                }}
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </TextField>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                수량
              </Typography>
              <div>
                <Incrementer name="quantity" />
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    display: 'block',
                    textAlign: 'right',
                    color: 'text.secondary'
                  }}
                />

                <FormHelperText error>{touched.quantity && errors.quantity}</FormHelperText>
              </div>
            </Stack>
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {/* eslint-disable-next-line react/no-danger */}
          <Box sx={{ mt: 1 }} dangerouslySetInnerHTML={{ __html: description }} />

          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 5 }}>
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              startIcon={<Icon icon={roundAddShoppingCart} />}
              sx={{ whiteSpace: 'nowrap' }}
            >
              장바구니에 담기
            </Button>
          </Stack>
        </Form>
      </FormikProvider>
    </RootStyle>
  );
}
