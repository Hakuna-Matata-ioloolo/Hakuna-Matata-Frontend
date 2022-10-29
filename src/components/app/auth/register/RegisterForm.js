import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';
import { Form, FormikProvider, useFormik } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Alert, IconButton, InputAdornment, Stack, TextField } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import useAuth from '../../../../hooks/useAuth';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { MIconButton } from '../../../@material-extend';

export default function RegisterForm() {
  const { register } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, '2글자 이상으로 입력해주세요.')
      .max(4, '4글자 이하로 입력해주세요.')
      .matches(/^[가-힣]{2,4}$/, '한글로 입력해주세요.')
      .required('이름을 입력해주세요.'),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{8}$/, '전화번호를 입력해주세요.')
      .required('전화번호를 입력해주세요.'),
    password: Yup.string()
      .min(8, '8자 이상으로 설정해주세요.')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$~!%*#?&])[A-Za-z\d@$~!%*#?&]{8,}$/,
        '하나의 문자, 숫자, 특수문자를 포함해주세요.'
      )
      .required('비밀번호를 입력해주세요.'),
    passwordCheck: Yup.string()
      .oneOf([Yup.ref('password'), null], '비밀번호와 같지 않습니다..')
      .required('비밀번호 확인을 입력해주세요.')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      phoneNumber: '',
      school: '제천고등학교',
      grade: '1',
      clazz: '1',
      stdId: '1',
      password: '',
      passwordCheck: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        const phoneNumber = `010${values.phoneNumber}`;

        await register(
          values.name,
          phoneNumber,
          values.school,
          values.grade,
          values.clazz,
          values.stdId,
          values.password
        );

        enqueueSnackbar('정상적으로 가입되었습니다.', {
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
          setErrors({ afterSubmit: error.message });
          setSubmitting(false);
        }
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

          <TextField
            fullWidth
            label="이름"
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField disabled value="010" />

            <TextField
              fullWidth
              label="전화번호"
              {...getFieldProps('phoneNumber')}
              error={Boolean(touched.phoneNumber && errors.phoneNumber)}
              helperText={touched.phoneNumber && errors.phoneNumber}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={9}>
            <TextField select label="학교" size="middle" {...getFieldProps('school')} SelectProps={{ native: true }}>
              {['제천고등학교', '제천여자고등학교', '제천제일고등학교', '세명고등학교'].map((school) => (
                <option key={school} value={school}>
                  {school}
                </option>
              ))}
            </TextField>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <TextField select label="학년" size="middle" {...getFieldProps('grade')} SelectProps={{ native: true }}>
                {Array(3)
                  .fill()
                  .map((v, i) => i + 1)
                  .map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
              </TextField>

              <TextField select label="반" size="middle" {...getFieldProps('clazz')} SelectProps={{ native: true }}>
                {Array(9)
                  .fill()
                  .map((v, i) => i + 1)
                  .map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
              </TextField>

              <TextField select label="번호" size="middle" {...getFieldProps('stdId')} SelectProps={{ native: true }}>
                {Array(30)
                  .fill()
                  .map((v, i) => i + 1)
                  .map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
              </TextField>
            </Stack>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="비밀번호"
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />

            <TextField
              fullWidth
              type={showPasswordCheck ? 'text' : 'password'}
              label="비밀번호 확인"
              {...getFieldProps('passwordCheck')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowPasswordCheck((prev) => !prev)}>
                      <Icon icon={showPasswordCheck ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.passwordCheck && errors.passwordCheck)}
              helperText={touched.passwordCheck && errors.passwordCheck}
            />
          </Stack>

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            회원가입
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
