import * as Yup from 'yup';
import { useState } from 'react';
import { useSnackbar } from 'notistack5';
import { Form, FormikProvider, useFormik } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Alert, IconButton, InputAdornment, Stack, TextField } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import useAuth from '../../../../hooks/useAuth';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { MIconButton } from '../../../@material-extend';

export default function LoginForm() {
  const { login } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .min(8, '올바른 전화번호를 입력해주세요.')
      .max(8, '올바른 전화번호를 입력해주세요.')
      .required('전화번호를 입력해주세요.'),
    password: Yup.string().required('비밀번호를 입력해주세요.')
  });

  const formik = useFormik({
    initialValues: {
      phoneNumber: '',
      password: ''
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        const phoneNumber = `010${values.phoneNumber}`;

        await login(phoneNumber, values.password);

        enqueueSnackbar(`[${phoneNumber}]로 로그인되었습니다.`, {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        console.error(error);
        if (isMountedRef.current) {
          setSubmitting(false);
          setErrors({ afterSubmit: error.message });
        }
      }
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

          <Stack direction="row" spacing={2}>
            <TextField disabled value="010" />

            <TextField
              fullWidth
              label="전화번호"
              {...getFieldProps('phoneNumber')}
              error={Boolean(touched.phoneNumber && errors.phoneNumber)}
              helperText={touched.phoneNumber && errors.phoneNumber}
            />
          </Stack>

          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="비밀번호"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          sx={{ marginTop: 5 }}
          loading={isSubmitting}
        >
          로그인
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
