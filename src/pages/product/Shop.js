import { useEffect } from 'react';
import { Container } from '@material-ui/core';
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts } from '../../redux/slices/product';
import { PATH_APP } from '../../routes/paths';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { ShopProductList } from '../../components/app/shop/shop';
import CartWidget from '../../components/app/shop/CartWidget';

export default function Shop() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <Page title="하쿠나 마타타 | 상점">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs heading="상점" links={[{ name: '하쿠나 마타타', href: PATH_APP.root }, { name: '상점' }]} />

        <ShopProductList products={products} />
        <CartWidget />
      </Container>
    </Page>
  );
}
