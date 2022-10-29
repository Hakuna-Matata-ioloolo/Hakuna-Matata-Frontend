import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Card, Container, Grid, Skeleton, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from '../../redux/store';
import { getProduct } from '../../redux/slices/product';
import { PATH_APP } from '../../routes/paths';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { ProductDetailsCarousel, ProductDetailsSumary } from '../../components/app/shop/productDetail';
import CartWidget from '../../components/app/shop/CartWidget';

const SkeletonLoad = (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6} lg={7}>
      <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '100%', borderRadius: 2 }} />
    </Grid>
    <Grid item xs={12} md={6} lg={5}>
      <Skeleton variant="circular" width={80} height={80} />
      <Skeleton variant="text" height={240} />
      <Skeleton variant="text" height={40} />
      <Skeleton variant="text" height={40} />
      <Skeleton variant="text" height={40} />
    </Grid>
  </Grid>
);

export default function ProductDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { product, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  return (
    <Page title="하쿠나 마타타 | 상품 설명">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="상품 설명"
          links={[{ name: '하쿠나 마타타', href: PATH_APP.root }, { name: 'test' }]}
        />

        {error && <Typography variant="h6">상품을 찾을 수 없습니다.</Typography>}

        <CartWidget />

        {product && (
          <>
            <Card>
              <Grid container>
                <Grid item xs={12} md={6} lg={7}>
                  <ProductDetailsCarousel />
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  <ProductDetailsSumary />
                </Grid>
              </Grid>
            </Card>
          </>
        )}

        {!product && SkeletonLoad}
      </Container>
    </Page>
  );
}
