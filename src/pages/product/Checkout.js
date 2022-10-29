import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import checkmarkFill from '@iconify/icons-eva/checkmark-fill';
import { Box, Container, Grid, Step, StepConnector, StepLabel, Stepper } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from '../../redux/store';
import { getCart } from '../../redux/slices/product';
import { PATH_APP } from '../../routes/paths';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { CheckoutCart, CheckoutPayment, CheckoutAddress } from '../../components/app/shop/checkout';

const STEPS = ['장바구니', '배달지 설정', '결제'];

const QontoConnector = withStyles((theme) => ({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 20px)',
    right: 'calc(50% + 20px)'
  },
  active: {
    '& $line': { borderColor: theme.palette.primary.main }
  },
  completed: {
    '& $line': { borderColor: theme.palette.primary.main }
  },
  line: {
    borderTopWidth: 2,
    borderColor: theme.palette.divider
  }
}))(StepConnector);

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool
};

function QontoStepIcon({ active, completed }) {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? 'primary.main' : 'divider',
        bgcolor: 'background.default'
      }}
    >
      {completed ? (
        <Box component={Icon} icon={checkmarkFill} sx={{ zIndex: 1, width: 20, height: 20, color: 'primary.main' }} />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'currentColor'
          }}
        />
      )}
    </Box>
  );
}

export default function Checkout() {
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const { checkout } = useSelector((state) => state.product);
  const { cart } = checkout;
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isMountedRef.current) dispatch(getCart(cart));
  }, [dispatch, isMountedRef, cart]);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  return (
    <Page title="하쿠나 마타타 | 장바구니">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="장바구니"
          links={[{ name: '하쿠나 마타타', href: PATH_APP.root }, { name: '장바구니' }]}
        />

        <Grid container justifyContent="flex-start">
          <Grid item xs={12} md={8} sx={{ mb: 5 }}>
            <Stepper alternativeLabel activeStep={step} connector={<QontoConnector />}>
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={QontoStepIcon}
                    sx={{
                      '& .MuiStepLabel-label': {
                        typography: 'subtitle2',
                        color: 'text.disabled'
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
        </Grid>

        {step === 0 && <CheckoutCart onNextStep={handleNextStep} />}
        {step === 1 && <CheckoutAddress onNextStep={handleNextStep} />}
        {step === 2 && <CheckoutPayment />}
      </Container>
    </Page>
  );
}
