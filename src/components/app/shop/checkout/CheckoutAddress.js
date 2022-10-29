import PropTypes from 'prop-types';
import { Box, Grid, Card, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import Label from '../../../Label';
import CheckoutSummary from './CheckoutSummary';
import useAuth from '../../../../hooks/useAuth';

CheckoutAddress.propTypes = {
  onNextStep: PropTypes.func
};

export default function CheckoutAddress({ onNextStep }) {
  const { user } = useAuth();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card sx={{ p: 3, mb: 3, position: 'relative' }}>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1">{user.school}</Typography>
            <Label color="info" sx={{ ml: 1 }}>
              {user.grade}학년 {user.clazz}반
            </Label>
          </Box>
          <Typography variant="body2" gutterBottom>
            {user.name} ({user.stdId}번)
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {user.phoneNumber}
          </Typography>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <CheckoutSummary />
        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={onNextStep}>
          결제하기
        </LoadingButton>
      </Grid>
    </Grid>
  );
}
