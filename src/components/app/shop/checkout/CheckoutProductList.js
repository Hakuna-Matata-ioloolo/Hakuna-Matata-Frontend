import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import minusFill from '@iconify/icons-eva/minus-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import { fCurrency } from '../../../../utils/formatNumber';
import { MIconButton } from '../../../@material-extend';
import axios from '../../../../utils/axios';

const IncrementerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`
}));

const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  marginRight: theme.spacing(2),
  borderRadius: theme.shape.borderRadiusSm
}));

Incrementer.propTypes = {
  quantity: PropTypes.number,
  onIncrease: PropTypes.func,
  onDecrease: PropTypes.func
};

function Incrementer({ quantity, onIncrease, onDecrease }) {
  return (
    <Box sx={{ width: 96, textAlign: 'right' }}>
      <IncrementerStyle>
        <MIconButton size="small" color="inherit" onClick={onDecrease} disabled={quantity <= 1}>
          <Icon icon={minusFill} width={16} height={16} />
        </MIconButton>
        {quantity}
        <MIconButton size="small" color="inherit" onClick={onIncrease}>
          <Icon icon={plusFill} width={16} height={16} />
        </MIconButton>
      </IncrementerStyle>
    </Box>
  );
}

ProductList.propTypes = {
  formik: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  onDecreaseQuantity: PropTypes.func,
  onIncreaseQuantity: PropTypes.func
};

export default function ProductList({ formik, onDelete, onIncreaseQuantity, onDecreaseQuantity }) {
  const [allProduct, setAllProduct] = useState({});

  const { products } = formik.values;

  useEffect(() => {
    (async () => {
      const response = await axios.get('/api/product/list');
      const t = {};

      response.data.forEach((product) => {
        t[product.id] = product;
      });

      setAllProduct(t);
    })();
  }, []);

  return (
    <TableContainer sx={{ minWidth: 500 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>상품</TableCell>
            <TableCell>수량</TableCell>
            <TableCell>가격</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map(({ color, id, quantity, size }) => {
            if (allProduct[id]) {
              const { name, price, photoUrls } = allProduct[id];

              return (
                <TableRow key={id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ThumbImgStyle alt="product image" src={photoUrls[0]} />

                      <Stack direction="row" alignItems="center">
                        <Typography noWrap color={color} variant="body1" sx={{ fontSize: 18, maxWidth: 150, mb: 0 }}>
                          ⦁
                        </Typography>

                        <Typography noWrap variant="subtitle2" sx={{ maxWidth: 150, mb: 0.5 }}>
                          [{size}]&emsp;{name}
                        </Typography>
                      </Stack>
                    </Box>
                  </TableCell>

                  <TableCell align="left">
                    <Incrementer
                      quantity={quantity}
                      onDecrease={() => onDecreaseQuantity(id, color, size)}
                      onIncrease={() => onIncreaseQuantity(id, color, size)}
                    />
                  </TableCell>

                  <TableCell>{fCurrency(price * quantity)}</TableCell>

                  <TableCell>
                    <MIconButton onClick={() => onDelete(id, color, size)}>
                      <Icon icon={trash2Fill} width={20} height={20} />
                    </MIconButton>
                  </TableCell>
                </TableRow>
              );
            }

            return <></>;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
