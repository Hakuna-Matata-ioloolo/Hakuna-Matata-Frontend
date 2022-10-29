import { useEffect } from 'react';
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@material-ui/core';
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts } from '../../redux/slices/product';
import { fCurrency } from '../../utils/formatNumber';
import { PATH_APP } from '../../routes/paths';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { ProductListHead } from '../../components/app/admin/productList';

const TABLE_HEAD = [
  { id: 'name', label: '이름' },
  { id: 'inventoryType', label: '가격' }
];

const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadiusSm
}));

// ----------------------------------------------------------------------

export default function ProductList() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <Page title="하쿠나 마타타 | 상품 목록">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="상품 목록"
          links={[{ name: '하쿠나 마타타', href: PATH_APP.root }, { name: '상품 목록' }]}
        />

        <Card>
          <Scrollbar>
            <TableContainer>
              <Table>
                <ProductListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {products.map(({ id, name, photoUrls, price }) => (
                    <TableRow hover key={id} tabIndex={-1} role="checkbox">
                      <TableCell component="th" scope="row" padding="none">
                        <Box
                          sx={{
                            py: 2,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <ThumbImgStyle alt={name} src={photoUrls[0]} />
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell align="left">{fCurrency(price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  );
}
