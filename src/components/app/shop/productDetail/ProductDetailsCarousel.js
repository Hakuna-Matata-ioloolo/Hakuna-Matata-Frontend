import PropTypes from 'prop-types';
import { styled } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { useSelector } from '../../../../redux/store';

const RootStyle = styled('div')(({ theme }) => ({
  '& .slick-slide': {
    float: theme.direction === 'rtl' ? 'right' : 'left',
    '&:focus': { outline: 'none' }
  }
}));

const LargeImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

LargeItem.propTypes = {
  item: PropTypes.string
};

function LargeItem({ item }) {
  return (
    <Box sx={{ paddingTop: '100%', position: 'relative' }}>
      <LargeImgStyle alt={item} src={item} />
    </Box>
  );
}

export default function ProductDetailsCarousel() {
  const { product } = useSelector((state) => state.product);

  return (
    <RootStyle>
      <Box sx={{ p: 1 }}>
        <Box
          sx={{
            zIndex: 0,
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {product.photoUrls.map((item) => (
            <LargeItem key={item} item={item} />
          ))}
        </Box>
      </Box>
    </RootStyle>
  );
}
