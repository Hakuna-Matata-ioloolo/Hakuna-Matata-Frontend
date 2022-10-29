import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import {
  Autocomplete,
  Card,
  Chip,
  FormHelperText,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@material-ui/core';
import { PATH_APP } from '../../../routes/paths';
import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';
import axios from '../../../utils/axios';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

export default function ProductNewForm() {
  const navigate = useNavigate();
  const [photoUrls, setPhotoUrls] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('이름을 입력해주세요.'),
    description: Yup.string().required('설명을 입력해주세요.'),
    images: Yup.array().min(1, '사진을 등록해주세요.'),
    price: Yup.number().required('가격을 입력해주세요.')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: '',
      description: '',
      images: [],
      price: '',
      sizes: [],
      colors: []
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const { name, description, price, sizes, colors } = values;

        await axios.put('/api/product', {
          name,
          description,
          photoUrls,
          price,
          sizes,
          colors
        });

        resetForm();
        setSubmitting(false);
        enqueueSnackbar('새 상품을 만들었습니다.', { variant: 'success' });
        navigate(PATH_APP.root);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = async (acceptedFiles) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('photo', file);
      // eslint-disable-next-line no-await-in-loop
      const response = await axios.put('/api/product/photo', formData);
      setPhotoUrls([response.data.url, ...photoUrls]);
    }

    setFieldValue(
      'images',
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    );
  };

  const handleRemoveAll = () => {
    setFieldValue('images', []);
  };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="상품 이름"
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />

                <div>
                  <LabelStyle>상품 설명</LabelStyle>
                  <QuillEditor
                    simple
                    id="product-description"
                    value={values.description}
                    onChange={(val) => setFieldValue('description', val)}
                    error={Boolean(touched.description && errors.description)}
                  />
                  {touched.description && errors.description && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {touched.description && errors.description}
                    </FormHelperText>
                  )}
                </div>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    placeholder="0"
                    label="가격"
                    {...getFieldProps('price')}
                    InputProps={{
                      endAdornment: <InputAdornment position="start">원</InputAdornment>,
                      type: 'number'
                    }}
                    error={Boolean(touched.price && errors.price)}
                    helperText={touched.price && errors.price}
                  />

                  <Autocomplete
                    multiple
                    freeSolo
                    value={values.tags}
                    options={[]}
                    onChange={(event, newValue) => {
                      setFieldValue('sizes', newValue);
                    }}
                    renderInput={(params) => <TextField label="사이즈" {...params} />}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip key={option} size="small" label={option} {...getTagProps({ index })} />
                      ))
                    }
                  />

                  <Autocomplete
                    multiple
                    freeSolo
                    value={values.colors}
                    options={[]}
                    onChange={(event, newValue) => {
                      setFieldValue('colors', newValue);
                    }}
                    renderInput={(params) => <TextField label="색상" {...params} />}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip key={option} size="small" label={option} {...getTagProps({ index })} />
                      ))
                    }
                  />

                  <div>
                    <LabelStyle>상품 사진 등록</LabelStyle>
                    <UploadMultiFile
                      showPreview
                      maxSize={1024 * 1024 * 5}
                      accept="image/*"
                      files={values.images}
                      onDrop={handleDrop}
                      onRemoveAll={handleRemoveAll}
                      error={Boolean(touched.images && errors.images)}
                    />
                    {touched.images && errors.images && (
                      <FormHelperText error sx={{ px: 2 }}>
                        {touched.images && errors.images}
                      </FormHelperText>
                    )}
                  </div>
                </Stack>
              </Card>

              <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={isSubmitting}>
                상품 등록
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
