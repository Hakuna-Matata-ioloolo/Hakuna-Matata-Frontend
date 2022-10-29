// routes
import { PATH_APP } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  cart: getIcon('ic_cart'),
  list: getIcon('ic_list'),
  user: getIcon('ic_user'),
  store: getIcon('ic_store')
};

export default [
  {
    subheader: '하쿠나 마타타',
    items: [
      {
        title: '상점',
        path: PATH_APP.product.shop,
        icon: ICONS.store
      },
      {
        title: '내 주문',
        path: PATH_APP.product.myOrder,
        icon: ICONS.list
      }
    ]
  }
];
