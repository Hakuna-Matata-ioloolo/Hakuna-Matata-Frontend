import { Container } from '@material-ui/core';
import { PATH_APP } from '../../routes/paths';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ProductNewForm from '../../components/app/shop/ProductNewForm';

export default function ProductCreate() {
  return (
    <Page title="하쿠나 마타타 | 새 상품 등록">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="새 상품"
          links={[{ name: '하쿠나 마타타', href: PATH_APP.root }, { name: '새 상품' }]}
        />

        <ProductNewForm />
      </Container>
    </Page>
  );
}
