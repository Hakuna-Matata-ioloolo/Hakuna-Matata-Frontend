import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import checkmarkCircle2Fill from '@iconify/icons-eva/checkmark-circle-2-fill';
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  Typography
} from '@material-ui/core';

const OptionStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2.5),
  justifyContent: 'space-between',
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('all'),
  border: `solid 1px ${theme.palette.grey[500_32]}`
}));

CheckoutPaymentMethods.propTypes = {
  formik: PropTypes.object,
  paymentOptions: PropTypes.array
};

export default function CheckoutPaymentMethods({ paymentOptions, formik }) {
  const { errors, touched, values, getFieldProps } = formik;

  return (
    <Card>
      <CardHeader title="결제 방법" />
      <CardContent>
        <RadioGroup row {...getFieldProps('payment')}>
          <Grid container spacing={2}>
            {paymentOptions.map((method) => {
              const { value, title, icon } = method;

              return (
                <Grid key={title} item xs={12}>
                  <OptionStyle
                    sx={{
                      ...(values.payment === value && {
                        boxShadow: (theme) => theme.customShadows.z8
                      })
                    }}
                  >
                    <FormControlLabel
                      value={value}
                      control={<Radio checkedIcon={<Icon icon={checkmarkCircle2Fill} />} />}
                      label={
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="subtitle2">{title}</Typography>
                        </Box>
                      }
                      sx={{ flexGrow: 1, py: 3 }}
                    />
                    <Box width={56} key={icon} component="img" src={icon} />
                  </OptionStyle>
                </Grid>
              );
            })}
          </Grid>
        </RadioGroup>

        {errors.payment && (
          <FormHelperText error>
            <Box component="span" sx={{ px: 2 }}>
              {touched.payment && errors.payment}
            </Box>
          </FormHelperText>
        )}
      </CardContent>
    </Card>
  );
}
