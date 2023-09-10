import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from '../layouts';
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import LoadingScreen from '../components/LoadingScreen';

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

export default function Router() {
  return useRoutes([
    {
      path: '/auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          )
        }
      ]
    },
    {
      path: '/',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: '/', element: <Navigate to="/shop" replace /> },
        { path: 'shop', element: <Shop /> },
        { path: 'product/:id', element: <ProductDetail /> },
        { path: 'myOrder', element: <MyOrder /> },
        { path: 'invoice/:id', element: <Invoice /> },
        { path: 'checkout', element: <Checkout /> },
        { path: 'payment/success', element: <PaymentSuccess /> },
        { path: 'payment/fail', element: <PaymentFail /> }
      ]
    },
    {
      path: '/admin',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: 'product/new', element: <ProductCreate /> },
        { path: 'products', element: <ProductList /> },
        { path: 'orders', element: <OrderList /> },
        { path: 'users', element: <UserList /> }
      ]
    },
    {
      path: '/404',
      element: <PageNotFound />
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));

const PaymentSuccess = Loadable(lazy(() => import('../pages/payment/Success')));
const PaymentFail = Loadable(lazy(() => import('../pages/payment/Fail')));

const Shop = Loadable(lazy(() => import('../pages/product/Shop')));
const ProductDetail = Loadable(lazy(() => import('../pages/product/ProductDetail')));
const Checkout = Loadable(lazy(() => import('../pages/product/Checkout')));
const MyOrder = Loadable(lazy(() => import('../pages/product/MyOrder')));
const Invoice = Loadable(lazy(() => import('../pages/product/Invoice')));

const ProductCreate = Loadable(lazy(() => import('../pages/admin/ProductCreate')));
const ProductList = Loadable(lazy(() => import('../pages/admin/ProductList')));
const UserList = Loadable(lazy(() => import('../pages/admin/UserList')));
const OrderList = Loadable(lazy(() => import('../pages/admin/OrderList')));

const PageNotFound = Loadable(lazy(() => import('../pages/PageNotFound')));
