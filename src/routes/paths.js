function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '';

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register')
};

export const PATH_APP = {
  root: '/',
  payment: {
    success: path(ROOTS_DASHBOARD, '/payment/success'),
    fail: path(ROOTS_DASHBOARD, '/payment/fail')
  },
  product: {
    shop: path(ROOTS_DASHBOARD, '/shop'),
    detail: path(ROOTS_DASHBOARD, '/product'),
    myOrder: path(ROOTS_DASHBOARD, '/myOrder'),
    checkout: path(ROOTS_DASHBOARD, '/checkout'),
    invoice: path(ROOTS_DASHBOARD, '/invoice')
  },
  admin: {
    newProduct: path(ROOTS_DASHBOARD, '/admin/product/new'),
    products: path(ROOTS_DASHBOARD, '/admin/products'),
    orders: path(ROOTS_DASHBOARD, '/admin/orders'),
    users: path(ROOTS_DASHBOARD, '/admin/users')
  }
};
